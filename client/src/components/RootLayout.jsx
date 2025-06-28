import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
function RootLayout() {
  return (
    <>
      {/* Should be authorized to view this navbar and outlet */}
      <Navbar />
      <Outlet />
    </>
  )
}

export default RootLayout