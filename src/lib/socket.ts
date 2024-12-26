import { Server } from 'socket.io'
import { verifyJwt } from './auth'
import { prisma } from './prisma'

const io = new Server({
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error'))
  }

  try {
    const payload = await verifyJwt(token)
    if (!payload) {
      return next(new Error('Invalid token'))
    }
    socket.data.userId = payload.id
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join:project', async (projectId) => {
    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { ownerId: socket.data.userId },
            { members: { some: { id: socket.data.userId } } }
          ]
        }
      })

      if (!project) {
        socket.emit('error', 'Project not found or access denied')
        return
      }

      socket.join(projectId)
      socket.to(projectId).emit('presence', {
        userId: socket.data.userId,
        status: 'online'
      })
    } catch (error) {
      console.error('Join project error:', error)
      socket.emit('error', 'Failed to join project')
    }
  })

  socket.on('task:update', (data) => {
    const { projectId, taskId, updates } = data
    socket.to(projectId).emit('task:updated', {
      taskId,
      updates,
      userId: socket.data.userId
    })
  })

  socket.on('disconnecting', () => {
    const rooms = Array.from(socket.rooms)
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('presence', {
          userId: socket.data.userId,
          status: 'offline'
        })
      }
    })
  })
})

export { io } 