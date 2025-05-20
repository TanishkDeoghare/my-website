from flask import Flask, request, jsonify
from flask_cors import CORS
import math
from scipy.stats import norm
import numpy as np

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

@app.route('/api/mc-price', methods=['POST'])
def mc_price():
    data = request.get_json(force=True)
    S = float(data['S'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    N = int(float(data['paths']))
    opt = data['optionType']
    
    dt = T
    z = np.random.standard_normal(N)
    ST = S*np.exp((r-0.5*sigma**2)*dt + sigma*np.sqrt(dt)*z)
    if opt=='call':
        payoffs = np.maximum(ST - K, 0.0)
    else:
        payoffs = np.maximum(K - ST, 0.0)
    price = np.exp(-r*T)*payoffs.mean()
    return jsonify({'price': float(price)})

@app.route('/api/black-price', methods=['POST'])
def black_price():
    data = request.get_json(force=True)
    F = float(data['F'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    opt = data['optionType']
    
    d1 = (math.log(F/K)+ 0.5*sigma**2*T)/(sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    df = math.exp(-r*T)
    
    if opt == 'call':
        price = df*(F*norm.cdf(d1) - K*norm.cdf(d2))
    else:
        price = df*(K*norm.cdf(-d2) - F*norm.cdf(-d1))
    return jsonify({'price': float(price)})

@app.route('/api/binomial-price', methods=['POST'])
def binomial_price():
    data = request.get_json(force=True)
    S = float(data['S'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    N = int(float(data['steps']))
    opt = data['optionType']
    
    dt = T/N
    u = math.exp(sigma*math.sqrt(dt))
    d = 1/u
    p = (math.exp(r*dt) - d)/(u-d)
    
    values = []
    
    for j in range(N+1):
        ST = S*(u**j)*(d**(N-j))
        if opt== 'call':
            values.append(max(ST - K, 0.0))
        else:
            values.append(max(K - ST, 0.0))
            
    for i in range(N-1, -1, -1):
        values = [
            math.exp(-r*dt)*(p*values[j+1] + (1-p)*values[j])
            for j in range(i+1)
        ]

    return jsonify({'price': values[0]})

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)