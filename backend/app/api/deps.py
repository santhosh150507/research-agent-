from app.models.user import User

class MockUser:
    id = 1

def get_current_user():
    return MockUser()
