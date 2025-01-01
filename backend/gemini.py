from flask import Flask, jsonify, request
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)

# Simple route that returns a JSON response
import google.generativeai as genai

API = "AIzaSyC3ln3khmV34xDoYJ4pfSI3KMAmfeQrt7I"



def gemini_query(input):
    genai.configure(api_key=API)

    # Set up the model
    generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 0,
    "max_output_tokens": 8192,
    }

    safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    ]

    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                                generation_config=generation_config,
                                safety_settings=safety_settings)

    convo = model.start_chat(history=[
    {
        "role": "user",
        "parts": ["""I'm going to give you a goal, i want you to break down the goal to smaller sub-goals. for example i can give you "My goal is to lose 10 kgs in the next 3 months." Your answer should be something like "Start tracking you caloric intake for 2 weeks, do some sort of physical training for 4 weeks, reduce your caloric intake by 500 calories." expect business goals like "increase profit by 10%" and you should break down the goal into 4 sub-goals, one for each quarter. Don't use alot of special characters, and your response should be to the point, just give me the sub-goals do not walk me through the breakdown. and kindly limiting using new lines, and do not attempt making certain words in bold or such. and finally make the quarters in a csv format, meaning 'Goal for Q1, Goal for Q2' and so on you dont need to mention the quarters like this Q1: ..., Q2: ..."""]
    },
    {
        "role": "model",
        "parts": ["Got it!"]
    },
    ])

    convo.send_message(input)
    return convo.last.text
    
# Route that handles POST request
@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.json
    return jsonify({"received": data}), 201

# Route that handles GET request with query parameter
@app.route('/api', methods=['GET'])
def get_query():
    query = request.args.get('query')  # Retrieve the 'query' parameter from the URL
    if query:
        gemini_result = gemini_query(query)
        return jsonify({"response": gemini_result})
    else:
        return jsonify({"error": "No query parameter provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)

