/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Reduce build size and cache footprint
  productionBrowserSourceMaps: false,
  // Memory optimization
  experimental: {
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
    // Optimize bundle loading
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  // Tree shake unused code more aggressively
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
    "recharts": {
      transform: "recharts/lib/{{member}}",
    },
  },
  
  // Webpack optimizations for memory and cache size
  webpack: (config, { isServer, dev }) => {
    // Only apply these optimizations during production builds
    if (!dev) {
      // Exclude heavy client-side packages from server bundle
      if (isServer) {
        config.externals = [
          ...(config.externals || []),
          'recharts',
          'lucide-react'
        ]
      }

      // Reduce memory usage and cache size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          maxSize: 150000, // Smaller 150kb max chunk size to reduce cache
          cacheGroups: {
            // Remove default cache groups to reduce memory
            default: false,
            vendors: false,
            // Create smaller, more specific chunks
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'recharts',
              chunks: 'all',
              priority: 35,
              reuseExistingChunk: true,
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              chunks: 'all',
              priority: 35,
              reuseExistingChunk: true,
            },
            lib: {
              test(module) {
                return module.size() > 100000 && /node_modules[/\\]/.test(module.identifier())
              },
              name(module) {
                const hash = require('crypto').createHash('sha1')
                hash.update(module.identifier())
                return `lib-${hash.digest('hex').substring(0, 8)}`
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
              chunks: 'all',
            },
          },
        },
        // Reduce memory pressure during compilation
        minimize: true,
      }

      // Reduce memory usage in file system cache
      config.cache = {
        ...config.cache,
        maxMemoryGenerations: 1,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }
    }
    
    return config
  },
}

module.exports = nextConfig
