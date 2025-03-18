
import cv2
import mediapipe as mp
import numpy as np
import base64

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

def calculate_angle(a, b, c):
    """Calculate the angle between three points"""
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point
    
    ba = a - b
    bc = c - b
    
    # Handle potential division by zero
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    
    if norm_ba == 0 or norm_bc == 0:
        return 0
    
    cosine_angle = np.dot(ba, bc) / (norm_ba * norm_bc)
    # Ensure the value is within valid arccos range [-1, 1]
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    angle = np.degrees(np.arccos(cosine_angle))
    
    return angle

def analyze_posture(base64_image):
    """Analyze posture from a base64 encoded image"""
    # Decode base64 image
    image_data = base64.b64decode(base64_image)
    
    # Convert to numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to RGB for MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Default values
    posture_status = "Not detected"
    neck_angle = 0
    left_bend = 0
    right_bend = 0
    posture_score = 0  # Default score is now 0 to indicate inactivity
    activity_status = "Inactive"  # Added activity status
    
    # Process frame with MediaPipe Pose
    results = pose.process(rgb_frame)
    
    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        activity_status = "Active"  # If landmarks detected, user is active

        # Get necessary key points
        try:
            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
            left_ear = [landmarks[mp_pose.PoseLandmark.LEFT_EAR].x, landmarks[mp_pose.PoseLandmark.LEFT_EAR].y]
            right_ear = [landmarks[mp_pose.PoseLandmark.RIGHT_EAR].x, landmarks[mp_pose.PoseLandmark.RIGHT_EAR].y]
            nose = [landmarks[mp_pose.PoseLandmark.NOSE].x, landmarks[mp_pose.PoseLandmark.NOSE].y]
            
            # Calculate angles for posture analysis
            neck_angle = calculate_angle(left_shoulder, nose, right_shoulder)
            left_bend = calculate_angle(left_ear, left_shoulder, nose)
            right_bend = calculate_angle(right_ear, right_shoulder, nose)

            # Determine Posture - using exact same criteria as original code
            if 50 < neck_angle < 90 and left_bend < 40 and right_bend < 40:
                posture_status = "Good Posture"
                posture_score = 100
            else:
                posture_status = "Bad Posture"
                # Calculate a score based on deviation from ideal angles
                angle_deviation = abs(70 - neck_angle) + abs(20 - left_bend) + abs(20 - right_bend)
                posture_score = max(0, 100 - angle_deviation)
                
                # If the score is too low, cap it at a minimum
                posture_score = max(20, posture_score)
        
        except (IndexError, AttributeError) as e:
            print(f"Error analyzing posture landmarks: {e}")
            activity_status = "Partially Active"  # Some landmarks detected but not all
    else:
        # No landmarks detected, user is inactive
        activity_status = "Inactive"
    
    print(f"Posture Analysis - Status: {posture_status}, Neck Angle: {neck_angle}, " 
          f"Left Bend: {left_bend}, Right Bend: {right_bend}, " 
          f"Score: {posture_score}, Activity: {activity_status}")
    
    return {
        'posture_status': posture_status,
        'neck_angle': round(neck_angle, 1),
        'left_bend': round(left_bend, 1),
        'right_bend': round(right_bend, 1),
        'posture_score': round(posture_score),
        'activity_status': activity_status
    }
