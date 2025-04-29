const FloatingLabelInput = ({
  type = "text",
  name,
  id,
  label,
  value,
  onChange,
  required = false,
  error, 
  className = "",
  inputClassName = "",
  labelClassName = ""
}) => (
  <div className={`relative ${className}`}>
    <input
      type={type}
      name={name}
      id={id}
      placeholder=" "  
      required={required}
      value={value}
      onChange={onChange}
      className={`peer w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-transparent border-gray-300 ${inputClassName} ${
        error ? "border-red-500" : ""
      }`}
    />
    <label
      htmlFor={id}
      className={`absolute left-2 
        top-1/2 transform -translate-y-1/2 
        transition-all duration-300 
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-500 
        peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:px-[6px]
        peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-500 peer-valid:px-[6px]
        bg-white ${labelClassName}`}
    >
      {label}
    </label>
  </div>
);

export default FloatingLabelInput;
