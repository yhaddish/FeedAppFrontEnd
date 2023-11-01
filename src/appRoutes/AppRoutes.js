import React, { useState, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "../pages/User/login";
import Register from "../pages/User/Register";
import VerifyEmail from "../pages/User/VerifyEmail";
import ForgotPassword from "../pages/User/ForgotPassword";
import ResetPassword from "../pages/User/ResetPassword";
import Wrapper from "../components/Wrapper";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/applicationContext";
import LoadingIndicator from "../components/LoadingIndicator";
import { sessionApi } from "../util/ApiUtil";
import Dashboard from "../pages/App/Dashboard";
import Profile from "../pages/App/Profile";
import CompleteProfile from "../pages/App/CompleteProfile";
import MyFeeds from "../pages/App/MyFeeds";


const AppRoutes = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const appContext = useContext(AppContext);
  const token = appContext.getSession();
  const userData = appContext.getUserData();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const pageTitles = {
    "/app/dashboard": "Dashboard",
    "/app/profile": "Profile",
    "/app/myFeeds": "My Feeds",
  };

  const getSsession = async () => {
    const apiResponse = await sessionApi(token);
    if (apiResponse.status === 1) {
      appContext.setUserData(apiResponse.payLoad);
    }
  };

  useEffect(() => {
    if (token && !userData) {
      getSsession();
    }
  }, []);

  useEffect(() => {
    if (!userData && !token) {
      setIsAuthenticated(false);
    }

    if (userData) {
      setIsAuthenticated(true);
      if (!userData.profile) {
        navigate("/app/completeProfile");
      }
    }
  }, [userData]);


  if (isAuthenticated === null) {
    return (
      <LoadingIndicator />
    )
  }

  if (isAuthenticated === false) {
    return (
      <Routes>
        <Route exact path="/user/login" element={<Login />} />
        <Route exact path="/user/register" element={<Register />} />
        <Route exact path="/user/verifyEmail" element={<VerifyEmail />} />
        <Route exact path="/user/forgotPassword" element={<ForgotPassword />} />
        <Route exact path="/user/resetPassword" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
    )
  }

  if (isAuthenticated === true) {
    return (
      <Wrapper>
        {userData && userData.profile && (
          <NavBar pageTitle={pageTitles[location.pathname]} />
        )}
        <Routes>
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          <Route exact path="/app/dashboard" element={<Dashboard />} />
          <Route exact path="/app/myFeeds" element={<MyFeeds />} />
          <Route exact path="/app/profile" element={<Profile />} />
          <Route
            exact
            path="/app/completeProfile"
            element={<CompleteProfile />}
          />
        </Routes>
      </Wrapper>
    );
  }


};

export default AppRoutes;