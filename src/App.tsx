// import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
// import { useAtom } from "jotai";
// import { isAuthenticatedAtom } from "./stores";
import Layout from "./commons/Layout";
import {
  Anniversaries,
  Categories,
  Dashboard,
  Gallery,
  GeneralSettings,
  JournalCreate,
  JournalDetail,
  JournalList,
  LoginPage,
  Profile,
  Stats,
  TodoCreate,
  TodoDetail,
  TodoList,
} from "./pages";
import { ROUTES } from "./utils/routes";

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
          path={ROUTES.JOURNAL_CREATE}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalCreate />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.JOURNAL_DETAIL}
          element={
            // <ProtectedRoute>
            <Layout>
              <JournalDetail />
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
          path={ROUTES.TODO_CREATE}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoCreate />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TODO_DETAIL}
          element={
            // <ProtectedRoute>
            <Layout>
              <TodoDetail />
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
