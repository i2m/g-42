import { Navigate, Outlet } from "react-router";
import { View } from "@adobe/react-spectrum";

import { useAuthContext } from "./users/AuthContext";
import { Loading } from "../components/Loading";

export function Root() {
  const { isAuthenticated } = useAuthContext();

  return (
    <View padding="size-400">
      {isAuthenticated === undefined ? <Loading /> : <Outlet />}
      {isAuthenticated === false && <Navigate to="/login" />}
    </View>
  );
}
