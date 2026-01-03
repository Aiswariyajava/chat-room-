# Chat Application Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Port 5173)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Vue.js 3 Application (App.vue)              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Login Screen                                    │   │  │
│  │  │  - Username input                               │   │  │
│  │  │  - Join button                                  │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                      OR                                 │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Chat Screen                                     │   │  │
│  │  │  ┌──────────────────────────────────────────┐   │   │  │
│  │  │  │ Header: Title + User Info + Leave Btn   │   │   │  │
│  │  │  ├──────────────────────────────────────────┤   │   │  │
│  │  │  │ Main Layout                              │   │   │  │
│  │  │  │ ┌─────────────────────────────────────┐  │   │   │  │
│  │  │  │ │ Users Panel   │  Messages Area      │  │   │   │  │
│  │  │  │ │               │                     │  │   │   │  │
│  │  │  │ │ - Alice ✓     │  ┌─────────────────┤  │   │   │  │
│  │  │  │ │ - Bob (you)   │  │ Alice: Hello!   │  │   │   │  │
│  │  │  │ │ - Carol       │  │ 10:30 AM        │  │   │   │  │
│  │  │  │ │               │  ├─────────────────┤  │   │   │  │
│  │  │  │ │ Active Users: │  │ Bob: Hi there!  │  │   │   │  │
│  │  │  │ │ 3             │  │ 10:31 AM        │  │   │   │  │
│  │  │  │ │               │  ├─────────────────┤  │   │   │  │
│  │  │  │ │               │  │ Carol is typing │  │   │   │  │
│  │  │  │ └─────────────────────────────────────┘  │   │   │  │
│  │  │  │ Input Area: [Message...] [Send]         │   │   │  │
│  │  │  └──────────────────────────────────────────┘   │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  Socket.io Client (socket.io-client library)            │  │
│  │  ↓                                                       │  │
│  │  WebSocket Connection (persistent)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────┬──────────────────────────────────┘
                             │
                    WebSocket │ (TCP/IP)
                    ↕ Events ↕
                             │
┌────────────────────────────┴──────────────────────────────────┐
│                  NODE.JS SERVER (Port 3001)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Express.js Framework                                   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │                                                          │ │
│  │  HTTP Routes:                                           │ │
│  │  - GET  /api/health          → Server status           │ │
│  │  - GET  /api/messages        → Message history         │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Socket.io Server                                       │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │                                                          │ │
│  │  Connected Clients Tracking:                            │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │ activeUsers Map                                 │   │ │
│  │  │ {                                               │   │ │
│  │  │   "socket1": { username: "Alice", id: "..." }  │   │ │
│  │  │   "socket2": { username: "Bob", id: "..." }    │   │ │
│  │  │   "socket3": { username: "Carol", id: "..." }  │   │ │
│  │  │ }                                               │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  Message Storage:                                       │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │ messageHistory Array (last 100 messages)        │   │ │
│  │  │ [                                               │   │ │
│  │  │   { id, userId, username, text, timestamp },   │   │ │
│  │  │   { id, userId, username, text, timestamp },   │   │ │
│  │  │   ...                                           │   │ │
│  │  │ ]                                               │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  Event Handlers:                                        │ │
│  │  • connection       → New client connected             │ │
│  │  • user-join        → User joins chat                  │ │
│  │  • send-message     → Message received                 │ │
│  │  • typing           → User is typing                   │ │
│  │  • stop-typing      → User stopped typing              │ │
│  │  • disconnect       → User disconnected                │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Joins Chat
```
User A Types Username → Frontend: user-join event
                         ↓
                   Backend: Adds to activeUsers
                         ↓
                   Backend: Broadcasts user-joined
                         ↓
        All Clients: Receive user list update
```

### Message Sent
```
User A Types Message → Frontend: send-message event
                         ↓
                   Backend: Stores message
                         ↓
                   Backend: Broadcasts receive-message
                         ↓
   All Clients: Add message to display + scroll to bottom
```

### Typing Indicator
```
User A Starts Typing → Frontend: typing event
                         ↓
                   Backend: Broadcasts user-typing
                         ↓
   Other Clients: Show "User A is typing"
                         ↓ (after 2 seconds of inactivity)
                    Frontend: stop-typing event
                         ↓
                   Backend: Broadcasts user-stop-typing
                         ↓
   Other Clients: Hide typing indicator
```

## Technology Stack

```
┌──────────────────────────────────────┐
│        Frontend (Browser)             │
├──────────────────────────────────────┤
│                                      │
│  Vue.js 3                            │
│  ├─ Composition API                  │
│  ├─ Reactive State Management        │
│  └─ Component Lifecycle              │
│                                      │
│  Vite                                │
│  ├─ Fast Dev Server                  │
│  ├─ Hot Module Replacement           │
│  └─ Optimized Build                  │
│                                      │
│  Socket.io-client                    │
│  ├─ WebSocket Connection             │
│  ├─ Event Emission                   │
│  └─ Auto Reconnection                │
│                                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│    Backend (Node.js Server)           │
├──────────────────────────────────────┤
│                                      │
│  Express.js                          │
│  ├─ HTTP Server                      │
│  ├─ REST Endpoints                   │
│  └─ Middleware Support               │
│                                      │
│  Socket.io                           │
│  ├─ WebSocket Server                 │
│  ├─ Real-time Events                 │
│  └─ Room Broadcasting                │
│                                      │
│  Node.js                             │
│  ├─ JavaScript Runtime               │
│  ├─ Event Loop                       │
│  └─ Package Management (npm)         │
│                                      │
│  Utilities                           │
│  ├─ CORS (Cross-Origin)              │
│  └─ Environment Variables (.env)     │
│                                      │
└──────────────────────────────────────┘
```

## Event Types

### Client → Server
- **user-join**: { username: string }
- **send-message**: { text: string }
- **typing**: void
- **stop-typing**: void

### Server → Client
- **user-joined**: { userId, username, users[] }
- **user-left**: { userId, username, users[] }
- **receive-message**: { id, userId, username, text, timestamp }
- **user-list**: user[]
- **user-typing**: { userId, username }
- **user-stop-typing**: { userId }

## State Management

### Backend State
```javascript
{
  activeUsers: Map<socketId, { username, id }>
  messageHistory: Array<{
    id: number,
    userId: string,
    username: string,
    text: string,
    timestamp: string
  }>
}
```

### Frontend State
```javascript
{
  username: string,
  inputUsername: string,
  messageText: string,
  messages: Array<Message>,
  users: Array<User>,
  userId: string,
  typingUsers: Array<TypingUser>
}
```

## Connection Lifecycle

```
1. Browser Loads
   ↓
2. Socket Connected (setupSocket)
   ↓
3. User Enters Name & Clicks Join
   ↓
4. Frontend Emits "user-join" Event
   ↓
5. Backend Stores User in activeUsers
   ↓
6. Backend Broadcasts "user-joined" Event
   ↓
7. All Clients Update User List
   ↓
8. User Types & Sends Message
   ↓
9. Frontend Emits "send-message" Event
   ↓
10. Backend Stores Message
    ↓
11. Backend Broadcasts "receive-message" Event
    ↓
12. All Clients Receive & Display Message
    ↓
13. User Leaves or Disconnects
    ↓
14. Backend Removes User
    ↓
15. Backend Broadcasts "user-left" Event
    ↓
16. All Clients Update User List
```

## Performance Considerations

- **Message Limit**: Keep last 100 messages in memory
- **WebSocket**: Persistent connection (more efficient than polling)
- **Event Broadcasting**: Use socket.broadcast for efficiency
- **State Updates**: Vue reactivity handles UI updates automatically
- **Typing Timeout**: Auto-stop typing after 2 seconds

## Security Notes

- Frontend validates input before sending
- Backend can add additional validation
- CORS is configured for specific origin
- Consider adding authentication for production
- Rate limiting recommended for production
