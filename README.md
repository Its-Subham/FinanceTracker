# FinanceTracker

FinanceTracker is a personal finance tracking web application with a React frontend and an Express + MongoDB backend. Users can register/login, upload a profile photo (stored on Cloudinary), add incomes and expenses, and view dashboard insights.

**Tech stack:**
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose)
- File upload: Multer + Cloudinary
- Auth: JSON Web Tokens (JWT)

**Repository structure**
- `backend/` — Express API and database models
- `frontend/` — React/Vite app

**Prerequisites**
- Node.js (LTS)
- npm or yarn
- MongoDB URI (Atlas or self-hosted)
- Cloudinary account (cloud name, API key, API secret)

**Environment variables**
Create environment files for backend and frontend. Example keys (do NOT commit secrets):

- Backend — create `[backend/.env](backend/.env)` with:
  - `MONGODB_URL` — MongoDB connection string
  - `JWT_SECRET` — secret for signing JWTs
  - `PORT` — backend port (e.g., 5000)
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- Frontend — create `[frontend/.env](frontend/.env)` with:
  - `VITE_API_URL` — base URL of backend API (e.g., `http://localhost:5000` or your deployed backend URL)

**Install dependencies**
Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

**Run locally (development)**
1. Start backend (dev):
```bash
cd backend
npm run dev
```
2. Start frontend (dev):
```bash
cd frontend
npm run dev
```

Open the frontend URL printed by Vite (usually `http://localhost:5173`) and the backend at `http://localhost:5000` (or the `PORT` you set).

**Profile image uploads (Cloudinary)**
- The backend uses `multer` to accept multipart `image` uploads and then uploads files to Cloudinary using the credentials in the backend `.env` file.
- Public endpoint: `POST /api/auth/upload-image` — accepts `image` form field and returns `{ imageUrl, public_id }`.
- Protected endpoint: `POST /api/auth/upload-profile` — requires `Authorization: Bearer <token>`; accepts `image`, uploads to Cloudinary, saves the `profileImageUrl` on the `User` document, and returns the updated user.

**API (main endpoints)**
- `POST /api/auth/register` — register a user. Request body: `fullName`, `email`, `password`, `profileImageUrl` (optional).
- `POST /api/auth/login` — login and receive JWT.
- `GET /api/auth/getUser` — protected; returns authenticated user info (`profileImageUrl` included).
- `POST /api/auth/upload-image` — public image upload to Cloudinary.
- `POST /api/auth/upload-profile` — protected profile image upload and save to user record.
- Income/Expense endpoints under `/api/income` and `/api/expense` for create/list/delete.

**Deployment notes**
- Do NOT commit `.env` files to the repository. Use your cloud host or GitHub secrets to store environment variables when deploying.
- Frontend: build with `npm run build` in `frontend` and host on GitHub Pages, Netlify, Vercel, or static hosting. Ensure `VITE_API_URL` points to the deployed backend.
- Backend: host on platforms like Render, Heroku, Railway, or Azure. Provide the MongoDB connection string and Cloudinary credentials through the host's secret manager.

**Security & maintenance**
- Rotate Cloudinary API keys if accidentally committed.
- Consider storing images with `public_id` in user model to support image replacement and deletion.
- Enable HTTPS in production and restrict CORS origins to your frontend domain(s).

**Troubleshooting**
- If `profileImageUrl` is empty after registration: the frontend uploads image first and includes `profileImageUrl` in the register payload; ensure the upload endpoint returns `imageUrl` and the frontend sends that value with the register request. The backend normalizes empty strings to `null`.
- Check backend logs for `Register payload:` (a debug log added to `backend/controllers/authController.js`) to see incoming values.

**Contribution & License**
- Open to improvements; create issues or pull requests against this repo.


