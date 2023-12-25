import sqlite3
from flask import Flask, request, jsonify
from flask_httpauth import HTTPBasicAuth
from passlib.hash import argon2

app = Flask(__name__)
auth = HTTPBasicAuth()

# Database Connection
conn = sqlite3.connect('com_viet.db', check_same_thread=False)
c = conn.cursor()

# Create tables
c.execute('''CREATE TABLE IF NOT EXISTS users
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password_hash TEXT NOT NULL)''')

c.execute('''CREATE TABLE IF NOT EXISTS orders
             (order_id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              status TEXT DEFAULT 'active',
              FOREIGN KEY(user_id) REFERENCES users(id))''')

c.execute('''CREATE TABLE IF NOT EXISTS chosen_dishes
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER,
              dish_name TEXT,
              price INTEGER,
              FOREIGN KEY(order_id) REFERENCES orders(order_id))''')
conn.commit()

@auth.verify_password
def verify_password(username, password):
    c.execute('SELECT password_hash FROM users WHERE username = ?', (username,))
    user = c.fetchone()
    if user and argon2.verify(password, user[0]):
        return username

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    c.execute('SELECT id FROM users WHERE username = ?', (username,))
    if c.fetchone():
        return jsonify({'message': 'Username already exists'}), 409

    password_hash = argon2.hash(password)
    c.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', (username, password_hash))
    conn.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    auth_data = request.authorization
    if not auth_data or not auth_data.username or not auth_data.password:
        return jsonify({'message': 'Could not verify'}), 401

    if verify_password(auth_data.username, auth_data.password):
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'message': 'Bad credentials'}), 401

@app.route('/choose-dish', methods=['POST'])
@auth.login_required
def choose_dish():
    data = request.json
    dish_name = data.get('dishName')
    price = data.get('price')
    username = auth.current_user()
    
    c.execute('SELECT id FROM users WHERE username = ?', (username,))
    user_id = c.fetchone()[0]

    order_id = get_active_order_id(user_id)
    if not order_id:
        create_order(user_id)

    c.execute('INSERT INTO chosen_dishes (order_id, dish_name, price) VALUES (?, ?, ?)', (order_id, dish_name, price))
    conn.commit()
    return jsonify({'message': 'Dish chosen successfully'})

@app.route('/review-cart', methods=['GET'])
@auth.login_required
def review_cart():
    username = auth.current_user()
    
    c.execute('SELECT id FROM users WHERE username = ?', (username,))
    user_id = c.fetchone()[0]

    order_id = get_active_order_id(user_id)
    if order_id:
        c.execute('SELECT * FROM chosen_dishes WHERE order_id=?', (order_id,))
        cart_items = [{'id': row[0], 'dishName': row[2], 'price': row[3]} for row in c.fetchall()]
        return jsonify({'cartItems': cart_items})
    else:
        return jsonify({'message': 'No active order'})

@app.route('/delete-dish/<int:dish_id>', methods=['DELETE'])
@auth.login_required
def delete_dish(dish_id):
    c.execute('DELETE FROM chosen_dishes WHERE id=?', (dish_id,))
    conn.commit()
    return jsonify({'message': 'Dish deleted successfully'})

@app.route('/calculate-total', methods=['GET'])
@auth.login_required
def calculate_total():
    username = auth.current_user()
    
    c.execute('SELECT id FROM users WHERE username = ?', (username,))
    user_id = c.fetchone()[0]

    order_id = get_active_order_id(user_id)
    if order_id:
        c.execute('SELECT SUM(price) FROM chosen_dishes WHERE order_id=?', (order_id,))
        total = c.fetchone()[0]
        return jsonify({'total': total})
    else:
        return jsonify({'message': 'No active order'})

def create_order(user_id):
    c.execute('INSERT INTO orders (user_id) VALUES (?)', (user_id,))
    conn.commit()

def get_active_order_id(user_id):
    c.execute('SELECT order_id FROM orders WHERE status="active" AND user_id = ?', (user_id,))
    result = c.fetchone()
    return result[0] if result else None

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
