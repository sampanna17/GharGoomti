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
import { toast, ToastContainer } from "react-toastify";
import SellerImageViewer from "../../components/SellerImageViewer";
import { useNavigate } from 'react-router-dom';


function SinglePage() {

    const { id } = useParams();

    const [property, setProperty] = useState(null)
    const [pImage, setPImage] = useState(null)
    const [user, setUser] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [appointment, setAppointment] = useState(null);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const navigate = useNavigate();

    const userData = Cookies.get('user_data') ? JSON.parse(Cookies.get('user_data')) : null;

    useEffect(() => {
        const abortController = new AbortController();

        const getUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/property/${id}/user`, {
                    signal: abortController.signal
                });
                setUser(res.data);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('Error fetching user details:', error);
            }
        };

        const getsingleproperty = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/property/${id}`, {
                    signal: abortController.signal
                });
                setProperty(res.data);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('Error fetching property:', error);
            }
        };

        const getallimages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/property/${id}/images`, {
                    signal: abortController.signal
                });
                setPImage(res.data);
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('Error fetching images:', error);
            }
        };

        const checkBookmarkStatus = async () => {
            if (userData?.userID) {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/bookmark/check/${userData.userID}/${id}`,
                        { signal: abortController.signal }
                    );
                    setIsBookmarked(response.data.isBookmarked);
                } catch (error) {
                    if (axios.isCancel(error)) return;
                    console.error("Error checking bookmark status:", error);
                }
            }
        };

        const checkAppointment = async () => {
            if (userData?.userID) {
                try {
                    const res = await axios.get(
                        `http://localhost:8000/api/appointment/check/${userData.userID}/${id}`,
                        { signal: abortController.signal }
                    );
                    if (res.data.exists) {
                        setAppointment(res.data.appointment);
                    }
                } catch (error) {
                    if (axios.isCancel(error)) return;
                    console.error('Error checking appointment:', error);
                }
            }
        };

        getsingleproperty();
        getallimages();
        getUserDetails();
        checkBookmarkStatus();
        checkAppointment();

        return () => {
            abortController.abort();
        };
    }, [id, userData?.userID]);

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

    const handleBookVisit = async () => {

        if (!visitDate || !selectedTime) {
            toast.error("Please select both date and time");
            return;
        }

        if (!userData?.userID) {
            toast.error("Please login to book an appointment");
            return;
        }
        setIsBooking(true);

        try {
            // Convert AM/PM time to 24-hour format for backend
            const time24hr = convertTo24Hour(selectedTime);

            await axios.post('http://localhost:8000/api/appointment/add', {
                userID: userData.userID,
                propertyID: id,
                appointmentDate: visitDate,
                appointmentTime: time24hr
            },);

            toast.success("Appointment booked successfully!");
            setAppointment({
                appointmentDate: visitDate,
                appointmentTime: selectedTime,
                status: 'Pending'
            });
            setVisitDate("");
            setSelectedTime("");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to book appointment";
            toast.error(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    // Helper function to convert AM/PM to 24-hour format
    const convertTo24Hour = (time12h) => {
        if (!time12h) return '';

        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const handleSendMessage = async () => {
        if (!userData?.userID) {
            toast.error("Please login to send messages");
            return;
        }

        if (userData.userID === user?.userID) {
            toast.error("You cannot message yourself");
            return;
        }

        try {
            // First create or get existing chat
            const chatResponse = await axios.post('http://localhost:8000/api/chats/', {
                userId: userData.userID,
                receiverId: user?.userID
            });

            // Navigate to chats page with the chatId
            navigate('/chats', {
                state: {
                    activeChat: chatResponse.data.id,
                    receiver: {
                        userID: user.userID,
                        username: user.fullName,
                        profile_picture: user.profile
                    }
                }
            });

        } catch (error) {
            console.error("Failed to start chat:", error);
            toast.error("Failed to start chat");
        }
    };

    return (
        <div className="singlePage mt-32 mb-5 mx-auto px-4">
            <ToastContainer position="top-right" autoClose={1000} limit={1} newestOnTop={false} closeOnClick />
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
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Avatar - shows image or initials */}
                                            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer" onClick={() => setShowSellerModal(true)}>
                                                {user.profile ? (
                                                    <img
                                                        src={user.profile}
                                                        alt="Seller profile"
                                                        className="!w-20 !h-20 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-lg font-semibold text-gray-700">
                                                        {user.fullName?.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Seller info */}
                                            <div>
                                                <p className="font-medium text-gray-900">Seller: {user.fullName}</p>
                                                <p className="text-sm text-gray-600">Contact: {user.contact}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Loading user information...</p>
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
                        <button onClick={handleSendMessage}>
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


                    {appointment && appointment.status === 'Pending' ? (
                        <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-lg p-3 bg-white">
                            <div className="flex flex-col">
                                <p className="font-medium">You have booked an appointment on:</p>
                                <p>
                                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                                </p>
                                <p className="mt-1">
                                    Status: <span className={`font-semibold ${appointment.status === 'Confirmed' ? 'text-green-600' :
                                        appointment.status === 'Pending' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                        {appointment.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-lg p-3 bg-white">
                            {/* Left side - Date and Time */}
                            <div className="flex items-center gap-4">
                                {/* Date Picker */}
                                <div className="relative">
                                    <input
                                        id="customDateInput"
                                        type="date"
                                        value={visitDate}
                                        onChange={handleDateChange}
                                        className="p-2 pr-8 outline-none bg-transparent border border-gray-300 rounded-md appearance-none w-40"
                                    />
                                    <img
                                        src={Calendar}
                                        alt="Calendar"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        style={{ width: "18px", height: "18px" }}
                                        onClick={() => document.getElementById("customDateInput").showPicker()}
                                    />
                                </div>

                                {/* Time Selector */}
                                <div className="relative">
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="p-2 pl-3 pr-8 outline-none bg-transparent border border-gray-300 rounded-md appearance-none w-36"
                                    >
                                        <option value="">Select Time</option>
                                        {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBookVisit}
                                disabled={isBooking}
                                className={`p-2 bg-white text-gray-700 border-l border-gray-300 pl-5 pr-3 rounded-r-lg ${isBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isBooking ? 'Booking...' : 'Book a Visit'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showSellerModal && (
                <SellerImageViewer
                    imageUrl={user?.profile}
                    fullName={user?.fullName}
                    onClose={() => setShowSellerModal(false)}
                />
            )}
        </div >
    );
}

export default SinglePage;





