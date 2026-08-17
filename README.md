# Manual Clipper

Manual Clipper is a desktop video editor and social media scheduler built with **Electron**, **Vite**, **FFmpeg**, **Cloudflare R2**, and **Zernio**.

## Features

- **Precision Video Clipping**: Set custom Hook and Main video ranges with frame-accurate previews.
- **Offline FFmpeg Processing**: Fast video cutting and concatenation with automated normalization.
- **Cloudflare R2 Integration**: Seamless cloud upload and remote video library management.
- **Multi-Platform Scheduling**: Schedule content directly to social platforms (Instagram, YouTube, etc.) via Zernio API.
- **Modern Dark UI**: Fast, responsive, and minimalist desktop interface.

## Tech Stack

- **Desktop Framework**: Electron
- **Frontend**: HTML5, CSS3, Vanilla JS, Vite
- **Media Processing**: FFmpeg (`ffmpeg-static`)
- **Cloud Storage**: Cloudflare R2 (`@aws-sdk/client-s3`)
- **Social Scheduling**: Zernio API (`@zernio/node`)
- **Packaging**: Electron Builder (NSIS Windows Installer)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Ashraf1156/ManualClipper.git
cd ManualClipper

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_BUCKET_NAME=your_bucket_name
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key

# Zernio
ZERNIO_API_KEY=your_zernio_api_key
```

### Running Locally

```bash
# Start Vite and Electron in development mode
npm run dev
```

### Building Installer

```bash
# Build production bundle and Windows NSIS installer (.exe)
npm run dist
```

Output `.exe` will be located in the `release/` directory.

## License

MIT
