
# Virtual Classroom Backend

This is the backend service for the Virtual Classroom application, handling face recognition, attendance tracking, and engagement monitoring.

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

## API Endpoints

- **POST /api/process-frame** - Process a webcam frame for face recognition and engagement tracking
- **GET /api/get-attendance** - Get all attendance records
- **GET /api/download-attendance** - Download attendance as Excel file
