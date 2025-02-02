import { useEffect, useState, useCallback } from 'react';
import { CiDesktopMouse2 } from "react-icons/ci";
import { FaChevronUp } from "react-icons/fa";

const GotoTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    // Handle scroll-to-top logic
    const goToBtn = useCallback(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

    const listenToScroll = useCallback(() => {
        const scrollThreshold = 20;
        const winScroll = document.documentElement.scrollTop;

        setIsVisible(winScroll > scrollThreshold);

        if (!hasScrolled && winScroll > 0) {
            setHasScrolled(true);
        }
    }, [hasScrolled]);

    // Adding the scroll event listener
    useEffect(() => {
        const handleScroll = debounce(listenToScroll, 50);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [listenToScroll]);

    // Debounce utility function
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    return (
        <div className="flex justify-center items-center relative">
            {isVisible && (
                <div
                    className={`top-btn fixed bottom-12 right-4 flex flex-col justify-center items-center cursor-pointer opacity-0 transform transition-all duration-300 ease-in-out 
                        ${hasScrolled ? 'opacity-100 translate-y-0' : 'translate-y-5'}`}
                    onClick={goToBtn}
                >
                    <FaChevronUp className="w-4 h-4 text-blue-600 animate-upArrow" style={{ animationDelay: '0.4s' }} />
                    <FaChevronUp className="w-4 h-4 text-blue-600 animate-upArrow" style={{ animationDelay: '0.2s' }} />
                    <CiDesktopMouse2 className="w-8 h-8 text-blue-600 mt-1" /> {/* Static Mouse Icon */}
                </div>
            )}
        </div>
    );
};

export default GotoTop;
