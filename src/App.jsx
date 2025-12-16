// src/App.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { hasRole } from "./utils/auth";
import DeviceListPage from "./pages/DeviceListPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

function Navbar({ user, logout, isStaff }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        CDLS
      </Link>

      <div className="nav-links">
        <Link to="/" className={isActive("/")}>Devices</Link>
        <Link to="/my-bookings" className={isActive("/my-bookings")}>My Bookings</Link>
        {isStaff && <Link to="/admin/bookings" className={isActive("/admin/bookings")}>Admin</Link>}
      </div>

      <div className="nav-user">
        <span className="user-email">{user.email}</span>
        {isStaff && <span className="badge badge-info">Staff</span>}
        <button
          className="btn btn-outline"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function LoginScreen({ loginWithRedirect }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      gap: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>
        Campus Device Loan System
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', textAlign: 'center' }}>
        Reserve equipment for your coursework and projects. Log in with your university account to get started.
      </p>
      <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }} onClick={() => loginWithRedirect()}>
        Login to Access
      </button>
    </div>
  );
}

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen loginWithRedirect={loginWithRedirect} />;
  }

  const isStaff = hasRole(user, "staff");

  return (
    <>
      <Navbar user={user} logout={logout} isStaff={isStaff} />
      <main className="container">
        <Routes>
          <Route path="/" element={<DeviceListPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route
            path="/admin/bookings"
            element={isStaff ? <AdminBookingsPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </>
  );
}
