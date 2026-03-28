# ApplySmart

An AI-powered resume analyzer and optimizer built with Next.js. Paste your resume and a job description to get an ATS match score, identify skill gaps, and generate a tailored improved resume — all powered by Google Gemini.

## Features

- **Resume Analysis** — compare your resume against a job description and get a match score (0–100), strengths, missing skills, and actionable suggestions
- **AI Resume Improvement** — rewrite your resume to be ATS-optimized and keyword-rich for the target role
- **PDF Export** — download the improved resume as a PDF
- **Save & Dashboard** — save analyses to your account and revisit them anytime from the dashboard
- **File Upload** — upload PDF, DOCX, or TXT resume files (parsed client-side)
- **Auth** — JWT-based register/login with bcrypt password hashing
- **Dark / Light mode** — persisted per user

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Google Gemini API](https://aistudio.google.com) (`gemini-2.5-flash`)
- [MongoDB](https://mongodb.com) + [Mongoose](https://mongoosejs.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) — client state
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [pdfjs-dist](https://mozilla.github.io/pdf.js) + [mammoth](https://github.com/mwilliamson/mammoth.js) — file parsing
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF export
- [lucide-react](https://lucide.dev) — icons
- [react-hot-toast](https://react-hot-toast.com) — notifications

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd applysmart
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Google Gemini API key — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT secret — generate with: openssl rand -hex 32
JWT_SECRET=your-jwt-secret-min-32-chars-here
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.js                  # Landing page
  layout.js                # Root layout with AuthProvider + Toaster
  analyze/
    page.js                # Resume + JD input
    results/page.js        # Match score + analysis results
    improve/page.js        # AI-improved resume
  analysis/[id]/page.js    # Saved analysis detail
  dashboard/page.js        # User's saved analyses
  login/page.js
  register/page.js
  api/
    analyze/route.js       # POST — run Gemini analysis
    improve/route.js       # POST — generate improved resume
    analysis/route.js      # GET (list) / POST (save) analyses
    analysis/[id]/route.js # GET / DELETE a single analysis
    auth/login/route.js
    auth/register/route.js
    auth/me/route.js

components/                # Shared UI components
lib/                       # Server utilities (gemini, auth, db) + client hooks
models/                    # Mongoose schemas (User, Analysis)
store/                     # Zustand store
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/analyze` | No | Analyze resume vs job description |
| POST | `/api/improve` | No | Generate ATS-optimized resume |
| POST | `/api/analysis` | Yes | Save an analysis |
| GET | `/api/analysis` | Yes | List user's analyses |
| GET | `/api/analysis/[id]` | Yes | Get a single analysis |
| DELETE | `/api/analysis/[id]` | Yes | Delete an analysis |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com). Add the three environment variables (`GEMINI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`) in your project settings and deploy.

```bash
npm run build
npm run start
```
