# EduMind AI

EduMind AI is a local-first learning assistant maintained by [Iqra403](https://github.com/Iqra403). It combines a React/Vite web interface with a Node.js/Express API and MongoDB persistence so students can manage learning material, track progress, and optionally use Gemini-powered study tools.

## Features

- Account registration and JWT-based authentication
- Student profiles, progress tracking, and dashboard views
- PDF upload and document management
- Course content and learning workflows
- Optional AI chat, summaries, flashcards, and quizzes
- Local development without a production API URL

## Technology

- **Frontend:** React 19, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB 6 or newer
- **AI:** Google Gemini API (optional)

## Requirements

- Node.js 20 or newer
- npm
- MongoDB 6 or newer, local or remotely reachable
- Gemini API key only for AI-generation features

## Quick start

Clone the project and install each application separately:

```bash
git clone https://github.com/Iqra403/Edumind-AI.git
cd Edumind-AI
```

### 1. Configure the backend

```bash
cd Backend
npm install
```

Copy `Backend/.env.example` to `Backend/.env` and set the values for your environment:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/edumind_ai
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=
GROQ_API_KEY=
```

Start the API:

```bash
npm run dev
```

The health endpoint is available at <http://localhost:8000/> and should return `Backend is running`.

### 2. Configure the frontend

Open a second terminal from the repository root:

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the web app:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally <http://localhost:5173>.

### Windows PowerShell

Use these commands instead of `cp` and shell redirection:

```powershell
Copy-Item Backend/.env.example Backend/.env
Set-Content Frontend/.env "VITE_API_URL=http://localhost:8000"
```

## Verify a local run

1. Start MongoDB.
2. Confirm <http://localhost:8000/> returns `Backend is running`.
3. Open the frontend and register a test account.
4. Sign in and confirm the dashboard loads.
5. Configure `GROQ_API_KEY` only when testing AI-generation features. You can also enter a GroqCloud key in **Profile Settings → Groq AI** after signing in. That browser-only setting is kept in the current session and sent only with AI requests; the server environment variable remains the fallback for all users.

## Development checks

Run frontend checks from `Frontend`:

```bash
npm run build
npm run lint
npm audit
```

The backend currently provides start and development scripts but does not yet include a separate automated test or lint script.

## Troubleshooting

- **MongoDB connection error:** verify that MongoDB is running and that `MONGODB_URI` is reachable.
- **Port already in use:** change `PORT` and update `VITE_API_URL` to match.
- **CORS error:** make sure `FRONTEND_URL` exactly matches the frontend origin.
- **AI returns `503`:** add a key in Profile Settings → Gemini AI, or configure `GEMINI_API_KEY` in the backend environment and restart the server.
- **Frontend uses an old API URL:** update `Frontend/.env` and restart Vite.

## Security

Never commit `Backend/.env`, API keys, JWT secrets, uploaded documents, or other credentials. The Profile Settings key is stored in browser session storage, not in the database; use HTTPS and clear the session when finished. Please report reproducible security issues privately to the repository maintainer rather than opening a public issue with sensitive details.

## Contributing

Bug reports and focused pull requests are welcome. Include reproducible steps, explain the expected and actual behavior, and run the relevant checks before submitting a change.

## License

No license is currently declared for this repository. Please contact the maintainer before redistributing the code or incorporating it into another project.
