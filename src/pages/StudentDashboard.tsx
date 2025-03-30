
import React, { useState, useEffect } from "react";
import CameraFeed from "@/components/CameraFeed";
import EngagementIndicator from "@/components/EngagementIndicator";
import PostureIndicator from "@/components/PostureIndicator";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AlertTriangle, BookOpen, UserX } from "lucide-react";

const StudentDashboard = () => {
  const [currentEngagement, setCurrentEngagement] = useState(0);
  const [engagementRemarks, setEngagementRemarks] = useState("");
  const [posture, setPosture] = useState({
    posture_status: "Not detected",
    neck_angle: 0,
    left_bend: 0,
    right_bend: 0,
    posture_score: 0,
    activity_status: "Inactive"
  });
  const { toast } = useToast();
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [unknownPersonDetected, setUnknownPersonDetected] = useState(false);

  const handleFrame = (frame: string) => {
    console.log("Frame captured for processing");
  };

  const handleFaceDetection = (faces: string[]) => {
    console.log("Faces detected:", faces);
    if (faces.length > 0) {
      if (faces[0] !== "Unknown" && !attendanceMarked) {
        toast({
          title: "Attendance Marked Successfully",
          description: `Welcome ${faces[0]}! Your attendance has been recorded.`,
          duration: 5000,
        });
        setAttendanceMarked(true);
        setUnknownPersonDetected(false);
      } else if (faces[0] === "Unknown") {
        setUnknownPersonDetected(true);
        toast({
          title: "Unknown Person Detected",
          description: "You are not registered in the system.",
          variant: "warning",
          duration: 5000,
        });
      }
    }
  };

  useEffect(() => {
    if (currentEngagement < 70 && currentEngagement > 0 && posture.activity_status !== "Inactive") {
      toast({
        title: "Low Engagement Alert",
        description: engagementRemarks || "Please stay focused on the class",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [currentEngagement, engagementRemarks, toast, posture.activity_status]);

  useEffect(() => {
    if (posture.posture_status === "Bad Posture" && posture.activity_status !== "Inactive") {
      toast({
        title: "Poor Posture Detected",
        description: "Please sit up straight to improve your posture",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [posture.posture_status, toast, posture.activity_status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Virtual Classroom</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <CameraFeed 
              onFrame={handleFrame} 
              onFaceDetection={handleFaceDetection}
              onEngagementUpdate={(score, remarks) => {
                setCurrentEngagement(score);
                setEngagementRemarks(remarks);
                console.log("Engagement updated:", score, remarks);
              }}
              onPostureUpdate={(postureData) => {
                setPosture(postureData);
                console.log("Posture updated:", postureData);
              }}
            />
            
            {posture.activity_status === "Inactive" && (
              <Card className="p-4 bg-gray-50 border-gray-200 animate-slideUp">
                <div className="flex items-center gap-2 text-gray-700">
                  <UserX className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    No activity detected. Please position yourself in front of the camera.
                  </p>
                </div>
              </Card>
            )}
            
            {unknownPersonDetected && (
              <Card className="p-4 bg-yellow-50 border-yellow-200 animate-slideUp">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    Unknown person detected. Please register to mark attendance.
                  </p>
                </div>
              </Card>
            )}
            
            {currentEngagement < 70 && currentEngagement > 0 && posture.activity_status !== "Inactive" && (
              <Card className="p-4 bg-red-50 border-red-200 animate-slideUp">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-medium">
                    {engagementRemarks || "Your engagement level is low. Please focus on the class."}
                  </p>
                </div>
              </Card>
            )}
          </div>
          
          <div className="space-y-4">
            <EngagementIndicator 
              engagement={posture.activity_status === "Inactive" ? 0 : currentEngagement} 
              remarks={engagementRemarks}
            />
            
            <PostureIndicator posture={posture} />
            
            {attendanceMarked && (
              <Card className="p-4 bg-green-50 border-green-200">
                <p className="text-sm text-green-700">
                  Your attendance has been recorded for today's session.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
