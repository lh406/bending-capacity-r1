from flask import Flask, render_template, request, jsonify
from app import app
import json
import os
import math

@app.route('/')
def index():
    shapes = load_shapes()
    return render_template('index.html', shapes=shapes)

@app.route('/bending', methods=['POST'])
def bending():
    try:
        lunbraced = float(request.form['lunbraced'])
        omega2 = float(request.form['omega2'])
        phi = float(request.form['phi'])   
        fy = float(request.form['fy'])
        es = float(request.form['es'])
        g = float(request.form['g'])
        cw = float(request.form['cw'])
        j = float(request.form['j'])
        iy = float(request.form['iy'])
        zx = float(request.form['zx'])

        mp = fy * zx / 1000000
        mu = (omega2 * math.pi / lunbraced) * math.sqrt(es * iy * g * j + iy * cw * math.pow(math.pi * es /lunbraced, 2)) / 1000000
        mr = 0
        if (mp > 0.67 * mp):
            mr = min(1.15*phi*mp*(1-0.28*mp/mu), phi * mp)
        else:
            mr = phi * mu
                
        result = mr
        return jsonify({'mp': mp,
                        'mu': mu,
                        'mr': mr})

    except ValueError:
        return jsonify({'error': 'Invalid input. Please enter numbers.'})

# Load shape data from JSON file
def load_shapes():
    # json_file_path = os.path.join('app', 'static', 'sections.json')
    with open('app/static/sections.json') as f:
        return json.load(f)

@app.route('/shape/<shape_name>')
def get_shape(shape_name):
    shapes = load_shapes()
    shape = next((s for s in shapes if s['Shape'] == shape_name), None)
    return jsonify(shape)

@app.route('/bendingGraph', methods=['POST'])
def bendingGraph():
    try:
        lunbraced = 1.0
        omega2 = float(request.form['omega2'])
        phi = float(request.form['phi'])   
        fy = float(request.form['fy'])
        es = float(request.form['es'])
        g = float(request.form['g'])
        cw = float(request.form['cw'])
        j = float(request.form['j'])
        iy = float(request.form['iy'])
        zx = float(request.form['zx'])

        mp = fy * zx / 1000000
        mu = (omega2 * math.pi / lunbraced) * math.sqrt(es * iy * g * j + iy * cw * math.pow(math.pi * es /lunbraced, 2)) / 1000000
        mr = 0
        if (mp > 0.67 * mp):
            mr = min(1.15*phi*mp*(1-0.28*mp/mu), phi * mp)
        else:
            mr = phi * mu

        data = []
        while  mr > 0.15 * mp:
            data.append({
                'x': lunbraced,  # Random x between 0 and 100
                'y': mr   # Random y between 0 and 100
            })
            lunbraced += 200
            mu = (omega2 * math.pi / lunbraced) * math.sqrt(es * iy * g * j + iy * cw * math.pow(math.pi * es /lunbraced, 2)) / 1000000
            if (mp > 0.67 * mp):
                mr = min(1.15*phi*mp*(1-0.28*mp/mu), phi * mp)
            else:
                mr = phi * mu

        return jsonify(data)

    except ValueError:
        return jsonify({'error': 'Invalid input. Please enter numbers.'})
