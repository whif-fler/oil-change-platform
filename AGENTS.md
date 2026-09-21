# Agent rules

## Working agreement
- Do not make architectural or library decisions on your own. If a choice is not specified in my prompt, stop and ask me, offering 2-3 options with tradeoffs.
- Implement only what I specify. No extra features, files, or dependencies.
- Before writing code for a task, restate your plan in a few lines and wait for my go-ahead.
- Never run git commit or git push. I commit myself.

## Constraints
- Next.js 15 (App Router), React 19, TypeScript strict, Tailwind, shadcn/ui, PostgreSQL.
- No `any` anywhere. All API payloads, responses, and DB models strictly typed.
- Server Components by default; "use client" only where interactivity is needed.
- All backend operations through Route Handlers, with proper HTTP status codes and structured JSON errors.
- No placeholder buttons. Every interactive element must do something real.
- Mobile-first, no horizontal scroll from 375px to 1440px.
