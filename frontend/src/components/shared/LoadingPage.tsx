import { Heart } from "lucide-react";
import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-50">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
      <p className="text-lg text-neutral-700 font-medium animate-pulse mt-6">
        Connecting to your chats...
      </p>
      <div className="absolute bottom-10 text-center text-neutral-500 text-xs font-normal">
        <p className="flex items-center justify-center gap-x-1.5">
          Powered by Ali Moghrabi{" "}
          <Heart size={14} className="text-red-500 fill-red-500" />
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
