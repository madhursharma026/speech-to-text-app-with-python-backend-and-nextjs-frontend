from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os

app = Flask(__name__)
CORS(app)

model = whisper.load_model("base")  # You can also use "tiny" or "small" for faster results

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio = request.files['audio']
    file_path = os.path.join("temp.wav")
    audio.save(file_path)

    try:
        result = model.transcribe(file_path)
        return jsonify({'text': result['text']})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
