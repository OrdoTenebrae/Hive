const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Create Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    next()
  })

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join:project', (projectId) => {
      socket.join(projectId)
      console.log(`Client ${socket.id} joined project ${projectId}`)
      
      // Notify other clients in the project
      socket.to(projectId).emit('presence', {
        type: 'USER_JOINED',
        userId: socket.handshake.auth.userId,
        timestamp: Date.now()
      })
    })

    socket.on('message', (message) => {
      console.log('Received message:', message)
      if (message.projectId) {
        // Broadcast the message to all clients in the project except the sender
        socket.to(message.projectId).emit('message', message)
      }
    })

    socket.on('disconnecting', () => {
      // Get all rooms that the socket is currently in
      const rooms = Array.from(socket.rooms)
      rooms.forEach(room => {
        if (room !== socket.id) {
          // Notify other clients in each project room
          socket.to(room).emit('presence', {
            type: 'USER_LEFT',
            userId: socket.handshake.auth.userId,
            timestamp: Date.now()
          })
        }
      })
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  server.listen(3001, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3001')
  })
}) 