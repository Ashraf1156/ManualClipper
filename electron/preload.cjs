const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // ================================
  // VIDEO EDITOR
  // ================================

  selectVideo: () => ipcRenderer.invoke("select-video"),

  createFinalVideo: (
    hookStart,
    hookEnd,
    mainStart,
    mainEnd
  ) =>
    ipcRenderer.invoke("create-final-video", {
      hookStart,
      hookEnd,
      mainStart,
      mainEnd,
    }),

  onVideoProcessingProgress: (callback) => {
    const listener = (_event, progress) => {
      callback(progress);
    };

    ipcRenderer.on("video-processing-progress", listener);

    return () => {
      ipcRenderer.removeListener(
        "video-processing-progress",
        listener
      );
    };
  },

  // ================================
  // R2 UPLOAD
  // ================================

  uploadVideo: (filePath) =>
    ipcRenderer.invoke("upload-video", {
      filePath,
    }),

  onCloudUploadProgress: (callback) => {
    const listener = (_event, progress) => {
      callback(progress);
    };

    ipcRenderer.on("cloud-upload-progress", listener);

    return () => {
      ipcRenderer.removeListener(
        "cloud-upload-progress",
        listener
      );
    };
  },

  // ================================
  // VIDEO LIBRARY
  // ================================

  listVideoLibrary: () =>
    ipcRenderer.invoke("list-video-library"),

  deleteVideoFromR2: (key) =>
    ipcRenderer.invoke("delete-video-from-r2", {
      key,
    }),

  // ================================
  // ZERNIO
  // ================================

  getConnectedAccounts: () =>
    ipcRenderer.invoke("get-connected-accounts"),

  getZernioAccounts: () =>
    ipcRenderer.invoke("get-connected-accounts"),

  scheduleVideo: (data) =>
    ipcRenderer.invoke("schedule-video", data),

  updateScheduledVideo: (data) =>
    ipcRenderer.invoke("update-scheduled-video", data),
});
