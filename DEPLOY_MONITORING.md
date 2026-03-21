# Server Monitoring System Deployment Guide

This guide explains how to deploy your new standalone Worker and API to Render or Railway, and how it integrates with your existing Next.js frontend on Vercel.

## 1. What was built

1. **`worker.js`**: A standalone Node.js script that connects to your MongoDB database, fetches all approved servers, and pings them every 30 seconds using `minecraft-server-util`. It handles updating the database with `players`, `status` (`online`/`offline`), and `checkFailures`. It also dispatches Discord webhooks and Emails (using `nodemailer`) when a server goes offline or recovers.
2. **`api.js`**: A simple Express.js application exposing the endpoints you requested (`/api/servers`, `/api/owner/:ownerId`, `/api/servers/add`, `/api/servers/recheck`).

*Note: Since your Next.js frontend (`src/app/api/servers/route.ts` etc.) already connects to the **same MongoDB database**, the frontend will automatically reflect the REAL-TIME status updates made by the `worker.js`. Therefore, you do NOT have to modify all your UI components to fetch from the new Express API; they already work perfectly together!*

---

## 2. Deploying to Render (Recommended)

Render allows you to host "Background Workers" (for `worker.js`) and "Web Services" (for `api.js`) very easily.

### A. Deploying the API (api.js)
1. Go to [Render Dashboard](https://dashboard.render.com/) and create a new **Web Service**.
2. Connect your GitHub repository (the one containing SvrForgeV3).
3. Set the **Start Command** to: `node api.js`
4. Expand **Advanced** and add these Environment Variables:
   - `MONGODB_URI` = your production MongoDB connection string
5. Click **Create Web Service**. 

### B. Deploying the Worker (worker.js)
1. In the Render Dashboard, create a new **Background Worker**.
2. Connect the same repository.
3. Set the **Start Command** to: `node worker.js`
4. Add these Environment Variables:
   - `MONGODB_URI` = your production MongoDB connection string
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` = Mail settings (optional)
   - `DISCORD_WEBHOOK_URL` = Discord webhook (optional)
5. Click **Create Background Worker**.

---

## 3. Deploying to Railway

1. Go to [Railway Dashboard](https://railway.app/) and create a new project.
2. Deploy from your GitHub Repo.
3. By default, Railway uses `npm start` (which runs your Next.js app). To run the worker and API specifically on Railway:
   - You can create two separate Railway "Services" from the same Git repo.
   - For Service 1 (API): Go to Settings -> Deploy -> Custom Start Command: `node api.js`
   - For Service 2 (Worker): Go to Settings -> Deploy -> Custom Start Command: `node worker.js`
4. Add all your Environment Variables (`MONGODB_URI`, etc.) in the **Variables** tab for both services.

---

## 4. Frontend Integration (Vercel)

Because your existing Next.js application already reads `status`, `players`, and `checkFailures` from MongoDB, no additional configuration is strictly necessary on Vercel. 

Once your remote worker starts pinging servers, the MongoDB documents will update automatically, and the Next.js `fetch('/api/servers')` calls will instantly show real-time player counts and hide `offline` servers, matching your request perfectly.
