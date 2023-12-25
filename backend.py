import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

# Database Connection
conn = sqlite3.connect('com_viet.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS orders
             (order_id INTEGER PRIMARY KEY AUTOINCREMENT,
              status TEXT DEFAULT 'active')''')

c.execute('''CREATE TABLE IF NOT EXISTS chosen_dishes
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER,
              dish_name TEXT,
              price INTEGER,
              FOREIGN KEY(order_id) REFERENCES orders(order_id))''')
conn.commit()

# Endpoints for choosing dishes
@app.route('/choose-dish', methods=['POST'])
def choose_dish():
    data = request.json
    dish_name = data.get('dishName')
    price = data.get('price')
    order_id = get_active_order_id()
    
    if not order_id:
        create_order()

    c.execute('INSERT INTO chosen_dishes (order_id, dish_name, price) VALUES (?, ?, ?)', (order_id, dish_name, price))
    conn.commit()
    return jsonify({'message': 'Dish chosen successfully'})

# Endpoint for reviewing shopping cart
@app.route('/review-cart', methods=['GET'])
def review_cart():
    order_id = get_active_order_id()
    if order_id:
        c.execute('SELECT * FROM chosen_dishes WHERE order_id=?', (order_id,))
        cart_items = [{'id': row[0], 'dishName': row[2], 'price': row[3]} for row in c.fetchall()]
        return jsonify({'cartItems': cart_items})
    else:
        return jsonify({'message': 'No active order'})

# Endpoint for deleting a dish from cart
@app.route('/delete-dish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    c.execute('DELETE FROM chosen_dishes WHERE id=?', (dish_id,))
    conn.commit()
    return jsonify({'message': 'Dish deleted successfully'})

# Endpoint for calculating total
@app.route('/calculate-total', methods=['GET'])
def calculate_total():
    order_id = get_active_order_id()
    if order_id:
        c.execute('SELECT SUM(price) FROM chosen_dishes WHERE order_id=?', (order_id,))
        total = c.fetchone()[0]
        return jsonify({'total': total})
    else:
        return jsonify({'message': 'No active order'})

# Additional endpoints related to suspicious behavior detection
@app.route('/abuse', methods=['GET'])
def detect_abuse():
    # Implement logic to detect suspicious behavior
    # For example, checking for abnormal order frequency or total amount spent
    # Return relevant information about the suspicious behavior
    return jsonify({'message': 'Suspicious behavior detected'})

@app.route('/checkpoint/956', methods=['POST'])
def report_checkpoint_956():
    # Capture and report specific checkpoint event, e.g., user reaching a specific stage in the app
    # Log the event and report back a success message
    return jsonify({'message': 'Checkpoint 956 reported'})

@app.route('/checkpoint/282', methods=['GET'])
def get_checkpoint_282():
    # Retrieve specific checkpoint details, if available
    # May involve querying the database or other data source
    checkpoint_data = {'name': 'Checkpoint 282', 'description': 'User reached a critical stage'}
    return jsonify({'checkpoint': checkpoint_data})

def create_order():
    c.execute('INSERT INTO orders DEFAULT VALUES')
    conn.commit()

def get_active_order_id():
    c.execute('SELECT order_id FROM orders WHERE status="active"')
    result = c.fetchone()
    return result[0] if result else None

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
