
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Camera, Users, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 p-6 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-10 animate-fadeIn">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 px-3 py-1 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Virtual Classroom</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Attendance & Engagement System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An intelligent classroom solution that uses facial recognition to track attendance and monitor student engagement in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 my-12">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Facial Recognition</h3>
            </div>
            <p className="text-gray-600">
              Automatically identifies students and marks attendance without manual intervention.
            </p>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Engagement Tracking</h3>
            </div>
            <p className="text-gray-600">
              Monitors student attention and engagement levels during class sessions.
            </p>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Teacher Dashboard</h3>
            </div>
            <p className="text-gray-600">
              Comprehensive view of student attendance and engagement metrics for instructors.
            </p>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Student Portal</h3>
            </div>
            <p className="text-gray-600">
              Personalized interface for students to view their attendance and engagement feedback.
            </p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            size="lg" 
            className="bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
