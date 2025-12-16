import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function MyBookingsPage() {
  const { bookingGet } = useApi();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");

    try {
      const data = await bookingGet("/bookings/me");
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e.message || "Error loading bookings");
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'reserved':
        return 'badge-success';
      case 'returned':
        return 'badge-gray';
      case 'overdue':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  return (
    <div>
      <header className="page-header flex-between">
        <h2 className="page-title">My Bookings</h2>
        <button className="btn btn-outline" onClick={load}>
          Refresh
        </button>
      </header>

      {loading && <p className="text-center" style={{ color: 'var(--text-muted)' }}>Loading...</p>}
      
      {msg && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {msg}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You haven't reserved any devices yet.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Device Model</th>
                <th>Status</th>
                <th>Reserved Date</th>
                <th>Due Date</th>
                <th>Booking ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.deviceModel}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>{new Date(b.reservedAt).toLocaleDateString()}</td>
                  <td>{new Date(b.dueAt).toLocaleDateString()}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85em', color: 'var(--text-muted)' }}>
                    {b.id.split('-')[0]}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
