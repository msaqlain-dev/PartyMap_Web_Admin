export const config = {
  backendUrl:
    import.meta.env.VITE_APP_ENVIRONMENT !== "production"
      ? import.meta.env.VITE_BACKEND_URL_DEV
      : import.meta.env.VITE_BACKEND_URL,
  frontendUrl:
    import.meta.env.VITE_APP_ENVIRONMENT !== "production"
      ? import.meta.env.VITE_FRONTEND_URL_DEV
      : import.meta.env.VITE_FRONTEND_URL,
};
