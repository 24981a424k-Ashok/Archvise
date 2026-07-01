import React from 'react'

interface LogoProps {
  className?: string
  size?: number
}

export default function ArchviseLogo({ className, size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Pointed Gothic Arch Path */}
      <path d="M3 21C3 13 7.5 4 12 4C16.5 4 21 13 21 21" />
      {/* Upward Arrow Path inside the Arch */}
      <path d="M12 21V9" />
      <path d="M8.5 12.5L12 9L15.5 12.5" />
    </svg>
  )
}
