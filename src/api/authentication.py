from common import *

@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    new_token = create_access_token(identity=user_id)
    return jsonify(access_token=new_token), 200


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    middle_name = data.get('middle_name')
    last_name = data.get('last_name')
    name_ext = data.get('name_ext')
    birthdate = data.get('birthdate')
    gender = data.get('gender')
    email = data.get('email')
    password = data.get('pw_hash')

    if cursor.email_taken(email): 
        return jsonify({'error': 'Email is already taken'}), 401
    
    success = cursor.register_user(first_name, middle_name, last_name, name_ext, birthdate, gender, email, password)

    if success:
        return jsonify(msg="User registered succesfully"), 200
    else:
        return jsonify(msg="User cannot be registered"), 200
    

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('pw_hash')
    user_id = cursor.authenticate_user(email, password)
        
    if user_id is not None:
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@app.route('/api/account', methods=['DELETE'])
@jwt_required() 
def delete_account():
    user_id = get_jwt_identity() 
    
    if user_id is None:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    success = cursor.delete_user(user_id) 
    
    if success:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found or could not be deleted'}), 404
    

@app.route('/api/account', methods=['PUT'])
@jwt_required()
def update_account():
    user_id = get_jwt_identity()
    data = request.get_json()

    if user_id is None:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    user_info = cursor.get_info(user_id)

    if user_info is None:
        return jsonify({'error': 'User not found'}), 404

    updated_info = {
        'new_first_name': data.get('new_first_name', user_info['first_name']),
        'new_middle_name': data.get('new_middle_name', user_info['middle_name']),
        'new_last_name': data.get('new_last_name', user_info['last_name']),
        'new_name_ext': data.get('new_name_ext', user_info['name_ext']),
        'new_birthdate': data.get('new_birthdate', user_info['birthdate']),
        'new_gender': data.get('new_gender', user_info['gender']),
        'new_hashed_pw': data.get('new_hashed_pw', user_info['hashed_pw'])
    }
    
    updated_info = {k: v for k, v in updated_info.items() if v is not None}

    success = cursor.update_user(
        user_id,
        updated_info['new_first_name'],
        updated_info['new_middle_name'],
        updated_info['new_last_name'],
        updated_info['new_name_ext'],
        updated_info['new_birthdate'],
        updated_info['new_gender'],
        updated_info['new_hashed_pw']
    )
    
    if success:
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User could not be updated'}), 500