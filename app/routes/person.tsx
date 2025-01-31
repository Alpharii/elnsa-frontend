import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/sidebar";


export default function PersonLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}