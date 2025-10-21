# 1. Clone repo
git clone https://github.com/
cd OMNICRON_hydroponic_PROJECT/BackEnd

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy .env
cp .env.example .env

# 5. Edit .env (just update SECRET_KEY if DATABASE_URL is already there)
nano .env

# 6. Run server
uvicorn app.main:app --reload

