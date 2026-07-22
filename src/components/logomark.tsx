import type { JSX, SVGProps } from "react"

export function Logomark(props: SVGProps<SVGSVGElement>): JSX.Element {
  const { className, ...rest } = props

  return (
    <svg
      className={`fill-current ${className}`.trim()}
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM6 12L12 18L18 12L12 6L6 12Z" />
    </svg>
  )
}
