
import { Link } from "react-router-dom";
import "./card.scss";
import Kitchen from "../../assets/SinglePage/Kitchen.png";
import Hall from "../../assets/SinglePage/living.png";
import Bathroom from "../../assets/SinglePage/toilet.png";
import Beds from "../../assets/SinglePage/bedroom.png";
import Pin from "../../assets/SinglePage/pin.png";
import Chat from "../../assets/SinglePage/chat.png";
import Bookmark from "../../assets/SinglePage/bookmark.png";

function Card({ item }) {
  return (
    <div className="card">
      <Link to={`/${item?.propertyID}`} className="imageContainer">
        <img 
          src={item?.images?.[0]?.imageURL || "placeholder-image.jpg"} 
          alt={item?.propertyTitle} 
        />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item?.propertyID}`}>{item?.propertyTitle}</Link>
        </h2>
        <p className="address">
          <img src={Pin} alt="" />
          <span>{item?.propertyAddress}, {item?.propertyCity}</span>
        </p>
        <p className="price">$ {item?.propertyPrice}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src={Beds} alt="" />
              <span>{item?.bedrooms} bedroom{item?.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="feature">
              <img src={Bathroom} alt="" />
              <span>{item?.bathrooms} bathroom{item?.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src={Bookmark} alt="Bookmark" />
            </div>
            <div className="icon">
              <img src={Chat} alt="Chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;