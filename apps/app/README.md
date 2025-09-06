# Swooche App

A React + Vite application with tRPC integration for the Swooche platform.

## Environment Variables

Create a `.env` file in the app directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

For local development, the default API URL is `http://localhost:3001`. You can override this by setting `VITE_API_URL` in your `.env` file.

### Production

In production, set `VITE_API_URL` to your deployed API server URL.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
