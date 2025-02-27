import { useEffect, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";

const ResponsiveToastContainer = () => {
  const [position, setPosition] = useState<"bottom-right" | "top-center">(
    "bottom-right"
  );

  useEffect(() => {
    const updatePosition = () => {
      setPosition(window.innerWidth < 600 ? "top-center" : "bottom-right");
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <ToastContainer
      position={position}
      autoClose={3000}
      pauseOnHover
      theme="dark"
      transition={Bounce}
      draggable
      limit={1}
    />
  );
};

export default ResponsiveToastContainer;
