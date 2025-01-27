import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Navbar from "../../components/AdminNav";
import Sidebar from "../../components/Sidebar";
import PaginationComponent from "../../components/PaginationComponent";

const PropertyDetails = () => {
    const properties = [
    ];

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [paginatedProperties, setPaginatedProperties] = useState(properties.slice(0, 8));

    const handlePageChange = (newPaginatedItems) => {
        setPaginatedProperties(newPaginatedItems);  // Update the paginated properties in the state
    };

    const handleRowClick = (property) => {
        setSelectedProperty(property);
        setCurrentImageIndex(0); // Reset slider when opening modal
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
        setCurrentImageIndex(0);
    };

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0
                ? selectedProperty.images.length - 1
                : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === selectedProperty.images.length - 1
                ? 0
                : prevIndex + 1
        );
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-6">Properties</h1>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-left">Property Name</th>
                                    <th className="p-3 text-left">Price</th>
                                    <th className="p-3 text-left">Location</th>
                                    <th className="p-3 text-left">Seller</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProperties.map((property) => (
                                    <tr
                                        key={property.id}
                                        className="border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowClick(property)}
                                    >
                                        <td className="p-3">{property.title}</td>
                                        <td className="p-3">{property.price}</td>
                                        <td className="p-3">{property.location}</td>
                                        <td className="p-3">{property.seller}</td>
                                        <td className="p-3">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Edit property: ${property.title}`);
                                                    }}
                                                >
                                                    <FaEdit className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Delete property: ${property.title}`);
                                                    }}
                                                >
                                                    <FaTrash className="mr-1" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Reusable Pagination Component */}
                        <PaginationComponent
                            allItems={properties}
                            itemsPerPage={8}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>

                {isModalOpen && selectedProperty && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                        onClick={handleOutsideClick}
                    >
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-4 sm:p-6 relative animate-fadeIn">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg sm:text-xl font-bold">{selectedProperty.title}</h2>
                                <button
                                    className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
                                    onClick={handleCloseModal}
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Image Slider Section */}
                            <div className="relative mb-3">
                                <button
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                                    onClick={handlePrevImage}
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                                <img
                                    src={selectedProperty.images[currentImageIndex]}
                                    alt={`Property ${currentImageIndex + 1}`}
                                    className="rounded-lg w-full h-40 sm:h-56 object-cover"
                                />
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60"
                                    onClick={handleNextImage}
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>

                            {/* Property Details */}
                            <div className="space-y-2">
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Price</h3>
                                    <p className="text-sm sm:text-base text-gray-600">{selectedProperty.price}</p>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Location</h3>
                                    <p className="text-sm sm:text-base text-gray-600">{selectedProperty.location}</p>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Seller</h3>
                                    <p className="text-sm sm:text-base text-gray-600">{selectedProperty.seller}</p>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold">Description</h3>
                                    <p className="text-sm sm:text-base text-gray-600">{selectedProperty.description}</p>
                                </div>
                            </div>

                            {/* Close Button */}
                            <div className="mt-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-600 w-full"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetails;
