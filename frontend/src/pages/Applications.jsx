import { useEffect, useState } from "react";
import api from "../services/api";

function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const res = await api.get("/applications");
    setApps(res.data);
  };

  return (
    <div className="p-6">
      <h1>Applications</h1>

      {apps.map((a) => (
        <div key={a.id} className="border p-3 mb-2">
          <p>User ID: {a.user_id}</p>
          <p>Job ID: {a.job_id}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Applications;