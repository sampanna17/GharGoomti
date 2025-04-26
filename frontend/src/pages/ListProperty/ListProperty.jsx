
// import "./ListProperty.scss";
// import Filter from "../../components/filter/Filter";
// import Card from "../../components/card/card";
// import Map from "../../components/map/Map";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast, ToastContainer } from "react-toastify";

// function ListPage() {
//     const [properties, setProperties] = useState([]);
//     const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
//     const userData = Cookies.get('user_data') ? JSON.parse(Cookies.get('user_data')) : null;

//     useEffect(() => {
//         const getAllProperties = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/properties');

//                 // Group images by propertyID
//                 const groupedProperties = response.data.reduce((acc, current) => {
//                     const existingProperty = acc.find(p => p.propertyID === current.propertyID);

//                     if (existingProperty) {
//                         existingProperty.images.push({
//                             imageID: current.imageID,
//                             imageURL: current.imageURL
//                         });
//                     } else {
//                         acc.push({
//                             ...current,
//                             images: [{
//                                 imageID: current.imageID,
//                                 imageURL: current.imageURL
//                             }]
//                         });
//                     }
//                     return acc;
//                 }, []);

//                 setProperties(groupedProperties);
//             } catch (error) {
//                 console.error(error);
//                 setProperties();
//             }
//         };

//         getAllProperties();

//         const fetchBookmarkedProperties = async () => {
//             if (userData?.userID) {
//                 try {
//                     const response = await axios.get(`http://localhost:8000/api/bookmark/${userData.userID}`
//                     );
//                     setBookmarkedProperties(response.data.map((property) => property.propertyID)); 
//                 } catch (error) {
//                     console.error("Error fetching bookmarked properties:", error);
//                 }
//             }
//         };

//         fetchBookmarkedProperties();
//     }, [userData]);

//     const handleBookmark = async (propertyID) => {
//         if (!userData?.userID) {
//             alert('Please login to bookmark properties');
//             return;
//         }

//         try {
//             if (bookmarkedProperties.includes(propertyID)) {
//                 // Remove from bookmarks
//                 await axios.delete("http://localhost:8000/api/bookmark", {
//                     data: { userID: userData.userID, propertyID }
//                 });

//                 setBookmarkedProperties(prev => prev.filter(id => id !== propertyID));
//                 toast.success("Bookmark removed successfully!");
//             } else {
//                 // Add to bookmarks
//                 await axios.post(
//                     "http://localhost:8000/api/bookmark",
//                     { userID: userData.userID, propertyID },
//                     { headers: { Authorization: `Bearer ${userData.token}` } }
//                 );
//                 setBookmarkedProperties([...bookmarkedProperties, propertyID]); 
//                 toast.success("Property bookmarked successfully!");
//             }
//         } catch (error) {
//             console.error("Error bookmarking property:", error);
//             toast.error(error.response?.data?.message || "Failed to update bookmark.");
//         }
//     };

//     return (
//         <div className="listPage">
//             <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
//             <div className="listContainer">
//                 <div className="wrapper">
//                     {properties.map(property => (
//                         <Card key={property.propertyID} item={property} onBookmark={handleBookmark} isBookmarked={bookmarkedProperties.includes(property.propertyID)} />
//                     ))}
//                 </div>
//             </div>
//             <div className="mapContainer mt-20">
//                 <Filter />
//                 <Map items={properties} />
//             </div>
//         </div>
//     );
// }

// export default ListPage;


import "./ListProperty.scss";
import Filter from "../../components/filter/filter";
import Card from "../../components/card/card";
import Map from "../../components/map/Map";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "react-router-dom";

function ListPage() {
    const [allProperties, setAllProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
    const [searchParams] = useSearchParams();
    const userData = Cookies.get('user_data') ? JSON.parse(Cookies.get('user_data')) : null;

    useEffect(() => {
        const getAllProperties = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/properties', {
                    params: Object.fromEntries(searchParams)
                });

                const groupedProperties = response.data.reduce((acc, current) => {
                    const existingProperty = acc.find(p => p.propertyID === current.propertyID);

                    if (existingProperty) {
                        existingProperty.images.push({
                            imageID: current.imageID,
                            imageURL: current.imageURL
                        });
                    } else {
                        acc.push({
                            ...current,
                            images: [{
                                imageID: current.imageID,
                                imageURL: current.imageURL
                            }]
                        });
                    }
                    return acc;
                }, []);

                setAllProperties(groupedProperties);
                setFilteredProperties(groupedProperties);
            } catch (error) {
                console.error(error);
                setAllProperties([]);
                setFilteredProperties([]);
            }
        };

        getAllProperties();

        const fetchBookmarkedProperties = async () => {
            if (userData?.userID) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/bookmark/${userData.userID}`);
                    setBookmarkedProperties(response.data.map((property) => property.propertyID));
                } catch (error) {
                    console.error("Error fetching bookmarked properties:", error);
                }
            }
        };

        fetchBookmarkedProperties();
    }, [userData, searchParams]); 


    const handleBookmark = async (propertyID) => {
        if (!userData?.userID) {
            toast.error('Please login to bookmark properties');
            return;
        }

        try {
            if (bookmarkedProperties.includes(propertyID)) {
                await axios.delete("http://localhost:8000/api/bookmark", {
                    data: { userID: userData.userID, propertyID }
                });
                setBookmarkedProperties(prev => prev.filter(id => id !== propertyID));
                toast.success("Bookmark removed successfully!");
            } else {
                await axios.post(
                    "http://localhost:8000/api/bookmark",
                    { userID: userData.userID, propertyID },
                    { headers: { Authorization: `Bearer ${userData.token}` } }
                );
                setBookmarkedProperties([...bookmarkedProperties, propertyID]);
                toast.success("Property bookmarked successfully!");
            }
        } catch (error) {
            console.error("Error bookmarking property:", error);
            toast.error(error.response?.data?.message || "Failed to update bookmark.");
        }
    };

    return (
        <div className="listPage">
            <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
            <div className="listContainer">
                <div className="wrapper">
                    {filteredProperties.map(property => (
                        <Card
                            key={property.propertyID}
                            item={property}
                            onBookmark={handleBookmark}
                            isBookmarked={bookmarkedProperties.includes(property.propertyID)}
                        />
                    ))}
                </div>
            </div>
            <div className="mapContainer mt-16">
                <Filter />
                <Map items={filteredProperties} />
            </div>
        </div>
    );
}

export default ListPage;



