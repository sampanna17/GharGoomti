
const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      <img src={icon} className="w-10 h-10" />
    </div>
  );
};

export default StatsCard;