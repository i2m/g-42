import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultTheme, Provider } from "@adobe/react-spectrum";

import { Root } from "./pages/Root.layout";
import { Login } from "./pages/users/Login.page";
import { RoundsList } from "./pages/rounds/RoundsList.page";
import { RoundDetail } from "./pages/rounds/RoundDetail.page";
import { AuthContextProvider } from "./pages/users/AuthContext";

import "./main.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Provider theme={defaultTheme}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Root />}>
                <Route index element={<RoundsList />} />
                <Route path="rounds/:roundId" element={<RoundDetail />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
