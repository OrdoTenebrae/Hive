import toast from 'react-hot-toast'

interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export function showToast(options: ToastOptions) {
  const { title, description, variant = 'default', duration = 3000 } = options
  const message = description ? `${title}\n${description}` : title

  if (variant === 'destructive') {
    toast.error(message, { duration })
  } else {
    toast.success(message, { duration })
  }
}

export { toast } 