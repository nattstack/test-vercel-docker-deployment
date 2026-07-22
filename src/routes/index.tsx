// oxlint-disable unicorn/consistent-function-scoping

import { Button, Column, Input, Label, Spacer } from "@nattstack/ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: function RouteComponent() {
    function onSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
      event.preventDefault()

      console.log(event.currentTarget)

      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      console.log(email, password)
    }

    return (
      <Column className="h-dvh items-center justify-center">
        <form className="flex w-full max-w-320 flex-col gap-4" onSubmit={onSubmit}>
          <Label htmlFor="email">Email</Label>
          <Spacer height={4} />
          <Input defaultValue="larry@example.com" id="email" name="email" type="email" />
          <Spacer height={16} />

          <Label htmlFor="password">Password</Label>
          <Spacer height={4} />
          <Input defaultValue="password" id="password" name="password" type="text" />

          <Spacer height={24} />
          <Button isFullWidth label="Login" size={48} type="submit" />
        </form>
      </Column>
    )
  },
})
