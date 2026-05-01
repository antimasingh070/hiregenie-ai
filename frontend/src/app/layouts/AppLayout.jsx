import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-72">
        <Navbar />

        <main className="px-6 lg:px-8 py-6">
            <Outlet/>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;