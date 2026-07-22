---
name: git-commit-messages
description: Generate and review high-quality git commit messages using Conventional Commits and repository history. Use when writing commit messages, reviewing staged changes, preparing commits, or when the user mentions git commit, commit message, Conventional Commits, changelog, or release notes.
---

# Git Commit Messages

## Instructions

When writing a commit message:

1. Inspect the actual change set before drafting.
   - Use `git status` to see staged, unstaged, and untracked files.
   - Use `git diff --staged` for the commit contents when changes are staged.
   - If nothing is staged, use `git diff` and say the message is based on unstaged changes.
   - Check recent commits with `git log --oneline -n 10` and match the repository's local style when it is consistent.
2. Identify the primary intent of the change, not just the edited files.
3. Use Conventional Commits unless the repository clearly uses another format.
4. Keep the subject concise, specific, and written in imperative mood.
5. Add a body only when it explains important context, tradeoffs, migration notes, or user-visible behavior.
6. Add footers for breaking changes, issue links, reviewed-by metadata, or other trailer-style references.
7. If the diff contains unrelated changes, recommend splitting them into separate commits instead of forcing one vague message.

Do not run `git commit` unless the user explicitly asks you to create the commit.

## Conventional Commit Format

Use this structure:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

Choose the type by intent:

- `feat`: adds a user-facing capability.
- `fix`: fixes incorrect behavior.
- `docs`: documentation-only changes.
- `style`: formatting-only changes with no behavior impact.
- `refactor`: restructures code without changing behavior.
- `perf`: improves performance.
- `test`: adds or updates tests.
- `build`: changes build tooling, dependencies, or packaging.
- `ci`: changes CI configuration or workflows.
- `chore`: maintenance work that does not fit another type.
- `revert`: reverts previous changes.

Use a scope when it adds useful context, such as `auth`, `home`, `todos`, `api`, `ui`, `deps`, or `ci`. Keep scopes short, lowercase, and noun-based.

## Subject Guidelines

- Target 50 characters when practical; keep it under 72 characters.
- Start with a lowercase verb after the prefix: `fix(auth): handle expired sessions`.
- Prefer specific verbs: `add`, `fix`, `remove`, `rename`, `split`, `validate`, `persist`.
- Avoid vague subjects such as `update files`, `fix stuff`, `misc changes`, or `work in progress`.
- Do not end the subject with a period.
- Describe the externally meaningful outcome when possible.

## Body Guidelines

Use a body when the subject cannot carry the full context. Explain why the change was needed and what behavior changed. Wrap prose around 72 characters.

Good body topics:

- Motivation or root cause.
- User-visible behavior changes.
- Compatibility or migration notes.
- Important implementation constraints.
- Why a simpler-looking approach was not used.

Avoid bodies that only repeat the subject or list every modified file.

## Footers

Use `BREAKING CHANGE:` when a stable public contract, persisted data format, environment requirement, or user workflow changes incompatibly.

```text
feat(api)!: require project id for todo creation

BREAKING CHANGE: Todo creation requests must include `projectId`.
```

Use issue references when relevant:

```text
fix(todos): preserve completed filter on refresh

Closes #123
```

## Output Patterns

When the user asks for one commit message, return only the message unless they ask for explanation.

When there are multiple reasonable options, provide 2-3 concise alternatives and label the recommended one.

When the change set is unclear or mixed, briefly state what is unclear and ask whether to split or which intent should lead the commit.

## Examples

Feature:

```text
feat(todos): add due-date sorting
```

Bug fix with body:

```text
fix(auth): ignore expired verification tokens

Treat expired tokens as invalid instead of letting the verification
handler continue with a stale session.
```

Refactor:

```text
refactor(home): extract hero topbar
```

Breaking change:

```text
feat(api)!: require authenticated todo requests

BREAKING CHANGE: Todo API routes now reject requests without a valid session.
```

Chore:

```text
chore(deps): update TanStack packages
```

## Quality Checklist

Before finalizing a commit message, verify:

- The type matches the actual intent of the diff.
- The scope is useful and not overly broad.
- The subject is specific, imperative, and under 72 characters.
- The body explains why or impact, not a file-by-file inventory.
- Breaking changes are marked with `!` or `BREAKING CHANGE:`.
- The message would still make sense in a changelog or release history.
