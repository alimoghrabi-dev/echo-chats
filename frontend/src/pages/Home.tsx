import React, { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = `Echo Chats | Home`;
  }, []);

  return (
    <div className="w-full h-full pb-12 flex items-center justify-center text-2xl font-semibold uppercase text-red-500">
      - under development -
    </div>
  );
};

export default Home;
