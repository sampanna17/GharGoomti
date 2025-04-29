
import { useState, useEffect } from "react";
import { FaTrash, FaBed, FaBath, FaRulerCombined, FaSpinner } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import Navbar from "../../components/AdminNav";
import Sidebar from "../../components/AdminSideBar";
import PaginationComponent from "../../components/PaginationComponent";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import NumberFormat from "../../components/FormatNumber";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";

const PropertyDetails = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [paginatedProperties, setPaginatedProperties] = useState([]);

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        propertyId: null,
        propertyName: ""
    });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/allproperty');
                console.log("Raw response data:", response.data);

                // No need to group — use directly
                const groupedProperties = response.data;

                console.log("Grouped properties with images:", groupedProperties);

                setProperties(groupedProperties);
                setPaginatedProperties(groupedProperties.slice(0, 4));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error("Failed to load properties");
            }
        };

        fetchProperties();
    }, []);

    useEffect(() => {
        setPaginatedProperties(properties.slice(0, 4));
      }, [properties]);

    const handlePageChange = (newPaginatedItems) => {
        setPaginatedProperties(newPaginatedItems);
    };

    const handleRowClick = (property) => {
        setSelectedProperty(property);
        setCurrentImageIndex(0);
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

    const handleDeleteClick = (propertyId, propertyName, e) => {
        e.stopPropagation();
        setDeleteModal({
            isOpen: true,
            propertyId,
            propertyName
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            propertyId: null,
            propertyName: ""
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/property/${deleteModal.propertyId}`);
            setProperties(properties.filter(p => p.propertyID !== deleteModal.propertyId));
            toast.success("Property deleted successfully");

            // Also check if we're viewing the deleted property in the modal
            if (selectedProperty && selectedProperty.propertyID === deleteModal.propertyId) {
                handleCloseModal();
            }
        } catch{
            toast.error("Failed to delete property");
        } finally {
            handleDeleteCancel();
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4 mx-auto" />
                            <p className="text-gray-600">Loading properties...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                 <ToastContainer position="top-right" autoClose={3000} limit={1} newestOnTop={false} closeOnClick pauseOnHover />
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
                            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Properties</h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
                            <div className="text-sm text-gray-500">
                                {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                            </div>
                        </div>

                        {properties.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                                <th className="p-3 text-left font-medium w-20">Image</th>
                                                <th className="p-3 text-left font-medium">Property</th>
                                                <th className="p-3 text-left font-medium">Price</th>
                                                <th className="p-3 text-left font-medium">Location</th>
                                                <th className="p-3 text-left font-medium">Status</th>
                                                <th className="p-3 text-left font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {paginatedProperties.map((property) => (
                                                <tr
                                                    key={property.propertyID}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => handleRowClick(property)}
                                                >
                                                    <td className="p-3">
                                                        <div className="w-32 h-20 flex-shrink-0">
                                                            {property.images.length > 0 ? (
                                                                <img
                                                                    src={property.images[0].imageUrl}
                                                                    alt={`${property.title}`}
                                                                    className="w-full h-full object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                                    <FiMapPin className="text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div>
                                                                <div className="font-medium text-gray-900">{property.title}</div>
                                                                <div className="text-xs text-gray-500 flex items-center">
                                                                    <FaBed className="mr-1" /> {property.bedrooms} beds
                                                                    <FaBath className="ml-2 mr-1" /> {property.bathrooms} baths
                                                                    <FaRulerCombined className="ml-2 mr-1" /> {property.area} sqft
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-gray-700">
                                                        NPR. <NumberFormat value={property.price.toLocaleString()} />
                                                        {property.status === 'Rent' && ' /month'}

                                                    </td>
                                                    <td className="p-3 text-gray-700">
                                                        <div className="flex items-center">
                                                            <FiMapPin className="mr-1 text-gray-400" />
                                                            {property.location}
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${property.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : property.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {property.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex space-x-2">

                                                        
                                                            <button
                                                                className="text-red-500 hover:text-red-700 flex items-center text-sm p-2 hover:bg-red-50 rounded"
                                                                onClick={(e) => handleDeleteClick(
                                                                    property.propertyID,
                                                                    property.title,
                                                                    e
                                                                )}
                                                            >
                                                                <FaTrash className="mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="">
                                    <PaginationComponent
                                        allItems={properties}
                                        itemsPerPage={4}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FiMapPin className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    There are currently no properties listed. Add a new property to get started.
                                </p>
                                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                    Add Property
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Property Detail Modal */}
            {isModalOpen && selectedProperty && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-50"
                    onClick={handleOutsideClick}
                >
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 sm:p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedProperty.title}</h2>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <FiMapPin className="mr-1" />
                                    {selectedProperty.location}
                                </div>
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-500 text-2xl"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Image Gallery Section */}
                        <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-100">
                            {selectedProperty.images.length > 0 ? (
                                <>
                                    <div className="w-full max-h-[450px] flex justify-center bg-gray-100">
                                        <img
                                            src={selectedProperty.images[currentImageIndex].imageUrl}
                                            alt={`Property ${currentImageIndex + 1}`}
                                            className="h-full w-auto object-contain"
                                        />
                                    </div>

                                    {selectedProperty.images.length > 1 && (
                                        <>
                                            <button
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                onClick={handlePrevImage}
                                            >
                                                <FiChevronLeft size={20} />
                                            </button>
                                            <button
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                onClick={handleNextImage}
                                            >
                                                <FiChevronRight size={20} />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                        {selectedProperty.images.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                                aria-label={`Go to image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-gray-200 text-gray-400">
                                    <FiMapPin size={48} />
                                </div>
                            )}
                        </div>

                        {/* Property Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold mb-3">Description</h3>
                                <p className="text-gray-600">
                                    {selectedProperty.description || 'No description provided.'}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-gray-500 text-sm">Property Type</div>
                                        <div className="font-medium">
                                            {selectedProperty.type || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-gray-500 text-sm">Status</div>
                                        <div className="font-medium capitalize">
                                            {selectedProperty.status || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-gray-500 text-sm">Pet Policy</div>
                                        <div className="font-medium capitalize">
                                            {selectedProperty.petPolicy || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-gray-500 text-sm">Area</div>
                                        <div className="font-medium capitalize">
                                            {selectedProperty.area || 'N/A'} sqft
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Price:</span>
                                        <span className="font-medium">
                                            NPR. <NumberFormat value={selectedProperty.price ? selectedProperty.price.toLocaleString() : 'N/A'} />

                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bedrooms:</span>
                                        <span className="font-medium">
                                            {selectedProperty.bedrooms || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bathrooms:</span>
                                        <span className="font-medium">
                                            {selectedProperty.bathrooms || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Seller Information</h4>
                                        <div className="text-gray-600">
                                            {selectedProperty.seller || 'N/A'}
                                        </div>
                                        <div className="text-gray-600">
                                            {selectedProperty.sellerEmail || 'N/A'}
                                        </div>
                                        <div className="text-gray-600">
                                            {selectedProperty.sellerContact || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                propertyName={deleteModal.propertyName}
            />
        </div>
    );
};

export default PropertyDetails;