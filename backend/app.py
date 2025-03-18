
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from datetime import date

# Import module functions
from facial_recognition import process_face_recognition
from attendance_tracker import update_attendance, get_attendance_records
from posture_detector import analyze_posture

app = Flask(__name__)
CORS(app)

@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    try:
        # Get the base64 image from the request
        data = request.json
        base64_image = data['frame'].split(',')[1]
        
        # Process facial recognition and engagement
        face_result = process_face_recognition(base64_image)
        
        # Process posture detection
        posture_result = analyze_posture(base64_image)
        
        # Update attendance if a known face is detected
        if face_result['faces'] and face_result['faces'][0] != "Unknown":
            update_attendance(
                face_result['faces'][0], 
                face_result['engagement'], 
                face_result['remarks'],
                posture_result['posture_status']
            )
        
        # Combine results
        result = {
            **face_result,
            **posture_result
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-attendance', methods=['GET'])
def download_attendance():
    try:
        return send_file(
            'attendance.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'attendance_{date.today().strftime("%Y-%m-%d")}.xlsx'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-attendance', methods=['GET'])
def get_attendance():
    try:
        return jsonify(get_attendance_records())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
