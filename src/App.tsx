// import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, useColorMode } from "@chakra-ui/react";
// import { useAtom } from "jotai";
// import { isAuthenticatedAtom } from "./stores";
import { ROUTES } from "./constants";

// Components
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import JournalPage from "./pages/JournalPage";
import JournalWritePage from "./pages/JournalWritePage";
import JournalViewPage from "./pages/JournalViewPage";
import TodoPage from "./pages/TodoPage";
import TodoWritePage from "./pages/TodoWritePage";
import TodoViewPage from "./pages/TodoViewPage";
import GalleryPage from "./pages/GalleryPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import CategoriesPage from "./pages/CategoriesPage";
import AnniversariesPage from "./pages/AnniversariesPage";

// Protected Route Component
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [isAuthenticated] = useAtom(isAuthenticatedAtom);

//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }

//   return <>{children}</>;
// };

function App() {
  const { colorMode } = useColorMode();

  return (
    <Box
      minH="100vh"
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
      color={colorMode === "dark" ? "white" : "gray.800"}
    >
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.HOME}
          element={
            // <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL_WRITE}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalWritePage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL_VIEW}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalViewPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO_WRITE}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoWritePage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO_VIEW}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoViewPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.GALLERY}
          element={
            // <ProtectedRoute>
            <Layout>
              <GalleryPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.STATS}
          element={
            // <ProtectedRoute>
            <Layout>
              <StatsPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.SETTINGS}
          element={
            // <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            // <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CATEGORIES}
          element={
            // <ProtectedRoute>
            <Layout>
              <CategoriesPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ANNIVERSARIES}
          element={
            // <ProtectedRoute>
            <Layout>
              <AnniversariesPage />
            </Layout>
            // </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Box>
  );
}

export default App;
