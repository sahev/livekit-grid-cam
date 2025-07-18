Here’s a README in English, tailored for your project:

---

# LiveKit Grid Webcam App

A real-time webcam grid app built with [Vue 3](https://vuejs.org/) and [LiveKit Cloud](https://livekit.io/). Supports up to 16 participants in a video room. The backend is a simple Node.js server that generates access tokens using the LiveKit SDK.

---

## Features

- 4x4 video grid (up to 16 participants)
- Dynamic join/leave for participants
- Participant identity shown via tooltip
- LiveKit Cloud integration for real-time video streaming
- Simple backend for access token generation

---

## How It Works

1. The user enters a username and joins the room.
2. The frontend requests a token from the backend.
3. The frontend connects to LiveKit Cloud using the token.
4. The local video is published, and remote videos are displayed automatically in the grid.
5. When a participant joins or leaves, the grid updates in real time.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/livekit-grid-webcam.git
cd livekit-grid-webcam
```

### 2. Install frontend dependencies

```bash
npm install
# or
yarn install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure LiveKit API keys

In `server.js`, set your LiveKit Cloud API keys:

```js
const LIVEKIT_API_KEY = 'YOUR_API_KEY'
const LIVEKIT_API_SECRET = 'YOUR_API_SECRET'
```

### 5. Start the backend

```bash
node server.js
```

The backend will be available at `http://localhost:3001`.

### 6. Start the frontend

Go back to the frontend folder and run:

```bash
npm run dev
# or
yarn dev
```

---

## Main File Structure

- **Frontend (Vue 3):**
  - Renders a 4x4 video grid.
  - Manages participants, connection, and disconnection.
  - Uses LiveKit Client SDK for video stream handling.

- **Backend (Node.js):**
  - `/token` endpoint to generate JWT access tokens for LiveKit.
  - Uses LiveKit Server SDK.

---

## Usage

1. Open the app in your browser.
2. Enter a username.
3. Click to join the room.
4. Allow webcam access.
5. Share the link with others to join the same room.

---

## Customization

- To change the grid layout, edit the CSS properties in `.video-grid`.
- To increase the number of participants, adjust the `videoSlots` array and the grid CSS.
- For production, use environment variables for your LiveKit keys and run behind HTTPS.

---

## Requirements

- Node.js 16+
- Modern browser with WebRTC support
- [LiveKit Cloud](https://livekit.io/cloud/) account

---

## License

MIT

---