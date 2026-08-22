import sys
import os

# Ensure the root directory is in sys.path
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

from backend.app import app

# Vercel needs the application instance exposed for WSGI
if __name__ == '__main__':
    app.run(debug=True)
