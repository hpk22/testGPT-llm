# backend/app.py
import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import openai
from functools import wraps
import markdown
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Simple rate limiting decorator
def rate_limit(limit=100, per=900):
    def decorator(f):
        last_reset = time.time()
        calls = 0
        @wraps(f)
        def wrapped(*args, **kwargs):
            nonlocal last_reset, calls
            now = time.time()
            if now - last_reset > per:
                calls = 0
                last_reset = now
            if calls >= limit:
                return jsonify({"error": "Rate limit exceeded"}), 429
            calls += 1
            return f(*args, **kwargs)
        return wrapped
    return decorator

# backend/app.py
# ... (previous imports and setup remain the same)

@app.route('/api/generate-instructions', methods=['POST'])
@rate_limit()
def generate_instructions():
    print("Received request")  # Debug print
    print("Files:", request.files)  # Debug print
    print("Form:", request.form)  # Debug print

    if 'screenshots' not in request.files:
        return jsonify({"error": "No screenshots provided in the request"}), 400

    screenshots = request.files.getlist('screenshots')
    context = request.form.get('context', '')

    # New check for empty files
    valid_screenshots = [f for f in screenshots if f.filename != '']
    if not valid_screenshots:
        return jsonify({"error": "No valid screenshots provided. Make sure you're selecting files in Postman."}), 400

    try:
        image_contents = []
        for file in valid_screenshots:
            if allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                with open(filepath, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    image_contents.append(f"data:image/{filename.split('.')[-1]};base64,{encoded_string}")
                
                # Clean up the file after processing
                os.remove(filepath)
            else:
                return jsonify({"error": f"Invalid file type for {file.filename}"}), 400

        print(f"Processing {len(image_contents)} images")  # Debug print
        instructions = process_with_gpt4_vision(context, image_contents)
       # html=markdown.markdown(instructions)
        return jsonify({"instructions": instructions})

    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500

# ... (rest of the code remains the same)

def process_with_gpt4_vision(context, image_contents):
    messages = [
        {"role": "system", "content": "You are a QA expert tasked with creating detailed testing instructions based on screenshots of a digital product.  Provide step-by-step test cases that cover all visible functionalities. Each test case should include:Description: What the test case is about. Pre-conditions: What needs to be set up or ensured before testing. Testing Steps: Clear, step-by-step instructions on how to perform the test. Expected Result: What should happen if the feature works correctly. Make sure its detailed with all detailed steps. Include Performace testing, security testing. It should identify issues, enhances test coverage, improves user experience. It should have MORE THAN 7 test cases . Respond with  a non markdown format."},
        {"role": "user", "content": [
            {"type": "text", "text": context or "Please provide detailed testing instructions for the functionalities shown in these screenshots."},
            *[{"type": "image_url", "image_url": {"url": content}} for content in image_contents]
        ]}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1000
    )

    return response.choices[0].message['content']

if __name__ == '__main__':
    app.run(debug=True, port=3001) 



