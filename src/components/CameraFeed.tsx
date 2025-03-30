
import React, { useRef, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, CheckCircle, UserX } from "lucide-react";
import { processFrame } from "@/services/api";

interface CameraFeedProps {
  onFrame: (frame: string) => void;
  onFaceDetection: (faces: string[]) => void;
  onEngagementUpdate?: (score: number, remarks: string) => void;
  onPostureUpdate?: (posture: {
    posture_status: string;
    neck_angle: number;
    left_bend: number;
    right_bend: number;
    posture_score: number;
    activity_status: string;
  }) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
  onFrame, 
  onFaceDetection,
  onEngagementUpdate,
  onPostureUpdate 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const { toast } = useToast();
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentName, setCurrentName] = useState<string>("");
  const [activityStatus, setActivityStatus] = useState<string>("Inactive");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
          toast({
            title: "Camera activated",
            description: "Your camera feed is now active",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, toast]);

  useEffect(() => {
    const captureFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !isActive) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0);

      const frame = canvas.toDataURL("image/jpeg");
      onFrame(frame);

      try {
        console.log("Capturing and processing frame");
        const result = await processFrame(frame);
        console.log("Processed frame result:", result);
        
        setActivityStatus(result.activity_status || "Active");
        
        if (result.faces && result.faces.length > 0) {
          setFaceDetected(true);
          
          const detectedFaceName = result.faces[0];
          setCurrentName(detectedFaceName);
          
          // Only mark attendance for known faces (not "Unknown")
          if (detectedFaceName !== "Unknown" && !attendanceMarked) {
            onFaceDetection(result.faces);
            setAttendanceMarked(true);
            
            // Add colored frame for known faces
            const frameColor = '#4CAF50';
            context.strokeStyle = frameColor;
            context.lineWidth = 3;
            context.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
            
            context.fillStyle = frameColor;
            context.fillRect(50, 20, 200, 30);
            context.fillStyle = 'white';
            context.font = '16px Arial';
            context.fillText(detectedFaceName, 60, 40);
          }
          // Add yellow frame for unknown faces
          else if (detectedFaceName === "Unknown") {
            const frameColor = '#FFC107';
            context.strokeStyle = frameColor;
            context.lineWidth = 3;
            context.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
            
            context.fillStyle = frameColor;
            context.fillRect(50, 20, 200, 30);
            context.fillStyle = 'black';
            context.font = '16px Arial';
            context.fillText("Unknown Person", 60, 40);
          }
        } else {
          setFaceDetected(false);
          setCurrentName("");
        }

        if (onEngagementUpdate && result.engagement !== undefined) {
          onEngagementUpdate(result.engagement, result.remarks || "");
        }

        if (onPostureUpdate) {
          onPostureUpdate({
            posture_status: result.posture_status,
            neck_angle: result.neck_angle,
            left_bend: result.left_bend,
            right_bend: result.right_bend,
            posture_score: result.posture_score,
            activity_status: result.activity_status || "Active"
          });
        }

      } catch (error) {
        console.error("Error processing frame:", error);
      }
    };

    const interval = setInterval(captureFrame, 1000);
    return () => clearInterval(interval);
  }, [isActive, onFrame, onFaceDetection, attendanceMarked, toast, onEngagementUpdate, onPostureUpdate]);

  return (
    <Card className="p-4 w-full bg-white/80 backdrop-blur-sm shadow-xl animate-fadeIn">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg aspect-video bg-gray-100"
        />
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="hidden"
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isActive && (
            <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
              attendanceMarked 
                ? "bg-green-500 text-white"
                : faceDetected 
                  ? currentName === "Unknown"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
            }`}>
              {attendanceMarked ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Marked: {currentName}</span>
                </>
              ) : faceDetected ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {currentName === "Unknown" ? "Unknown Person" : "Face Detected"}
                  </span>
                </>
              ) : (
                <>
                  {activityStatus === "Inactive" ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {activityStatus === "Inactive" ? "No Activity" : "Scanning"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => setIsActive(!isActive)}
          className={`${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          } text-white transition-colors duration-200`}
        >
          <Camera className="w-4 h-4 mr-2" />
          {isActive ? "Stop Camera" : "Start Camera"}
        </Button>
      </div>
    </Card>
  );
};

export default CameraFeed;
