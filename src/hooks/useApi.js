import { useAuth0 } from "@auth0/auth0-react";

const BOOKING_API = import.meta.env.VITE_BOOKING_API;
const INVENTORY_API = import.meta.env.VITE_INVENTORY_API;

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  async function apiFetch(url, options = {}) {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: "https://cdls-api",
      },
    });

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return res.json();
  }

  return {
    bookingGet: (path) => apiFetch(`${BOOKING_API}${path}`),
    bookingPost: (path, body) =>
      apiFetch(`${BOOKING_API}${path}`, {
        method: "POST",
        body: JSON.stringify(body),
      }),

    inventoryGet: async (path) => {
      const res = await fetch(`${INVENTORY_API}${path}`);
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
  };
}
