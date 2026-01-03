<template>
  <div class="app-container">
    <div v-if="!username" class="login-screen">
      <div class="login-card">
        <h1>💬 Chat App</h1>
        <input
          v-model="inputUsername"
          @keyup.enter="joinChat"
          type="text"
          placeholder="Enter your username"
          class="username-input"
          maxlength="20"
        />
        <button @click="joinChat" class="join-button">Join Chat</button>
      </div>
    </div>

    <div v-else class="chat-screen">
      <header class="chat-header">
        <h1>💬 Real-Time Chat</h1>
        <div class="user-info">
          <span class="current-user">{{ username }}</span>
          <button @click="leaveChat" class="leave-button">Leave</button>
        </div>
      </header>

      <div class="chat-container">
        <aside class="users-panel">
          <h3>Active Users ({{ users.length }})</h3>
          <ul class="user-list">
            <li v-for="user in users" :key="user.id" class="user-item">
              <span class="user-dot" :class="{ 'current': user.id === userId }"></span>
              {{ user.username }}
              <span v-if="user.id === userId" class="you-badge">You</span>
            </li>
          </ul>
        </aside>

        <main class="messages-container">
          <div class="messages">
            <div
              v-for="message in messages"
              :key="message.id"
              class="message"
              :class="{ 'own-message': message.userId === userId }"
            >
              <div class="message-header">
                <span class="message-username">{{ message.username }}</span>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-text">{{ message.text }}</div>
            </div>
            <div v-if="typingUsers.length > 0" class="typing-indicator">
              <span v-for="user in typingUsers" :key="user.userId" class="typing-user">
                {{ user.username }} is typing
              </span>
            </div>
          </div>

          <div class="input-area">
            <input
              v-model="messageText"
              @keyup="handleTyping"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Type a message..."
              class="message-input"
            />
            <button @click="sendMessage" class="send-button">Send</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import io from 'socket.io-client'

export default {
  name: 'App',
  setup() {
    const username = ref('')
    const inputUsername = ref('')
    const messageText = ref('')
    const messages = ref([])
    const users = ref([])
    const userId = ref('')
    const socket = ref(null)
    const typingUsers = ref([])
    const typingTimeout = ref(null)

    const SOCKET_URL = 'http://localhost:3001'

    const initializeSocket = () => {
      socket.value = io(SOCKET_URL)

      socket.value.on('connect', () => {
        console.log('Connected to server')
      })

      socket.value.on('user-joined', (data) => {
        users.value = data.users
        if (data.userId !== userId.value) {
          messages.value.push({
            id: Date.now(),
            userId: 'system',
            username: 'System',
            text: `${data.username} joined the chat`,
            timestamp: new Date().toISOString(),
            isSystem: true
          })
        }
      })

      socket.value.on('receive-message', (message) => {
        messages.value.push(message)
        scrollToBottom()
      })

      socket.value.on('user-list', (userList) => {
        users.value = userList
      })

      socket.value.on('user-left', (data) => {
        users.value = data.users
        messages.value.push({
          id: Date.now(),
          userId: 'system',
          username: 'System',
          text: `${data.username} left the chat`,
          timestamp: new Date().toISOString(),
          isSystem: true
        })
      })

      socket.value.on('user-typing', (data) => {
        if (!typingUsers.value.find(u => u.userId === data.userId)) {
          typingUsers.value.push(data)
        }
      })

      socket.value.on('user-stop-typing', (data) => {
        typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId)
      })

      socket.value.on('disconnect', () => {
        console.log('Disconnected from server')
      })
    }

    const joinChat = () => {
      if (inputUsername.value.trim().length === 0) {
        alert('Please enter a username')
        return
      }
      username.value = inputUsername.value
      userId.value = socket.value.id
      socket.value.emit('user-join', inputUsername.value)
      nextTick(() => scrollToBottom())
    }

    const sendMessage = () => {
      if (messageText.value.trim().length === 0) return

      socket.value.emit('send-message', { text: messageText.value })
      messageText.value = ''
      socket.value.emit('stop-typing')
      clearTimeout(typingTimeout.value)
      nextTick(() => scrollToBottom())
    }

    const handleTyping = () => {
      socket.value.emit('typing')
      clearTimeout(typingTimeout.value)
      typingTimeout.value = setTimeout(() => {
        socket.value.emit('stop-typing')
      }, 2000)
    }

    const leaveChat = () => {
      if (socket.value) {
        socket.value.disconnect()
      }
      username.value = ''
      inputUsername.value = ''
      messageText.value = ''
      messages.value = []
      users.value = []
      initializeSocket()
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }

    const scrollToBottom = () => {
      nextTick(() => {
        const messagesDiv = document.querySelector('.messages')
        if (messagesDiv) {
          messagesDiv.scrollTop = messagesDiv.scrollHeight
        }
      })
    }

    onMounted(() => {
      initializeSocket()
    })

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect()
      }
    })

    return {
      username,
      inputUsername,
      messageText,
      messages,
      users,
      userId,
      typingUsers,
      joinChat,
      sendMessage,
      leaveChat,
      handleTyping,
      formatTime
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100vw;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Login Screen */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.login-card h1 {
  color: #667eea;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.username-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.username-input:focus {
  outline: none;
  border-color: #667eea;
}

.join-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.join-button:hover {
  transform: translateY(-2px);
}

/* Chat Screen */
.chat-screen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  font-size: 1.5em;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-user {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 20px;
}

.leave-button {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 1px solid white;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.leave-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.chat-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.users-panel {
  width: 200px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 15px;
}

.users-panel h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 0.9em;
  text-transform: uppercase;
}

.user-list {
  list-style: none;
}

.user-item {
  padding: 8px;
  margin-bottom: 5px;
  background: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  color: #333;
}

.user-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
}

.user-dot.current {
  background: #2196f3;
}

.you-badge {
  font-size: 0.75em;
  background: #2196f3;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: auto;
}

.messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.own-message {
  display: flex;
  justify-content: flex-end;
}

.message.own-message .message-header {
  flex-direction: row-reverse;
}

.message-header {
  display: flex;
  gap: 10px;
  margin-bottom: 4px;
  font-size: 0.85em;
}

.message-username {
  font-weight: 600;
  color: #667eea;
}

.message-time {
  color: #999;
  font-size: 0.8em;
}

.message-text {
  background: white;
  padding: 10px 12px;
  border-radius: 8px;
  word-wrap: break-word;
  max-width: 70%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.own-message .message-text {
  background: #667eea;
  color: white;
}

.typing-indicator {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  font-size: 0.85em;
  color: #999;
}

.typing-user {
  font-style: italic;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: white;
  border-top: 1px solid #ddd;
}

.message-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
}

.send-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: translateY(-2px);
}

.send-button:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }

  .users-panel {
    width: 100%;
    max-height: 100px;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .message-text {
    max-width: 85%;
  }

  .login-card {
    max-width: 90%;
  }
}
</style>
