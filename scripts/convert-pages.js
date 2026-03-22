import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Mapping of HTML files to Vue component names
const pageMapping = {
  'dashboard.html': 'Dashboard.vue',
  'messages.html': 'Messages.vue',
  'projects.html': 'Projects.vue',
  'project-details.html': 'ProjectDetails.vue',
  'files.html': 'Files.vue',
  'billing.html': 'Billing.vue',
  'profile.html': 'Profile.vue',
  'notifications.html': 'Notifications.vue',
  'notification-details.html': 'NotificationDetails.vue',
  'notifications-settings.html': 'NotificationsSettings.vue',
  'settings-hub.html': 'Settings.vue',
  'account-security.html': 'AccountSecurity.vue',
  'privacy-data.html': 'PrivacyData.vue',
  'preferences-info.html': 'PreferencesInfo.vue',
  'services.html': 'Services.vue',
  'login.html': 'Login.vue',
  'signup.html': 'Signup.vue',
  'forgot-password.html': 'ForgotPassword.vue',
  'reset-password.html': 'ResetPassword.vue'
}

// Icons mapping for lucide-vue-next
const iconImports = new Set()

function extractIcons(html) {
  const iconMatches = html.match(/data-lucide="([^"]+)"/g) || []
  const icons = iconMatches.map(match => {
    const icon = match.replace('data-lucide="', '').replace('"', '')
    // Convert kebab-case to PascalCase for component names
    return icon.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')
  })
  icons.forEach(icon => iconImports.add(icon))
  return icons
}

function convertHtmlToVue(html, fileName) {
  // Extract icons
  extractIcons(html)
  
  // Remove DOCTYPE, html, head, body tags
  let content = html
    .replace(/<!DOCTYPE html>/i, '')
    .replace(/<html[^>]*>/i, '')
    .replace(/<\/html>/i, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
    .replace(/<body[^>]*>/i, '')
    .replace(/<\/body>/i, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim()

  // Convert router links
  content = content.replace(
    /<a\s+href="([^"]+\.html)"([^>]*)>/g,
    (match, href, attrs) => {
      const route = href.replace('.html', '')
      return `<RouterLink to="/${route}"${attrs}>`
    }
  )
  content = content.replace(/<\/a>/g, '</RouterLink>')
  
  // Convert onclick handlers for navigation
  content = content.replace(
    /onclick="window\.location\.href='([^']+)'/g,
    (match, href) => {
      const route = href.replace('.html', '')
      return `@click="router.push('/${route}')"`
    }
  )
  
  // Convert other onclick handlers
  content = content.replace(/onclick="toggleMobileMenu\(\)"/g, '@click="toggleMobileMenu"')
  content = content.replace(/onclick="handleDemoLogout\(\)"/g, '@click="handleLogout"')
  content = content.replace(/onclick="supportAction\(\)"/g, '@click="supportAction"')
  content = content.replace(/onclick="createNewProject\(\)"/g, '@click="createNewProject"')
  
  // Convert onsubmit handlers
  content = content.replace(/onsubmit="event\.preventDefault\(\);[^"]*"/g, '@submit.prevent')
  
  // Remove lucide data attributes (icons will be components)
  content = content.replace(/data-lucide="[^"]+"/g, '')
  
  // Convert lucide icons to Vue components
  content = content.replace(
    /<i\s+class="[^"]*w-([^"]+)[^"]*h-([^"]+)[^"]*"[^>]*><\/i>/g,
    (match, w, h) => {
      // Extract icon name from context - this is a simplification
      return `<IconComponent class="w-${w} h-${h}" />`
    }
  )

  return content
}

console.log('Converting HTML pages to Vue components...')
console.log('This is a helper script. Manual conversion recommended for best results.')
