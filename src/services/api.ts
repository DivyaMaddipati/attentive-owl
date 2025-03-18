
interface ProcessFrameResponse {
  faces: string[];
  engagement: number;
  remarks: string;
  gaze_status: string;
  posture_status: string;
  neck_angle: number;
  left_bend: number;
  right_bend: number;
  posture_score: number;
  error?: string;
}

export async function processFrame(frame: string): Promise<ProcessFrameResponse> {
  try {
    console.log("Sending frame to backend for processing");
    const response = await fetch('http://localhost:5000/api/process-frame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame }),
    });

    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from backend:", data);
    return data;
  } catch (error) {
    console.error('Error processing frame:', error);
    return {
      faces: [],
      engagement: 100,
      remarks: 'Error processing image',
      gaze_status: 'unknown',
      posture_status: 'Not detected',
      neck_angle: 0,
      left_bend: 0,
      right_bend: 0,
      posture_score: 100,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getAttendance() {
  try {
    console.log("Fetching attendance data from backend");
    const response = await fetch('http://localhost:5000/api/get-attendance');
    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Received attendance data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function downloadAttendance() {
  try {
    console.log("Requesting attendance download from backend");
    const response = await fetch('http://localhost:5000/api/download-attendance');
    if (!response.ok) {
      console.error(`Backend error: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.blob();
  } catch (error) {
    console.error('Error downloading attendance:', error);
    throw error;
  }
}
