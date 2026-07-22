import { Column } from "@nattstack/ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: function RouteComponent() {
    return (
      <Column className="h-dvh items-center justify-center">
        Testing vercel docker deployment
      </Column>
    )
  },
})
