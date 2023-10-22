from flask import Flask, request, jsonify
import requests

app = Flask(__name)

@app.route('/ask_odinai', methods=['POST'])
def ask_odinai():
    try:
        user_id = request.json['user_id']
        question = request.json['question']

        API_URL = "https://api.tryterra.co/v2/chat/odinai"
        headers = {
            'dev-id': 'odincareai-prod-q1pqPcy2xh',
            'x-api-key': '4wSTI79Dc8wdKcMOt7dLbF3tzaWkfqWG'
        }

        query_params = {
            'user_id': user_id,
            'user_input': question,
            'enable_history': True,  # if you want OdinAI to remember and use previous dialogues
        }

        response = requests.post(API_URL, headers=headers, params=query_params)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'OdinAI request failed'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
