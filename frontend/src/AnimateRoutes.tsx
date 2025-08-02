import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import CitizenHome from "./pages/CitizenHome";
import CitizenProfile from "./pages/CitizenProfile";
import ReportIssue from "./pages/ReportIssue";
import AdminHome from "./pages/AdminHome";
import AdminProfile from "./pages/AdminProfile";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

const pageTransition = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: { duration: 0.32, ease: "easeInOut" as const },
};

function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      style={{ height: "100%" }} // optional, helps with layout
    >
      {children}
    </motion.div>
  );
}

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <MotionWrapper>
              <Index />
            </MotionWrapper>
          }
        />
        <Route
          path="/signin"
          element={
            <MotionWrapper>
              <SignIn />
            </MotionWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <MotionWrapper>
              <SignUp />
            </MotionWrapper>
          }
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute requiredRole="citizen">
              <MotionWrapper>
                <CitizenHome />
              </MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/create-issue"
          element={
            <ProtectedRoute requiredRole="citizen">
              <MotionWrapper>
                <ReportIssue />
              </MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute requiredRole="citizen">
              <MotionWrapper>
                <CitizenProfile />
              </MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <MotionWrapper>
                <AdminHome />
              </MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <MotionWrapper>
                <AdminProfile />
              </MotionWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <MotionWrapper>
              <NotFound />
            </MotionWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
