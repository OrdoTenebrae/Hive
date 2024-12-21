export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-0.5 ${className}`}>
      <svg
        width="78"
        height="78"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(180deg) rotate(12deg)' }}
        className="relative -top-1"
      >
        {/* Left Hexagon */}
        <path
          d="M11 8L15 6L19 8L19 12L15 14L11 12L11 8Z"
          fill="#FCD34D"
          stroke="#F59E0B"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        
        {/* Right Hexagon */}
        <path
          d="M19 8L23 6L27 8L27 12L23 14L19 12L19 8Z"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        
        {/* Bottom Hexagon */}
        <path
          d="M15 14L19 12L23 14L23 18L19 20L15 18L15 14Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.75"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
        />
        
        {/* Center Point */}
        <circle
          cx="19"
          cy="12"
          r="0.75"
          fill="#92400E"
        />
      </svg>
      <span className="font-bold text-3xl tracking-tight relative right-4 top-0.5">Hive</span>
    </div>
  )
} 