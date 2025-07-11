import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ChattingSetup from './components/chatting/ChattingSetup'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { setOnlineUser } from './redux/authSlice'
import { setSocket } from './redux/socketSlice'
import QuizPage from './components/QuizPage'
import ErrorBoundary from './components/ErrorBoundary'
import "../src/index.css"
import Friends from './components/Friends'
import Notifications from './components/Notifications'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },

  {
    path: "/notifications",
    element: <Notifications />
  },
  // admin ke liye yha se start hoga
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },



  //chatting k lea yahn sy start hu ga

  {
    path: "/chatting",
    element: <ChattingSetup />
  },

  {
    path: "/friends",
    element: <Friends />

  },
  {
    path: "/quiz",
    element: (
      <ErrorBoundary>
        <QuizPage />
      </ErrorBoundary>
    ),

  },


])
function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let sock;
    if (user) {
      sock = io('http://localhost:8000', { query: { userId: user._id } });
      dispatch(setSocket(sock));
      sock.on('getOnlineUsers', users => dispatch(setOnlineUser(users)));
    }
    return () => {
      if (sock) sock.disconnect();
      dispatch(setSocket(null));
    };
  }, [user, dispatch]);

  return (
    // <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-700 text-white">
    <RouterProvider router={appRouter} />
    // </div>


  );
}

export default App;