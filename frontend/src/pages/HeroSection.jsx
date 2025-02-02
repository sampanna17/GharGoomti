import Frame from '../assets/Frame.png';

export const HeroSection = () => {
    return (
        <div
            className="w-full h-[515px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative"
            style={{ backgroundImage: `url(${Frame})` }}
        >
            <div className="-mt-40">
                <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-colors">
                    LET US GUIDE YOUR HOME
                </button>
                <p className="mt-6 text-[#1B4B40] text-lg font-medium">
                    We have more apartments, places & plots.
                </p>
                <h1 className="text-[#1B4B40] text-5xl font-medium mt-4 mb-8">
                    Find Your Perfect Home
                </h1>
            </div>

            {/* Bottom Center Content */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <p className="text-[#1B4B40] text-lg font-medium">
                    Explore all the properties
                </p>
            </div>
        </div>
    );
};
