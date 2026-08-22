import sys
import os

# Add the backend folder to the system path so Python can find sentiment.py and app.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app import app

# Vercel needs the application instance exposed for WSGI
if __name__ == '__main__':
    app.run(debug=True)
