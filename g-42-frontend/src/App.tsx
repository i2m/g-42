import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthContextProvider } from "./pages/users/Auth.context";
import { Root } from "./pages/Root.layout";
import { RoundsList } from "./pages/rounds/list/RoundsList.page";
import { RoundDetail } from "./pages/rounds/detail/RoundDetail.page";
import { Login } from "./pages/users/Login.page";

export function App() {
  const queryClient = new QueryClient();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Root />}>
                <Route index element={<RoundsList />} />
                <Route path="rounds/:roundId" element={<RoundDetail />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
