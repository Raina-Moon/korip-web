const AdminCard = ({
  iconColor,
  title,
  description,
  iconPath,
}: {
  iconColor: string;
  title: string;
  description: string;
  iconPath: string;
}) => (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-12 w-12 ${iconColor} mb-4`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
    </svg>
    <h2 className="text-xl font-medium text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2">{description}</p>
  </div>
);

export default AdminCard;