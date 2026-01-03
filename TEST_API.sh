#!/bin/bash
# API Testing Guide for Chat Application

# Make sure backend is running on http://localhost:3001

echo "Testing Chat Application API..."
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
curl -X GET http://localhost:3001/api/health
echo ""
echo ""

# Test 2: Get Message History
echo "2. Getting Message History..."
curl -X GET http://localhost:3001/api/messages
echo ""
echo ""

# Notes:
# - WebSocket events cannot be tested with curl
# - Use browser console or Socket.io client library for testing WebSocket events
# - Frontend at http://localhost:5173 handles all WebSocket communication
# 
# WebSocket Testing with socket.io-client:
# const io = require('socket.io-client');
# const socket = io('http://localhost:3001');
# 
# socket.emit('user-join', 'TestUser');
# socket.emit('send-message', { text: 'Hello' });
# 
# socket.on('receive-message', (msg) => console.log(msg));
