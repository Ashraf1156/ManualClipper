const fs = require("fs");
const path = require("path");
const https = require("https");
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Upload } = require("@aws-sdk/lib-storage");
const { Zernio } = require("@zernio/node");

const r2Configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_BUCKET_NAME &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY,
);

const zernioConfigured = Boolean(process.env.ZERNIO_API_KEY);

const r2 = r2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

const zernio = zernioConfigured ? new Zernio({ apiKey: process.env.ZERNIO_API_KEY }) : null;

function assertR2() {
  if (!r2) throw new Error("R2 is not configured. Check the R2 variables in .env.");
}

function assertZernio() {
  if (!zernio) throw new Error("Zernio is not configured. Add ZERNIO_API_KEY to .env.");
}

function bucket() {
  if (!process.env.R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is missing.");
  return process.env.R2_BUCKET_NAME;
}

function cleanName(name) {
  return String(name).replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function videoKeyFor(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  return `videos/${Date.now()}_${cleanName(base)}.mp4`;
}

async function putJson(key, value) {
  assertR2();
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      ContentType: "application/json",
      Body: JSON.stringify(value, null, 2),
    }),
  );
}

async function readJson(key) {
  assertR2();
  try {
    const result = await r2.send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    return JSON.parse(await result.Body.transformToString());
  } catch (error) {
    if (error?.name === "NoSuchKey" || error?.$metadata?.httpStatusCode === 404) return null;
    throw error;
  }
}

async function uploadVideo(filePath, { onProgress } = {}) {
  assertR2();

  const key = videoKeyFor(filePath);
  const stat = await fs.promises.stat(filePath);

  const upload = new Upload({
    client: r2,
    params: {
      Bucket: bucket(),
      Key: key,
      Body: fs.createReadStream(filePath),
      ContentType: "video/mp4",
      Metadata: {
        "library-type": "video",
        "original-filename": path.basename(filePath),
      },
    },
    partSize: 8 * 1024 * 1024,
    queueSize: 4,
  });

  upload.on("httpUploadProgress", ({ loaded, total }) => {
    const size = total || stat.size;
    if (onProgress && size) onProgress(Math.min(100, (loaded / size) * 100));
  });

  await upload.done();

  await putJson(`${key}.json`, {
    key,
    filename: path.basename(filePath),
    status: "in-cloud",
    zernioPostId: null,
    uploadedAt: new Date().toISOString(),
  });

  return {
    key,
    filename: path.basename(filePath),
    size: stat.size,
  };
}

async function listR2Objects() {
  assertR2();
  const objects = [];
  let token;

  do {
    const result = await r2.send(
      new ListObjectsV2Command({
        Bucket: bucket(),
        Prefix: "videos/",
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );

    for (const object of result.Contents || []) {
      if (object.Key?.endsWith(".mp4")) objects.push(object);
    }

    token = result.IsTruncated ? result.NextContinuationToken : undefined;
  } while (token);

  return objects;
}

async function getPreviewUrl(key, expiresIn = 3600) {
  assertR2();
  return getSignedUrl(r2, new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn });
}

async function deleteVideo(key) {
  assertR2();

  await r2.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));

  try {
    await r2.send(new DeleteObjectCommand({ Bucket: bucket(), Key: `${key}.json` }));
  } catch (error) {
    console.warn("Could not remove video metadata:", error.message);
  }

  return { success: true, key };
}

async function listZernioPosts() {
  assertZernio();
  const posts = [];
  let page = 1;

  while (true) {
    const { data } = await zernio.posts.listPosts({
      query: { page, limit: 100, sortBy: "created-desc" },
    });

    posts.push(...(data.posts || []));

    if (!data.pagination || page >= data.pagination.pages) break;
    page += 1;
  }

  return posts;
}

async function getVideoLibrary() {
  const objects = await listR2Objects();
  let posts = [];

  if (zernio) {
    try {
      posts = await listZernioPosts();
    } catch (error) {
      console.warn("Zernio sync failed:", error.message);
    }
  }

  const postMap = new Map(posts.map((post) => [post._id, post]));
  const videos = [];

  for (const object of objects) {
    const metadata = await readJson(`${object.Key}.json`);
    const postId = metadata?.zernioPostId || null;
    const post = postId ? postMap.get(postId) : null;

    let status = "in-cloud";
    if (post?.status === "scheduled") status = "scheduled";
    if (post?.status === "published") status = "published";

    videos.push({
      key: object.Key,
      name: metadata?.filename || path.basename(object.Key),
      size: object.Size || 0,
      lastModified: object.LastModified || null,
      status,
      zernioPostId: postId,
      scheduledFor: post?.scheduledFor || null,
      timezone: post?.timezone || null,
      platforms: post?.platforms || [],
      previewUrl: await getPreviewUrl(object.Key),
    });
  }

  videos.sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));
  return videos;
}

async function downloadR2ObjectToTemp(key) {
  assertR2();
  const result = await r2.send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  const tempDir = path.join(require("os").tmpdir(), "manual-clipper");
  await fs.promises.mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${Date.now()}_${cleanName(path.basename(key))}`);
  const output = fs.createWriteStream(tempPath);

  await new Promise((resolve, reject) => {
    result.Body.pipe(output);
    result.Body.on("error", reject);
    output.on("finish", resolve);
    output.on("error", reject);
  });

  return tempPath;
}

async function uploadToZernioMedia(filePath) {
  assertZernio();

  const { data } = await zernio.media.getMediaPresignedUrl({
    body: {
      filename: path.basename(filePath),
      contentType: "video/mp4",
    },
  });

  await putFileToUrl(data.uploadUrl, filePath);
  return data.publicUrl;
}

function putFileToUrl(url, filePath) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(filePath);
    const parsed = new URL(url);

    const request = https.request(
      {
        method: "PUT",
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: `${parsed.pathname}${parsed.search}`,
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": stat.size,
        },
      },
      (response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          response.resume();
          response.on("end", resolve);
        } else {
          let body = "";
          response.on("data", (chunk) => (body += chunk.toString()));
          response.on("end", () => reject(new Error(`Zernio media upload failed (${response.statusCode}): ${body}`)));
        }
      },
    );

    request.on("error", reject);
    fs.createReadStream(filePath).pipe(request);
  });
}

async function scheduleVideo({ key, content, platforms, scheduledFor, timezone, title }) {
  assertZernio();

  const tempPath = await downloadR2ObjectToTemp(key);
  try {
    const mediaUrl = await uploadToZernioMedia(tempPath);

    const { data } = await zernio.posts.createPost({
      body: {
        title,
        content,
        mediaItems: [{ type: "video", url: mediaUrl }],
        platforms,
        scheduledFor,
        timezone,
        publishNow: false,
      },
    });

    const post = data.post;
    const existing = (await readJson(`${key}.json`)) || { key };
    await putJson(`${key}.json`, {
      ...existing,
      zernioPostId: post._id,
      status: "scheduled",
      scheduledFor: post.scheduledFor,
      timezone: post.timezone,
      updatedAt: new Date().toISOString(),
    });

    return post;
  } finally {
    await fs.promises.rm(tempPath, { force: true }).catch(() => {});
  }
}

async function updateScheduledVideo(postId, { scheduledFor, timezone, content, title }) {
  assertZernio();
  const body = { scheduledFor, timezone, isDraft: false };
  if (content !== undefined) body.content = content;
  if (title !== undefined) body.title = title;

  const { data } = await zernio.posts.updatePost({
    path: { postId },
    body,
  });

  return data.post;
}

async function getConnectedAccounts() {
  assertZernio();
  const { data } = await zernio.accounts.listAccounts({
    query: { status: "connected" },
  });
  return data.accounts || [];
}

module.exports = {
  r2Configured,
  zernioConfigured,
  uploadVideo,
  getVideoLibrary,
  getPreviewUrl,
  deleteVideo,
  scheduleVideo,
  updateScheduledVideo,
  getConnectedAccounts,
};
