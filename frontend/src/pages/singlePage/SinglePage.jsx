// import "./singlePage.scss";
// import Slider from "../../components/Slider";
// import NumberFormat from "../../components/FormatNumber";
// import Map from "../../components/Map";
// import { useState } from "react";
// import DOMPurify from "dompurify";
// import Pin from "../../assets/SinglePage/pin.png";
// import Pet from "../../assets/SinglePage/animal.png";
// import Area from "../../assets/SinglePage/wide.png";
// import Longitude from "../../assets/SinglePage/longitude.png";
// import Latitude from "../../assets/SinglePage/latitude.png";
// import Kitchen from "../../assets/SinglePage/Kitchen.png";
// import Hall from "../../assets/SinglePage/living.png";
// import Bathroom from "../../assets/SinglePage/toilet.png";
// import Beds from "../../assets/SinglePage/bedroom.png";
// import Chat from "../../assets/SinglePage/chat.png";
// import Bookmark from "../../assets/SinglePage/bookmark.png";
// import Calendar from "../../assets/SinglePage/calendar.png";
// import PropertyFor from "../../assets/SinglePage/property-for.png";
// import PropertyType from "../../assets/SinglePage/property-type.png";
// import one from "../../assets/demo/1.jpg";
// import two from "../../assets/demo/2.jpg";
// import three from "../../assets/demo/3.jpg";
// import four from "../../assets/demo/4.png";
// import five from "../../assets/demo/5.jpg";
// import six from "../../assets/demo/6.jpg";


// function SinglePage() {
//     const post = {
//         title: "Luxury Apartment in the City Center",
//         address: "123 Main St, Kathmandu, Nepal",
//         price: 120000,
//         images: [one, two, three, four,five,six],
//         user: {
//             avatar: "user-avatar.jpg",
//             username: "Sampanna"
//         },
//         postDetail: {
//             desc: "<p>This is a beautiful apartment with modern amenities Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ullam totam labore unde minima voluptatibus illo, quia quidem iusto vel! Expedita odit ducimus doloremque sit hic ut doloribus ipsum! Id?</p>",
//             longitude: 123,
//             latitude: 123,
//             pet: "allowed",
//             income: "Minimum $5000/month",
//             size: 1200,
//             school: 500,
//             bus: 200,
//             restaurant: 300
//         },
//         bedroom: 3,
//         bathroom: 2,
//         isSaved: false
//     };

//     const [saved, setSaved] = useState(false);
//     const [visitDate, setVisitDate] = useState(""); 

//     const handleSave = () => {
//         setSaved((prev) => !prev);
//     };

//     const handleDateChange = (event) => {
//         setVisitDate(event.target.value); 
//     };

//     const handleBookVisit = () => {
//         if (visitDate) {
//             alert(`Visit booked for: ${visitDate}`);
//             setVisitDate(""); // Reset date after booking
//         } else {
//             alert("Please select a visit date.");
//         }
//     };

//     return (
//         <div className="singlePage mt-32 mb-5 mx-auto px-4">
//             <div className="details">
//                 <div className="wrapper">
//                     <Slider images={post.images} />
//                     <div className="info">
//                         <div className="top">
//                             <div className="post">
//                                 <h1>{post.title}</h1>
//                                 <div className="address">
//                                     <img src={Pin} alt="Pin" />
//                                     <span>{post.address}</span>
//                                 </div>
//                                 <div className="price">NPR. <NumberFormat value={post.price} /> </div>
//                             </div>
//                             <div className="user">
//                                 <img src={post.user.avatar} alt="" />
//                                 <span>{post.user.username}</span>
//                                 <p>Contact : +977- 9864034456</p>
//                             </div>
//                         </div>
//                         <div
//                             className="bottom"
//                             dangerouslySetInnerHTML={{
//                                 __html: DOMPurify.sanitize(post.postDetail.desc),
//                             }}
//                         ></div>
//                     </div>
//                 </div>
//             </div>
//             <div className="features">
//                 <div className="wrapper">
//                     <p className="title">General</p>
//                     <div className="listVertical">
//                         <div className="feature">
//                             <img src={Pet} alt="Pet" />
//                             <div className="featureText">
//                                 <span>Pet Policy</span>
//                                 <p>Allowed</p>
//                             </div>
//                         </div>
//                         <div className="feature">
//                             <img src={Area} alt="Area" />
//                             <div className="featureText">
//                                 <span>Area</span>
//                                 <p>{post.postDetail.size} sqft</p>
//                             </div>
//                         </div>
//                         <div className="feature">
//                             <img src={Longitude} alt="Longitude" />
//                             <div className="featureText">
//                                 <span>Longitude</span>
//                                 <p>{post.postDetail.longitude}</p>
//                             </div>
//                         </div>
//                         <div className="feature">
//                             <img src={Latitude} alt="Latitude" />
//                             <div className="featureText">
//                                 <span>Latitude</span>
//                                 <p>{post.postDetail.latitude}</p>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="title">Sizes</p>

//                     <div className="sizes">
//                         <div className="size">
//                             <img src={Beds} alt="Bedroom" />
//                             <span>{post.bedroom} Beds</span>
//                         </div>
//                         <div className="size">
//                             <img src={Bathroom} alt="Bathroom" />
//                             <span>{post.bathroom} Bathroom</span>
//                         </div>
//                         <div className="size">
//                             <img src={Hall} alt="Livingroom" />
//                             <span>{post.bathroom} Hall</span>
//                         </div>
//                         <div className="size">
//                             <img src={Kitchen} alt="Kitchen" />
//                             <span>{post.bathroom} Kitchen</span>
//                         </div>
//                     </div>
//                     <p className="title">Property Type</p>
//                     <div className="listHorizontal">
//                         <div className="feature">
//                             <img src={PropertyType} alt="Property Type" />
//                             <div className="featureText">
//                                 <span>Property Type</span>
//                                 <p>
//                                     Appartment
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="feature">
//                             <img src={PropertyFor} alt="Property For" />
//                             <div className="featureText">
//                                 <span>Property For</span>
//                                 <p>Rent</p>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="title">Location</p>
//                     <div className="mapContainer">
//                         <Map items={[post]} />
//                     </div>
//                     <div className="buttons">
//                         <button>
//                             <img src={Chat} alt="Chat" />
//                             Send a Message
//                         </button>

//                         <button
//                             onClick={handleSave}
//                             style={{ backgroundColor: saved ? "#fece51" : "white" }}
//                             className="w-48 flex items-center justify-center gap-x-2 py-2 rounded-md"
//                         >
//                             <img src={Bookmark} alt="Bookmark" className="w-5 h-5" />
//                             {saved ? "Place Saved" : "Save the Place"}
//                         </button>

//                     </div>
//                     <div className="flex items-center justify-center gap-5 border border-gray-300 rounded-lg p-2 bg-white ">
//                         <div className="relative flex items-center">

//                             <img
//                                 src={Calendar}
//                                 alt="Calendar"
//                                 className="absolute right-4 cursor-pointer"
//                                 style={{ width: "21px", height: "21px" }}
//                                 onClick={() => document.getElementById("customDateInput").showPicker()} // Opens calendar
//                             />
//                             <input
//                                 id="customDateInput"
//                                 type="date"
//                                 value={visitDate}
//                                 onChange={handleDateChange}
//                                 className="p-2 pr-6 outline-none bg-transparent appearance-none"
//                             />
//                         </div>

//                         <button
//                             onClick={handleBookVisit}
//                             className="p-2 bg-white text-gray-700 border-l border-gray-300 pl-5 pr-3 rounded-r-lg"
//                         >
//                             Book a Visit
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     );
// }

// export default SinglePage;

































import "./singlePage.scss";
import Slider from "../../components/Slider";
import NumberFormat from "../../components/FormatNumber";
import Map from "../../components/Map";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
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
import one from "../../assets/demo/1.jpg";
import two from "../../assets/demo/2.jpg";
import three from "../../assets/demo/3.jpg";
import four from "../../assets/demo/4.png";
import five from "../../assets/demo/5.jpg";
import six from "../../assets/demo/6.jpg";
import axios from 'axios';

function SinglePage() {
    const post = {
        title: "Luxury Apartment in the City Center",
        address: "123 Main St, Kathmandu, Nepal",
        price: 120000,
        images: [one, two, three, four,five,six],
        user: {
            avatar: "user-avatar.jpg",
            username: "Sampanna"
        },
        postDetail: {
            desc: "<p>This is a beautiful apartment with modern amenities Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ullam totam labore unde minima voluptatibus illo, quia quidem iusto vel! Expedita odit ducimus doloremque sit hic ut doloribus ipsum! Id?</p>",
            longitude: 123,
            latitude: 123,
            pet: "allowed",
            income: "Minimum $5000/month",
            size: 1200,
            school: 500,
            bus: 200,
            restaurant: 300
        },
        bedroom: 3,
        bathroom: 2,
        isSaved: false
    };

    const [property, setProperty] = useState(null)
    const [pImage, setPImage] = useState(null)
    useEffect(() => {
        const getsingleproperty = async() =>{
            const res = await axios.get(`http://localhost:8000/api/property/9`)
            setProperty(res.data);
        }

        const getallimages = async() =>{
            const res = await axios.get(`http://localhost:8000/api/property/9/images`)
            console.log(res.data);
            setPImage(res.data);
        }

        getsingleproperty();
        getallimages();

    },[])

    const [saved, setSaved] = useState(false);
    const [visitDate, setVisitDate] = useState(""); 

    const handleSave = () => {
        setSaved((prev) => !prev);
    };

    const handleDateChange = (event) => {
        setVisitDate(event.target.value); 
    };

    const handleBookVisit = () => {
        if (visitDate) {
            alert(`Visit booked for: ${visitDate}`);
            setVisitDate(""); // Reset date after booking
        } else {
            alert("Please select a visit date.");
        }
    };

    return (
        <div className="singlePage mt-32 mb-5 mx-auto px-4">
            <div className="details">
                <div className="wrapper">
                    <Slider images={post.images} />
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>{property.propertyTitle}</h1>
                                <div className="address">
                                    <img src={Pin} alt="Pin" />
                                    <span>{property.propertyAddress}</span>
                                </div>
                                <div className="price">NPR. <NumberFormat value={property.propertyPrice} /> </div>
                            </div>
                            <div className="user">
                                <img src={post.user.avatar} alt="" />
                                <span>{post.user.username}</span>
                                <p>Contact : +977- 9864034456</p>
                            </div>
                        </div>
                        <div
                            className="bottom"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.postDetail.desc),
                            }}
                        ></div>
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
                                <p>{property.petPolicy} </p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Area} alt="Area" />
                            <div className="featureText">
                                <span>Area</span>
                                <p>{property.propertySize} sqft</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Longitude} alt="Longitude" />
                            <div className="featureText">
                                <span>Longitude</span>
                                <p>{property.longitude}</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={Latitude} alt="Latitude" />
                            <div className="featureText">
                                <span>Latitude</span>
                                <p>{property.latitude}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Sizes</p>

                    <div className="sizes">
                        <div className="size">
                            <img src={Beds} alt="Bedroom" />
                            <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="size">
                            <img src={Bathroom} alt="Bathroom" />
                            <span>{property.bathrooms} Bathroom</span>
                        </div>
                        <div className="size">
                            <img src={Hall} alt="Livingroom" />
                            <span>{property.halls} Hall</span>
                        </div>
                        <div className="size">
                            <img src={Kitchen} alt="Kitchen" />
                            <span>{property.kitchens} Kitchen</span>
                        </div>
                    </div>
                    <p className="title">Property Type</p>
                    <div className="listHorizontal">
                        <div className="feature">
                            <img src={PropertyType} alt="Property Type" />
                            <div className="featureText">
                                <span>Property Type</span>
                                <p>
                                    {property.propertyType}
                                </p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src={PropertyFor} alt="Property For" />
                            <div className="featureText">
                                <span>Property For</span>
                                <p>{property.propertyFor}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Location</p>
                    <div className="mapContainer">
                        <Map items={[post]} />
                    </div>
                    <div className="buttons">
                        <button>
                            <img src={Chat} alt="Chat" />
                            Send a Message
                        </button>

                        <button
                            onClick={handleSave}
                            style={{ backgroundColor: saved ? "#fece51" : "white" }}
                            className="w-48 flex items-center justify-center gap-x-2 py-2 rounded-md"
                        >
                            <img src={Bookmark} alt="Bookmark" className="w-5 h-5" />
                            {saved ? "Place Saved" : "Save the Place"}
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


