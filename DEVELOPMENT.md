# Development Guide

## Project Overview

This is a **real-time chat application** using WebSockets (Socket.io), Vue.js 3 frontend, and Node.js backend.

## File Reference

### Backend Files

#### `backend/server.js`
The main server file containing:
- Express app setup
- Socket.io server configuration
- Event handlers for all chat operations
- Active user management
- Message history storage

**Key Components:**
- `activeUsers` Map - Tracks connected users
- `messageHistory` Array - Stores last 100 messages
- Event handlers for: user-join, send-message, typing, disconnect

#### `backend/package.json`
Backend dependencies:
- `express` - Web server framework
- `socket.io` - WebSocket library
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable management
- `nodemon` - Auto-reload on file changes (dev)

#### `backend/.env`
Configuration file:
```
PORT=3001
NODE_ENV=development
```

### Frontend Files

#### `frontend/src/App.vue`
Main Vue component containing:
- Login UI (username input)
- Chat UI (messages, users list, input)
- All event handlers
- WebSocket connection logic
- State management

**Key Sections:**
- `<template>` - UI structure
- `<script>` - Component logic with Composition API
- `<style>` - Responsive CSS styling

#### `frontend/src/main.js`
Vue app entry point:
- Creates Vue app instance
- Mounts to DOM

#### `frontend/index.html`
HTML template:
- Root div with id="app"
- Imports main.js

#### `frontend/vite.config.js`
Vite build configuration:
- Vue plugin setup
- Dev server config (port 5173)

#### `frontend/package.json`
Frontend dependencies:
- `vue` - Frontend framework
- `vite` - Build tool
- `socket.io-client` - WebSocket client

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # (already done)
npm start    # or npm run dev for hot reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # (already done)
npm run dev  # Starts on port 5173
```

**Browser:**
Navigate to `http://localhost:5173`

### Production Build

**Frontend Build:**
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

**Deploy:**
- Deploy `frontend/dist/` to static hosting (Vercel, Netlify)
- Deploy `backend/` to Node.js hosting (Heroku, Railway, Render)
- Update SOCKET_URL in App.vue to point to backend

## Customization Guide

### Change Server Port

Edit `backend/.env`:
```env
PORT=3002  # Changed from 3001
```

Then update Socket.io URL in `frontend/src/App.vue`:
```javascript
const SOCKET_URL = 'http://localhost:3002'
```

### Customize Colors

Edit the CSS in `frontend/src/App.vue`:
```css
/* Change gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change specific colors */
.login-card h1 {
  color: #667eea;  /* Change this */
}
```

### Modify Message Limit

Edit `backend/server.js` in the send-message handler:
```javascript
if (messageHistory.length > 100) {  // Change 100 to desired limit
  messageHistory.shift();
}
```

### Add New Features

#### Example: Add Emoji Reaction to Messages

1. **Frontend (App.vue):** Add button to message div
2. **Backend (server.js):** Add 'emoji-reaction' event handler
3. **Both:** Emit/receive reaction event

#### Example: Add User Status (Online/Away)

1. **Backend:** Track user status
2. **Frontend:** Display status indicator
3. **Event:** Broadcast status changes

## Socket.io Event Patterns

### Emit Event from Frontend
```javascript
socket.value.emit('event-name', data);
```

### Listen for Event on Frontend
```javascript
socket.value.on('event-name', (data) => {
  // Handle event
});
```

### Emit Event from Backend
```javascript
io.emit('event-name', data);  // All clients
socket.emit('event-name', data);  // Only this client
socket.broadcast.emit('event-name', data);  // All except sender
```

### Add New Event

**Backend (server.js):**
```javascript
socket.on('new-event', (data) => {
  console.log('Received:', data);
  io.emit('event-response', response);
});
```

**Frontend (App.vue):**
```javascript
socket.value.on('event-response', (data) => {
  console.log('Response:', data);
});

socket.value.emit('new-event', { key: 'value' });
```

## Vue 3 Composition API Patterns

### Reactive References
```javascript
const username = ref('')  // Reactive state
const messages = ref([])  // Reactive array
```

### Computed Properties
```javascript
const userCount = computed(() => users.value.length)
```

### Watchers
```javascript
watch(messageText, (newVal) => {
  // React to changes
});
```

### Lifecycle Hooks
```javascript
onMounted(() => {
  // Run on component mount
});

onBeforeUnmount(() => {
  // Cleanup before unmount
});
```

## Debugging Tips

### Browser Console
- Check for WebSocket connection errors
- Monitor Socket.io events: Look at Network > WS tab
- Use `console.log()` in event handlers

### Server Logs
- Backend prints messages to console
- Check for connection/disconnection messages
- Monitor for errors in event handlers

### Network Tab (Chrome DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Filter for "WS" (WebSocket)
4. Expand WebSocket connection to see messages
5. Look at individual frames for event data

### Test Multiple Clients
- Open multiple browser tabs
- Use incognito/private windows
- Test on different devices
- Watch real-time message broadcasting

## Common Issues & Solutions

### Issue: Messages not appearing
**Solution:**
- Check browser console for errors
- Verify backend is running
- Check Socket.io connection in Network tab
- Ensure sender and receiver have valid socket connections

### Issue: Typing indicator doesn't work
**Solution:**
- Check typing event is being emitted
- Verify typing/stop-typing events in Network tab
- Check typing timeout is working (2 seconds)

### Issue: CORS error
**Solution:**
- Update frontend URL in `backend/server.js`:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "http://your-frontend-url",  // Update this
    methods: ["GET", "POST"]
  }
});
```

### Issue: Port already in use
**Solution:**
- Find process using port: `lsof -i :3001`
- Kill process or change PORT in `.env`
- On Windows: `netstat -ano | findstr :3001`

## Testing Guide

### Manual Testing Checklist
- [ ] Login with username
- [ ] Send message
- [ ] See message appear instantly
- [ ] See active users list
- [ ] See typing indicator
- [ ] Join with second tab/user
- [ ] See both messages from both users
- [ ] See new user in list
- [ ] Leave chat and verify user removed
- [ ] Open multiple concurrent users
- [ ] Test responsive design

### Unit Testing (Optional)
Consider adding Jest for:
- Socket event emission
- User state management
- Message formatting

### Integration Testing
Use tools like:
- Cypress - End-to-end testing
- Playwright - Browser automation

## Performance Optimization

### Frontend Optimization
- Message history limit (100 messages)
- Virtual scrolling for large message lists
- Debounce typing indicator
- Lazy load user list

### Backend Optimization
- Connection pooling
- Message database instead of array
- Redis for user/message caching
- Load balancing for multiple servers

### Network Optimization
- Enable gzip compression
- Minimize bundle size
- Use CDN for static assets
- WebSocket compression

## Security Considerations

### Frontend
- Sanitize user input
- Validate message length
- XSS protection (Vue handles this)

### Backend
- Validate all input
- Rate limiting
- SQL injection prevention (if using DB)
- JWT authentication (for auth-enabled version)

### Deployment
- Use HTTPS/WSS
- Enable CORS properly
- Environment variables for secrets
- Keep dependencies updated

## Database Integration (Optional)

To add persistent storage:

1. **Install Database:**
   ```bash
   npm install mongoose  # or sequelize, prisma
   ```

2. **Create Models:**
   - User model
   - Message model

3. **Modify Backend:**
   - Save messages to database
   - Load history on startup
   - Query user records

4. **Example MongoDB:**
   ```javascript
   const messageDoc = await Message.create({
     userId, username, text, timestamp
   });
   ```

## Deployment Checklist

- [ ] Update SOCKET_URL in App.vue
- [ ] Update CORS origin in server.js
- [ ] Set NODE_ENV to production
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend dist folder
- [ ] Deploy backend folder
- [ ] Set environment variables on host
- [ ] Test WebSocket connection
- [ ] Monitor server logs

## Resources

- Vue 3 Documentation: https://vuejs.org/
- Socket.io Documentation: https://socket.io/
- Vite Documentation: https://vitejs.dev/
- Express Documentation: https://expressjs.com/

## Support

For issues or questions:
1. Check browser console
2. Check server logs
3. Review this guide
4. Refer to documentation links above
5. Test with simple example first
