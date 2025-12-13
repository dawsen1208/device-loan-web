// src/pages/MyBookingsPage.jsx
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function MyBookingsPage() {
  const { get } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");

    try {
      const data = await get("http://localhost:7071/api/bookings/me");
      setBookings(data);
    } catch (e) {
      setMsg("Error loading bookings");
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h3>My Bookings</h3>
      {loading && <p>Loading...</p>}
      {msg && <p>{msg}</p>}
      {!loading && bookings.length === 0 && <p>No bookings yet.</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device</th>
            <th>Status</th>
            <th>Reserved At</th>
            <th>Due At</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.deviceModel}</td>
              <td>{b.status}</td>
              <td>{b.reservedAt}</td>
              <td>{b.dueAt}</td>
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
