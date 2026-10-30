interface LogoProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  size?: number
}

/** Quokra mark. Decorative: pair it with visible "Quokra" text. */
export function Logo({ size = 24, ...props }: LogoProps) {
  return <img src="/logo.png" width={size} height={size} alt="" {...props} />
}
