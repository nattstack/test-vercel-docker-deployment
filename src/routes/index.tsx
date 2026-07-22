// oxlint-disable unicorn/consistent-function-scoping

import { Button, Column, Input, Label, Spacer } from "@nattstack/ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: function RouteComponent() {
    function onClick(): void {
      console.log("clicked")
    }

    return (
      <Column className="h-dvh items-center justify-center">
        <Column className="w-full max-w-320">
          <Label htmlFor="email">Email</Label>
          <Spacer height={4} />
          <Input id="email" type="email" value="larry@example.com" />
          <Spacer height={16} />

          <Label htmlFor="password">Password</Label>
          <Spacer height={4} />
          <Input id="password" type="text" value="password" />

          <Spacer height={24} />
          <Button isFullWidth label="Login" onClick={onClick} size={48} />
        </Column>
      </Column>
    )
  },
})
