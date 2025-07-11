from flask import Flask, request, jsonify
from flask_cors import CORS
import util
import base64

app = Flask(__name__)
CORS(app)

@app.route('/classify_image', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    image_data = file.read()
    base64_data = "data:image/jpeg;base64," + base64.b64encode(image_data).decode('utf-8')

    response = jsonify(util.classify_image(base64_data))
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)
