Hydroponic System Backend - Setup Guide
Overview
This guide will walk you through setting up the Omicron Hydroponic Project backend on your local machine. The backend is built with FastAPI and provides APIs for managing hydroponic system operations.
Prerequisites
Before you begin, ensure you have the following installed:

Python 3.8+ - Download Python
Git - Download Git
pip - Python package installer (comes with Python)

Step-by-Step Installation
1. Clone the Repository
First, download the project code from GitHub to your local machine:
bashgit clone github link
cd OMNICRON_hydroponic_PROJECT/BackEnd

2. Create a Virtual Environment
A virtual environment keeps your project dependencies isolated from other Python projects on your system.
On macOS/Linux:
 ~python -m venv venv
source venv/bin/activate
On Windows:
~python -m venv venv
venv\Scripts\activate
You'll know the virtual environment is activated when you see (venv) at the beginning of your command prompt.

3. Install Project Dependencies
Install all required Python packages listed in the requirements.txt file:
bashpip install -r requirements.txt
IF YOU ARE ON MAC OR LINUX
bash pip install -r requirements-mac.txt
This will install FastAPI, Uvicorn, database drivers, and other necessary libraries.
Tip: If you encounter permission errors, try using pip install --user -r requirements.txt

4. Configure Environment Variables
The application uses environment variables for sensitive configuration like database connections and secret keys.
Copy the example environment file:
bashcp .env.example .env
On Windows, use:
bashcopy .env.example .env
On MAC or LINUX
cp .env.example .env
Edit the .env file:
bashnano .env  # or use your preferred text editor (vim, code, notepad, etc.)
Required Configuration:

SECRET_KEY - Generate a secure random string for JWT token encryption

You can generate one using: openssl rand -hex 32


DATABASE_URL - Your database connection string (if not already configured)

Example: postgresql://user:password@localhost:5432/hydroponics_db



Example .env file:
envSECRET_KEY=your-super-secret-key-here-change-this
DATABASE_URL=postgresql://user:password@localhost:5432/hydroponics_db
DEBUG=True

5. Run the Development Server
Start the FastAPI application with auto-reload enabled (automatically restarts when you make code changes):
bashuvicorn app.main:app --reload
The server will start on: http://127.0.0.1:8000
Access the interactive API documentation:

Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc


Troubleshooting
Virtual Environment Issues

Can't activate venv: Ensure you're in the correct directory and the venv folder was created successfully
Permission denied: On Linux/Mac, you may need to make the activate script executable: chmod +x venv/bin/activate

Dependency Installation Issues

pip not found: Make sure Python is properly installed and added to your PATH
Package conflicts: Try upgrading pip first: pip install --upgrade pip

Database Connection Issues

Verify your DATABASE_URL is correctly formatted in the .env file
Ensure your database server is running
Check that the database user has proper permissions

Port Already in Use
If port 8000 is already taken, specify a different port:
bashuvicorn app.main:app --reload --port 8001

Additional Commands
Deactivate virtual environment:
bashdeactivate
Update dependencies:
bashpip install --upgrade -r requirements.txt
Run with custom host/port:
bashuvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Next Steps
Once the server is running successfully:

Visit the API documentation at http://127.0.0.1:8000/docs
Test the API endpoints using the interactive interface
Begin integrating with the frontend application