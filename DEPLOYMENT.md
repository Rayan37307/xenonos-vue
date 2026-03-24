# Deployment Guide - XenonOS Vue

Complete guide for deploying XenonOS Vue to production using manual file upload.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Building for Production](#building-for-production)
4. [Manual Deployment Steps](#manual-deployment-steps)
5. [Server Configuration](#server-configuration)
6. [Post-Deployment Checklist](#post-deployment-checklist)
7. [Troubleshooting](#troubleshooting)
8. [Production Best Practices](#production-best-practices)

---

## Prerequisites

### Local Development Environment

Before deploying, ensure you have:

- **Node.js** 18+ installed locally
- **pnpm** 8+ or npm installed
- **Git** for version control
- **SSH access** to your deployment server
- **FTP/SFTP client** (optional, for file upload)

### Server Requirements

Your production server should have:

- **Web Server:** Nginx (recommended) or Apache
- **PHP:** 8.2+ (for Laravel backend)
- **Database:** MySQL 8.0+ or PostgreSQL 14+
- **Redis:** 6.0+ (for cache and queues)
- **Node.js:** 18+ (if building on server)
- **SSL Certificate:** Let's Encrypt or commercial

---

## Environment Configuration

### Environment Variables

Create or update the `.env` file in your project root:

```env
# API Configuration
VITE_API_URL=https://your-api-domain.com/api

# Optional: Feature flags
VITE_FEATURE_DARK_MODE=false
VITE_FEATURE_WEBSOCKET=true

# Optional: Analytics
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

### Environment-Specific Configs

**Development (.env.development):**
```env
VITE_API_URL=http://localhost:8000/api
```

**Staging (.env.staging):**
```env
VITE_API_URL=https://staging-api.yourdomain.com/api
```

**Production (.env.production):**
```env
VITE_API_URL=https://api.xenonos.com/api
```

### Using Environment Files

```bash
# Build for specific environment
pnpm build --mode production

# Build for staging
pnpm build --mode staging
```

---

## Building for Production

### Standard Build

```bash
# Install dependencies (clean install for production)
pnpm install --frozen-lockfile

# Run linting (if configured)
pnpm lint

# Run tests (if configured)
pnpm test

# Build for production
pnpm build
```

### Build Output

After building, you'll have a `dist/` folder with:

```
dist/
├── index.html              # Main HTML entry point
├── favicon.svg             # Favicon
├── assets/
│   ├── index-abc123.js     # Main JavaScript bundle (hashed)
│   ├── index-def456.css    # Main CSS bundle (hashed)
│   ├── vendor-ghi789.js    # Vendor dependencies (hashed)
│   └── images/             # Optimized images
└── _redirects              # Redirect rules (if configured)
```

### Build Analysis

```bash
# Install rollup visualizer (optional)
pnpm add -D rollup-plugin-visualizer

# Add to vite.config.js and rebuild
# View bundle size and optimize if needed
```

### Build Optimizations

**Enable Gzip/Brotli:**
```javascript
// vite.config.js
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    compression({ algorithm: 'brotliCompress' })
  ]
})
```

**Code Splitting:**
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['axios']
        }
      }
    }
  }
})
```

---

## Manual Deployment Steps

### Step 1: Prepare Build Locally

```bash
# Navigate to project
cd /path/to/xenonos-vue

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Build for production
pnpm build
```

### Step 2: Verify Build Locally

```bash
# Preview production build
pnpm preview

# Check that:
# - Application loads correctly
# - API calls work
# - No console errors
# - Assets load properly
```

### Step 3: Upload Files to Server

**Option A: Using rsync (Recommended)**

```bash
# Sync dist folder to server
rsync -avz --delete dist/ user@your-server:/var/www/xenonos-vue/

# Or with specific permissions
rsync -avz --delete --chmod=755 dist/ user@your-server:/var/www/xenonos-vue/
```

**Option B: Using SCP**

```bash
# Create tarball
tar -czf xenonos-vue-dist.tar.gz dist/

# Upload to server
scp xenonos-vue-dist.tar.gz user@your-server:/tmp/

# Extract on server
ssh user@your-server
cd /var/www/xenonos-vue
tar -xzf /tmp/xenonos-vue-dist.tar.gz --strip-components=1
```

**Option C: Using FTP/SFTP**

1. Connect to your server using FileZilla or similar
2. Navigate to `/var/www/xenonos-vue/`
3. Upload entire `dist/` folder contents
4. Ensure file permissions are set correctly

### Step 4: Set File Permissions

```bash
# SSH into server
ssh user@your-server

# Navigate to deployment directory
cd /var/www/xenonos-vue

# Set ownership (adjust www-data to your web server user)
sudo chown -R www-data:www-data /var/www/xenonos-vue

# Set permissions
sudo find /var/www/xenonos-vue -type f -exec chmod 644 {} \;
sudo find /var/www/xenonos-vue -type d -exec chmod 755 {} \;
```

---

## Server Configuration

### Nginx Configuration

Create or update your Nginx configuration:

```nginx
# /etc/nginx/sites-available/xenonos-vue
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/xenonos-vue;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA routing - all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable cache for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Block access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Enable Site and SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/xenonos-vue /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Apache Configuration (Alternative)

```apache
# /etc/apache2/sites-available/xenonos-vue.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/xenonos-vue

    <Directory /var/www/xenonos-vue>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Enable mod_rewrite for SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

---

## Post-Deployment Checklist

### Immediate Checks

- [ ] **Site loads:** Navigate to your domain
- [ ] **No 404 errors:** Check browser console
- [ ] **Assets load:** CSS, JS, images all load
- [ ] **API connection:** Verify API calls work
- [ ] **Login works:** Test authentication
- [ ] **Routing works:** Navigate to different pages
- [ ] **Forms submit:** Test a form submission
- [ ] **Mobile responsive:** Test on mobile device

### Performance Checks

- [ ] **Page load time:** Under 3 seconds
- [ ] **First Contentful Paint:** Under 1.5 seconds
- [ ] **Time to Interactive:** Under 3.5 seconds
- [ ] **Lighthouse score:** 90+ recommended

```bash
# Run Lighthouse audit
# Chrome DevTools > Lighthouse > Run audit
```

### Security Checks

- [ ] **HTTPS enabled:** All traffic over SSL
- [ ] **Security headers:** Verify in browser dev tools
- [ ] **No console errors:** Check for warnings
- [ ] **CORS configured:** API allows your domain
- [ ] **Environment variables:** No secrets in frontend

### Functional Tests

- [ ] **Login/Logout:** Authentication flow
- [ ] **Dashboard:** Loads with correct data
- [ ] **Projects:** CRUD operations work
- [ ] **Tasks:** Create, update, complete tasks
- [ ] **File upload:** Upload and download files
- [ ] **Notifications:** Receive and mark as read
- [ ] **Profile:** Update profile information

---

## Troubleshooting

### Common Issues

#### 1. Blank Page After Deployment

**Symptoms:** Page loads but shows nothing

**Solutions:**
```bash
# Check browser console for errors
# Common causes:
# - Wrong API URL in .env
# - CORS issues
# - JavaScript errors

# Verify build output
ls -la /var/www/xenonos-vue/dist/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

#### 2. 404 on Page Refresh

**Symptoms:** Direct URL access shows 404

**Solution:** Ensure SPA routing is configured in Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 3. API Calls Failing

**Symptoms:** Console shows CORS errors or 401/403

**Solutions:**
```bash
# Check .env has correct API URL
VITE_API_URL=https://your-api-domain.com/api

# Verify API backend is running
curl https://your-api-domain.com/api/auth/me

# Check CORS configuration on backend
# Laravel: config/cors.php
```

#### 4. Assets Not Loading

**Symptoms:** CSS/JS files return 404

**Solutions:**
```bash
# Check file permissions
sudo chown -R www-data:www-data /var/www/xenonos-vue
sudo chmod -R 755 /var/www/xenonos-vue

# Clear browser cache
# Or add cache-busting to build
```

#### 5. Build Fails

**Symptoms:** `pnpm build` shows errors

**Solutions:**
```bash
# Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite

# Check Node.js version
node --version  # Should be 18+

# Try building with verbose output
pnpm build --debug
```

### Debug Mode

**Enable Vue DevTools in Production:**
```javascript
// main.js (temporary for debugging)
const app = createApp(App)
app.config.devtools = true  // Remove after debugging
```

**Check Environment Variables:**
```javascript
// Add temporarily to any component
console.log('API URL:', import.meta.env.VITE_API_URL)
```

---

## Production Best Practices

### Performance

1. **Enable Compression:**
   - Gzip or Brotli for text assets
   - Already configured in Nginx example above

2. **Use CDN:**
   - Serve static assets from CDN
   - Configure in Vite:
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       assetsDir: 'cdn-assets'
     }
   })
   ```

3. **Lazy Load Routes:**
   - Already implemented in project
   - Consider lazy loading large components

4. **Image Optimization:**
   - Use WebP format where supported
   - Compress images before upload
   - Consider using image CDN

### Security

1. **Content Security Policy:**
   ```nginx
   add_header Content-Security-Policy 
     "default-src 'self'; 
      script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
      style-src 'self' 'unsafe-inline';" always;
   ```

2. **Rate Limiting:**
   ```nginx
   limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
   
   server {
       location / {
           limit_req zone=one burst=20 nodelay;
       }
   }
   ```

3. **Hide Server Version:**
   ```nginx
   server_tokens off;
   ```

### Monitoring

1. **Error Tracking:**
   - Sentry integration (recommended)
   - LogRocket for session replay
   - Custom error logging

2. **Analytics:**
   - Google Analytics
   - Plausible (privacy-focused)
   - Custom analytics

3. **Uptime Monitoring:**
   - UptimeRobot
   - Pingdom
   - StatusCake

### Backup Strategy

1. **Code Backups:**
   - Git repository (already versioned)
   - Tag releases: `git tag v1.0.0`

2. **Environment Backups:**
   - Backup .env files securely
   - Use secrets management (Vault, AWS Secrets Manager)

3. **Rollback Plan:**
   ```bash
   # Keep previous version
   /var/www/xenonos-vue/
   ├── current/      # Symlink to active version
   ├── releases/
   │   ├── 20260324-1/
   │   └── 20260324-2/
   └── previous -> releases/20260324-1/
   
   # Rollback command
   ln -sfn /var/www/xenonos-vue/releases/20260324-1 /var/www/xenonos-vue/current
   ```

---

## Deployment Script (Optional)

Create a deployment script for automation:

```bash
#!/bin/bash
# deploy.sh

set -e

# Configuration
SERVER_USER="your-user"
SERVER_HOST="your-server.com"
SERVER_PATH="/var/www/xenonos-vue"
LOCAL_PATH="$(pwd)"

echo "🚀 Starting deployment..."

# Build
echo "📦 Building for production..."
pnpm install --frozen-lockfile
pnpm build

# Test build
echo "🧪 Testing build..."
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

# Upload
echo "📤 Uploading to server..."
rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# Set permissions
echo "🔐 Setting permissions..."
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R www-data:www-data $SERVER_PATH"
ssh $SERVER_USER@$SERVER_HOST "sudo find $SERVER_PATH -type f -exec chmod 644 {} \;"
ssh $SERVER_USER@$SERVER_HOST "sudo find $SERVER_PATH -type d -exec chmod 755 {} \;"

# Clear cache (optional)
echo "🧹 Clearing cache..."
ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "✅ Deployment complete!"
echo "🌐 Visit: https://your-domain.com"
```

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Continuous Deployment (Future Enhancement)

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v3
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          SOURCE: "dist/"
          TARGET: ${{ secrets.SERVER_PATH }}
```

---

## Support

For deployment issues or questions, contact the Xenon Studios team.

**Contributors:**
- Tasin - Xenon Studios
- Munthasir - Xenon Studios

---

**Last Updated:** March 24, 2026  
**Version:** 1.0.0
