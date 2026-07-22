import { TooltipProvider } from "@nattstack/ui"
import type { JSX, PropsWithChildren } from "react"

export function Providers(props: PropsWithChildren): JSX.Element {
  const { children } = props

  return <TooltipProvider>{children}</TooltipProvider>
}
