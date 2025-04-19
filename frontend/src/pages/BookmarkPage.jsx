import Filter from "../components/filter/filter";
import Card from "../components/card/card";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast ,ToastContainer} from "react-toastify";

function BookmarkPage() {
  const [properties, setProperties] = useState([]);
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const userData = Cookies.get('user_data') ? JSON.parse(Cookies.get('user_data')) : null;

  useEffect(() => {
    const fetchBookmarkedProperties = async () => {
      if (userData?.userID) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/bookmark/${userData.userID}`,
            {
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          );

          const formattedProperties = response.data.map(property => ({
            ...property,
            images: property.images ? property.images.map(img => ({ imageURL: img })) : []
          }));

          setProperties(formattedProperties);
          setBookmarkedProperties(formattedProperties.map(p => p.propertyID));
        } catch (error) {
          console.error("Error fetching bookmarked properties:", error);
          toast.error("Failed to load bookmarks");
        }
      }
    };

    fetchBookmarkedProperties();
  }, [userData]);

  const handleBookmark = async (propertyID) => {
    if (!userData?.userID) {
      toast.error('Please login to bookmark properties');
      return;
    }

    try {
      if (bookmarkedProperties.includes(propertyID)) {
        await axios.delete("http://localhost:8000/api/bookmark", {
          data: { userID: userData.userID, propertyID },
          headers: { Authorization: `Bearer ${userData.token}` }
        });

        setProperties(prev => prev.filter(p => p.propertyID !== propertyID));
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
      console.error("Error updating bookmark:", error);
      toast.error(error.response?.data?.message || "Failed to update bookmark");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center p-10 overflow-hidden">
      <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
      <div className="w-5/6 flex-2 max-h-[90%] h-full overflow-y-auto pr-5 mt-28 
                  scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-600">

        <div className="h-auto flex flex-col gap-12 pb-12">
          <Filter />
          {properties.length > 0 ? (
            properties.map(property => (
              <Card
                key={property.propertyID}
                item={property}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedProperties.includes(property.propertyID)}
              />
            ))
          ) : (
            <div className="w-full text-center py-10 ">
              <h3 className="text-xl mb-4 text-gray-800">No bookmarked properties yet</h3>
              <p className="text-gray-600">Save properties you like and they'll appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkPage;