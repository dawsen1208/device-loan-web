import { useAuth0 } from "@auth0/auth0-react";


export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  /**
   * 核心方法 apiFetch():
   * 自动带 Token 调用后端 Functions
   */
  async function apiFetch(url, options = {}) {
    // 获取 Access Token
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: "https://cdls-api", // 与 Auth0 API Identifier 一致
      },
    });

    // 执行请求
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    return response;
  }

  /**
   * GET 请求封装
   */
  async function get(url) {
    const res = await apiFetch(url, { method: "GET" });
    return res.json();
  }

  /**
   * POST 请求封装
   */
  async function post(url, body = {}) {
    const res = await apiFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return res.json();
  }

  return { apiFetch, get, post };
}
