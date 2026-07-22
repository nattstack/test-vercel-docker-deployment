---
name: spacer-over-margin
description: Prefer @nattstack/ui Spacer components over Tailwind margin utilities when adding vertical or horizontal spacing between sibling UI elements in this project.
---

# Spacer Over Margin

## Instructions

The user prefers `<Spacer height={4} />` over `className="mb-4"` for spacing between sibling elements.

When adding layout spacing:

- Use `Spacer` from `@nattstack/ui` for explicit gaps between sibling elements.
- Use `<Spacer height={value} />` for vertical spacing.
- Use `<Spacer width={value} />` for horizontal spacing.
- Put a blank line after `<Spacer />` when it sits between sibling elements.
- Keep values numeric and aligned with the project's tokenless scale, such as `4`, `8`, `16`, `24`, `32`, or `100`.
- Import `Spacer` from `@nattstack/ui` if the file does not already import it.

Prefer this:

```tsx
<Label htmlFor="email">Email</Label>
<Spacer height={8} />

<Input id="email" />
```

Instead of this:

```tsx
<Label className="mb-8" htmlFor="email">
  Email
</Label>
<Input id="email" />
```

Margins are still acceptable when the spacing is part of an element's own visual treatment, alignment, or positioning rather than a gap between siblings.
