import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Shield, User, Briefcase, Edit3 } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.get("/user/me")
      .then((res) => setProfile(res.data))
      .catch(() => alert("Failed to load profile"));
  }, []);

  if (!profile) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white text-indigo-700 flex items-center justify-center text-2xl font-bold">
              {profile.name?.[0]}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-indigo-100 text-sm capitalize">
                {profile.role} profile
              </p>
            </div>
          </div>

          <button
              onClick={() => navigate("/profile/edit")}
              className="bg-white text-black px-4 py-2 flex items-center gap-2"
          >
            <Edit3 size={16}/> Edit
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2 bg-white border p-6">
          <h2 className="font-semibold mb-4">Personal Info</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Info icon={User} label="Name" value={profile.name} />
            <Info icon={Shield} label="Role" value={profile.role} />
            <Info icon={Mail} label="Email" value={profile.email} />
            <Info icon={Phone} label="Phone" value={profile.phone} />
            <Info icon={Briefcase} label="Company" value={profile.company} />
            <Info icon={User} label="Skills" value={profile.skills} />
          </div>
        </div>

        <div className="bg-white border p-6">
          <h2 className="font-semibold mb-4">Account</h2>

          <Row label="Status" value={profile.is_active ? "Active" : "Inactive"} />
          <Row label="Security" value="JWT Enabled" />
          <Row label="Role" value={profile.role} />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 p-4 border">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={16} /> {label}
      </div>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default Profile;