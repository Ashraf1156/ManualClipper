import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app">

    <header class="app-header">

      <div class="brand">
        <div class="brand-mark">
          MC
        </div>

        <div class="brand-text">
          <h1>
            Manual Clipper
          </h1>

          <span>
            Offline Video Editor
          </span>
        </div>
      </div>

      <div class="header-actions">
        <button
          id="editor-nav-button"
          class="header-button active"
          type="button"
        >
          Editor
        </button>

        <button
          id="library-nav-button"
          class="header-button"
          type="button"
        >
          Video Library
        </button>
      </div>

    </header>


    <main class="main-content">

      <!-- ================================================== -->
      <!-- IMPORT -->
      <!-- ================================================== -->

      <section
        id="import-section"
        class="welcome-section"
      >

        <div class="welcome-icon">

          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="M15 10L19.5 7.5C20.164 7.131 21 7.611 21 8.371V15.629C21 16.389 20.164 16.869 19.5 16.5L15 14"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <rect
              x="3"
              y="6"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              stroke-width="1.7"
            />

          </svg>

        </div>


        <h2>
          Import your video
        </h2>


        <p>
          Select a local video to start creating your Short.
        </p>


        <button
          id="select-video-button"
          class="primary-button"
          type="button"
        >

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="M12 3V15"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />

            <path
              d="M7 8L12 3L17 8"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <path
              d="M5 15V19C5 20.105 5.895 21 7 21H17C18.105 21 19 20.105 19 19V15"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />

          </svg>

          Select Video

        </button>


        <span class="supported-formats">
          MP4, MOV, WebM
        </span>

      </section>


      <!-- ================================================== -->
      <!-- VIDEO EDITOR -->
      <!-- ================================================== -->

      <section
        id="video-section"
        class="video-section"
        hidden
      >

        <!-- VIDEO HEADER -->

        <div class="video-header">

          <div class="video-information">

            <h2 id="video-title">
              Video
            </h2>

            <span id="video-duration">
              Duration: --:--
            </span>

          </div>


          <button
            id="change-video-button"
            class="secondary-button"
            type="button"
          >
            Change Video
          </button>

        </div>


        <!-- VIDEO PLAYER -->

        <div class="video-player-wrapper">

          <video
            id="source-video"
            preload="metadata"
          ></video>

        </div>


        <!-- VIDEO CONTROLS -->

        <div class="video-controls">

          <div class="video-time-row">

            <span id="current-time">
              00:00:00
            </span>

            <span id="total-time">
              00:00:00
            </span>

          </div>


          <input
            id="timeline"
            class="timeline"
            type="range"
            min="0"
            max="0"
            step="0.01"
            value="0"
          />


          <div class="playback-controls">

            <button
              id="play-button"
              class="control-button"
              type="button"
            >
              Play
            </button>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- HOOK SELECTION -->
        <!-- ================================================= -->

        <div class="selection-group">

          <div class="selection-group-header">

            <div>

              <h3>
                Hook
              </h3>

              <span>
                Select the opening section from the raw video.
              </span>

            </div>

          </div>


          <div class="selection-actions">

            <button
              id="set-hook-start-button"
              class="secondary-button"
              type="button"
            >
              Set Hook Start
            </button>

            <button
              id="set-hook-end-button"
              class="secondary-button"
              type="button"
            >
              Set Hook End
            </button>

          </div>


          <div class="selection-panel">

            <div class="selection-item">

              <span class="selection-label">
                Start
              </span>

              <span
                id="hook-start"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>


            <div class="selection-item">

              <span class="selection-label">
                End
              </span>

              <span
                id="hook-end"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>


            <div class="selection-item">

              <span class="selection-label">
                Duration
              </span>

              <span
                id="hook-duration"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- MAIN VIDEO SELECTION -->
        <!-- ================================================= -->

        <div class="selection-group">

          <div class="selection-group-header">

            <div>

              <h3>
                Main Video
              </h3>

              <span>
                Select the main section from the same raw video.
              </span>

            </div>

          </div>


          <div class="selection-actions">

            <button
              id="set-main-start-button"
              class="secondary-button"
              type="button"
            >
              Set Main Start
            </button>

            <button
              id="set-main-end-button"
              class="secondary-button"
              type="button"
            >
              Set Main End
            </button>

          </div>


          <div class="selection-panel">

            <div class="selection-item">

              <span class="selection-label">
                Start
              </span>

              <span
                id="main-start"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>


            <div class="selection-item">

              <span class="selection-label">
                End
              </span>

              <span
                id="main-end"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>


            <div class="selection-item">

              <span class="selection-label">
                Duration
              </span>

              <span
                id="main-duration"
                class="selection-value"
              >
                00:00:00
              </span>

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- GENERATE FINAL VIDEO -->
        <!-- ================================================= -->

        <div class="editor-actions">

          <button
            id="generate-clip-button"
            class="primary-button"
            type="button"
          >
            Generate Final Video
          </button>

          <div
            id="video-progress-container"
            class="video-progress-container"
            hidden
          >
            <div class="video-progress-header">
              <span id="video-progress-status">
                Generating final video...
              </span>

              <span id="video-progress-percent">
                0%
              </span>
            </div>

            <div class="video-progress-track">
              <div
                id="video-progress-bar"
                class="video-progress-bar"
                style="width: 0%;"
              ></div>
            </div>

            <div class="video-progress-details">
              <span id="video-progress-time">
                00:00:00 / 00:00:00
              </span>

              <span>
                Processing video
              </span>
            </div>
          </div>

        </div>

      </section>

      <!-- ================================================= -->
      <!-- VIDEO LIBRARY -->
      <!-- ================================================= -->

      <section
        id="library-section"
        class="library-section"
        hidden
      >
        <div class="library-toolbar">
          <div class="library-toolbar-left">
            <h2>Video Library</h2>
            <span id="library-count" class="library-count">0 videos</span>
          </div>

          <div class="library-toolbar-center">
            <div class="library-filters">
              <button
                class="library-filter active"
                data-filter="all"
                type="button"
              >
                All
              </button>
              <button
                class="library-filter"
                data-filter="in-cloud"
                type="button"
              >
                In Cloud
              </button>
              <button
                class="library-filter"
                data-filter="scheduled"
                type="button"
              >
                Scheduled
              </button>
              <button
                class="library-filter"
                data-filter="published"
                type="button"
              >
                Published
              </button>
            </div>
          </div>

          <div class="library-toolbar-right">
            <button
              id="refresh-library-button"
              class="secondary-button"
              type="button"
            >
              Refresh
            </button>
          </div>
        </div>

        <!-- LOADING -->
        <div
          id="library-loading"
          class="library-state"
          hidden
        >
          <div class="spinner"></div>
          <p>Loading video library...</p>
        </div>

        <!-- ERROR -->
        <div
          id="library-error"
          class="library-state"
          hidden
        >
          <h3>Unable to load video library</h3>
          <p id="library-error-message">
            Something went wrong.
          </p>
          <button
            id="library-error-retry"
            class="primary-button"
            type="button"
          >
            Try Again
          </button>
        </div>

        <!-- EMPTY -->
        <div
          id="library-empty"
          class="library-state"
          hidden
        >
          <h3>No videos found</h3>
          <p>
            Videos saved to the cloud will appear here.
          </p>
        </div>

        <!-- VIDEO GRID -->
        <div
          id="library-grid"
          class="library-grid"
        ></div>

        <!-- PAGINATION -->
        <div
          id="library-pagination"
          class="library-pagination"
          hidden
        >
          <button
            id="library-prev-button"
            class="secondary-button"
            type="button"
          >
            Previous
          </button>

          <div
            id="library-page-numbers"
            class="library-page-numbers"
          ></div>

          <button
            id="library-next-button"
            class="secondary-button"
            type="button"
          >
            Next
          </button>
        </div>
      </section>

      <!-- ================================================= -->
      <!-- VIDEO PREVIEW MODAL -->
      <!-- ================================================= -->

      <div
        id="video-preview-modal"
        class="modal-backdrop"
        hidden
      >
        <div class="modal-card modal-card-large">
          <div class="modal-header">
            <div class="preview-header-info">
              <h2 id="preview-video-name">Video Preview</h2>
              <span id="preview-video-status" class="status-badge">in-cloud</span>
            </div>

            <button
              id="close-preview-modal"
              class="modal-close-button"
              type="button"
            >
              ×
            </button>
          </div>

          <div class="preview-player-wrapper">
            <video
              id="preview-video"
              controls
              playsinline
            ></video>
          </div>

          <div class="preview-video-details">
            <div class="preview-detail-item">
              <label>File Name</label>
              <span id="preview-file-name">--</span>
            </div>

            <div class="preview-detail-item">
              <label>File Size</label>
              <span id="preview-file-size">--</span>
            </div>

            <div class="preview-detail-item">
              <label>Scheduled For</label>
              <span id="preview-scheduled-time">--</span>
            </div>

            <div class="preview-detail-item">
              <label>Platforms</label>
              <div id="preview-platforms" class="preview-platforms-list">--</div>
            </div>
          </div>

          <div class="preview-actions">
            <button
              id="preview-schedule-button"
              class="primary-button"
              type="button"
            >
              Schedule
            </button>

            <button
              id="preview-delete-button"
              class="danger-button"
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- ================================================= -->
      <!-- SCHEDULE VIDEO MODAL -->
      <!-- ================================================= -->

      <div
        id="schedule-video-modal"
        class="modal-backdrop"
        hidden
      >
        <div class="modal-card schedule-modal-card">
          <div class="modal-header">
            <h2 id="schedule-modal-title">Schedule Video</h2>

            <button
              id="close-schedule-modal"
              class="modal-close-button"
              type="button"
            >
              ×
            </button>
          </div>

          <div class="schedule-form">
            <!-- ACCOUNT -->
            <div class="schedule-field">
              <label for="schedule-account">
                Connected Account
              </label>
              <select id="schedule-account">
                <option value="">Loading accounts...</option>
              </select>
            </div>

            <!-- TITLE -->
            <div class="schedule-field">
              <label for="schedule-title">
                Post Title
              </label>
              <input
                id="schedule-title"
                type="text"
                placeholder="Enter post title..."
              />
            </div>

            <!-- CONTENT -->
            <div class="schedule-field schedule-field-content">
              <label for="schedule-content">
                Caption / Description
              </label>
              <div class="textarea-wrapper">
                <textarea
                  id="schedule-content"
                  rows="4"
                  placeholder="Write a caption for your video..."
                ></textarea>
                <span
                  id="schedule-character-count"
                  class="schedule-character-count"
                >
                  0
                </span>
              </div>
            </div>

            <!-- DATE & TIME -->
            <div class="schedule-fields-row">
              <div class="schedule-field">
                <label for="schedule-date">
                  Date
                </label>
                <input
                  id="schedule-date"
                  type="date"
                />
              </div>

              <div class="schedule-field">
                <label for="schedule-time">
                  Time
                </label>
                <input
                  id="schedule-time"
                  type="time"
                />
              </div>
            </div>

            <!-- TIMEZONE -->
            <div class="schedule-field">
              <label for="schedule-timezone">
                Timezone
              </label>
              <select id="schedule-timezone">
                <option value="Asia/Kolkata">
                  Asia/Kolkata
                </option>
                <option value="Asia/Dubai">
                  Asia/Dubai
                </option>
                <option value="UTC">
                  UTC
                </option>
                <option value="America/New_York">
                  America/New_York
                </option>
                <option value="America/Los_Angeles">
                  America/Los_Angeles
                </option>
                <option value="Europe/London">
                  Europe/London
                </option>
              </select>
            </div>

            <!-- STATUS -->
            <div
              id="schedule-status"
              class="schedule-status"
              hidden
            ></div>

            <!-- ACTIONS -->
            <div class="schedule-actions">
              <button
                id="cancel-schedule-button"
                class="secondary-button"
                type="button"
              >
                Cancel
              </button>

              <button
                id="confirm-schedule-button"
                class="primary-button"
                type="button"
              >
                Schedule Video
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================= -->
      <!-- SAVE VIDEO MODAL -->
      <!-- ================================================= -->

      <div
        id="save-video-modal"
        class="modal-backdrop"
        hidden
      >
        <div class="modal-card">
          <div class="modal-header">
            <h2>Save Video</h2>

            <button
              id="close-save-modal"
              class="modal-close-button"
              type="button"
            >
              ×
            </button>
          </div>

          <p class="modal-description">
            Your final video has been generated successfully.
            Where would you like to save it?
          </p>

          <div class="save-options">
            <button
              id="save-local-button"
              class="save-option"
              type="button"
            >
              <strong>Save on Local Disk</strong>
              <span>
                Keep the generated video on your computer.
              </span>
            </button>

            <button
              id="save-cloud-button"
              class="save-option"
              type="button"
            >
              <strong>Save on Cloud</strong>
              <span>
                Upload the video to your Cloudflare R2 bucket.
              </span>
            </button>
          </div>

          <div
            id="cloud-upload-section"
            class="cloud-upload-section"
            hidden
          >
            <div class="upload-status-row">
              <span id="cloud-upload-status">
                Uploading to cloud...
              </span>

              <strong id="cloud-upload-percent">
                0%
              </strong>
            </div>

            <div class="upload-progress-track">
              <div
                id="cloud-upload-progress"
                class="upload-progress-bar"
                style="width: 0%"
              ></div>
            </div>
          </div>
        </div>
      </div>

    </main>


    <footer class="app-footer">

      <span>
        Manual Clipper
      </span>

      <span>
        Offline processing
      </span>

    </footer>

  </div>
`;

/*
 * ============================================================
 * ELEMENTS
 * ============================================================
 */

const importSection = document.querySelector("#import-section");

const videoSection = document.querySelector("#video-section");

const librarySection = document.querySelector("#library-section");

const editorNavButton = document.querySelector("#editor-nav-button");

const libraryNavButton = document.querySelector("#library-nav-button");

const refreshLibraryButton = document.querySelector("#refresh-library-button");

const libraryGrid = document.querySelector("#library-grid");

const libraryCount = document.querySelector("#library-count");

const libraryLoading = document.querySelector("#library-loading");

const libraryError = document.querySelector("#library-error");

const libraryErrorMessage = document.querySelector("#library-error-message");

const libraryErrorRetry = document.querySelector("#library-error-retry");

const libraryEmpty = document.querySelector("#library-empty");

const libraryPagination = document.querySelector("#library-pagination");

const libraryPrevButton = document.querySelector("#library-prev-button");

const libraryNextButton = document.querySelector("#library-next-button");

const libraryPageNumbers = document.querySelector("#library-page-numbers");

const libraryFilterButtons = document.querySelectorAll(".library-filter");

const videoPreviewModal = document.querySelector("#video-preview-modal");

const closePreviewModalButton = document.querySelector("#close-preview-modal");

const previewVideo = document.querySelector("#preview-video");

const previewVideoName = document.querySelector("#preview-video-name");

const previewVideoStatus = document.querySelector("#preview-video-status");

const previewFileName = document.querySelector("#preview-file-name");

const previewFileSize = document.querySelector("#preview-file-size");

const previewScheduledTime = document.querySelector("#preview-scheduled-time");

const previewPlatforms = document.querySelector("#preview-platforms");

const previewScheduleButton = document.querySelector("#preview-schedule-button");

const previewDeleteButton = document.querySelector("#preview-delete-button");

/*
 * ============================================================
 * SCHEDULE MODAL ELEMENTS
 * ============================================================
 */

const scheduleVideoModal = document.querySelector("#schedule-video-modal");

const closeScheduleModalButton = document.querySelector("#close-schedule-modal");

const cancelScheduleButton = document.querySelector("#cancel-schedule-button");

const confirmScheduleButton = document.querySelector("#confirm-schedule-button");

const scheduleAccount = document.querySelector("#schedule-account");

const scheduleTitle = document.querySelector("#schedule-title");

const scheduleContent = document.querySelector("#schedule-content");

const scheduleCharacterCount = document.querySelector("#schedule-character-count");

const scheduleDate = document.querySelector("#schedule-date");

const scheduleTime = document.querySelector("#schedule-time");

const scheduleTimezone = document.querySelector("#schedule-timezone");

const scheduleStatus = document.querySelector("#schedule-status");

const scheduleModalTitle = document.querySelector("#schedule-modal-title");

const selectVideoButton = document.querySelector("#select-video-button");

const changeVideoButton = document.querySelector("#change-video-button");

const sourceVideo = document.querySelector("#source-video");

const videoTitle = document.querySelector("#video-title");

const videoDuration = document.querySelector("#video-duration");

const currentTimeElement = document.querySelector("#current-time");

const totalTimeElement = document.querySelector("#total-time");

const timeline = document.querySelector("#timeline");

const playButton = document.querySelector("#play-button");

/*
 * ============================================================
 * HOOK ELEMENTS
 * ============================================================
 */

const setHookStartButton = document.querySelector("#set-hook-start-button");

const setHookEndButton = document.querySelector("#set-hook-end-button");

const hookStartElement = document.querySelector("#hook-start");

const hookEndElement = document.querySelector("#hook-end");

const hookDurationElement = document.querySelector("#hook-duration");

/*
 * ============================================================
 * MAIN VIDEO ELEMENTS
 * ============================================================
 */

const setMainStartButton = document.querySelector("#set-main-start-button");

const setMainEndButton = document.querySelector("#set-main-end-button");

const mainStartElement = document.querySelector("#main-start");

const mainEndElement = document.querySelector("#main-end");

const mainDurationElement = document.querySelector("#main-duration");

/*
 * ============================================================
 * GENERATE
 * ============================================================
 */

const generateClipButton = document.querySelector("#generate-clip-button");

const videoProgressContainer = document.querySelector(
  "#video-progress-container"
);

const videoProgressBar = document.querySelector(
  "#video-progress-bar"
);

const videoProgressPercent = document.querySelector(
  "#video-progress-percent"
);

const videoProgressStatus = document.querySelector(
  "#video-progress-status"
);

const videoProgressTime = document.querySelector(
  "#video-progress-time"
);

let removeVideoProgressListener = null;

removeVideoProgressListener =
  window.electronAPI.onVideoProcessingProgress((progress) => {
    const percent = Math.max(
      0,
      Math.min(100, Number(progress.percent) || 0)
    );

    videoProgressContainer.hidden = false;

    videoProgressBar.style.width = `${percent}%`;

    videoProgressPercent.textContent = `${Math.round(percent)}%`;

    videoProgressStatus.textContent =
      percent >= 100
        ? "Final video ready"
        : "Generating final video...";

    if (
      Number.isFinite(progress.completedSeconds) &&
      Number.isFinite(progress.totalDuration)
    ) {
      videoProgressTime.textContent =
        `${formatTime(progress.completedSeconds)} / ` +
        `${formatTime(progress.totalDuration)}`;
    }
  });

/*
 * ============================================================
 * SAVE MODAL ELEMENTS
 * ============================================================
 */

const saveVideoModal = document.querySelector("#save-video-modal");
const closeSaveModalButton = document.querySelector("#close-save-modal");
const saveLocalButton = document.querySelector("#save-local-button");
const saveCloudButton = document.querySelector("#save-cloud-button");
const cloudUploadSection = document.querySelector("#cloud-upload-section");
const cloudUploadStatus = document.querySelector("#cloud-upload-status");
const cloudUploadPercent = document.querySelector("#cloud-upload-percent");
const cloudUploadProgress = document.querySelector("#cloud-upload-progress");

let generatedVideoPath = null;

/*
 * ============================================================
 * VIDEO LIBRARY STATE
 * ============================================================
 */

let libraryVideos = [];

let libraryFilter = "all";

let libraryCurrentPage = 1;

const LIBRARY_PAGE_SIZE = 16;

let selectedLibraryVideo = null;

let zernioAccounts = [];

let scheduleMode = "create";

const removeCloudUploadProgressListener =
  window.electronAPI.onCloudUploadProgress((percent) => {
    cloudUploadPercent.textContent = `${percent}%`;

    cloudUploadProgress.style.width = `${percent}%`;

    if (percent >= 100) {
      cloudUploadStatus.textContent =
        "Upload completed successfully.";
    }
  });

/*
 * ============================================================
 * SELECTION STATE
 * ============================================================
 *
 * Hook and Main are completely independent.
 *
 * Both are taken from the same source video.
 */

let hookStart = null;
let hookEnd = null;

let mainStart = null;
let mainEnd = null;

let isTimelineDragging = false;

/*
 * ============================================================
 * SELECT VIDEO
 * ============================================================
 */

async function selectVideo() {
  try {
    const video = await window.electronAPI.selectVideo();

    if (!video) {
      return;
    }

    videoTitle.textContent = video.name;

    sourceVideo.src = video.url;

    importSection.hidden = true;

    videoSection.hidden = false;

    resetSelections();

    sourceVideo.load();

    console.log("Selected video:", video.path);

    console.log("Video URL:", video.url);
  } catch (error) {
    console.error("Failed to select video:", error);

    alert(`Failed to import video.\n\n${error.message}`);
  }
}

/*
 * ============================================================
 * VIDEO METADATA
 * ============================================================
 */

sourceVideo.addEventListener("loadedmetadata", () => {
  const duration = sourceVideo.duration;

  if (!Number.isFinite(duration)) {
    videoDuration.textContent = "Duration: Unknown";

    return;
  }

  videoDuration.textContent = `Duration: ${formatTime(duration)}`;

  totalTimeElement.textContent = formatTime(duration);

  timeline.max = duration;

  timeline.value = 0;

  currentTimeElement.textContent = formatTime(0);

  console.log("Video duration:", duration, "seconds");
});

/*
 * ============================================================
 * VIDEO TIME UPDATE
 * ============================================================
 */

sourceVideo.addEventListener("timeupdate", () => {
  if (!isTimelineDragging) {
    timeline.value = sourceVideo.currentTime;
  }

  currentTimeElement.textContent = formatTime(sourceVideo.currentTime);
});

/*
 * ============================================================
 * TIMELINE
 * ============================================================
 *
 * THIS IS THE EXISTING WORKING TIMELINE LOGIC.
 *
 * Do not change the behavior.
 */

timeline.addEventListener("pointerdown", () => {
  isTimelineDragging = true;
});

timeline.addEventListener("input", () => {
  const time = Number(timeline.value);

  if (!Number.isFinite(time)) {
    return;
  }

  currentTimeElement.textContent = formatTime(time);

  sourceVideo.currentTime = time;
});

timeline.addEventListener("pointerup", () => {
  isTimelineDragging = false;

  const time = Number(timeline.value);

  if (Number.isFinite(time)) {
    sourceVideo.currentTime = time;

    currentTimeElement.textContent = formatTime(time);
  }
});

timeline.addEventListener("change", () => {
  const time = Number(timeline.value);

  if (!Number.isFinite(time)) {
    return;
  }

  sourceVideo.currentTime = time;

  currentTimeElement.textContent = formatTime(time);
});

timeline.addEventListener("pointercancel", () => {
  isTimelineDragging = false;
});

/*
 * ============================================================
 * PLAY / PAUSE
 * ============================================================
 */

sourceVideo.addEventListener("play", () => {
  playButton.textContent = "Pause";
});

sourceVideo.addEventListener("pause", () => {
  playButton.textContent = "Play";
});

sourceVideo.addEventListener("ended", () => {
  playButton.textContent = "Play";
});

playButton.addEventListener("click", async () => {
  if (sourceVideo.paused) {
    try {
      await sourceVideo.play();
    } catch (error) {
      console.error("Unable to play video:", error);
    }
  } else {
    sourceVideo.pause();
  }
});

/*
 * ============================================================
 * SET HOOK START
 * ============================================================
 */

setHookStartButton.addEventListener("click", () => {
  hookStart = sourceVideo.currentTime;

  hookStartElement.textContent = formatTime(hookStart);

  updateHookDuration();

  console.log("Hook start:", hookStart);
});

/*
 * ============================================================
 * SET HOOK END
 * ============================================================
 */

setHookEndButton.addEventListener("click", () => {
  hookEnd = sourceVideo.currentTime;

  hookEndElement.textContent = formatTime(hookEnd);

  updateHookDuration();

  console.log("Hook end:", hookEnd);
});

/*
 * ============================================================
 * SET MAIN START
 * ============================================================
 */

setMainStartButton.addEventListener("click", () => {
  mainStart = sourceVideo.currentTime;

  mainStartElement.textContent = formatTime(mainStart);

  updateMainDuration();

  console.log("Main start:", mainStart);
});

/*
 * ============================================================
 * SET MAIN END
 * ============================================================
 */

setMainEndButton.addEventListener("click", () => {
  mainEnd = sourceVideo.currentTime;

  mainEndElement.textContent = formatTime(mainEnd);

  updateMainDuration();

  console.log("Main end:", mainEnd);
});

/*
 * ============================================================
 * GENERATE FINAL VIDEO
 * ============================================================
 */

generateClipButton.addEventListener("click", async () => {
  if (
    !Number.isFinite(hookStart) ||
    !Number.isFinite(hookEnd) ||
    !Number.isFinite(mainStart) ||
    !Number.isFinite(mainEnd)
  ) {
    alert("Please select both Hook and Main Video ranges.");
    return;
  }

  if (hookEnd <= hookStart) {
    alert("Hook end must be greater than Hook start.");
    return;
  }

  if (mainEnd <= mainStart) {
    alert("Main Video end must be greater than Main Video start.");
    return;
  }

  const hookDuration = hookEnd - hookStart;
  const mainDuration = mainEnd - mainStart;
  const totalDuration = hookDuration + mainDuration;

  console.log("Generating final video...");
  console.log("Hook duration:", hookDuration);
  console.log("Main duration:", mainDuration);
  console.log("Final duration:", totalDuration);

  generateClipButton.disabled = true;
  generateClipButton.textContent = "Creating Final Video...";

  videoProgressContainer.hidden = false;
  videoProgressBar.style.width = "0%";
  videoProgressPercent.textContent = "0%";
  videoProgressStatus.textContent = "Generating final video...";
  videoProgressTime.textContent = `00:00:00 / ${formatTime(totalDuration)}`;

  try {
    const result = await window.electronAPI.createFinalVideo(
      hookStart,
      hookEnd,
      mainStart,
      mainEnd
    );

    console.log("Final video created:", result);

    videoProgressBar.style.width = "100%";
    videoProgressPercent.textContent = "100%";
    videoProgressStatus.textContent = "Final video ready";
    videoProgressTime.textContent = `${formatTime(totalDuration)} / ${formatTime(totalDuration)}`;

    openSaveVideoModal(result.outputPath);
  } catch (error) {
    console.error("Failed to create final video:", error);

    videoProgressStatus.textContent = "Video generation failed.";

    alert(
      `Failed to create final video.\n\n${error.message}`
    );
  } finally {
    generateClipButton.disabled = false;
    generateClipButton.textContent = "Generate Final Video";
  }
});

/*
 * ============================================================
 * HOOK DURATION
 * ============================================================
 */

function updateHookDuration() {
  if (hookStart === null || hookEnd === null) {
    hookDurationElement.textContent = "00:00:00";

    return;
  }

  const duration = hookEnd - hookStart;

  if (duration <= 0) {
    hookDurationElement.textContent = "00:00:00";

    return;
  }

  hookDurationElement.textContent = formatTime(duration);
}

/*
 * ============================================================
 * MAIN DURATION
 * ============================================================
 */

function updateMainDuration() {
  if (mainStart === null || mainEnd === null) {
    mainDurationElement.textContent = "00:00:00";

    return;
  }

  const duration = mainEnd - mainStart;

  if (duration <= 0) {
    mainDurationElement.textContent = "00:00:00";

    return;
  }

  mainDurationElement.textContent = formatTime(duration);
}

/*
 * ============================================================
 * RESET
 * ============================================================
 */

function resetSelections() {
  hookStart = null;
  hookEnd = null;

  mainStart = null;
  mainEnd = null;

  hookStartElement.textContent = "00:00:00";

  hookEndElement.textContent = "00:00:00";

  hookDurationElement.textContent = "00:00:00";

  mainStartElement.textContent = "00:00:00";

  mainEndElement.textContent = "00:00:00";

  mainDurationElement.textContent = "00:00:00";
}

/*
 * ============================================================
 * FORMAT TIME
 * ============================================================
 */

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "00:00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = Math.floor(totalSeconds % 60);

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

/*
 * ============================================================
 * BUTTON EVENTS
 * ============================================================
 */

selectVideoButton.addEventListener("click", selectVideo);

changeVideoButton.addEventListener("click", selectVideo);

/*
 * ============================================================
 * VIDEO LIBRARY FUNCTIONS
 * ============================================================
 */

async function loadVideoLibrary() {
  libraryLoading.hidden = false;
  libraryError.hidden = true;
  libraryEmpty.hidden = true;
  libraryGrid.innerHTML = "";
  libraryPagination.hidden = true;

  try {
    const result = await window.electronAPI.listVideoLibrary();
    libraryVideos = result.videos || [];
    libraryCurrentPage = 1;
    renderVideoLibrary();
  } catch (error) {
    console.error("Failed to load video library:", error);
    libraryErrorMessage.textContent = error.message || "Something went wrong.";
    libraryError.hidden = false;
  } finally {
    libraryLoading.hidden = true;
  }
}

function getFilteredLibraryVideos() {
  if (libraryFilter === "all") {
    return libraryVideos;
  }
  return libraryVideos.filter((v) => v.status === libraryFilter);
}

function renderVideoLibrary() {
  const filtered = getFilteredLibraryVideos();
  libraryCount.textContent = `${filtered.length} video${filtered.length === 1 ? "" : "s"}`;

  if (filtered.length === 0) {
    libraryEmpty.hidden = false;
    libraryGrid.innerHTML = "";
    libraryPagination.hidden = true;
    return;
  }

  libraryEmpty.hidden = true;

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIBRARY_PAGE_SIZE));
  if (libraryCurrentPage > totalPages) {
    libraryCurrentPage = totalPages;
  }

  const start = (libraryCurrentPage - 1) * LIBRARY_PAGE_SIZE;
  const pageVideos = filtered.slice(start, start + LIBRARY_PAGE_SIZE);

  libraryGrid.innerHTML = pageVideos
    .map((video) => {
      const statusClass = `status-${video.status || "in-cloud"}`;
      const statusText = video.status ? video.status.replace(/-/g, " ") : "in cloud";
      const sizeText = formatBytes(video.size);
      const dateText = formatDate(video.lastModified);

      return `
        <div class="library-card" data-key="${escapeHtml(video.key)}">
          <div class="library-card-preview">
            <video src="${escapeHtml(video.previewUrl)}" preload="metadata" muted></video>
            <div class="library-card-overlay">
              <span class="play-icon">▶</span>
            </div>
            <span class="library-card-status ${statusClass}">${escapeHtml(statusText)}</span>
          </div>
          <div class="library-card-info">
            <h4 class="library-card-title" title="${escapeHtml(video.name)}">${escapeHtml(video.name)}</h4>
            <div class="library-card-meta">
              <span>${sizeText}</span>
              <span>${dateText}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  libraryGrid.querySelectorAll(".library-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.key;
      const video = libraryVideos.find((v) => v.key === key);
      if (video) {
        openVideoPreview(video);
      }
    });
  });

  // Pagination
  if (totalPages > 1) {
    libraryPagination.hidden = false;
    libraryPrevButton.disabled = libraryCurrentPage <= 1;
    libraryNextButton.disabled = libraryCurrentPage >= totalPages;

    let pageHtml = "";
    for (let i = 1; i <= totalPages; i++) {
      pageHtml += `
        <button class="page-number-button ${i === libraryCurrentPage ? "active" : ""}" data-page="${i}" type="button">
          ${i}
        </button>
      `;
    }
    libraryPageNumbers.innerHTML = pageHtml;
    libraryPageNumbers.querySelectorAll(".page-number-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        libraryCurrentPage = Number(btn.dataset.page);
        renderVideoLibrary();
      });
    });
  } else {
    libraryPagination.hidden = true;
  }
}

function openVideoPreview(video) {
  selectedLibraryVideo = video;

  previewVideoName.textContent = video.name;
  previewFileName.textContent = video.key ? video.key.split("/").pop() : "--";
  previewFileSize.textContent = formatBytes(video.size);

  const status = video.status || "in-cloud";
  previewVideoStatus.textContent = status.replace(/-/g, " ");
  previewVideoStatus.className = `status-badge status-${status}`;

  if (video.scheduledFor) {
    previewScheduledTime.textContent = formatScheduledDate(video.scheduledFor, video.timezone);
  } else {
    previewScheduledTime.textContent = "--";
  }

  if (Array.isArray(video.platforms) && video.platforms.length > 0) {
    previewPlatforms.innerHTML = video.platforms
      .map((p) => {
        const platformName =
          typeof p === "string"
            ? p
            : p?.platform || "";

        return `
          <span class="platform-tag">
            ${escapeHtml(formatPlatformName(platformName))}
          </span>
        `;
      })
      .join("");
  } else {
    previewPlatforms.textContent = "--";
  }

  previewVideo.src = video.previewUrl || "";
  previewScheduleButton.textContent = status === "scheduled" ? "Edit Schedule" : "Schedule";

  videoPreviewModal.hidden = false;
}

function closeVideoPreview() {
  videoPreviewModal.hidden = true;
  previewVideo.pause();
  previewVideo.src = "";
  selectedLibraryVideo = null;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(isoString) {
  if (!isoString) return "--";
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatScheduledDate(scheduledFor, timezone) {
  const parsed = new Date(scheduledFor);
  if (Number.isNaN(parsed.getTime())) return scheduledFor;
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  });
}

function formatPlatformName(platform) {
  if (!platform) return "";
  return String(platform)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
 * ============================================================
 * NAVIGATION & LIBRARY EVENTS
 * ============================================================
 */

function switchView(view) {
  if (view === "editor") {
    editorNavButton.classList.add("active");
    libraryNavButton.classList.remove("active");
    librarySection.hidden = true;

    if (sourceVideo.src) {
      videoSection.hidden = false;
      importSection.hidden = true;
    } else {
      importSection.hidden = false;
      videoSection.hidden = true;
    }
  } else if (view === "library") {
    editorNavButton.classList.remove("active");
    libraryNavButton.classList.add("active");
    importSection.hidden = true;
    videoSection.hidden = true;
    librarySection.hidden = false;

    loadVideoLibrary();
  }
}

editorNavButton.addEventListener("click", () => switchView("editor"));
libraryNavButton.addEventListener("click", () => switchView("library"));

refreshLibraryButton.addEventListener("click", () => loadVideoLibrary());
libraryErrorRetry.addEventListener("click", () => loadVideoLibrary());

libraryPrevButton.addEventListener("click", () => {
  if (libraryCurrentPage <= 1) return;
  libraryCurrentPage--;
  renderVideoLibrary();
});

libraryNextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(getFilteredLibraryVideos().length / LIBRARY_PAGE_SIZE);
  if (libraryCurrentPage >= totalPages) return;
  libraryCurrentPage++;
  renderVideoLibrary();
});

libraryFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    libraryFilter = button.dataset.filter;
    libraryCurrentPage = 1;
    libraryFilterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderVideoLibrary();
  });
});

closePreviewModalButton.addEventListener("click", closeVideoPreview);

videoPreviewModal.addEventListener("click", (event) => {
  if (event.target === videoPreviewModal) {
    closeVideoPreview();
  }
});

/*
 * ============================================================
 * DELETE LIBRARY VIDEO
 * ============================================================
 */

previewDeleteButton.addEventListener("click", async () => {
  if (!selectedLibraryVideo) {
    return;
  }

  const video = selectedLibraryVideo;

  const confirmed = confirm(
    `Delete "${video.name}" from your Video Library?\n\n` +
    `This will delete the R2 library copy.`
  );

  if (!confirmed) {
    return;
  }

  previewDeleteButton.disabled = true;
  previewDeleteButton.textContent = "Deleting...";

  try {
    await window.electronAPI.deleteVideoFromR2(video.key);
    closeVideoPreview();
    await loadVideoLibrary();
  } catch (error) {
    console.error("Failed to delete video:", error);
    alert(`Failed to delete video.\n\n${error.message}`);
  } finally {
    previewDeleteButton.disabled = false;
    previewDeleteButton.textContent = "Delete";
  }
});

/*
 * ============================================================
 * SCHEDULE VIDEO MODAL LOGIC
 * ============================================================
 */

async function openScheduleModal(video) {
  selectedLibraryVideo = video;
  scheduleMode = video.status === "scheduled" ? "edit" : "create";

  scheduleModalTitle.textContent =
    scheduleMode === "edit"
      ? "Edit Scheduled Video"
      : "Schedule Video";

  confirmScheduleButton.textContent =
    scheduleMode === "edit"
      ? "Update Schedule"
      : "Schedule Video";

  scheduleStatus.hidden = true;
  scheduleStatus.textContent = "";

  scheduleAccount.innerHTML = `
    <option value="">Loading accounts...</option>
  `;

  try {
    const accounts = await window.electronAPI.getConnectedAccounts();
    zernioAccounts = Array.isArray(accounts)
      ? accounts
      : accounts?.accounts || [];

    if (zernioAccounts.length === 0) {
      scheduleAccount.innerHTML = `
        <option value="">No connected accounts found</option>
      `;
      showScheduleStatus(
        "No connected accounts found. Please connect your accounts in Zernio dashboard.",
        "error"
      );
    } else {
      scheduleAccount.innerHTML = zernioAccounts
        .map((account) => {
          const platform = formatPlatformName(account.platform);
          const name = account.name || account.username || account.displayName || account._id;
          return `<option value="${escapeHtml(account._id)}" data-platform="${escapeHtml(account.platform)}">${escapeHtml(platform)} (${escapeHtml(name)})</option>`;
        })
        .join("");

      if (Array.isArray(video.platforms) && video.platforms.length > 0) {
        const matched = zernioAccounts.find((a) => video.platforms.includes(a.platform));
        if (matched) {
          scheduleAccount.value = matched._id;
        }
      }
    }
  } catch (error) {
    console.error("Failed to load accounts:", error);
    scheduleAccount.innerHTML = `
      <option value="">
        Unable to load accounts
      </option>
    `;

    scheduleStatus.textContent =
      error.message ||
      "Unable to load connected accounts.";

    scheduleStatus.hidden = false;
  }

  /*
   * Existing schedule values.
   */
  scheduleTitle.value =
    video.title ||
    video.name ||
    "";

  scheduleContent.value =
    video.content ||
    "";

  updateScheduleCharacterCount();

  /*
   * Default timezone.
   */
  const detectedTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneExists =
    Array.from(scheduleTimezone.options)
      .some(
        (option) =>
          option.value === detectedTimezone
      );

  if (timezoneExists) {
    scheduleTimezone.value =
      detectedTimezone;
  }

  /*
   * Existing scheduled date/time.
   */
  if (video.scheduledFor) {
    const scheduledDate =
      new Date(video.scheduledFor);

    if (!Number.isNaN(scheduledDate.getTime())) {
      scheduleDate.value =
        formatDateForInput(scheduledDate);

      scheduleTime.value =
        formatTimeForInput(scheduledDate);
    }
  } else {
    setDefaultScheduleDateTime();
  }

  scheduleVideoModal.hidden = false;
}

function updateScheduleCharacterCount() {
  scheduleCharacterCount.textContent =
    scheduleContent.value.length;
}

function setDefaultScheduleDateTime() {
  const now = new Date();

  /*
   * Default to 1 hour from now.
   */
  now.setMinutes(now.getMinutes() + 60);

  scheduleDate.value =
    formatDateForInput(now);

  scheduleTime.value =
    formatTimeForInput(now);
}

function formatDateForInput(date) {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeForInput(date) {
  const hours =
    String(date.getHours())
      .padStart(2, "0");

  const minutes =
    String(date.getMinutes())
      .padStart(2, "0");

  return `${hours}:${minutes}`;
}

function closeScheduleModal() {
  scheduleVideoModal.hidden = true;
  scheduleStatus.hidden = true;
  scheduleStatus.textContent = "";
}

function showScheduleStatus(message, type) {
  scheduleStatus.textContent = message;
  scheduleStatus.className =
    `schedule-status schedule-status-${type}`;
  scheduleStatus.hidden = false;
}

async function submitScheduleVideo() {
  if (!selectedLibraryVideo) {
    return;
  }

  const selectedOption = scheduleAccount.selectedOptions[0];
  const selectedAccountId = scheduleAccount.value;

  if (!selectedAccountId) {
    showScheduleStatus("Please select a connected account.", "error");
    return;
  }

  const account = zernioAccounts.find((a) => a._id === selectedAccountId) || {
    platform: selectedOption?.dataset?.platform || "instagram",
    _id: selectedAccountId,
  };

  const platforms = [
    {
      platform: account.platform,
      accountId: account._id,
    },
  ];

  console.log("FULL ZERNIO ACCOUNT:", account);
  console.log("ZERNIO PLATFORMS PAYLOAD:", platforms);

  const title = scheduleTitle.value.trim();
  const content = scheduleContent.value.trim();
  const dateValue = scheduleDate.value;
  const timeValue = scheduleTime.value;
  const timezone = scheduleTimezone.value;

  if (!dateValue || !timeValue) {
    showScheduleStatus("Please select a valid scheduled date and time.", "error");
    return;
  }

  const scheduledFor = new Date(`${dateValue}T${timeValue}:00`).toISOString();

  confirmScheduleButton.disabled = true;
  confirmScheduleButton.textContent =
    scheduleMode === "edit"
      ? "Updating..."
      : "Scheduling...";

  try {
    if (scheduleMode === "edit") {
      const postId =
        selectedLibraryVideo.postId ||
        selectedLibraryVideo.zernioPostId;

      if (!postId) {
        throw new Error(
          "This scheduled video does not contain a Zernio post ID, so it cannot be edited yet."
        );
      }

      await window.electronAPI.updateScheduledVideo({
        postId,
        scheduledFor,
        timezone,
        content,
        title,
      });
    } else {
      await window.electronAPI.scheduleVideo({
        key: selectedLibraryVideo.key,
        content,
        platforms,
        scheduledFor,
        timezone,
        title,
      });
    }

    showScheduleStatus(
      scheduleMode === "edit"
        ? "Schedule updated successfully."
        : "Video scheduled successfully.",
      "success"
    );

    /*
     * Refresh the library so the card
     * changes from In Cloud → Scheduled.
     */
    await loadVideoLibrary();

    setTimeout(() => {
      closeScheduleModal();
      closeVideoPreview();
    }, 800);
  } catch (error) {
    console.error("Failed to schedule video:", error);
    showScheduleStatus(
      error.message || "Failed to schedule video.",
      "error"
    );
  } finally {
    confirmScheduleButton.disabled = false;
    confirmScheduleButton.textContent =
      scheduleMode === "edit"
        ? "Update Schedule"
        : "Schedule Video";
  }
}

/*
 * ============================================================
 * SCHEDULE MODAL BUTTON EVENTS
 * ============================================================
 */

previewScheduleButton.addEventListener("click", () => {
  if (!selectedLibraryVideo) {
    return;
  }

  openScheduleModal(selectedLibraryVideo);
});

closeScheduleModalButton.addEventListener("click", closeScheduleModal);

cancelScheduleButton.addEventListener("click", closeScheduleModal);

scheduleVideoModal.addEventListener("click", (event) => {
  if (event.target === scheduleVideoModal) {
    closeScheduleModal();
  }
});

scheduleContent.addEventListener("input", updateScheduleCharacterCount);

confirmScheduleButton.addEventListener("click", submitScheduleVideo);

/*
 * ============================================================
 * SAVE MODAL BEHAVIOR
 * ============================================================
 */

function openSaveVideoModal(outputPath) {
  generatedVideoPath = outputPath;

  cloudUploadSection.hidden = true;
  cloudUploadPercent.textContent = "0%";
  cloudUploadProgress.style.width = "0%";
  cloudUploadStatus.textContent = "Uploading to cloud...";

  saveVideoModal.hidden = false;
}

closeSaveModalButton.addEventListener("click", () => {
  saveVideoModal.hidden = true;
});

saveLocalButton.addEventListener("click", async () => {
  if (!generatedVideoPath) {
    return;
  }

  saveVideoModal.hidden = true;

  alert(
    `Video saved successfully on your local disk.\n\n${generatedVideoPath}`
  );
});

saveCloudButton.addEventListener("click", async () => {
  if (!generatedVideoPath) {
    return;
  }

  saveCloudButton.disabled = true;
  saveLocalButton.disabled = true;

  cloudUploadSection.hidden = false;
  cloudUploadStatus.textContent = "Uploading to Cloudflare R2...";
  cloudUploadPercent.textContent = "0%";
  cloudUploadProgress.style.width = "0%";

  try {
    const result = await window.electronAPI.uploadVideo(generatedVideoPath);

    console.log("Video uploaded to R2:", result);

    cloudUploadPercent.textContent = "100%";
    cloudUploadProgress.style.width = "100%";
    cloudUploadStatus.textContent = "Video uploaded successfully.";

    setTimeout(() => {
      saveVideoModal.hidden = true;

      saveCloudButton.disabled = false;
      saveLocalButton.disabled = false;
    }, 1000);
  } catch (error) {
    console.error("R2 upload failed:", error);

    cloudUploadStatus.textContent = "Upload failed.";

    alert(
      `Failed to upload video to R2.\n\n${error.message}`
    );

    saveCloudButton.disabled = false;
    saveLocalButton.disabled = false;
  }
});

/*
 * ============================================================
 * TEST ZERNIO ACCOUNTS CONNECTION
 * ============================================================
 */

async function testZernioAccounts() {
  try {
    const accounts = await window.electronAPI.getConnectedAccounts();

    console.log("CONNECTED ZERNIO ACCOUNTS:");
    console.log(accounts);

    return accounts;
  } catch (error) {
    console.error("Failed to load Zernio accounts:", error);
  }
}

testZernioAccounts();
