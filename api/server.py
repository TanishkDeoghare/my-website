from flask import Flask, request, jsonify
from flask_cors import CORS
import math
from scipy.stats import norm

app = Flask(__name__)
CORS(app)

def black_scholes(S, K, T, r, sigma, option_type):
    d1 = (math.log(S/K) + (r + 0.5*sigma**2)*T)/ (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    if option_type== 'call':
        price = S*norm.cdf(d1) - K*math.exp(-r*T)*norm.cdf(d2)
    else:
        price = K*math.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)
    return price
        
@app.route('/api/bs-price', methods=['POST'])
def bs_price():
    data = request.get_json()
    price= black_scholes(
        float(data['S']),
        float(data['K']),
        float(data['T']),
        float(data['r']),
        float(data['sigma']),
        option_type=data['optionType']
    )
    return jsonify({'price': price})

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)