
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from datetime import date

# Import module functions
from facial_recognition import process_face_recognition
from attendance_tracker import update_attendance, get_attendance_records
from posture_detector import analyze_posture

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080"}})

@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    try:
        # Get the base64 image from the request
        data = request.json
        print("Received frame processing request")
        base64_image = data['frame'].split(',')[1]
        
        # Process facial recognition and engagement
        face_result = process_face_recognition(base64_image)
        print(f"Face recognition result: {face_result}")
        
        # Process posture detection
        posture_result = analyze_posture(base64_image)
        print(f"Posture detection result: {posture_result}")
        
        # Update attendance if a known face is detected
        if face_result['faces'] and face_result['faces'][0] != "Unknown":
            update_attendance(
                face_result['faces'][0], 
                face_result['engagement'], 
                face_result['remarks'],
                posture_result['posture_status']
            )
            print(f"Updated attendance for {face_result['faces'][0]}")
        
        # Combine results
        result = {
            **face_result,
            **posture_result
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in process_frame: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-attendance', methods=['GET'])
def download_attendance():
    try:
        print("Received attendance download request")
        return send_file(
            'attendance.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'attendance_{date.today().strftime("%Y-%m-%d")}.xlsx'
        )
    except Exception as e:
        print(f"Error in download_attendance: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-attendance', methods=['GET'])
def get_attendance():
    try:
        print("Received get attendance request")
        records = get_attendance_records()
        print(f"Retrieved {len(records)} attendance records")
        return jsonify(records)
    except Exception as e:
        print(f"Error in get_attendance: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"status": "Backend is running correctly"})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')
