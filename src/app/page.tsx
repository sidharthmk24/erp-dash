import Sidebar from "../components/OverviewComponent/Sidebar";
import Header from "../components/OverviewComponent/Header";
import Dashboard from "../components/OverviewComponent/Dashboard";

export default function Page() {
  return (
    <>
    
        <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <Dashboard />
      </main>
    </div></>

  );
}