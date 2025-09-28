const DashboardCard = ({ title, value }) => (
  <div
    role="region"
    aria-label={`${title} card`}
    className="bg-[#FBE4E9] p-6 rounded-xl shadow-md font-bold text-lg transform hover:scale-105 transition-all duration-300 border border-[#D4BEBE]"
  >
    <h3 className="mb-2 text-sm text-[#444444] uppercase">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

export default DashboardCard;
