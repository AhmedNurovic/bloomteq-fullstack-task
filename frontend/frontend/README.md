# React + TypeScript + Vite

This project is a modern React + TypeScript frontend built with Vite, using MUI, TailwindCSS, and best practices for scalable development.

## Features
- Modern React (v19) with TypeScript
- MUI and TailwindCSS for UI
- API integration via Axios
- Jest and Testing Library for unit tests
- ESLint and Prettier for code quality

## Project Structure
```
src/
  assets/         # SVGs and images
  components/     # React components
  config/         # API and environment config
  contexts/       # React context providers
  hooks/          # Custom React hooks
  App.tsx         # Main app component
  main.tsx        # Entry point
  theme.ts        # MUI theme
  index.css       # Tailwind base styles
  vite-env.d.ts   # Vite type definitions
```

## Deployment (Vercel)

### Prerequisites
1. Complete backend deployment first
2. Get your backend URL (e.g., https://your-project-name.vercel.app)

### Steps
1. **Update API URL**:
   - Open `src/config/viteEnv.ts`
   - Replace the placeholder backend URL with your actual backend URL

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```
   - Choose to deploy to a new project if prompted
   - Set project name (e.g., "work-tracker-frontend")
   - Deploy

### Environment Variables
The frontend will automatically use the production API URL when deployed to Vercel. No additional environment variables are required for the frontend.

## Development
- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm run test` — Run unit tests
- `npm run lint` — Lint code

## Testing
- Jest and Testing Library are set up for unit testing React components.
- Mocks for SVGs and environment config are provided in `__mocks__/` for Jest.

## Linting & Formatting
- ESLint and Prettier are configured for code quality and consistency.

---

For backend setup and API documentation, see the root README.
