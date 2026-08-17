const { app, BrowserWindow, dialog, ipcMain, protocol } = require("electron");

const { Readable } = require("stream");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const envPath = app.isPackaged
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, "..", ".env");

require("dotenv").config({
  path: envPath,
});

const {
  uploadVideo,
  r2Configured,
  getVideoLibrary,
  deleteVideo,
  getConnectedAccounts,
  scheduleVideo,
  updateScheduledVideo,
} = require("./cloud-service.cjs");

let ffmpegPath = require("ffmpeg-static");
if (app.isPackaged && typeof ffmpegPath === "string") {
  ffmpegPath = ffmpegPath.replace("app.asar", "app.asar.unpacked");
}

// Reusable CTA green-screen animation.
function getCtaVideoPath() {
  const unpackedPath = path.join(
    process.resourcesPath,
    "app.asar.unpacked",
    "electron",
    "assets",
    "CTA-VIDEO.mp4"
  );
  if (fs.existsSync(unpackedPath)) {
    return unpackedPath;
  }
  return path.join(__dirname, "assets", "CTA-VIDEO.mp4");
}

const CTA_VIDEO_PATH = getCtaVideoPath();
const CTA_VIDEO_DURATION = 7.862069;

let originalVideoPath = null;
let selectedVideoPath = null;

/*
 * Prevent multiple video normalization processes
 * from running at the same time.
 */
let normalizationInProgress = false;

/*
 * Keep reference to the currently running FFmpeg process.
 */
let currentFFmpegProcess = null;

/*
 * ------------------------------------------------------------
 * REGISTER MEDIA PROTOCOL
 * ------------------------------------------------------------
 */

protocol.registerSchemesAsPrivileged([
  {
    scheme: "media",

    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

/*
 * ------------------------------------------------------------
 * CREATE WINDOW
 * ------------------------------------------------------------
 */

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (!app.isPackaged) {
    win.loadURL("http://127.0.0.1:5173/");
  } else {
    win.loadFile(
      path.join(__dirname, "..", "dist", "index.html")
    );
  }
}

/*
 * ------------------------------------------------------------
 * APP READY
 * ------------------------------------------------------------
 */

app.whenReady().then(() => {
  /*
   * ----------------------------------------------------------
   * MEDIA PROTOCOL
   * ----------------------------------------------------------
   *
   * The normalized 1080p video is served through media://
   * with proper byte-range support.
   */

  protocol.handle("media", async (request) => {
    if (!selectedVideoPath) {
      return new Response("No video selected", {
        status: 404,
      });
    }

    const filePath = selectedVideoPath;

    try {
      const stat = await fs.promises.stat(filePath);

      const fileSize = stat.size;

      const extension = path.extname(filePath).toLowerCase();

      const mimeTypes = {
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".webm": "video/webm",
        ".mkv": "video/x-matroska",
      };

      const mimeType = mimeTypes[extension] || "application/octet-stream";

      const rangeHeader = request.headers.get("range");

      /*
       * ------------------------------------------------------
       * RANGE REQUEST
       * ------------------------------------------------------
       */

      if (rangeHeader) {
        console.log("Video range request:", rangeHeader);

        const rangeMatch = rangeHeader.match(/bytes=(\d*)-(\d*)/);

        if (!rangeMatch) {
          return new Response("Invalid range", {
            status: 416,
          });
        }

        const startString = rangeMatch[1];

        const endString = rangeMatch[2];

        let start;
        let end;

        /*
         * bytes=1000-
         */

        if (startString === "") {
          const suffixLength = Number(endString);

          if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
            return new Response("Invalid range", {
              status: 416,
            });
          }

          start = Math.max(fileSize - suffixLength, 0);

          end = fileSize - 1;
        } else {
          start = Number(startString);

          if (!Number.isFinite(start) || start < 0) {
            return new Response("Invalid range", {
              status: 416,
            });
          }

          if (endString === "") {
            end = fileSize - 1;
          } else {
            end = Number(endString);
          }
        }

        /*
         * Validate range.
         */

        if (start >= fileSize || start > end) {
          return new Response(null, {
            status: 416,

            headers: {
              "Content-Range": `bytes */${fileSize}`,
            },
          });
        }

        /*
         * Never exceed the actual file.
         */

        end = Math.min(end, fileSize - 1);

        const contentLength = end - start + 1;

        console.log(`Serving bytes ${start}-${end} of ${fileSize}`);

        const fileStream = fs.createReadStream(filePath, {
          start,
          end,
        });

        const webStream = Readable.toWeb(fileStream);

        return new Response(webStream, {
          status: 206,

          headers: {
            "Content-Type": mimeType,

            "Content-Length": String(contentLength),

            "Content-Range": `bytes ${start}-${end}/${fileSize}`,

            "Accept-Ranges": "bytes",

            "Cache-Control": "no-cache",
          },
        });
      }

      /*
       * ------------------------------------------------------
       * NORMAL REQUEST
       * ------------------------------------------------------
       */

      console.log("Serving full video stream:", filePath);

      const fileStream = fs.createReadStream(filePath);

      const webStream = Readable.toWeb(fileStream);

      return new Response(webStream, {
        status: 200,

        headers: {
          "Content-Type": mimeType,

          "Content-Length": String(fileSize),

          "Accept-Ranges": "bytes",

          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error("Failed to serve media:", error);

      return new Response("Unable to load video", {
        status: 500,
      });
    }
  });

  /*
   * ----------------------------------------------------------
   * SELECT VIDEO
   * ----------------------------------------------------------
   */

  ipcMain.handle("select-video", async () => {
    /*
     * Prevent another normalization from starting.
     */

    if (normalizationInProgress) {
      throw new Error("A video is already being prepared. Please wait until it finishes.");
    }

    const result = await dialog.showOpenDialog({
      properties: ["openFile"],

      filters: [
        {
          name: "Video Files",

          extensions: ["mp4", "mov", "webm", "mkv"],
        },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const newOriginalPath = result.filePaths[0];

    /*
     * If the same video is selected again,
     * reuse the current normalized video.
     */

    if (originalVideoPath === newOriginalPath && selectedVideoPath && (await fileExists(selectedVideoPath))) {
      console.log("Same video selected again.");

      console.log("Reusing normalized video:", selectedVideoPath);

      return {
        path: selectedVideoPath,

        name: path.basename(originalVideoPath),

        url: "media://selected-video",
      };
    }

    originalVideoPath = newOriginalPath;

    console.log("====================================");

    console.log("Original video selected:");

    console.log(originalVideoPath);

    console.log("====================================");

    normalizationInProgress = true;

    try {
      /*
       * Normalize exactly once.
       *
       * If a valid proxy already exists,
       * normalizeVideo() will reuse it.
       */

      selectedVideoPath = await normalizeVideo(originalVideoPath);

      console.log("====================================");

      console.log("Editing video:");

      console.log(selectedVideoPath);

      console.log("====================================");

      return {
        path: selectedVideoPath,

        name: path.basename(originalVideoPath),

        url: "media://selected-video",
      };
    } catch (error) {
      console.error("Video normalization failed:", error);

      originalVideoPath = null;
      selectedVideoPath = null;

      throw error;
    } finally {
      normalizationInProgress = false;
    }
  });

  /*
   * ----------------------------------------------------------
   * CREATE FINAL VIDEO
   * ----------------------------------------------------------
   */

  ipcMain.handle("create-final-video", async (event, { hookStart, hookEnd, mainStart, mainEnd }) => {
    if (!selectedVideoPath || !originalVideoPath) {
      throw new Error("No video selected.");
    }

    if (
      !Number.isFinite(hookStart) ||
      !Number.isFinite(hookEnd) ||
      !Number.isFinite(mainStart) ||
      !Number.isFinite(mainEnd)
    ) {
      throw new Error("Invalid selection ranges.");
    }

    if (hookStart < 0 || mainStart < 0) {
      throw new Error("Start times cannot be negative.");
    }

    if (hookEnd <= hookStart) {
      throw new Error("Hook end time must be greater than hook start time.");
    }

    if (mainEnd <= mainStart) {
      throw new Error("Main video end time must be greater than main video start time.");
    }

    const hookDuration = hookEnd - hookStart;
    const mainDuration = mainEnd - mainStart;
    const totalDuration = hookDuration + mainDuration;

    const sourceDirectory = path.dirname(originalVideoPath);
    const sourceName = path.basename(originalVideoPath, path.extname(originalVideoPath));
    const outputDirectory = path.join(sourceDirectory, "ManualClipper");

    await fs.promises.mkdir(outputDirectory, {
      recursive: true,
    });

    const outputPath = path.join(outputDirectory, `${sourceName}_final_${Date.now()}.mp4`);

    console.log("====================================");
    console.log("Creating final video...");
    console.log("Input:", selectedVideoPath);
    console.log("Hook:", hookStart, "→", hookEnd, `(${hookDuration}s)`);
    console.log("Main:", mainStart, "→", mainEnd, `(${mainDuration}s)`);
    console.log("Total duration:", totalDuration);
    console.log("Output:", outputPath);
    console.log("====================================");

    /*
     * ============================================================
     * CTA SETTINGS
     * ============================================================
     *
     * The CTA is overlaid during the last 7.862069 seconds of the
     * MAIN video. It is NOT appended, so it does not increase the
     * final video duration.
     */
    if (!(await fileExists(CTA_VIDEO_PATH))) {
      throw new Error(`CTA video not found. Put CTA-VIDEO.mp4 at: ${CTA_VIDEO_PATH}`);
    }

    const ctaDuration = Math.min(CTA_VIDEO_DURATION, mainDuration);
    const ctaStart = Math.max(0, mainDuration - ctaDuration);

    const filterComplex = [
      /*
       * ==========================================================
       * HOOK VIDEO
       * ==========================================================
       *
       * No opening transition.
       * Last 0.5 seconds = subtle zoom OUT.
       */
      `[0:v]trim=start=${hookStart}:end=${hookEnd},` +
        `setpts=PTS-STARTPTS,` +
        `scale=` +
        `w='trunc(1920*(1.08-0.08*min(max((t-${Math.max(0, hookDuration - 0.5)})/0.5,0),1))/2)*2':` +
        `h='trunc(1080*(1.08-0.08*min(max((t-${Math.max(0, hookDuration - 0.5)})/0.5,0),1))/2)*2':` +
        `eval=frame,` +
        `crop=1920:1080:(iw-1920)/2:(ih-1080)/2,` +
        `fps=60,` +
        `setsar=1[hookv]`,

      /* Hook audio */
      `[0:a]atrim=start=${hookStart}:end=${hookEnd},` + `asetpts=PTS-STARTPTS[hooka]`,

      /*
       * ==========================================================
       * MAIN VIDEO
       * ==========================================================
       *
       * Keep the working vignette + opening fade.
       * We intentionally do NOT fade out here yet.
       * The final fade happens AFTER the CTA is composited so
       * the CTA also fades to black with the main video.
       */
      `[0:v]trim=start=${mainStart}:end=${mainEnd},` +
        `setpts=PTS-STARTPTS,` +
        `scale=1920:1080:force_original_aspect_ratio=decrease,` +
        `pad=1920:1080:(ow-iw)/2:(oh-ih)/2,` +
        `vignette=angle=PI/5,` +
        `fade=t=in:st=0:d=0.5,` +
        `fps=60,` +
        `setsar=1[mainbase]`,

      /*
       * ==========================================================
       * CTA GREEN-SCREEN VIDEO
       * ==========================================================
       *
       * - Trim to the available CTA duration.
       * - Move it to the final CTA window of the Main video.
       * - Remove the bright green background.
       * - Scale it up while preserving aspect ratio.
       * - Keep alpha transparency for overlay.
       *
       * The CTA audio is intentionally NOT used. The original
       * gameplay/main audio remains untouched.
       */
      `[1:v]trim=duration=${ctaDuration},` +
        `setpts=PTS-STARTPTS+${ctaStart}/TB,` +
        `scale=1104:-2,` +
        `chromakey=0x00ff00:0.12:0.05,` +
        `format=rgba[cta]`,

      /*
       * Put CTA in the lower-middle portion of the 1920x1080
       * frame.
       */
      `[mainbase][cta]overlay=` + `x=(W-w)/2:` + `y=520:` + `eof_action=pass:` + `format=auto[maincta]`,

      /*
       * ==========================================================
       * MAIN AUDIO
       * ==========================================================
       */
      `[0:a]atrim=start=${mainStart}:end=${mainEnd},` +
        `asetpts=PTS-STARTPTS,` +
        `afade=t=out:st=${Math.max(0, mainDuration - 0.7)}:d=${Math.min(0.7, mainDuration)}[maina]`,

      /*
       * ==========================================================
       * FINAL VIDEO FADE
       * ==========================================================
       *
       * Apply this AFTER the CTA overlay so both the gameplay
       * and CTA fade out together.
       */
      `[maincta]fade=t=out:st=${Math.max(0, mainDuration - 0.7)}:d=${Math.min(0.7, mainDuration)}[mainfinal]`,

      /* Hook -> Main */
      `[hookv][hooka][mainfinal][maina]concat=n=2:v=1:a=1[v][a]`,
    ].join(";");

    const args = [
      "-y",

      "-i",
      selectedVideoPath,

      // Second input: reusable green-screen CTA.
      "-i",
      CTA_VIDEO_PATH,

      "-filter_complex",
      filterComplex,

      "-map",
      "[v]",

      "-map",
      "[a]",

      "-c:v",
      "libx264",

      "-preset",
      "medium",

      "-crf",
      "18",

      "-pix_fmt",
      "yuv420p",

      "-c:a",
      "aac",

      "-b:a",
      "192k",

      "-movflags",
      "+faststart",

      outputPath,
    ];

    await runFFmpeg(args, (completedSeconds) => {
      const percent = Math.min(
        100,
        Math.max(0, (completedSeconds / totalDuration) * 100)
      );

      event.sender.send("video-processing-progress", {
        stage: "final-video",
        percent,
        completedSeconds,
        totalDuration,
      });
    });

    console.log("====================================");
    console.log("FINAL VIDEO CREATED");
    console.log("====================================");

    return {
      success: true,
      outputPath,
      hookDuration,
      mainDuration,
      totalDuration,
    };
  });

  /*
   * ------------------------------------------------------------
   * UPLOAD VIDEO TO R2
   * ------------------------------------------------------------
   */

  ipcMain.handle("upload-video", async (event, { filePath }) => {
    if (!r2Configured) {
      throw new Error(
        "R2 is not configured. Please check your .env file."
      );
    }

    if (!filePath) {
      throw new Error("No video file provided.");
    }

    if (!(await fileExists(filePath))) {
      throw new Error("The final video file no longer exists.");
    }

    console.log("====================================");
    console.log("Uploading video to R2...");
    console.log("File:", filePath);
    console.log("====================================");

    const result = await uploadVideo(filePath, {
      onProgress: (percent) => {
        event.sender.send(
          "cloud-upload-progress",
          Math.round(percent)
        );
      },
    });

    console.log("====================================");
    console.log("VIDEO UPLOADED TO R2");
    console.log("Key:", result.key);
    console.log("====================================");

    return result;
  });

  /*
   * ------------------------------------------------------------
   * LIST VIDEO LIBRARY
   * ------------------------------------------------------------
   */

  ipcMain.handle("list-video-library", async (_event, { filter, page, limit } = {}) => {
    if (!r2Configured) {
      throw new Error("R2 is not configured. Please check your .env file.");
    }

    console.log("====================================");
    console.log("Fetching video library from R2...");
    console.log("====================================");

    const videos = await getVideoLibrary();

    console.log(`Fetched ${videos.length} videos from R2.`);

    return {
      success: true,
      videos,
    };
  });

  /*
   * ------------------------------------------------------------
   * DELETE VIDEO FROM R2
   * ------------------------------------------------------------
   */

  ipcMain.handle("delete-video-from-r2", async (_event, { key }) => {
    if (!r2Configured) {
      throw new Error("R2 is not configured. Please check your .env file.");
    }

    if (!key) {
      throw new Error("Video key is required for deletion.");
    }

    console.log("====================================");
    console.log("Deleting video from R2:", key);
    console.log("====================================");

    const result = await deleteVideo(key);

    console.log("Video deleted from R2 successfully:", key);

    return result;
  });

  /*
   * ------------------------------------------------------------
   * GET CONNECTED ZERNIO ACCOUNTS
   * ------------------------------------------------------------
   */

  ipcMain.handle("get-connected-accounts", async () => {
    return await getConnectedAccounts();
  });

  ipcMain.handle("get-zernio-accounts", async () => {
    return await getConnectedAccounts();
  });

  /*
   * ------------------------------------------------------------
   * SCHEDULE VIDEO
   * ------------------------------------------------------------
   */

  ipcMain.handle("schedule-video", async (_event, data) => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid schedule data.");
    }

    const { key, content, platforms, scheduledFor, timezone, title } = data;

    if (!key) {
      throw new Error("Video key is required.");
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      throw new Error("At least one platform must be selected.");
    }

    if (!scheduledFor) {
      throw new Error("A scheduled date and time are required.");
    }

    if (!timezone) {
      throw new Error("A timezone is required.");
    }

    console.log("====================================");
    console.log("Scheduling video...");
    console.log("Video:", key);
    console.log("Platforms:", platforms);
    console.log("Scheduled for:", scheduledFor);
    console.log("Timezone:", timezone);
    console.log("====================================");

    const post = await scheduleVideo({
      key,
      content: content || "",
      platforms,
      scheduledFor,
      timezone,
      title: title || "",
    });

    console.log("Video scheduled successfully.");
    console.log("Zernio Post ID:", post?._id);

    return {
      success: true,
      post,
    };
  });

  /*
   * ------------------------------------------------------------
   * UPDATE SCHEDULED VIDEO
   * ------------------------------------------------------------
   */

  ipcMain.handle("update-scheduled-video", async (_event, data) => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid schedule update data.");
    }

    const { postId, scheduledFor, timezone, content, title } = data;

    if (!postId) {
      throw new Error("Zernio post ID is required.");
    }

    if (!scheduledFor) {
      throw new Error("A scheduled date and time are required.");
    }

    if (!timezone) {
      throw new Error("A timezone is required.");
    }

    console.log("====================================");
    console.log("Updating scheduled video...");
    console.log("Zernio Post ID:", postId);
    console.log("Scheduled for:", scheduledFor);
    console.log("Timezone:", timezone);
    console.log("====================================");

    const post = await updateScheduledVideo(postId, {
      scheduledFor,
      timezone,
      content,
      title,
    });

    console.log("Scheduled video updated successfully.");

    return {
      success: true,
      post,
    };
  });

  /*
   * ----------------------------------------------------------
   * CREATE WINDOW
   * ----------------------------------------------------------
   */

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/*
 * ------------------------------------------------------------
 * APP CLOSE
 * ------------------------------------------------------------
 */

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/*
 * ------------------------------------------------------------
 * BEFORE QUIT
 * ------------------------------------------------------------
 *
 * If FFmpeg is running, stop it.
 */

app.on("before-quit", () => {
  if (currentFFmpegProcess) {
    console.log("Stopping FFmpeg...");

    currentFFmpegProcess.kill("SIGTERM");

    currentFFmpegProcess = null;
  }
});

/*
 * ------------------------------------------------------------
 * NORMALIZE VIDEO
 * ------------------------------------------------------------
 */

async function normalizeVideo(inputPath) {
  const sourceDirectory = path.dirname(inputPath);

  const sourceName = path.basename(inputPath, path.extname(inputPath));

  const workingDirectory = path.join(sourceDirectory, "ManualClipper", "working");

  await fs.promises.mkdir(workingDirectory, {
    recursive: true,
  });

  const outputPath = path.join(workingDirectory, `${sourceName}_1080p.mp4`);

  /*
   * ----------------------------------------------------------
   * REUSE EXISTING NORMALIZED VIDEO
   * ----------------------------------------------------------
   */

  if (await isReusableProxy(inputPath, outputPath)) {
    console.log("====================================");

    console.log("Existing 1080p proxy found.");

    console.log("Reusing:", outputPath);

    console.log("====================================");

    return outputPath;
  }

  /*
   * ----------------------------------------------------------
   * NORMALIZATION
   * ----------------------------------------------------------
   */

  console.log("====================================");

  console.log("Normalizing video...");

  console.log("Input:", inputPath);

  console.log("Output:", outputPath);

  console.log("====================================");

  /*
   * Remove an incomplete previous output.
   */

  await safeDelete(outputPath);

  const args = [
    "-y",

    "-i",
    inputPath,

    /*
     * 1920x1080 Full HD.
     *
     * Preserve aspect ratio.
     *
     * If the source is not 16:9,
     * black bars are added instead
     * of stretching the video.
     */

    "-vf",
    "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",

    /*
     * Standardize to 60 FPS.
     */

    "-r",
    "60",

    /*
     * H.264.
     */

    "-c:v",
    "libx264",

    /*
     * Fast encoding.
     */

    "-preset",
    "veryfast",

    /*
     * Quality.
     */

    "-crf",
    "20",

    /*
     * Keyframe approximately every second.
     *
     * This helps seeking.
     */

    "-g",
    "60",

    "-keyint_min",
    "60",

    "-sc_threshold",
    "0",

    /*
     * Browser-friendly pixel format.
     */

    "-pix_fmt",
    "yuv420p",

    /*
     * AAC audio.
     */

    "-c:a",
    "aac",

    "-b:a",
    "192k",

    /*
     * Put MP4 metadata at the beginning.
     */

    "-movflags",
    "+faststart",

    outputPath,
  ];

  await runFFmpeg(args);

  /*
   * Verify that FFmpeg actually produced
   * a usable file.
   */

  if (!(await fileExists(outputPath))) {
    throw new Error("FFmpeg completed but the normalized video was not created.");
  }

  const outputStat = await fs.promises.stat(outputPath);

  if (outputStat.size === 0) {
    throw new Error("FFmpeg created an empty normalized video.");
  }

  console.log("====================================");

  console.log("Normalization completed.");

  console.log("Normalized video:", outputPath);

  console.log("Size:", outputStat.size, "bytes");

  console.log("====================================");

  return outputPath;
}

/*
 * ------------------------------------------------------------
 * CHECK IF PROXY CAN BE REUSED
 * ------------------------------------------------------------
 */

async function isReusableProxy(sourcePath, proxyPath) {
  try {
    const sourceStat = await fs.promises.stat(sourcePath);

    const proxyStat = await fs.promises.stat(proxyPath);

    /*
     * Empty proxy = invalid.
     */

    if (proxyStat.size <= 0) {
      return false;
    }

    /*
     * If the original video was modified
     * after the proxy was created, regenerate.
     */

    if (proxyStat.mtimeMs < sourceStat.mtimeMs) {
      console.log("Source video is newer than proxy.");

      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/*
 * ------------------------------------------------------------
 * FILE EXISTS
 * ------------------------------------------------------------
 */

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

/*
 * ------------------------------------------------------------
 * SAFE DELETE
 * ------------------------------------------------------------
 */

async function safeDelete(filePath) {
  try {
    await fs.promises.unlink(filePath);

    console.log("Deleted old/incomplete file:", filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

/*
 * ------------------------------------------------------------
 * FFMPEG
 * ------------------------------------------------------------
 */

function runFFmpeg(args, onProgress) {
  return new Promise((resolve, reject) => {
    /*
     * Do not allow another FFmpeg process
     * while one is already running.
     */

    if (currentFFmpegProcess) {
      reject(new Error("Another FFmpeg process is already running."));

      return;
    }

    const ffmpegArgs = onProgress
      ? ["-progress", "pipe:1", "-nostats", ...args]
      : args;

    console.log("FFmpeg command:", ffmpegPath, ffmpegArgs);

    const process = spawn(ffmpegPath, ffmpegArgs, {
      windowsHide: true,
    });

    currentFFmpegProcess = process;

    let stderr = "";

    if (onProgress) {
      let buffer = "";
      let outTimeMs = 0;

      process.stdout.on("data", (data) => {
        buffer += data.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const parts = line.trim().split("=");
          if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();

            if (key === "out_time_us") {
              const parsed = Number(value);
              if (Number.isFinite(parsed)) {
                outTimeMs = parsed;
              }
            }

            if (key === "progress") {
              const completedSeconds = outTimeMs / 1000000;
              onProgress(completedSeconds);
            }
          }
        }
      });
    }

    process.stderr.on("data", (data) => {
      const text = data.toString();

      stderr += text;

      console.log("[FFmpeg]", text.trim());
    });

    process.on("error", (error) => {
      currentFFmpegProcess = null;

      reject(error);
    });

    process.on("close", (code) => {
      currentFFmpegProcess = null;

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg failed with code ${code}\n${stderr}`));
      }
    });
  });
}
