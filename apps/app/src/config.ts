export const getBaseApiUrl = () => {
  return `${import.meta.env.VITE_API_URL || "http://localhost:3002"}`;
};

export const getBaseUrl = () => {
  return `${import.meta.env.VITE_APP_URL || "http://localhost:3001"}`;
};

export const getClickUpClientId = () => {
  return import.meta.env.VITE_CLICKUP_CLIENT_ID;
};
