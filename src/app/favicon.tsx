import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/svg+xml'

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        style={{ transform: 'rotate(180deg) rotate(12deg)' }}
      >
        <path
          d="M11 8L15 6L19 8L19 12L15 14L11 12L11 8Z"
          fill="#FCD34D"
          stroke="#F59E0B"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        <path
          d="M19 8L23 6L27 8L27 12L23 14L19 12L19 8Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        <path
          d="M15 14L19 12L23 14L23 18L19 20L15 18L15 14Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        <circle
          cx="19"
          cy="12"
          r="0.75"
          fill="#92400E"
        />
      </svg>
    ),
    { ...size }
  )
} 