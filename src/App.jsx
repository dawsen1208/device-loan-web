// src/App.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { hasRole } from "./utils/auth";

import { useApi } from "./hooks/useApi";

// 3 个页面
import DeviceListPage from "./pages/DeviceListPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const { apiFetch } = useApi();

  // 借用 / 归还设备结果（来自你原来的代码）
  const [bookingResult, setBookingResult] = useState(null);
  const [returnResult, setReturnResult] = useState(null);

  // ================================
  // 📌 借用设备（所有用户）
  // ================================
  async function reserveDevice() {
    try {
      const res = await apiFetch("http://localhost:7071/api/bookings", {
        method: "POST",
        body: JSON.stringify({ deviceModel: "Camera-A" }),
      });

      const data = await res.json();
      setBookingResult(data);
      console.log("Booking created:", data);
    } catch (err) {
      console.error(err);
      alert("Error reserving device");
    }
  }

  // ================================
  // 📌 归还设备（只有 staff）
  // ================================
  async function returnDevice() {
    if (!bookingResult?.id) {
      alert("No booking ID — borrow a device first.");
      return;
    }

    try {
      const res = await apiFetch(
        `http://localhost:7071/api/bookings/${bookingResult.id}/return`,
        { method: "POST" }
      );

      const data = await res.json();
      setReturnResult(data);
      console.log("Device returned:", data);
    } catch (err) {
      console.error(err);
      alert("Error returning device");
    }
  }

  // ================================
  // Auth0 状态
  // ================================
  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!isAuthenticated)
    return (
      <div style={{ padding: 20 }}>
        <h2>Campus Device Loan System</h2>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    );

  const isStaff = hasRole(user, "staff");

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* ================================ */}
      {/* 顶部导航栏 */}
      {/* ================================ */}
      <header style={{ marginBottom: 20 }}>
        <h2>Campus Device Loan System</h2>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <nav style={{ display: "flex", gap: 12 }}>
            <Link to="/">Devices</Link>
            <Link to="/my-bookings">My Bookings</Link>
            {isStaff && <Link to="/admin/bookings">Admin</Link>}
          </nav>

          <div style={{ marginLeft: "auto" }}>
            <span style={{ marginRight: 12 }}>
              {user.email} {isStaff && <strong>(staff)</strong>}
            </span>

            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================================ */}
      {/* 路由区域 */}
      {/* ================================ */}
      <Routes>
        <Route path="/" element={<DeviceListPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route
          path="/admin/bookings"
          element={isStaff ? <AdminBookingsPage /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* ================================ */}
      {/* 你原来写的借用 / 归还 演示区域 */}
      {/* ================================ */}
      <hr style={{ marginTop: 40, marginBottom: 20 }} />

      <h3>Quick Demo (Your Original Buttons)</h3>

      {/* 📌 借设备 */}
      <button onClick={reserveDevice}>Reserve Camera-A</button>

      {bookingResult && (
        <div style={{ marginTop: 10 }}>
          <p><b>Booking Result:</b></p>
          <pre>{JSON.stringify(bookingResult, null, 2)}</pre>
        </div>
      )}

      {/* 📌 归还设备（只有 staff） */}
      <button style={{ marginTop: 15 }} onClick={returnDevice}>
        Return Camera-A (staff only)
      </button>

      {returnResult && (
        <div style={{ marginTop: 10 }}>
          <p><b>Return Result:</b></p>
          <pre>{JSON.stringify(returnResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
