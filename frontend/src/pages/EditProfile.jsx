import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/common/PageHeader";
import ResumeUpload from "../pages/candidate/ResumeUpload";

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/user/me")
      .then((res) => {
        setForm({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          role: res.data.role || "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Profile load nahi hua");
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/user/me", {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Profile"
        subtitle="Update your personal information and account details."
        action={
          <button
            onClick={() => navigate("/profile")}
            className="bg-white text-black px-4 py-2 font-semibold hover:bg-slate-100 transition"
          >
            Back to Profile
          </button>
        }
      />

      <form onSubmit={submit} className="bg-white border p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              disabled
              className="mt-1 w-full px-4 py-3 border text-sm bg-gray-100 text-gray-500"
              value={form.email}
            />
            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed here.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              className="mt-1 w-full px-4 py-3 border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              disabled
              className="mt-1 w-full px-4 py-3 border text-sm bg-gray-100 text-gray-500 capitalize"
              value={form.role}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-5 py-2.5 border text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {form.role === "candidate" && <ResumeUpload />}
    </div>
  );
}

export default EditProfile;