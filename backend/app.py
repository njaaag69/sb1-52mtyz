from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project_bank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    cohort = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github_url = db.Column(db.String(200), nullable=False)
    track = db.Column(db.String(50), nullable=False)
    cohort = db.Column(db.String(50), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Cohort(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    track = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data['role'],
        cohort=data.get('cohort')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=new_user.id)
    return jsonify({
        'token': access_token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email,
            'role': new_user.role,
            'cohort': new_user.cohort
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'cohort': user.cohort
        }
    })

@app.route('/api/projects', methods=['GET'])
@jwt_required()
def get_projects():
    projects = Project.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'githubUrl': p.github_url,
        'track': p.track,
        'cohort': p.cohort,
        'ownerId': p.owner_id,
        'createdAt': p.created_at.isoformat()
    } for p in projects])

@app.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    new_project = Project(
        name=data['name'],
        description=data['description'],
        github_url=data['githubUrl'],
        track=data['track'],
        cohort=data['cohort'],
        owner_id=user_id
    )
    
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify({
        'id': new_project.id,
        'name': new_project.name,
        'description': new_project.description,
        'githubUrl': new_project.github_url,
        'track': new_project.track,
        'cohort': new_project.cohort,
        'ownerId': new_project.owner_id,
        'createdAt': new_project.created_at.isoformat()
    })

@app.route('/api/cohorts', methods=['GET'])
@jwt_required()
def get_cohorts():
    cohorts = Cohort.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'track': c.track,
        'startDate': c.start_date.isoformat(),
        'endDate': c.end_date.isoformat()
    } for c in cohorts])

@app.route('/api/cohorts', methods=['POST'])
@jwt_required()
def create_cohort():
    data = request.get_json()
    user = User.query.get(get_jwt_identity())
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
        
    new_cohort = Cohort(
        name=data['name'],
        track=data['track'],
        start_date=datetime.strptime(data['startDate'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['endDate'], '%Y-%m-%d').date()
    )
    
    db.session.add(new_cohort)
    db.session.commit()
    
    return jsonify({
        'id': new_cohort.id,
        'name': new_cohort.name,
        'track': new_cohort.track,
        'startDate': new_cohort.start_date.isoformat(),
        'endDate': new_cohort.end_date.isoformat()
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)