# Real-Time Chat Application

A modern, feature-rich real-time chat application built with Vue.js, Node.js, Express, and WebSockets (Socket.io).

## Features

- 💬 **Real-time messaging** - Instant message delivery using WebSocket
- 👥 **Active users list** - See who's online in real-time
- ✍️ **Typing indicators** - Know when someone is typing
- 🎨 **Beautiful UI** - Modern, responsive design
- 🚀 **Fast & Lightweight** - Optimized for performance
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - WebSocket library for real-time communication
- **CORS** - Cross-Origin Resource Sharing support

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Socket.io-client** - WebSocket client library

## Project Structure

```
task2/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.vue       # Main Vue component
│   │   └── main.js       # Entry point
│   ├── public/           # Static files
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
└── README.md            # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Enter a username and click "Join Chat"
3. Start sending messages in real-time
4. See active users in the sidebar
5. Watch typing indicators when others are typing

## Socket.io Events

### Client → Server
- `user-join` - Join the chat with a username
- `send-message` - Send a message to all users
- `typing` - Notify others that you're typing
- `stop-typing` - Notify others that you stopped typing

### Server → Client
- `user-joined` - Someone joined the chat
- `receive-message` - Receive a new message
- `user-list` - Get list of active users
- `user-left` - Someone left the chat
- `user-typing` - Someone is typing
- `user-stop-typing` - Someone stopped typing

## API Endpoints

- `GET /api/health` - Check if server is running
- `GET /api/messages` - Get message history (last 100 messages)

## Configuration

### Environment Variables (.env)
```
PORT=3001
NODE_ENV=development
```

### Socket.io Configuration
The frontend connects to the backend using:
```javascript
const SOCKET_URL = 'http://localhost:3001'
```

Update this if running on a different server.

## Features Explained

### Real-time Messaging
Messages are sent and received instantly using WebSocket connections. The backend broadcasts to all connected clients.

### User Management
- Users join with a username
- Active users list is updated in real-time
- System messages notify when users join/leave
- Current user is highlighted

### Typing Indicators
- Typing indicator shows who is currently typing
- Auto-stops after 2 seconds of inactivity
- Updates across all connected clients

### Message History
- Last 100 messages are stored on the server
- New users see recent message history
- Timestamp for each message

## Troubleshooting

### Connection Issues
- Ensure backend is running on port 3001
- Check CORS configuration matches your frontend URL
- Verify Socket.io URL in App.vue

### Frontend Not Loading
- Clear browser cache
- Check if frontend is running on port 5173
- Look at browser console for errors

### No Messages Appearing
- Ensure backend server is running
- Check browser console for WebSocket errors
- Verify socket events are being emitted

## Deployment

### Backend Deployment (Heroku, Railway, etc.)
1. Update CORS origin in `server.js`
2. Set environment variables
3. Deploy the backend folder

### Frontend Deployment (Vercel, Netlify, etc.)
1. Update `SOCKET_URL` to point to your backend
2. Run `npm run build`
3. Deploy the dist folder

## Future Enhancements

- Private messaging between users
- Message editing and deletion
- User authentication and authorization
- Message search functionality
- Chat rooms/channels
- File sharing
- Emoji support
- User avatars
- Message reactions
- Database persistence

## License

ISC

## Author

Created with ❤️ for real-time communication
