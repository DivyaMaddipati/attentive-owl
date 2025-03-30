
import face_recognition
import cv2
import numpy as np
import os
import base64
from gaze_tracking import GazeTracking

# Initialize gaze tracking
gaze = GazeTracking()

# Initialize arrays for known face encodings and names
known_face_encodings = []
known_face_names = []

# Load face encodings from data folder
data_folder = "data"
if os.path.exists(data_folder):
    for file in os.listdir(data_folder):
        if file.lower().endswith(('png', 'jpg', 'jpeg')):
            file_path = os.path.join(data_folder, file)
            try:
                image = face_recognition.load_image_file(file_path)
                face_encodings = face_recognition.face_encodings(image)
                if face_encodings:
                    known_face_encodings.append(face_encodings[0])
                    known_face_names.append(os.path.splitext(file)[0])
            except Exception as e:
                print(f"Error processing file {file}: {e}")

def process_face_recognition(base64_image):
    """Process a base64 image for face recognition and gaze tracking"""
    # Decode base64 image
    image_data = base64.b64decode(base64_image)
    
    # Convert to numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert BGR to RGB
    rgb_frame = frame[:, :, ::-1]
    
    # Process gaze tracking
    gaze.refresh(frame)
    engagement_score = 100  # Default engagement score
    engagement_remarks = "Actively participating"
    
    # Determine engagement based on gaze
    if gaze.is_blinking():
        engagement_score -= 30
        engagement_remarks = "Student appears to be sleeping"
    elif gaze.is_right() or gaze.is_left():
        engagement_score -= 20
        engagement_remarks = "Student is distracted"
    
    # Find faces in the frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    
    face_names = []
    
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        
        name = "Unknown"
        
        # Set a threshold for recognition (adjust this based on testing)
        threshold = 0.5
        
        if len(face_distances) > 0:  # Ensure there are face distances to compare
            best_match_index = np.argmin(face_distances)
            min_distance = face_distances[best_match_index]
            
            if matches[best_match_index] and min_distance < threshold:  # Only accept if confidence is high
                name = known_face_names[best_match_index]
        
        face_names.append(name)
        print(f"Face detected: {name} with confidence: {1 - min_distance if len(face_distances) > 0 else 'N/A'}")
    
    # Determine if the frame contains any activity (faces)
    activity_status = "Active" if face_locations else "Inactive"
    
    return {
        'faces': face_names,
        'engagement': engagement_score,
        'remarks': engagement_remarks,
        'gaze_status': get_gaze_status(gaze),
        'activity_status': activity_status
    }

def get_gaze_status(gaze):
    """Get the gaze status as a string"""
    if gaze.is_blinking():
        return "blinking"
    elif gaze.is_right():
        return "looking_right"
    elif gaze.is_left():
        return "looking_left"
    elif gaze.is_center():
        return "looking_center"
    else:
        return "unknown"
