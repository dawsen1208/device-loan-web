import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

export default function AdminBookingsPage() {
  const { bookingGet, bookingPost } = useApi();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    setMsg("");

    try {
      const data = await bookingGet("/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e.message || "Error loading all bookings");
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function returnBooking(id) {
    if (!window.confirm("Mark this booking as returned?")) return;
    setMsg("");

    try {
      await bookingPost(`/bookings/${id}/return`);
      setMsg(`Returned ${id}`);
      await load();
    } catch (e) {
      setMsg(e.message || "Failed to return");
    }
  }

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
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2>All Bookings</h2>
        <button 
          className="btn btn-outline" 
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {msg && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
          {msg}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No bookings found in the system.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Device</th>
                <th>Status</th>
                <th>Reserved</th>
                <th>Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                    {b.id.substring(0, 8)}...
                  </td>
                  <td>{b.userId}</td>
                  <td style={{ fontWeight: 500 }}>{b.deviceModel}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>{new Date(b.reservedAt).toLocaleDateString()}</td>
                  <td>{new Date(b.dueAt).toLocaleDateString()}</td>
                  <td>
                    {b.status !== "returned" && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => returnBooking(b.id)}
                      >
                        Return
                      </button>
                    )}
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
