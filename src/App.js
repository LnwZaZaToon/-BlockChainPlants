import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

// Simulating a simple authentication context
const AuthContext = createContext();

// Custom hook to use auth context
const useAuth = () => {
  return useContext(AuthContext);
};

// Mock user data
const mockUser = {
  username: "JohnDoe",
  role: "user", // change to "admin" for admin role
};

// AuthProvider to manage authentication state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching the user (from local storage, API, etc.)
    setUser(mockUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Home Page Component
const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <h2>{user ? `Logged in as ${user.username}` : "Not logged in"}</h2>
      <nav>
        <ul>
          <li><Link to="/user-page">User Page</Link></li>
          <li><Link to="/admin-page">Admin Page</Link></li>
        </ul>
      </nav>
    </div>
  );
};

// User Page Component (only for regular users)
const UserPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>You must log in to access this page.</div>;
  }

  return (
    <div>
      <h1>User Page</h1>
      <h2>Welcome, {user.username}! This is the user-granted page.</h2>
    </div>
  );
};

// Admin Page Component (only for admins)
const AdminPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>You must log in to access this page.</div>;
  }

  if (user.role !== "admin") {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Welcome, Admin! This is the admin-granted page.</h2>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/user-page">User Page</Link>
              </li>
              <li>
                <Link to="/admin-page">Admin Page</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user-page" element={<UserPage />} />
            <Route path="/admin-page" element={<AdminPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
