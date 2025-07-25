import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import './App.css'
// import { Tooltip } from 'react-tooltip';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index.tsx';
import CitizenHome from './pages/CitizenHome.tsx';
import CitizenProfile from './pages/CitizenProfile.tsx';
import ReportIssue from './pages/ReportIssue.tsx';
import AdminHome from './pages/AdminHome.tsx';
import AdminProfile from './pages/AdminProfile.tsx';
import NotFound from './pages/NotFound.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Toaster as Sonner, Toaster} from 'sonner';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  {/* <Tooltip> */}
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/citizen" 
              element={
                <ProtectedRoute requiredRole="citizen">
                  <CitizenHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/create-issue" 
              element={
                <ProtectedRoute requiredRole="citizen">
                  <ReportIssue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/profile" 
              element={
                <ProtectedRoute requiredRole="citizen">
                  <CitizenProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/profile" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  {/* </Tooltip> */}
  </QueryClientProvider>
)

export default App;
