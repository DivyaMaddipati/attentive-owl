
import React from "react";
import { Card } from "@/components/ui/card";
import { ScanLine, ArrowUpRight, AlertTriangle, CheckCircle } from "lucide-react";

interface PostureIndicatorProps {
  posture: {
    posture_status: string;
    neck_angle: number;
    left_bend: number;
    right_bend: number;
    posture_score: number;
  };
}

const PostureIndicator: React.FC<PostureIndicatorProps> = ({ posture }) => {
  const getPostureColor = (status: string) => {
    if (status === "Good Posture") return "bg-green-500";
    if (status === "Bad Posture") return "bg-red-500";
    return "bg-gray-400";
  };

  const getPostureIcon = (status: string) => {
    if (status === "Good Posture") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "Bad Posture") return <AlertTriangle className="w-5 h-5 text-red-500" />;
    return <ScanLine className="w-5 h-5 text-gray-500" />;
  };

  const getAngleIndicator = (angle: number, idealMin: number, idealMax: number) => {
    const isIdeal = angle >= idealMin && angle <= idealMax;
    return (
      <span className={`text-sm font-bold ${isIdeal ? "text-green-500" : "text-red-500"}`}>
        {angle}°
      </span>
    );
  };

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg animate-fadeIn border-t-4 transition-colors duration-300" 
          style={{ borderTopColor: posture.posture_status === "Good Posture" ? '#22c55e' : posture.posture_status === "Bad Posture" ? '#ef4444' : '#9ca3af' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-700">Posture Analysis</h3>
        </div>
        {getPostureIcon(posture.posture_status)}
      </div>
      
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${getPostureColor(posture.posture_status)} transition-all duration-500 ease-out`}
          style={{ width: `${posture.posture_score}%` }}
        />
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{posture.posture_status}</span>
        <span className="text-sm font-bold text-gray-700">{posture.posture_score}%</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Neck Angle</p>
          {getAngleIndicator(posture.neck_angle, 50, 90)}
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Left Bend</p>
          {getAngleIndicator(posture.left_bend, 0, 40)}
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Right Bend</p>
          {getAngleIndicator(posture.right_bend, 0, 40)}
        </div>
      </div>

      {posture.posture_status === "Bad Posture" && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 animate-pulse">
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Please improve your sitting posture
          </p>
        </div>
      )}
    </Card>
  );
};

export default PostureIndicator;
