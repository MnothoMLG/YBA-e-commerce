import Image from "next/image"

type YbaLogoProps = {
  className?: string
  priority?: boolean
}

const YbaLogo = ({ className, priority = false }: YbaLogoProps) => {
  return (
    <Image
      src="/yba-logo.svg"
      alt="YBA"
      width={157}
      height={161}
      className={className}
      priority={priority}
    />
  )
}

export default YbaLogo
