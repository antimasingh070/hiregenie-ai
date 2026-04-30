function StatCard({ title, value, color = "bg-white" }) {
  return (
    <div className={`${color} p-5 rounded-xl shadow hover:shadow-md transition`}>

      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;