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

@app.route('/api/trinomial-price', methods=['POST'])
def trinomial_price():
    data = request.get_json(force=True)
    S = float(data['S'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    N = int(float(data['steps']))
    opt = data['optionType']
    
    dt = T/N
    nu = r - 0.5*sigma**2
    dx = sigma*math.sqrt(3*dt)
    
    u = math.exp(dx)
    d = math.exp(-dx)
    
    pu = 1/6 + (nu*math.sqrt(dt/(12*sigma**2)))
    pd = 1/6 - (nu*math.sqrt(dt/(12*sigma**2)))
    pm = 1 - pu - pd
    
    values = []
    for i in range(2*N+1):
        j = i - N
        ST = S*(u**j)
        payoff = max(ST - K, 0.0) if opt == 'call' else max(K - ST, 0.0)
        values.append(payoff)
        
    for i in range(N,0,-1):
        new_vals = []
        for j in range(2*i-1):
            v = (
                pu * values[j+2] + 
                pm * values[j+1] + 
                pd * values[j]
            )
            new_vals.append(math.exp(-r*dt)*v)
        values = new_vals

    return jsonify({'price':values[0]})

def thomas(a,b,c,d):
    n = len(b)
    cp = np.zeros(n-1)
    dp = np.zeros(n)
    cp[0] = c[0]/b[0]
    dp[0] = d[0]/b[0]
    for i in range(1, n-1):
        denom = b[i] - a[i-1]*cp[i-1]
        cp[i] = c[i]/denom
        dp[i] = (d[i]-a[i-1]*dp[i-1])/denom
    dp[n-1] = (d[n-1]-a[n-2]*d[n-2])/ (b[n-1] - a[n-2]*cp[n-2])
    x = np.zeros(n)
    x[n-1] = dp[n-1]
    for i in range(n-2, -1,-1):
        x[i] = dp[i] - cp[i]*x[i+1]
    return x

@app.route('/api/pde-price', methods=['POST'])
def pde_price():
    data = request.get_json(force=True)
    S0 = float(data['S'])
    K = float(data['K'])
    T = float(data['T'])
    r = float(data['r'])
    sigma = float(data['sigma'])
    S_max = float(data['S_max'])
    M = int(float(data['M']))
    N = int(float(data['N']))
    opt = data['optionType']
    
    ds = S_max/M
    dt = T/N
    
    V = np.array([
        max((j*ds - K), 0.0) if opt=='call' else max((K - j*ds), 0.0)
        for j in range(M+1)
    ], dtype=float)
    
    a = np.zeros(M-1); b = np.zeros(M-1); c = np.zeros(M-1)
    ap = np.zeros(M-1); bp = np.zeros(M-1); cp = np.zeros(M-1)
    
    for j in range(1, M):
        j2 = j
        alpha = 0.25*dt*(sigma**2*j2**2 - r*j2)
        beta = -0.5*dt*(sigma**2*j2**2 + r)
        gamma = 0.25*dt*(sigma**2*j2**2 + r*j2)
        
        a[j-1], b[j-1], c[j-1] = -alpha, 1-beta, -gamma
        ap[j-1], bp[j-1], cp[j-1] = alpha, 1+beta, gamma

    for n in range(N):
        t = T - n*dt
        V0 = 0.0 if opt=='call' else K*math.exp(-r*t)
        VM = (S_max - K*math.exp(-r*T)) if opt=='call' else 0.0
        
        d = ap*V[0:-2] + bp*V[1:-1] + cp*V[2:]
        d[0] += a[0]*V0
        d[-1] += c[-1]*VM
        
        V_new_int = thomas(a,b,c,d)
        
        V = np.concatenate(([V0], V_new_int, [VM]))
        
        j0 = S0/ds
        i = int(math.floor(j0))
        if i >= M:
            price = V[-1]
        else:
            price = V[i] + (j0 - i)*(V[i+1] - V[i])
            
        return jsonify({'price': float(price)})


if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)