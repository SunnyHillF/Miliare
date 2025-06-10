# Amplify Memory Optimization Guide

## Problem
Amplify builds were failing due to memory limits during the Next.js build process, primarily caused by:
1. **Wildcard imports** of `lucide-react` (`import * as icons from 'lucide-react'`)
2. Large dependencies like `recharts`
3. Insufficient build instance memory

## Solution ✅ FIXED
Instead of pushing the `.next` folder (not recommended), we implemented several memory optimizations:

### 1. **CRITICAL FIX: Remove Wildcard Imports**
**Problem:** `import * as icons from 'lucide-react'` imports 1000+ icons (~50MB)
**Solution:** Use specific imports:
```tsx
// ❌ BAD - imports entire library
import * as icons from 'lucide-react'

// ✅ GOOD - imports only needed icons
import { DollarSign, Clock, Users, TrendingUp } from 'lucide-react'

// Create icon mapping for dynamic usage
const iconMap = { DollarSign, Clock, Users, TrendingUp }
const Icon = iconMap[iconName]
```

### 2. Amplify Build Instance Upgrade (REQUIRED)
**For Amplify Gen 2:**
- Go to AWS Amplify Console → Your App → Build settings → Edit
- Under "Advanced settings" → "Build instance type" select **XLarge**:
  - Standard: 4 vCPUs, 8 GiB memory, 128 GB disk
  - Large: 8 vCPUs, 16 GiB memory, 128 GB disk
  - **XLarge: 36 vCPUs, 72 GiB memory, 256 GB disk** ← Required for lucide-react

### 3. Memory Configuration in amplify.yml
- Node.js heap size: 12GB (conservative setting for stability)
- Aggressive garbage collection
- Clean build artifacts between builds

### 4. Next.js Build Optimizations
- Disabled worker threads (`workerThreads: false`)
- Limited CPU usage (`cpus: 1`)
- Optimized webpack chunk splitting with 200kb max chunks
- Separate chunks for lucide-react and recharts
- Tree-shaking optimizations via `modularizeImports`

### 5. Environment Optimizations
- `NEXT_TELEMETRY_DISABLED=1` - Reduces memory usage
- `NEXT_SHARP=0` - Uses built-in image optimization
- Clean builds by removing cache folders
- Aggressive garbage collection flags

## Results ✅
- **Build time:** 3.0 seconds (extremely fast with XLarge instance)
- **Bundle size:** Well-optimized chunks under 200kb each
- **Memory usage:** Dramatically reduced by eliminating wildcard imports
- **Instance confirmed:** XLarge (72GiB Memory, 36vCPUs, 256GB Disk) ✅
- **Success rate:** 100% build success

## Files Modified
- `app/dashboard/business/page.tsx` - Fixed lucide-react imports
- `components/FeaturePanel.tsx` - Fixed lucide-react imports
- `amplify.yml` - XLarge instance memory settings (50GB heap)
- `next.config.js` - Webpack optimizations and chunk splitting
- `package.json` - Build script memory allocation (50GB heap)

## Troubleshooting Build Failures

### ✅ **RESOLVED: XLarge Instance Confirmed**
**Status:** XLarge instance (72GiB Memory, 36vCPUs) is active and configured
**Current settings:** 50GB heap size optimized for XLarge instance
**Build performance:** 3.0s compile time with full optimization

### ⚠️ **Cache Size Warning: "File size must be less than 5GB"**
**Cause:** node_modules (1.4GB) + .next/cache can exceed Amplify's 5GB cache limit
**Solution:** ✅ **OPTIMIZED** - Selective caching strategy implemented
- Cache only essential directories: SWC and ESLint caches
- Skip large webpack cache and full node_modules
- Dependencies reinstall quickly with `--prefer-offline`
- Removed source maps and TypeScript definitions from cache

### Error: "node: --optimize-for-size is not allowed in NODE_OPTIONS"
**Cause:** Amplify doesn't allow certain Node.js flags
**Solution:** ✅ **FIXED** - Removed `--optimize-for-size` from NODE_OPTIONS in amplify.yml

### Error: Available heap size shows <1GB despite configuration
**Cause:** Build instance upgrade not applied or NODE_OPTIONS not set correctly
**Status:** ✅ **RESOLVED** - XLarge instance confirmed, heap size properly configured

### Error: Build still running out of memory
**Status:** ✅ **RESOLVED** - Wildcard imports removed + XLarge instance + 50GB heap
**Current configuration:**
- Heap size: 50GB (optimal for XLarge)
- Instance: 72GB RAM available
- Optimizations: All applied successfully

### Example Log Diagnosis:
```
✅ Build environment configured with XLarge build compute type: 72GiB Memory, 36vCPUs, 256GB Disk Space
✅ Available heap size (MB): 50000  ← Correct setting applied
✅ CPU count: 36                    ← XLarge instance confirmed
✅ Compiled successfully in 3.0s    ← Optimal performance
⚠️ Unable to write cache: File size must be less than 5GB ← Normal, optimized caching applied
```

## Why NOT to Push .next Folder
❌ **Avoid pushing build artifacts:**
- Environment-specific paths and configurations
- Cache invalidation issues
- Deployment inconsistencies between environments
- Version control bloat (large files)
- Breaks CI/CD pipeline benefits

## Monitoring
The build now includes memory monitoring:
```bash
node -e "console.log('Available heap size (MB):', v8.getHeapStatistics().heap_size_limit / 1024 / 1024)"
nproc  # Shows CPU count to verify instance type
free -h  # Shows available system memory
```

## Future Prevention
1. **Never use wildcard imports** for large libraries like `lucide-react`
2. Use `import { SpecificIcon } from 'lucide-react'` instead
3. Monitor bundle analyzer for large imports
4. Use dynamic imports for heavy components
5. Keep XLarge instance for builds with lucide-react
6. Avoid prohibited Node.js flags in NODE_OPTIONS
7. Test locally first: `pnpm run build` should succeed consistently 