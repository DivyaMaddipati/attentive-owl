
interface ProcessFrameResponse {
  faces: string[];
  engagement: number;
  remarks: string;
  gaze_status: string;
  error?: string;
}

export async function processFrame(frame: string): Promise<ProcessFrameResponse> {
  try {
    const response = await fetch('http://localhost:5000/api/process-frame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ frame }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing frame:', error);
    return {
      faces: [],
      engagement: 100,
      remarks: 'Error processing image',
      gaze_status: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getAttendance() {
  try {
    const response = await fetch('http://localhost:5000/api/get-attendance');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export async function downloadAttendance() {
  try {
    const response = await fetch('http://localhost:5000/api/download-attendance');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.blob();
  } catch (error) {
    console.error('Error downloading attendance:', error);
    throw error;
  }
}
