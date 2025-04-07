
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, AlertTriangle, CheckCircle, Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendance, downloadAttendance, resetSession, getCurrentSession } from "@/services/api";

interface AttendanceRecord {
  date: string;
  session: string;
  name: string;
  status: string;
  engagement: number;
  remarks: string;
  posture: string;
}

const TeacherDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  // Get current session on load
  useQuery({
    queryKey: ['currentSession'],
    queryFn: getCurrentSession,
    onSettled: (data) => {
      if (data) {
        setCurrentSessionId(data);
      }
    }
  });

  // Get attendance data for the current session
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance', currentSessionId],
    queryFn: () => getAttendance(currentSessionId),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Mutation for resetting the session
  const resetSessionMutation = useMutation({
    mutationFn: resetSession,
    onSuccess: (newSessionId) => {
      setCurrentSessionId(newSessionId);
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "New Session Started",
        description: "Previous attendance records have been archived and a new session has begun.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start a new session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleResetSession = () => {
    resetSessionMutation.mutate();
  };

  const handleDownloadAttendance = async () => {
    try {
      const blob = await downloadAttendance();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Attendance report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download attendance report",
        variant: "destructive",
      });
    }
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return "bg-green-100 border-green-500 text-green-700";
    if (engagement >= 60) return "bg-yellow-100 border-yellow-500 text-yellow-700";
    return "bg-red-100 border-red-500 text-red-700";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading attendance data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={handleResetSession} 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              disabled={resetSessionMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${resetSessionMutation.isPending ? 'animate-spin' : ''}`} />
              {resetSessionMutation.isPending ? 'Starting New Session...' : 'Start New Session'}
            </Button>
            <Button onClick={handleDownloadAttendance} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>
          </div>
        </div>
        
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Student Attendance & Engagement</h2>
            </div>
            <div className="text-sm text-gray-500">
              Current Session: {currentSessionId ? new Date(currentSessionId.slice(0, 4) + '-' + currentSessionId.slice(4, 6) + '-' + currentSessionId.slice(6, 8) + ' ' + currentSessionId.slice(8, 10) + ':' + currentSessionId.slice(10, 12) + ':' + currentSessionId.slice(12, 14)).toLocaleString() : 'Loading...'}
            </div>
          </div>
          
          <div className="space-y-4">
            {attendanceData?.map((record: AttendanceRecord, index: number) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg ${getEngagementColor(record.engagement)} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{record.name}</h3>
                    <p className="text-sm opacity-75">Date: {record.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Engagement Score</p>
                      <p className="text-2xl font-bold">{record.engagement}%</p>
                    </div>
                    {record.engagement < 70 ? (
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Engagement Status:</p>
                    <p className="text-sm">{record.remarks}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Posture Status:
                    </p>
                    <p className="text-sm">{record.posture || "Not recorded"}</p>
                  </div>
                </div>
              </div>
            ))}

            {(!attendanceData || attendanceData.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No attendance records found for the current session
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
