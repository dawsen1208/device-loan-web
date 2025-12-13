// src/pages/AdminBookingsPage.jsx
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function AdminBookingsPage() {
  const { get, post } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");

    try {
      const data = await get("http://localhost:7071/api/bookings");
      setBookings(data);
    } catch (e) {
      setMsg("Error loading all bookings");
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function returnBooking(id) {
    try {
      await post(`http://localhost:7071/api/bookings/${id}/return`);
      setMsg(`Returned ${id}`);
      load();
    } catch (e) {
      setMsg("Failed to return");
    }
  }

  return (
    <div>
      <h3>Admin: All Bookings</h3>
      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}

      {!loading && bookings.length === 0 && <p>No bookings found.</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Device</th>
            <th>Status</th>
            <th>Reserved At</th>
            <th>Due At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.userId}</td>
              <td>{b.deviceModel}</td>
              <td>{b.status}</td>
              <td>{b.reservedAt}</td>
              <td>{b.dueAt}</td>
              <td>
                {b.status !== "returned" && (
                  <button onClick={() => returnBooking(b.id)}>Return</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={load} style={{ marginTop: 12 }}>
        Refresh
      </button>
    </div>
  );
}
