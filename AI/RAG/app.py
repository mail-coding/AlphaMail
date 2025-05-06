from flask import Flask
from routes.email_routes import email_bp
import os

app = Flask(__name__)
app.register_blueprint(email_bp)

if __name__ == '__main__':
    os.makedirs("./db", exist_ok=True)
    app.run(host='127.0.0.1', port=5000, debug=True)
