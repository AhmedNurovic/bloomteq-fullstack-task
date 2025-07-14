# Frontend Deployment Guide

## Prerequisites
1. Complete backend deployment first
2. Get your backend URL (e.g., https://your-project-name.vercel.app)

## Steps

1. **Update API URL**:
   - Open `src/config/viteEnv.ts`
   - Replace `https://your-backend-project-name.vercel.app` with your actual backend URL

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Choose to deploy to a new project
   - Set project name (e.g., "work-tracker-frontend")
   - Deploy

## Environment Variables
The frontend will automatically use the production API URL when deployed to Vercel. 