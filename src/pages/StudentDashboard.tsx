
import React, { useState, useEffect } from "react";
import CameraFeed from "@/components/CameraFeed";
import EngagementIndicator from "@/components/EngagementIndicator";
import PostureIndicator from "@/components/PostureIndicator";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AlertTriangle, BookOpen } from "lucide-react";

const StudentDashboard = () => {
  const [currentEngagement, setCurrentEngagement] = useState(100);
  const [engagementRemarks, setEngagementRemarks] = useState("");
  const [posture, setPosture] = useState({
    posture_status: "Not detected",
    neck_angle: 0,
    left_bend: 0,
    right_bend: 0,
    posture_score: 100
  });
  const { toast } = useToast();
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleFrame = (frame: string) => {
    console.log("Frame captured for processing");
  };

  const handleFaceDetection = (faces: string[]) => {
    console.log("Faces detected:", faces);
    if (faces.length > 0 && !attendanceMarked) {
      toast({
        title: "Attendance Marked Successfully",
        description: `Welcome ${faces[0]}! Your attendance has been recorded.`,
        duration: 5000,
      });
      setAttendanceMarked(true);
    }
  };

  useEffect(() => {
    if (currentEngagement < 70) {
      toast({
        title: "Low Engagement Alert",
        description: engagementRemarks || "Please stay focused on the class",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [currentEngagement, engagementRemarks, toast]);

  useEffect(() => {
    if (posture.posture_status === "Bad Posture") {
      toast({
        title: "Poor Posture Detected",
        description: "Please sit up straight to improve your posture",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [posture.posture_status, toast]);

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
            
            {currentEngagement < 70 && (
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
              engagement={currentEngagement} 
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
