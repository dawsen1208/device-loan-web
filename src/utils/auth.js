// src/utils/auth.js
export function getUserRoles(user) {
  if (!user) return [];
  // 这里使用你在 Auth0 中配置的自定义 claim
  return user["https://cdls-api/roles"] || [];
}

export function hasRole(user, role) {
  const roles = getUserRoles(user);
  return roles.includes(role);
}
