from app import app, db, User, Project, Cohort
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from faker import Faker
import random

fake = Faker()

def init_db():
    with app.app_context():
        # Drop all tables to start fresh
        db.drop_all()
        # Create all tables
        db.create_all()

        # Create test users
        test_users = [
            User(
                name='John Doe',
                email='john@example.com',
                password=generate_password_hash('password123'),
                role='student',
                cohort='MC-45'
            ),
            User(
                name='Jane Smith',
                email='jane@example.com',
                password=generate_password_hash('password123'),
                role='student',
                cohort='MC-45'
            ),
            User(
                name='Admin User',
                email='admin@example.com',
                password=generate_password_hash('admin123'),
                role='admin'
            )
        ]

        # Add more random users
        for _ in range(10):
            test_users.append(User(
                name=fake.name(),
                email=fake.email(),
                password=generate_password_hash('password123'),
                role='student',
                cohort=random.choice(['MC-45', 'MC-46'])
            ))

        db.session.add_all(test_users)
        db.session.flush()  # Flush to get user IDs

        # Create test cohorts
        test_cohorts = [
            Cohort(
                name='MC-45',
                track='Full Stack',
                start_date=datetime(2024, 1, 1).date(),
                end_date=datetime(2024, 6, 30).date()
            ),
            Cohort(
                name='MC-46',
                track='Android',
                start_date=datetime(2024, 3, 1).date(),
                end_date=datetime(2024, 8, 31).date()
            )
        ]
        db.session.add_all(test_cohorts)

        # Create test projects
        project_types = [
            ('E-commerce', 'Full Stack'),
            ('Social Media', 'Full Stack'),
            ('Fitness App', 'Android'),
            ('Task Manager', 'Full Stack'),
            ('Recipe Finder', 'Full Stack'),
            ('Weather App', 'Android'),
            ('Chat Application', 'Full Stack'),
            ('Budget Tracker', 'Android'),
            ('News Reader', 'Android'),
            ('Learning Platform', 'Full Stack')
        ]

        test_projects = []
        user_ids = [user.id for user in test_users if user.role == 'student']

        for _ in range(25):
            project_type = random.choice(project_types)
            created_date = fake.date_time_between(start_date='-6M', end_date='now')
            
            test_projects.append(Project(
                name=f"{project_type[0]} - {fake.company()}",
                description=fake.paragraph(nb_sentences=3),
                github_url=f"https://github.com/{fake.user_name()}/{fake.slug()}",
                track=project_type[1],
                cohort=random.choice(['MC-45', 'MC-46']),
                owner_id=random.choice(user_ids),
                created_at=created_date
            ))

        db.session.add_all(test_projects)
        db.session.commit()

if __name__ == '__main__':
    init_db()
    print("Database initialized with test data!")
    print("\nTest Users:")
    print("Student 1: john@example.com / password123")
    print("Student 2: jane@example.com / password123")
    print("Admin: admin@example.com / admin123")