const SellerImageViewer = ({ imageUrl, fullName, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          {/* Viewer content */}
          <div className="p-8 flex flex-col items-center">
            <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg mb-6">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${fullName}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.initials-fallback').style.display = 'flex';
                  }}
                />
              ) : null}
              {!imageUrl && (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center initials-fallback">
                  <span className="text-5xl font-semibold text-gray-700">
                    {fullName?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-center text-2xl font-medium text-gray-800 mb-2">
              {fullName}
            </p>
        
          </div>
        </div>
      </div>
    );
  };
  
  export default SellerImageViewer;