import "./singlePage.scss";
import Slider from "../../components/Slider";
import NumberFormat from "../../components/FormatNumber";
import Map from "../../components/Map";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pin from "../../assets/SinglePage/pin.png";
import Pet from "../../assets/SinglePage/animal.png";
import Area from "../../assets/SinglePage/wide.png";
import Longitude from "../../assets/SinglePage/longitude.png";
import Latitude from "../../assets/SinglePage/latitude.png";
import Kitchen from "../../assets/SinglePage/Kitchen.png";
import Hall from "../../assets/SinglePage/living.png";
import Bathroom from "../../assets/SinglePage/toilet.png";
import Beds from "../../assets/SinglePage/bedroom.png";
import Chat from "../../assets/SinglePage/chat.png";
import Bookmark from "../../assets/SinglePage/bookmark.png";
import Calendar from "../../assets/SinglePage/calendar.png";
import PropertyFor from "../../assets/SinglePage/property-for.png";
import PropertyType from "../../assets/SinglePage/property-type.png";
import BookmarkFilled from "../../assets/bookmarkfilled.png";
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

function SinglePage() {

    const { id } = useParams();

    const [property, setProperty] = useState(null)
    const [pImage, setPImage] = useState(null)
    const [user, setUser] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const userData = Cookies.get('user_data') ? JSON.parse(Cookies.get('user_data')) : null;

    useEffect(() => {

        const getUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/property/${id}/user`);
                setUser(res.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const getsingleproperty = async () => {
            const res = await axios.get(`http://localhost:8000/api/property/${id}`)
            setProperty(res.data);
        }

        const getallimages = async () => {
            const res = await axios.get(`http://localhost:8000/api/property/${id}/images`)
            setPImage(res.data);
        }

        const checkBookmarkStatus = async () => {
            if (userData?.userID) {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/bookmark/check/${userData.userID}/${id}`
                    );
                    setIsBookmarked(response.data.isBookmarked);
                } catch (error) {
                    console.error("Error checking bookmark status:", error);
                }
            }
        };

        checkBookmarkStatus();

        getsingleproperty();
        getallimages();
        getUserDetails();

    }, [id, userData])

    const [visitDate, setVisitDate] = useState("");

    const handleSave = async () => {
        if (!userData?.userID) {
            toast.error("Please login to bookmark properties");
            return;
        }

        try {
            if (isBookmarked) {
                // Remove bookmark
                await axios.delete("http://localhost:8000/api/bookmark", {
                    data: {
                        userID: userData.userID,
                        propertyID: id
                    }
                });
                setIsBookmarked(false);
                toast.success("Bookmark removed successfully!");
            } else {
                // Add bookmark
                await axios.post(
                    "http://localhost:8000/api/bookmark",
                    { userID: userData.userID, propertyID: id },
                );
                setIsBookmarked(true);
                toast.success("Property bookmarked successfully!");
            }
        } catch (error) {
            console.error("Error updating bookmark:", error);
            toast.error("Failed to update bookmark");
        }
    };

    const handleDateChange = (event) => {
        setVisitDate(event.target.value);
    };

    const handleBookVisit = () => {
        if (visitDate) {
            alert(`Visit booked for: ${visitDate}`);
            setVisitDate("");
        } else {
            alert("Please select a visit date.");
        }
    };

    return (
        <div className="singlePage mt-32 mb-5 mx-auto px-4">
            <div className="details">
                <div className="wrapper">
                    <Slider images={pImage} />
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>{property?.propertyTitle}</h1>
                                <div className="address">
                                    <img src={Pin} alt="Pin" />
                                    <span>{property?.propertyAddress}</span>
                                </div>
                                <div className="price">
                                    NPR. <NumberFormat value={property?.propertyPrice} />
                                    {property?.propertyFor === 'Rent' && ' /month'}
                                </div>
                            </div>
                            <div className="user">
                                {user ? (
                                    <>
                                        <div className="avatar-placeholder">
                                        </div>
                                        <span>Seller: {user.fullName}</span>
                                        <p>Contact: {user.contact}</p>
                                    </>
                                ) : (
                                    <p>Loading user information...</p>
                                )}
                            </div>
                        </div>
                        <div
                            className="bottom"

                        >{property?.description}</div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <p className="title">General</p>
                    <div className="listVertical">
                        <div className="feature">
                            <img src={Pet} alt="Pet" />
                            <div className="featureText">
                                <span>Pet Policy</span>
                                <p>{property?.petPolicy} </p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Area} alt="Area" />
                            <div className="featureText">
                                <span>Area</span>
                                <p>{property?.propertySize} sqft</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Longitude} alt="Longitude" />
                            <div className="featureText">
                                <span>Longitude</span>
                                <p>{property?.longitude}</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Latitude} alt="Latitude" />
                            <div className="featureText">
                                <span>Latitude</span>
                                <p>{property?.latitude}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Sizes</p>

                    <div className="sizes">
                        <div className="size">
                            <img src={Beds} alt="Bedroom" />
                            <span>{property?.bedrooms} Beds</span>
                        </div>
                        <div className="size">
                            <img src={Bathroom} alt="Bathroom" />
                            <span>{property?.bathrooms} Bathroom</span>
                        </div>
                        <div className="size">
                            <img src={Hall} alt="Livingroom" />
                            <span>{property?.halls} Hall</span>
                        </div>
                        <div className="size">
                            <img src={Kitchen} alt="Kitchen" />
                            <span>{property?.kitchens} Kitchen</span>
                        </div>
                    </div>
                    <p className="title">Property Type</p>
                    <div className="listHorizontal">
                        <div className="feature">
                            <img src={PropertyType} alt="Property Type" />
                            <div className="featureText">
                                <span>Property Type</span>
                                <p>
                                    {property?.propertyType}
                                </p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={PropertyFor} alt="Property For" />
                            <div className="featureText">
                                <span>Property For</span>
                                <p>{property?.propertyFor}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Location</p>
                    <div className="">
                        <div className="mapContainer p-0">
                            {property && <Map items={[property]} />}
                        </div>
                    </div>
                    <div className="buttons">
                        <button>
                            <img src={Chat} alt="Chat" />
                            Send a Message
                        </button>

                        <button
                            onClick={handleSave}
                            style={{ backgroundColor: isBookmarked ? "#fece51" : "white" }}
                            className="w-48 flex items-center justify-center gap-x-2 py-2 rounded-md"
                        >
                            <img
                                src={isBookmarked ? BookmarkFilled : Bookmark}
                                alt="Bookmark"
                                className="w-5 h-5"
                            />
                            {isBookmarked ? "Property saved" : "Save the Place"}
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-5 border border-gray-300 rounded-lg p-2 bg-white ">
                        <div className="relative flex items-center">

                            <img
                                src={Calendar}
                                alt="Calendar"
                                className="absolute right-4 cursor-pointer"
                                style={{ width: "21px", height: "21px" }}
                                onClick={() => document.getElementById("customDateInput").showPicker()} // Opens calendar
                            />
                            <input
                                id="customDateInput"
                                type="date"
                                value={visitDate}
                                onChange={handleDateChange}
                                className="p-2 pr-6 outline-none bg-transparent appearance-none"
                            />
                        </div>

                        <button
                            onClick={handleBookVisit}
                            className="p-2 bg-white text-gray-700 border-l border-gray-300 pl-5 pr-3 rounded-r-lg"
                        >
                            Book a Visit
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default SinglePage;





