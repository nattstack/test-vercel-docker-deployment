---
name: tailwind-tokenless
description: Use the @nattstack/ui tailwind-tokenless-10 design scale when editing Tailwind classes, component styling, layout, spacing, sizing, typography, borders, or CSS in this project.
---

# Tailwind Tokenless Scale

## Instructions

This project imports `@nattstack/ui/tailwind-tokenless-10` in `src/styles/global.css`. Treat it as the sizing source of truth for Tailwind UI work.

Use numeric token classes that map to visual pixel values through the 10px root font-size:

- Use `p-16`, `px-24`, `gap-8`, `size-32`, `w-240`, `top-56`, `rounded-12`, `text-14`.
- Prefer numeric font and tracking utilities when available, such as `font-500` and `tracking-5`.
- Avoid Tailwind default named sizing classes such as `p-4`, `gap-2`, `text-sm`, `rounded-lg`, or `shadow-md` for new UI work.
- Use arbitrary values only for one-off values that are not represented by the tokenless scale, such as `max-w-[420px]` or `h-[calc(...)]`.
- Do not replace `@nattstack/ui/tailwind-tokenless-10` with `@nattstack/ui/tailwind-tokenless-16` unless the user explicitly asks for the 16px root scale.

When reviewing or editing existing classes, preserve the project style by converting new spacing, radius, sizing, and text-size utilities to the tokenless numeric form.
