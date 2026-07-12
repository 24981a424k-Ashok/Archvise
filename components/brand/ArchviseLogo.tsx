import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: number
}

export default function ArchviseLogo({ className, size = 24 }: LogoProps) {
  return (
    <Image
      src="/icon.png"
      alt="Archvise"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
