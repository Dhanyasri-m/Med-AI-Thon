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
    # Nurse Medical Fields
    blood_pressure = db.Column(db.String(20))
    pulse_rate = db.Column(db.String(20))
    weight = db.Column(db.String(20))
    height = db.Column(db.String(20))
    temperature = db.Column(db.String(20))
    respiratory_rate = db.Column(db.String(20))
    appointment_time = db.Column(db.DateTime)  # ✅ NEW
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


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
    # Nurse Medical Fields
    blood_pressure = db.Column(db.String(20))
    pulse_rate = db.Column(db.String(20))
    weight = db.Column(db.String(20))
    height = db.Column(db.String(20))
    temperature = db.Column(db.String(20))
    respiratory_rate = db.Column(db.String(20))
    treatment_time = db.Column(db.DateTime)  # ✅ NEW
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


# ✅ Get All Appointments (for nurse)
@app.route("/get_all_appointments", methods=["GET"])
def get_all_appointments():
    appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
    data = [
        {
            "unique_id": a.unique_id,
            "name": a.name,
            "age": a.age,
            "sex": a.sex,
            "phone": a.phone,
            "aadhaar": a.aadhaar,
            "city": a.city,
            "state": a.state,
            "address": a.address,
            "reason": a.reason,
            "date": a.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for a in appointments
    ]
    return jsonify(data), 200


# ✅ Get All Emergency Cases (for nurse)
@app.route("/get_all_emergencies", methods=["GET"])
def get_all_emergencies():
    emergencies = EmergencyCase.query.order_by(EmergencyCase.created_at.desc()).all()
    data = [
        {
            "unique_id": e.unique_id,
            "name": e.name,
            "age": e.age,
            "sex": e.sex,
            "phone": e.phone,
            "aadhaar": e.aadhaar,
            "city": e.city,
            "state": e.state,
            "address": e.address,
            "emergency_type": e.emergency_type,
            "other_contact": e.other_contact,
            "immediate_treatment": e.immediate_treatment,
            "date": e.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for e in emergencies
    ]
    return jsonify(data), 200
 

# ✅ Update Medical Data for Appointments
@app.route("/update_appointment_vitals", methods=["PUT"])
def update_appointment_vitals():
    data = request.json
    appointment = Appointment.query.filter_by(unique_id=data["unique_id"]).first()
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    appointment.blood_pressure = data.get("blood_pressure")
    appointment.pulse_rate = data.get("pulse_rate")
    appointment.weight = data.get("weight")
    appointment.height = data.get("height")
    appointment.temperature = data.get("temperature")
    appointment.respiratory_rate = data.get("respiratory_rate")
    db.session.commit()
    return jsonify({"message": "✅ Appointment vitals updated successfully"}), 200


# ✅ Update Medical Data for Emergency Cases
@app.route("/update_emergency_vitals", methods=["PUT"])
def update_emergency_vitals():
    data = request.json
    emergency = EmergencyCase.query.filter_by(unique_id=data["unique_id"]).first()
    if not emergency:
        return jsonify({"error": "Emergency case not found"}), 404

    emergency.blood_pressure = data.get("blood_pressure")
    emergency.pulse_rate = data.get("pulse_rate")
    emergency.weight = data.get("weight")
    emergency.height = data.get("height")
    emergency.temperature = data.get("temperature")
    emergency.respiratory_rate = data.get("respiratory_rate")
    db.session.commit()
    return jsonify({"message": "✅ Emergency vitals updated successfully"}), 200

# ✅ Update Appointment Time (Doctor)
@app.route("/update_appointment_time", methods=["PUT"])
def update_appointment_time():
    data = request.json
    appointment = Appointment.query.filter_by(unique_id=data["unique_id"]).first()
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404
    appointment.appointment_time = data["appointment_time"]
    db.session.commit()
    return jsonify({"message": "✅ Appointment time fixed successfully"}), 200


# ✅ Update Emergency Treatment Time (Doctor)
@app.route("/update_emergency_time", methods=["PUT"])
def update_emergency_time():
    data = request.json
    emergency = EmergencyCase.query.filter_by(unique_id=data["unique_id"]).first()
    if not emergency:
        return jsonify({"error": "Emergency case not found"}), 404
    emergency.treatment_time = data["treatment_time"]
    db.session.commit()
    return jsonify({"message": "🚑 Emergency treatment time fixed successfully"}), 200


@app.route("/get_all_appointments_doctor", methods=["GET"])
def get_all_appointments_doctor():
    appointments = Appointment.query.filter(
        Appointment.blood_pressure.isnot(None)
    ).order_by(Appointment.created_at.desc()).all()
    data = [
        {
            "unique_id": a.unique_id,
            "name": a.name,
            "age": a.age,
            "sex": a.sex,
            "phone": a.phone,
            "reason": a.reason,
            "city": a.city,
            "blood_pressure": a.blood_pressure,
            "pulse_rate": a.pulse_rate,
            "weight": a.weight,
            "height": a.height,
            "temperature": a.temperature,
            "respiratory_rate": a.respiratory_rate,
            "appointment_time": a.appointment_time.isoformat() if a.appointment_time else None,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for a in appointments
    ]
    return jsonify(data), 200


@app.route("/get_all_emergencies_doctor", methods=["GET"])
def get_all_emergencies_doctor():
    emergencies = EmergencyCase.query.filter(
        EmergencyCase.blood_pressure.isnot(None)
    ).order_by(EmergencyCase.created_at.desc()).all()
    data = [
        {
            "unique_id": e.unique_id,
            "name": e.name,
            "age": e.age,
            "sex": e.sex,
            "phone": e.phone,
            "emergency_type": e.emergency_type,
            "other_contact": e.other_contact,
            "immediate_treatment": e.immediate_treatment,
            "city": e.city,
            "blood_pressure": e.blood_pressure,
            "pulse_rate": e.pulse_rate,
            "weight": e.weight,
            "height": e.height,
            "temperature": e.temperature,
            "respiratory_rate": e.respiratory_rate,
            "treatment_time": e.treatment_time.isoformat() if e.treatment_time else None,
            "created_at": e.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for e in emergencies
    ]
    return jsonify(data), 200

# ✅ Get Appointment Time for Patient
@app.route("/get_patient_appointment/<unique_id>", methods=["GET"])
def get_patient_appointment(unique_id):
    appointment = Appointment.query.filter_by(unique_id=unique_id).first()
    if not appointment:
        return jsonify({"found": False}), 200  # clear flag for frontend
    return jsonify({
        "found": True,
        "unique_id": appointment.unique_id,
        "reason": appointment.reason,
        "city": appointment.city,
        "appointment_time": appointment.appointment_time.isoformat() if appointment.appointment_time else None
    }), 200


# ✅ Get Emergency Treatment Time for Patient
@app.route("/get_patient_emergency/<unique_id>", methods=["GET"])
def get_patient_emergency(unique_id):
    emergency = EmergencyCase.query.filter_by(unique_id=unique_id).first()
    if not emergency:
        return jsonify({"found": False}), 200
    return jsonify({
        "found": True,
        "unique_id": emergency.unique_id,
        "emergency_type": emergency.emergency_type,
        "immediate_treatment": emergency.immediate_treatment,
        "treatment_time": emergency.treatment_time.isoformat() if emergency.treatment_time else None
    }), 200


# ✅ Doctor adds prescription, report, billing & next appointment
@app.route("/add_doctor_update", methods=["POST"])
def add_doctor_update():
    data = request.json
    uid = data.get("unique_id")
    appointment = Appointment.query.filter_by(unique_id=uid).first()

    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    # ----------------------------
    # 🧾 1️⃣ Save Lab Report / Diagnosis
    # ----------------------------
    new_report = Report(
        unique_id=uid,
        report_title="Consultation Summary / Lab Report",
        diagnosis=data.get("description", "N/A"),
        doctor_name="Dr. AI System",
        file_url=data.get("report_url", ""),
        date=datetime.utcnow()
    )
    db.session.add(new_report)

    # ----------------------------
    # 💊 2️⃣ Save Prescription (Pharmacy)
    # ----------------------------
    if data.get("prescription"):
        prescription_text = data.get("prescription").strip()
        if prescription_text:
            new_pharma = Pharmacy(
                unique_id=uid,
                medicine_name=prescription_text,
                dosage="As prescribed",
                frequency="Daily",
                duration="5 days",
                prescribed_by="Dr. AI System",
                date=datetime.utcnow()
            )
            db.session.add(new_pharma)

    # ----------------------------
    # 💰 3️⃣ Save Billing
    # ----------------------------
    if data.get("billing_amount"):
        try:
            amount = float(data.get("billing_amount"))
        except:
            amount = 0.0

        new_bill = Billing(
            unique_id=uid,
            total_amount=amount,
            payment_status="Pending",
            billing_date=datetime.utcnow(),
            remarks=data.get("billing_remarks", "")
        )
        db.session.add(new_bill)

    # ----------------------------
    # 📅 4️⃣ Update Appointment Next Visit
    # ----------------------------
    if data.get("next_appointment"):
        try:
            appointment.appointment_time = datetime.fromisoformat(
                data["next_appointment"]
            )
        except:
            pass

    db.session.commit()
    return jsonify({"message": "✅ Doctor update saved to all linked tables"}), 200


if __name__ == '__main__':
    with app.app_context():
        db.drop_all() 
        db.create_all()
    app.run(debug=True)
