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
