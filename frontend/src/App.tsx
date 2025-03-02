import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { CommunityPage, Home, SettingsPage } from "./pages/pages";
import RootLayout from "./components/layout/RootLayout";
import LoadingPage from "./components/shared/LoadingPage";
import LoginPage from "./_auth/LoginPage";
import RegisterPage from "./_auth/RegisterPage";
import ChatsLayout from "./components/layout/ChatsLayout";
import ProtectionProvider from "./components/providers/ProtectionProvider";

const AuthLayout = React.lazy(() => import("./_auth/AuthLayout"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <ProtectionProvider>
            <RootLayout />
          </ProtectionProvider>
        }
      >
        <Route element={<ChatsLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/chat/:chatId"
            element={
              <Suspense fallback={<LoadingPage />}>
                <ChatPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/community" element={<CommunityPage />} />
        <Route
          path="/profile/:profileId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route
        element={
          <Suspense fallback={<LoadingPage />}>
            <AuthLayout />
          </Suspense>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};

export default App;
