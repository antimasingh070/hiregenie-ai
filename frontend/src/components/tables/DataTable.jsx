function DataTable({ columns = [], data = [] }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left p-3 text-sm font-semibold text-gray-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">

              {Object.values(row).map((val, j) => (
                <td key={j} className="p-3 text-sm text-gray-700">
                  {val}
                </td>
              ))}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DataTable;