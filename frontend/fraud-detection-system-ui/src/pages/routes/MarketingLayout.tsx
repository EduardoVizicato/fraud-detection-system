import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../landingPage/landing.css"

export default function MarketingLayout() {
  return (
    <div className="lp">
      <Navbar />
      <Outlet />
    </div>
  );
}
