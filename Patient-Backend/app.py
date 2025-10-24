from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import random, string

app = Flask(__name__)
CORS(app)

# ✅ Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:dharun123@localhost:5432/medaithon_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ✅ Patient Model
class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    aadhaar = db.Column(db.String(12), unique=True, nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(255), nullable=False)

# ✅ Unique ID Generator — (3 letters + 3 digits)
def generate_unique_id():
    letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    digits = ''.join(random.choices(string.digits, k=3))
    uid = letters + digits
    # make sure it’s unique
    if Patient.query.filter_by(unique_id=uid).first():
        return generate_unique_id()
    return uid

# ✅ Register API
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    required_fields = ["name", "age", "sex", "phone", "aadhaar", "city", "state", "address", "password"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    if Patient.query.filter_by(phone=data["phone"]).first():
        return jsonify({"error": "Phone number already exists"}), 400
    if Patient.query.filter_by(aadhaar=data["aadhaar"]).first():
        return jsonify({"error": "Aadhaar already registered"}), 400

    hashed_pw = generate_password_hash(data["password"])
    new_patient = Patient(
        unique_id=generate_unique_id(),
        name=data["name"],
        age=data["age"],
        sex=data["sex"],
        phone=data["phone"],
        aadhaar=data["aadhaar"],
        city=data["city"],
        state=data["state"],
        address=data["address"],
        password=hashed_pw
    )
    db.session.add(new_patient)
    db.session.commit()

    return jsonify({
        "message": "✅ Registered successfully!",
        "unique_id": new_patient.unique_id
    }), 201

# ✅ Login API (Phone + Password)
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    patient = Patient.query.filter_by(phone=data.get("phone")).first()
    if patient and check_password_hash(patient.password, data.get("password")):
        return jsonify({
            "message": "✅ Login successful",
            "name": patient.name,
            "unique_id": patient.unique_id,
            "phone": patient.phone
        }), 200
    return jsonify({"error": "Invalid phone number or password"}), 401

if __name__ == "__main__":
    app.run(debug=True)
