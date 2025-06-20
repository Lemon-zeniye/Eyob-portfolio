// import logo from "../assets/logo_2.png";
// import { ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
import LoginForm from "@/components/Forms/LoginForm";
import bgImage from "../../assets/bg.png";
import logo from "../../assets/logo.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";
import img6 from "../../assets/img6.png";
import img7 from "../../assets/img7.png";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Login: React.FC = () => {
  const handleClick = () => {
    window.open("https://www.akilocorp.com/", "_blank");
  };
  return (
    <>
      <div
        className="flex lg:hidden max-w-md mx-auto flex-col min-h-screen bg-cover bg-center overflow-y-hidden  bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <LoginForm />
      </div>

      <div className="hidden lg:flex flex-row justify-between h-screen overflow-y-hidden">
        <div
          className="lg:w-1/2 hidden bg-primary2 lg:block bg-cover bg-center overflow-y-hidden  bg-no-repeat px-2"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="flex justify-end items-center">
            <img src={logo} className="w-32 h-32 shrink-0" alt="Logo" />
            <div className="flex-1">
              <p className="text-4xl bg-gradient-to-br from-black to-primary2 bg-clip-text text-transparent leading-10">
                Akilo Consultancy Corporation
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-1 relative h-[21rem] rounded-lg">
              <ImageSwapper />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <img
                src={img7}
                alt="img7"
                className="w-[22rem] h-[13rem] object-cover rounded-lg "
              />
            </div>
          </div>
          <div className="w-full space-y-3 px-4 mt-1">
            <h1 className="text-4xl bg-gradient-to-br from-primary2 to-black bg-clip-text text-transparent leading-10">
              Who We Are
            </h1>
            <p>
              We're a team of innovators, thinkers, and makers dedicated to
              harnessing the power of technology to transform businesses and
              lives. With a passion for problem-solving and a commitment to
              excellence, we craft custom solutions that drive growth,
              efficiency, and success. From strategy to implementation, we
              partner with our clients to turn their vision into reality,
              empowering them to achieve their full potential in a rapidly
              changing world.
            </p>
            <button
              className="px-4 py-2 rounded-full bg-primary2 hover:bg-primary2/70 text-white"
              onClick={handleClick}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center py-14 px-8r justify-center bg-white">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;

const ImageSwapper = () => {
  const images = [img4, img5, img6]; // Your image imports
  const [currentImages, setCurrentImages] = useState([0, 1, 2]); // Indexes of images
  const positions = [
    { className: "top-0 left-0", initial: { x: -50, y: -50 } },
    {
      className: "top-1/2 -right-10 transform -translate-y-1/2",
      initial: { x: 50, y: 0 },
    },
    { className: "bottom-0 left-0", initial: { x: -50, y: 50 } },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate the images (move each to the next position)
      setCurrentImages((prev) => [prev[2], prev[0], prev[1]]);
    }, 5000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-1 relative h-[21rem] rounded-lg px-2">
      <AnimatePresence mode="wait">
        {currentImages.map((imgIndex, positionIndex) => (
          <motion.div
            key={`${imgIndex}-${positionIndex}-${Date.now()}`} // Unique key for smoother re-renders
            className={`absolute w-[16rem] h-[10rem] ${positions[positionIndex].className} z-10`}
            initial={{
              opacity: 0,
              x: positions[positionIndex].initial.x * 0.7, // Reduced initial offset
              y: positions[positionIndex].initial.y * 0.7,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                delay: positionIndex * 0.15, // Staggered delay
                type: "spring",
                damping: 15, // Less bouncy
                stiffness: 50, // Softer spring
              },
            }}
            exit={{
              opacity: 0,
              x: positions[positionIndex].initial.x * 0.5,
              y: positions[positionIndex].initial.y * 0.5,
              transition: { duration: 0.6 },
            }}
            transition={{
              duration: 0.8,
              type: "spring",
              damping: 15,
              stiffness: 100,
            }}
            whileHover={{ scale: 1.03 }} // More subtle hover effect
          >
            <motion.img
              src={images[imgIndex]}
              alt={`img-${imgIndex}`}
              className="w-full h-full object-cover rounded-lg"
              layoutId={`img-${imgIndex}`}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
