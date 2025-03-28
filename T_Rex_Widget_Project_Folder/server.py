import os  # Import os to access environment variables
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Fetch the secret key from the environment variable
app.secret_key = os.getenv('Flask_Secret_Key')  # Securely fetch Flask_Secret_Key
CORS(app)  # Allow frontend-backend communication

# Initial T. rex data
trex_data = {
    "life_stage": 1,
    "points": 0,
    "alive": True
}

# Endpoint to get T. rex data
@app.route('/get_trex_data', methods=['GET'])
def get_trex_data():
    return jsonify(trex_data)

# Endpoint to update points
@app.route('/update_points', methods=['POST'])
def update_points():
    data = request.get_json()
    action = data.get("action", "")

    # Update points based on action
    if action == "like":
        trex_data["points"] += 5
    elif action == "follow":
        trex_data["points"] += 10
    elif action == "tiktok_universe":
        trex_data["points"] += 100

    # Handle life stage progression
    if trex_data["points"] >= 100:
        trex_data["life_stage"] += 1
        trex_data["points"] = 0  # Reset points for the new stage

    # Check if T. rex dies at stage 7
    if trex_data["life_stage"] > 7:
        trex_data["life_stage"] = 1  # Reset to stage 1
        trex_data["points"] = 0
        trex_data["alive"] = True  # Revive T. rex

    return jsonify({"success": True, "trex_data": trex_data})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
@app.route('/')
def home():
    return "Welcome to the T. rex Widget!"
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)

