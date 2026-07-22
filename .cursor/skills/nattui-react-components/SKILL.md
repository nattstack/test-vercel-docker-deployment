---
name: nattui-react-components
description: Use @nattstack/ui React components when building or editing UI, forms, menus, tabs, tooltips, dialogs, layout primitives, and shared controls in this project.
---

# Nattstack UI Components

## Instructions

This project uses `@nattstack/ui` as its shared React component library. Prefer these components for common UI instead of recreating local buttons, inputs, labels, menus, tabs, tooltips, or flex layout wrappers.

Import components directly from `@nattstack/ui`:

```tsx
import { Button, ButtonLink, Column, Input, Label, Row, Spacer } from "@nattstack/ui"
```

Use the library's semantic props before duplicating state or accessibility behavior with raw elements:

- Use `Button` for actions. Prefer `isLoading`, `isDisabled`, `isFullWidth`, `isIconOnly`, `isRounded`, `size`, and `variant`.
- Use `ButtonLink` for button-styled navigation. With TanStack Router, pass `as={Link}` and `to`.
- Use `Input`, `Textarea`, and `Label` for form controls. Prefer `isInvalid`, `isDisabled`, `isRequired`, `isReadOnly`, `isValid`, and `size`.
- Use `Row`, `Column`, and `Spacer` for simple flex layout and spacing.
- Use `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, and `MenuSeparator` for dropdown menus.
- Use `Tooltip`, `TooltipTrigger`, `TooltipPopup`, and `TooltipProvider` for tooltips.
- Use `Tabs`, `TabsPanel`, and the `TabsSegmented`, `TabsPill`, or `TabsUnderline` variants for tabbed UI.
- Use `Switch`, `DialogResponsive`, and `OTPField` when those patterns are needed.

When a non-button component wraps a router link or another element, follow the existing `render={<Link ... />}` pattern used by the Base UI-backed components.

Keep styling aligned with the local Tailwind tokenless skill: compose `@nattstack/ui` components with numeric token classes such as `h-36`, `px-8`, `gap-12`, `rounded-8`, and `text-14`.
