# Vercel Deployment Guide for SpendSafe

Complete guide for deploying SpendSafe to Vercel with Supabase backend.

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [Supabase Project](https://app.supabase.com) with database configured
- Git repository connected to Vercel
- Node.js 18+ and npm 9+ installed locally

## Pre-Deployment Checklist

### 1. Database Setup

Ensure all migrations are applied to your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute all migration files from the `migrations/` directory in order:

   - `20260115_create_atomic_income_rpc.sql`
   - Any other migration files

4. Verify tables exist:

   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

5. Verify RLS (Row Level Security) policies are enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables
   WHERE schemaname = 'public';
   ```

### 2. Environment Variables

Prepare the following environment variables from your Supabase project:

1. Go to **Project Settings** → **API**
2. Copy:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Set your production domain:
   - `NEXT_PUBLIC_APP_URL` → Your Vercel domain (e.g., `https://spendsafe.vercel.app`)

### 3. Local Build Test

Before deploying, verify the production build works locally:

```powershell
# Install dependencies
npm install

# Run production build
npm run build

# Test production server
npm run start
```

Navigate to http://localhost:3000 and verify:

- ✅ Authentication works (login/signup)
- ✅ Dashboard loads without errors
- ✅ API routes respond correctly
- ✅ No console errors

## Vercel Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**

   - Go to https://vercel.com/new
   - Select your Git repository
   - Click **Import**

2. **Configure Project**

   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

3. **Add Environment Variables**

   Click **Environment Variables** and add:

   | Name                            | Value                  | Environment                      |
   | ------------------------------- | ---------------------- | -------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase URL      | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL`           | Your Vercel domain     | Production                       |

   **Important**: Set `NEXT_PUBLIC_APP_URL` to your actual Vercel domain after first deployment.

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete (~2-3 minutes)

### Option 2: Deploy via Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Configuration

### 1. Update Environment Variables

After your first deployment, update `NEXT_PUBLIC_APP_URL`:

1. Go to **Project Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Redeploy: **Deployments** → **...** → **Redeploy**

### 2. Configure Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### 3. Configure Supabase Redirect URLs

Add your Vercel domain to Supabase allowed redirect URLs:

1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-custom-domain.com/auth/callback` (if using custom domain)

### 4. Verify OAuth Providers (if enabled)

If using Google/GitHub OAuth:

1. Update OAuth redirect URIs in provider consoles:

   - Google: https://console.cloud.google.com
   - GitHub: https://github.com/settings/developers

2. Add Vercel domain to allowed redirects:
   - `https://your-domain.vercel.app/auth/callback`

## Monitoring & Debugging

### View Logs

1. Go to **Deployments** → Select deployment
2. Click **View Function Logs**
3. Monitor for errors or warnings

### Common Issues

#### Build Fails: "Missing environment variables"

**Solution**: Ensure all required environment variables are set in Vercel dashboard.

```powershell
# Verify locally
npm run build
```

#### Runtime Error: "Unauthorized" on API routes

**Solution**: Check Supabase connection and RLS policies.

1. Verify environment variables are correct
2. Test Supabase connection:
   ```typescript
   const { data, error } = await supabase.auth.getUser();
   console.log({ data, error });
   ```

#### OAuth Redirect Fails

**Solution**: Update redirect URLs in Supabase and OAuth provider settings.

### Performance Monitoring

Use Vercel Analytics:

1. Go to **Analytics** tab
2. Monitor:
   - **Core Web Vitals** (LCP, FID, CLS)
   - **Real Experience Score**
   - **Page Load Times**

Target metrics:

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## Rollback Procedure

If deployment has issues:

1. Go to **Deployments**
2. Find last working deployment
3. Click **...** → **Promote to Production**

## Continuous Deployment

Vercel automatically deploys on Git push:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches

### Disable Auto-Deploy (if needed)

1. Go to **Project Settings** → **Git**
2. Configure deployment branches

## Security Checklist

- ✅ Environment variables set correctly
- ✅ RLS policies enabled on all tables
- ✅ HTTPS enforced (automatic on Vercel)
- ✅ Security headers configured (via `next.config.mjs`)
- ✅ OAuth redirect URLs whitelisted
- ✅ No secrets in client-side code

## Performance Optimization

### Enable Edge Functions (Optional)

For faster global response times:

1. Update `next.config.mjs`:

   ```javascript
   export const runtime = "edge";
   ```

2. Note: Edge runtime has limitations (no Node.js APIs)

### Configure Caching

Vercel automatically caches static assets. For API routes, caching is disabled via `vercel.json`.

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Maintenance

### Regular Updates

1. Keep dependencies updated:

   ```powershell
   npm outdated
   npm update
   ```

2. Monitor Vercel dashboard for:
   - Build failures
   - Performance degradation
   - Error spikes

### Database Migrations

When adding new migrations:

1. Apply to Supabase via SQL Editor
2. Commit migration file to repository
3. Deploy to Vercel (automatic)

---

**Last Updated**: 2026-01-16
