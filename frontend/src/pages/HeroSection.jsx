import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Frame from "../assets/Frame.png";
import Hero from "../assets/hero.png";
import SideHero from "../assets/hero1.png";
import ImageLoop from "../components/ImgaeLoop";

export const HeroSection = () => {
    const controls = useAnimation();
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: false,  
    });

    useEffect(() => {
        if (inView) {
            controls.start({ opacity: 1, y: 0 });
        } else {
            controls.start({ opacity: 0, y: 60 });
        }
    }, [controls, inView]);

    return (
        <>
            <div
                className="w-full h-[515px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative"
                style={{ backgroundImage: `url(${Frame})` }}
            >
                <div className="-mt-48">
                    <motion.button 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                    >
                        LET US GUIDE YOUR HOME
                    </motion.button>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        className="mt-6 text-[#1B4B40] text-lg font-medium"
                    >
                        We have more apartments, places & plots.
                    </motion.p>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        className="text-[#1B4B40] text-5xl font-medium mt-4 mb-8"
                    >
                        Find Your Perfect Home
                    </motion.h1>
                </div>

                {/* Bottom Center Content */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <p className="text-[#1B4B40] text-lg font-medium">
                        Explore all the properties
                    </p>
                </div>
            </div>
            <ImageLoop/>

            <motion.div
                ref={ref}
                animate={controls}
                initial={controls}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-2 lg:px-20 py-8 overflow-x-hidden w-full"
            >
                {/* Left Image Section */}
                <div className="flex-1 flex flex-col items-center">
                    <img
                        className="w-full max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-md xl:max-w-md h-auto object-contain mt-10 lg:mt-0 -ml-52"
                        src={SideHero}
                        alt="Side Hero"
                    />
                    <p className="-mt-16 text-gray-600 text-lg sm:text-xl mr-20 font-['Playfair_Display']">
                        Explore the best real estate deals with ease and confidence.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="mt-8 flex justify-center lg:justify-start w-full">
                        <img
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain -mt-20"
                            src={Hero}
                            alt="Hero"
                        />
                    </div>
                    <h1 className="text-xl sm:text-4xl md:text-5xl text-gray-700 leading-tight -mt-8 ml-4 font-['Playfair_Display']">
                        Find Your Dream Property
                    </h1>
                </div>
            </motion.div>
        </>
    );
};
