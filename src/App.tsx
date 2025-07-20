// import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
// import { useAtom } from "jotai";
// import { isAuthenticatedAtom } from "./stores";
import { ROUTES } from "./constants/data";
import Layout from "./commons/Layout";
import {
  Anniversaries,
  Categories,
  Dashboard,
  Gallery,
  GeneralSettings,
  JournalList,
  JournalView,
  JournalWrite,
  LoginPage,
  Profile,
  Stats,
  TodoList,
  TodoView,
  TodoWrite,
} from "./pages";

// Protected Route Component
// const ProtectedRoute<{ children: React.ReactNode }> = ({
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
              <Dashboard />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalList />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL_WRITE}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalWrite />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL_VIEW}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalView />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoList />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO_WRITE}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoWrite />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO_VIEW}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoView />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.GALLERY}
          element={
            // <ProtectedRoute>
            <Layout>
              <Gallery />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.STATS}
          element={
            // <ProtectedRoute>
            <Layout>
              <Stats />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.SETTINGS}
          element={
            // <ProtectedRoute>
            <Layout>
              <GeneralSettings />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROFILE}
          element={
            // <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CATEGORIES}
          element={
            // <ProtectedRoute>
            <Layout>
              <Categories />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ANNIVERSARIES}
          element={
            // <ProtectedRoute>
            <Layout>
              <Anniversaries />
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
