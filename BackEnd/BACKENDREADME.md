# Hydroponic System - Backend

## Setup Instructions

### First Time Setup
1. **Clone the repository**
```bash
   git clone https://github.com/
   cd hydroponic-system/backend
```

2. **Create virtual environment**
```bash
   python -m venv venv
```

3. **Activate virtual environment**
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`

4. **Install dependencies**
```bash
   pip install -r requirements.txt
```

5. **Setup database**
   - Install PostgreSQL locally
   - Create database: `createdb hydroponic_db`
   - Copy `.env.example` to `.env` and update credentials

6. **Run the server**
```bash
   uvicorn app.main:app --reload
```

7. **Visit API docs**
   - http://localhost:8000/docs

### Daily Development
```bash
# Activate environment
source venv/bin/activate  # or venv\Scripts\activate

# Pull latest changes
git pull

# Install any new dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

### Adding New Dependencies
If you install a new package:
```bash
pip install package-name
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add package-name dependency"
```

## Project Structure
```
backend/
├── venv/              # (local only - not in git)
├── app/
│   ├── main.py       # FastAPI app
│   ├── database.py   # DB connection
│   ├── models.py     # Database tables
│   ├── routes/       # API endpoints
│   └── utils/        # Helper functions
├── requirements.txt  # Dependencies
└── .env              # (local only - not in git)
```