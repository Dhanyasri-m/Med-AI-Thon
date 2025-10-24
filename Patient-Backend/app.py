from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
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

# ✅ Appointment Model (linked by unique_id)
class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), db.ForeignKey('patients.unique_id'))
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    sex = db.Column(db.String(10))
    phone = db.Column(db.String(15))
    aadhaar = db.Column(db.String(12))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    address = db.Column(db.String(200))
    reason = db.Column(db.String(250))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ Emergency Case Table
class EmergencyCase(db.Model):
    __tablename__ = 'emergency_cases'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), db.ForeignKey('patients.unique_id'))
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    sex = db.Column(db.String(10))
    phone = db.Column(db.String(15))
    aadhaar = db.Column(db.String(12))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    address = db.Column(db.String(200))
    emergency_type = db.Column(db.String(100))
    other_contact = db.Column(db.String(15))
    immediate_treatment = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ Updated Reports Table
class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), db.ForeignKey('patients.unique_id'))
    report_title = db.Column(db.String(100))
    diagnosis = db.Column(db.String(250))
    doctor_name = db.Column(db.String(100))
    file_url = db.Column(db.String(300))  # 🔹 store PDF/image link or file path
    date = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ Pharmacy Table
class Pharmacy(db.Model):
    __tablename__ = 'pharmacy'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), db.ForeignKey('patients.unique_id'))
    medicine_name = db.Column(db.String(100))
    dosage = db.Column(db.String(50))
    frequency = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    prescribed_by = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.utcnow)

# ✅ Billing Table
class Billing(db.Model):
    __tablename__ = 'billing'
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(10), db.ForeignKey('patients.unique_id'))
    total_amount = db.Column(db.Float)
    payment_status = db.Column(db.String(50))
    billing_date = db.Column(db.DateTime, default=datetime.utcnow)
    remarks = db.Column(db.String(250))


# ✅ Unique ID Generator — (3 letters + 3 digits)
def generate_unique_id():
    letters = ''.join(random.choices(string.ascii_uppercase, k=3))
    digits = ''.join(random.choices(string.digits, k=3))
    uid = letters + digits
    if Patient.query.filter_by(unique_id=uid).first():
        return generate_unique_id()
    return uid

# ✅ Register Patient
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

# ✅ Login (Phone + Password)
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

# ✅ Fetch Patient Data (by unique_id)
@app.route("/get_patient/<unique_id>", methods=["GET"])
def get_patient(unique_id):
    patient = Patient.query.filter_by(unique_id=unique_id).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    return jsonify({
        "unique_id": patient.unique_id,
        "name": patient.name,
        "age": patient.age,
        "sex": patient.sex,
        "phone": patient.phone,
        "aadhaar": patient.aadhaar,
        "city": patient.city,
        "state": patient.state,
        "address": patient.address
    }), 200

# ✅ Add Appointment (linked by unique_id)
@app.route("/add_appointment", methods=["POST"])
def add_appointment():
    data = request.json
    patient = Patient.query.filter_by(unique_id=data["unique_id"]).first()
    if not patient:
        return jsonify({"error": "Invalid patient ID"}), 404

    new_appointment = Appointment(
        unique_id=data["unique_id"],
        name=patient.name,
        age=patient.age,
        sex=patient.sex,
        phone=patient.phone,
        aadhaar=patient.aadhaar,
        city=patient.city,
        state=patient.state,
        address=patient.address,
        reason=data["reason"]
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({"message": "✅ Appointment submitted successfully!"}), 201

# ✅ Add Emergency Case API
@app.route("/add_emergency", methods=["POST"])
def add_emergency():
    data = request.json
    patient = Patient.query.filter_by(unique_id=data["unique_id"]).first()
    if not patient:
        return jsonify({"error": "Invalid patient ID"}), 404

    new_emergency = EmergencyCase(
        unique_id=data["unique_id"],
        name=patient.name,
        age=patient.age,
        sex=patient.sex,
        phone=patient.phone,
        aadhaar=patient.aadhaar,
        city=patient.city,
        state=patient.state,
        address=patient.address,
        emergency_type=data["emergency_type"],
        other_contact=data["other_contact"],
        immediate_treatment=data["immediate_treatment"]
    )
    db.session.add(new_emergency)
    db.session.commit()

    return jsonify({"message": "🚑 Emergency record submitted successfully!"}), 201

# ✅ Get Reports by Patient
@app.route("/get_reports/<unique_id>", methods=["GET"])
def get_reports(unique_id):
    reports = Report.query.filter_by(unique_id=unique_id).all()
    data = [
        {
            "report_title": r.report_title,
            "diagnosis": r.diagnosis,
            "doctor_name": r.doctor_name,
            "file_url": r.file_url,
            "date": r.date.strftime("%Y-%m-%d %H:%M")
        }
        for r in reports
    ]
    return jsonify(data), 200


# ✅ Get Pharmacy Records by Patient
@app.route("/get_pharmacy/<unique_id>", methods=["GET"])
def get_pharmacy(unique_id):
    records = Pharmacy.query.filter_by(unique_id=unique_id).all()
    data = [
        {
            "medicine_name": p.medicine_name,
            "dosage": p.dosage,
            "frequency": p.frequency,
            "duration": p.duration,
            "prescribed_by": p.prescribed_by,
            "date": p.date.strftime("%Y-%m-%d")
        }
        for p in records
    ]
    return jsonify(data), 200

# ✅ Get Billing Records by Patient
@app.route("/get_billing/<unique_id>", methods=["GET"])
def get_billing(unique_id):
    bills = Billing.query.filter_by(unique_id=unique_id).all()
    data = [
        {
            "total_amount": b.total_amount,
            "payment_status": b.payment_status,
            "billing_date": b.billing_date.strftime("%Y-%m-%d"),
            "remarks": b.remarks
        }
        for b in bills
    ]
    return jsonify(data), 200


if __name__ == '__main__':
   # with app.app_context():
      #  db.drop_all() 
        #db.create_all()
    app.run(debug=True)
