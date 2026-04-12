# ESTUDIOK - Project Documentation

## Last Updated: April 10, 2026

## Recent Changes

### ✅ Build Fixes (April 10, 2026)
- **Fixed TypeScript strict mode errors** across the entire codebase
- **Rewrote PremiumIcons.tsx** to support dual usage patterns:
  - Named exports: `import { Check, Calendar } from '@/components/PremiumIcons'`
  - Component pattern: `<PremiumIcon name="check" className="h-4 w-4" />`
- **Fixed prerender errors** in `/agendar`, `/consultoria`, and `/indicacao` pages
  - Replaced dynamic icon lookups (`PremiumIcons[icon]`) with `<PremiumIcons.PremiumIcon name={...} />`
- **Fixed SwipeQuiz.tsx** - Added null checks for `currentQuestion` and `changedTouches`
- **Fixed PremiumHero.tsx** - Added `isMounted` state to prevent SSR issues with `window` object
- **Updated PremiumUI.tsx** - Added missing props (`className`, `type`, `description`)

### ✅ Bulk Email Marketing System (April 10, 2026)

#### API Endpoint
- **Location**: `/app/api/marketing/bulk-email/route.ts`
- **Features**:
  - Send emails to multiple recipients using Resend API
  - Personalization support with `{{nome}}` placeholder
  - Batch processing (50 emails per batch) to avoid rate limits
  - Detailed success/failure reporting

#### Admin Dashboard
- **Location**: `/app/admin/marketing/bulk-email/page.tsx`
- **Features**:
  - Auto-import users from Firebase Firestore (`users` collection)
  - Manual email address input
  - Rich HTML email composer with subject and body
  - **Pre-built templates**: Boas-vindas, Promoção, Newsletter, Reengajamento, Case de Sucesso
  - **Live preview** of email with personalization
  - Real-time recipient count
  - Loading states and error feedback
  - Success/failure status reporting

#### Templates System
- **Location**: `/app/admin/marketing/bulk-email/templates.ts`
- Available templates:
  1. **Welcome** - Email de boas-vindas para novos leads
  2. **Promotion** - Oferta especial com desconto
  3. **Newsletter** - Newsletter mensal com tendências
  4. **Reengagement** - Email de reengajamento para leads inativos
  5. **Case Study** - Compartilhamento de cases de sucesso

### Project Structure
```
/app
  /api
    /marketing
      /bulk-email          # Bulk email API endpoint
  /admin
    /marketing
      /bulk-email          # Bulk email admin page
      /templates.ts        # Email templates library
/components
  PremiumIcons.tsx         # Icon system with dual usage
  PremiumUI.tsx           # UI component library
  SwipeQuiz.tsx           # Quiz component with fixed TypeScript errors
  PremiumHero.tsx         # Hero component with SSR protection
```

## Deployment Status
- **Build**: ✅ Passing
- **TypeScript**: ✅ Strict mode compliant
- **Static Pages**: 129 pages generated successfully

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
