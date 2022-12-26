import { useLocation, Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/utils/session";

export default function PrivateRoute() {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
