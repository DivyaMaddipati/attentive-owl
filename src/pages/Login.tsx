
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Users } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (role: 'student' | 'teacher') => {
    // In a real app, this would involve actual authentication
    localStorage.setItem('userRole', role);
    toast({
      title: "Login Successful",
      description: `Logged in as ${role}`,
    });
    navigate(role === 'student' ? '/student' : '/teacher');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-secondary/5 p-6">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white/80 backdrop-blur-sm shadow-xl animate-fadeIn">
        <div className="text-center">
          <GraduationCap className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Virtual Classroom Login
          </h1>
          <p className="text-gray-600 mb-6">Choose your role to proceed</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => handleLogin('student')} 
            className="w-full bg-primary hover:bg-primary/90 h-14 text-lg"
          >
            <Users className="w-5 h-5 mr-2" />
            Login as Student
          </Button>
          
          <Button 
            onClick={() => handleLogin('teacher')} 
            variant="outline" 
            className="w-full h-14 text-lg border-2 hover:bg-secondary/10"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Login as Teacher
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          This is a demo application. No real authentication is required.
        </p>
      </Card>
    </div>
  );
};

export default Login;
