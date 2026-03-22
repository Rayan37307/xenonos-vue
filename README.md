# Xenon OS - Vue 3

Premium Client Dashboard built with Vue 3, Vite, Tailwind CSS 4, and Pinia.

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vue Router** - Official router for Vue
- **Pinia** - Vue store with intuitive API
- **Lucide Vue** - Beautiful icons

## 📦 Setup

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.vue        # Main layout wrapper
│   ├── AppSidebar.vue       # Navigation sidebar
│   └── AppTopNav.vue        # Top navigation bar
├── router/
│   └── index.js             # Vue Router configuration
├── stores/
│   └── auth.js              # Pinia auth store
├── views/                   # Page components
│   ├── Dashboard.vue
│   ├── Login.vue
│   ├── Projects.vue
│   └── ...
├── App.vue
├── main.js
└── style.css                # Tailwind + design tokens
```

## 🎨 Design Tokens

Custom theme colors and fonts are defined in `src/style.css`:

- `--color-surface` - Main background
- `--color-primary` - Primary accent (#6366f1)
- `--color-on-surface` - Text color
- Fonts: Outfit (body), Syne (headlines), Ubuntu (labels)

## 🔐 Authentication

Demo authentication uses localStorage. Any email/password combination will log you in.

## 📄 License

Proprietary - Xenon Studios © 2026
