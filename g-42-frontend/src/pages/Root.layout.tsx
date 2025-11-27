import { Navigate, Outlet } from "react-router";
import { Flex } from "@adobe/react-spectrum";
import { defaultTheme, Provider } from "@adobe/react-spectrum";

import { useNavigate, useHref } from "react-router";

import { useAuthContext } from "./users/Auth.context";
import { Loading } from "../components/Loading";
import { LOGIN_PATH } from "../App";

export function Root() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  return (
    <Provider
      theme={defaultTheme}
      router={{ navigate, useHref }}
      breakpoints={{
        S: 375,
        M: 768,
        L: 1024,
        XL: 1280,
        XXL: 1536,
      }}
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {isAuthenticated === undefined && <Loading />}
        {isAuthenticated !== undefined && <Outlet />}
        {isAuthenticated === false && <Navigate to={`/${LOGIN_PATH}`} />}
      </Flex>
    </Provider>
  );
}
