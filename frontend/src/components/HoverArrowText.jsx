import { useNavigate } from 'react-router-dom';
import { RiArrowRightUpLine } from 'react-icons/ri';

const HoverArrowText = ({ text, IconStart = RiArrowRightUpLine, IconEnd = RiArrowRightUpLine, customClass, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex items-center space-x-1 cursor-pointer ${customClass}`}
    >
      {IconStart && (
        <IconStart
          className="opacity-0 translate-x-4 transition-all duration-300 ease-in-out group-hover:opacity-100"
        />
      )}
      <span className="transition-all duration-300 ease-in-out group-hover:translate-x-4">
        {text}
      </span>
      {IconEnd && (
        <IconEnd
          className="transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:translate-x-2"
        />
      )}
    </div>
  );
};

export default HoverArrowText;
