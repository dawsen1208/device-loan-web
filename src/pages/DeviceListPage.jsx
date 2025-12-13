// src/pages/DeviceListPage.jsx
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

const DEVICES = [
  { model: "Camera-A", name: "4K Camera A" },
  { model: "Laptop-B", name: "High-spec Laptop B" },
  { model: "Mic-C", name: "Wireless Microphone C" },
];

export default function DeviceListPage() {
  const { apiFetch } = useApi();
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      const result = {};

      for (const d of DEVICES) {
        try {
          const res = await fetch(
            `http://localhost:7072/api/inventory/${encodeURIComponent(d.model)}`
          );
          result[d.model] = res.ok ? await res.json() : null;
        } catch {
          result[d.model] = null;
        }
      }

      setInventory(result);
      setLoading(false);
    }

    loadInventory();
  }, []);

  async function reserve(model) {
    try {
      const res = await apiFetch("http://localhost:7071/api/bookings", {
        method: "POST",
        body: JSON.stringify({ deviceModel: model }),
      });

      if (!res.ok) {
        setMsg("Failed: " + (await res.text()));
        return;
      }

      const data = await res.json();
      setMsg(`Reserved ${model} successfully (id: ${data.id})`);
    } catch (e) {
      setMsg("Reservation error");
    }
  }

  return (
    <div>
      <h3>Available Devices</h3>
      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {DEVICES.map((d) => {
          const inv = inventory[d.model];
          const available = inv ? inv.availableCount : "–";

          return (
            <div
              key={d.model}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{d.name}</strong> <br />
                Model: {d.model} <br />
                Available:{" "}
                <strong>{available === "–" ? "Unknown" : available}</strong>
              </div>

              <button onClick={() => reserve(d.model)}>Reserve</button>
            </div>
          );
        })}
      </div>

      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
