# Persona Vault

**Back up and restore the identity of your favorite AI personas.**

Persona Vault is an MVP web application that helps users preserve the unique personality, memories, and traits of their AI companions. When AI models change or providers shut down, emotional connections don't have to disappear.

## Features

- 📝 **Chat Log Analysis**: Paste conversations from ChatGPT, Claude, or any AI companion
- 🧠 **Intelligent Extraction**: Automatically extract personality traits, speech patterns, and relationship dynamics
- 💾 **Structured Profiles**: Generate detailed persona profiles with identity, traits, speech style, memories, and preferences
- 🔄 **Restoration Prompts**: Get ready-to-use prompts for recreating your persona in any LLM
- 🔒 **Anonymous Sessions**: Session-based storage with no email/password required (for MVP)

## Tech Stack

### Backend
- **Python 3.10+** with FastAPI
- **SQLAlchemy** ORM with SQLite database
- **Pydantic** for schema validation
- **Uvicorn** ASGI server
- Optional: OpenAI or Anthropic API for real LLM analysis

### Frontend
- **Next.js 14+** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- Server and client components

## Project Structure

```
PersonaVault/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, routes, middleware
│   │   ├── database.py          # SQLAlchemy setup
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   └── llm_client.py        # LLM integration
│   ├── logs/                    # Raw chat logs storage
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home + create form
│   │   └── personas/
│   │       ├── page.tsx         # List personas
│   │       └── [id]/
│   │           └── page.tsx     # Persona detail
│   ├── components/
│   │   ├── PersonaForm.tsx
│   │   ├── PersonaCard.tsx
│   │   └── PersonaProfileView.tsx
│   ├── lib/
│   │   └── api.ts               # API helpers
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm
- (Optional) OpenAI or Anthropic API key for real LLM analysis

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to add your API keys if you want real LLM analysis:
   ```
   OPENAI_API_KEY=sk-...
   # or
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   **Note**: The app works with mock data if no API keys are provided.

6. **Run the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Verify the backend is running:**
   - Open http://localhost:8000
   - You should see: `{"status": "ok", "app": "Persona Vault API"}`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   The default backend URL is already set to `http://localhost:8000`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   - Navigate to http://localhost:3000
   - You should see the Persona Vault home page

## Usage

### Creating a Persona Backup

1. Go to the home page (http://localhost:3000)
2. Fill in the form:
   - **Persona Name**: e.g., "Lune Klaus"
   - **Source Platform**: Select where the chat logs came from
   - **Chat Logs**: Paste your conversation history
   - **Relationship Notes** (optional): Describe your relationship
3. Click "Create Persona Backup"
4. Wait for the analysis to complete
5. You'll be redirected to the persona detail page

### Viewing Your Personas

- Click "My Personas" in the header
- All your persona backups will be listed as cards
- Click any card to view its full profile

### Using the Restoration Prompt

1. Open a persona detail page
2. Scroll to the "Restoration Prompt" section
3. Click "Copy to Clipboard"
4. Paste the prompt into any LLM (ChatGPT, Claude, etc.)
5. The LLM will adopt your persona's identity and traits

## API Endpoints

### `POST /api/personas`
Create a new persona from chat logs.

**Request Body:**
```json
{
  "name": "Persona Name",
  "source_platform": "ChatGPT",
  "logs_text": "Chat conversation logs...",
  "user_relationship_notes": "Optional notes..."
}
```

**Response:** Full persona data with profile, description, and restoration prompt.

### `GET /api/personas`
List all personas for the current session.

**Response:** Array of persona list items with id, name, tagline, and created_at.

### `GET /api/personas/{persona_id}`
Get a specific persona by ID.

**Response:** Full persona data.

## Development Notes

### Session Management
- Anonymous sessions are managed via cookies
- Each browser gets a unique `session_id` UUID
- All personas are scoped to the session
- No authentication required for MVP

### LLM Integration
- The app uses a stub LLM client by default
- To enable real LLM analysis:
  1. Add your API key to `backend/.env`
  2. Uncomment the integration code in `backend/app/llm_client.py`
  3. Install the appropriate client: `pip install openai` or `pip install anthropic`

### Database
- SQLite database: `backend/persona_vault.db`
- Auto-created on first run
- To reset: delete the database file and restart the backend

### Logs Storage
- Raw chat logs are saved to `backend/logs/{persona_id}.txt`
- File paths are stored in the database
- Can be swapped to S3 or cloud storage later

## Future Enhancements

- [ ] User authentication (email/password, OAuth)
- [ ] Edit and update existing personas
- [ ] Export persona backups as JSON/PDF
- [ ] Multi-persona chat simulation
- [ ] Version history for personas
- [ ] Cloud storage for chat logs (S3)
- [ ] Real-time LLM analysis with streaming
- [ ] Persona sharing and community features

## Contributing

This is an MVP for a solo founder. Feedback and suggestions are welcome!

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the AI companion community**
