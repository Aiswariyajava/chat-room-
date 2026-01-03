# Quick Start Guide

## Starting the Application

### Option 1: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
Server will run on: http://localhost:3001

**Terminal 2 - Frontend Dev Server:**
```bash
cd frontend
npm run dev
```
Frontend will be available on: http://localhost:5173

Then open your browser and visit: **http://localhost:5173**

### Option 2: Background Processes

**Start backend:**
```bash
cd backend
npm start &
```

**Start frontend:**
```bash
cd frontend
npm run dev &
```

## Development Mode with Auto-Reload

**Backend (with nodemon):**
```bash
cd backend
npm run dev
```

**Frontend (with Vite hot reload):**
```bash
cd frontend
npm run dev
```

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Make sure Node.js is installed: `node --version`
- Verify dependencies installed: `npm install` in backend folder

### Frontend won't load
- Check if port 5173 is in use
- Clear browser cache
- Check browser console for errors (F12)

### Can't connect to server
- Ensure backend is running on port 3001
- Check that CORS is configured correctly
- Verify Socket.io URL in frontend/src/App.vue

## Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

## Features to Try

1. **Open Multiple Tabs**: Connect with different usernames
2. **See Typing Indicators**: Start typing and watch others see it
3. **Real-time Updates**: Messages appear instantly
4. **User List**: Active users update in real-time
5. **System Messages**: See when users join/leave

## Next Steps

- Customize colors and styling in `frontend/src/App.vue`
- Add user authentication
- Implement private messaging
- Add message persistence to a database
- Deploy to production

Enjoy your real-time chat application! 💬
