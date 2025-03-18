
# Virtual Classroom Backend

This is the backend service for the Virtual Classroom application, handling face recognition, attendance tracking, engagement monitoring, and posture detection.

## Setup Instructions

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `data` folder and add student face images:
   - Each image should be named with the student's name (e.g., `John_Smith.jpg`)
   - Supported formats: jpg, jpeg, png

5. Run the server:
   ```
   python app.py
   ```

The server will run on http://localhost:5000 by default.

## Features

- **Face Recognition**: Identifies students and marks attendance automatically
- **Engagement Tracking**: Monitors eye gaze to assess student engagement
- **Posture Detection**: Analyzes student posture to encourage healthy sitting habits
- **Attendance Recording**: Stores all attendance records with engagement metrics

## API Endpoints

- **POST /api/process-frame** - Process a webcam frame for face recognition, engagement tracking, and posture analysis
- **GET /api/get-attendance** - Get all attendance records
- **GET /api/download-attendance** - Download attendance as Excel file

## Project Structure

- `app.py` - Main Flask application with API endpoints
- `facial_recognition.py` - Face detection and recognition module
- `posture_detector.py` - Posture analysis using MediaPipe
- `attendance_tracker.py` - Attendance recording and management
