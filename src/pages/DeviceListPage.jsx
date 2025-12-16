import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

const DEVICES = [
  { model: "Camera-A", name: "4K Camera A", desc: "Professional 4K cinema camera with lens kit." },
  { model: "Laptop-B", name: "High-spec Laptop B", desc: "i9 Processor, 32GB RAM, RTX 4080." },
  { model: "Mic-C", name: "Wireless Microphone C", desc: "Studio quality wireless microphone system." },
];

export default function DeviceListPage() {
  const { inventoryGet, bookingPost } = useApi();

  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      const result = {};

      for (const d of DEVICES) {
        try {
          const data = await inventoryGet(
            `/inventory/${encodeURIComponent(d.model)}`
          );
          result[d.model] = data;
        } catch (e) {
          result[d.model] = null;
        }
      }

      setInventory(result);
      setLoading(false);
    }

    loadInventory();
  }, []);

  async function reserve(model) {
    setMsg("");
    setActionLoading(true);

    try {
      const data = await bookingPost("/bookings", {
        deviceModel: model,
      });

      setMsg(`Successfully reserved ${model} (Booking ID: ${data.id})`);

      // Refresh specific item
      const updated = await inventoryGet(
        `/inventory/${encodeURIComponent(model)}`
      );

      setInventory((prev) => ({
        ...prev,
        [model]: updated,
      }));
    } catch (e) {
      setMsg(e.message || "Reservation failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <header className="page-header flex-between">
        <h2 className="page-title">Available Devices</h2>
      </header>

      {msg && (
        <div style={{ 
          background: msg.includes("failed") ? '#fee2e2' : '#dcfce7',
          color: msg.includes("failed") ? '#b91c1c' : '#15803d',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center" style={{ color: 'var(--text-muted)' }}>Loading inventory...</div>
      ) : (
        <div className="grid">
          {DEVICES.map((d) => {
            const inv = inventory[d.model];
            const available = inv?.availableCount ?? 0;
            const isAvailable = available > 0;

            return (
              <div key={d.model} className="card">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <h3 className="card-title">{d.name}</h3>
                  <span className={`badge ${isAvailable ? 'badge-success' : 'badge-gray'}`}>
                    {isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                
                <p className="card-meta">{d.desc}</p>
                
                <div className="flex-between" style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    In Stock: <strong style={{ color: 'var(--text-main)' }}>{available}</strong>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    disabled={!isAvailable || actionLoading}
                    onClick={() => reserve(d.model)}
                  >
                    {actionLoading ? 'Processing...' : 'Reserve'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
