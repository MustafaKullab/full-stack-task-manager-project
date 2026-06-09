export const fetchWithRefresh = async (uri, options = { ...options, credentials: "include" }) => {
  let response = await fetch(uri, options);

  if (response.status === 401) {
    const refresh = await fetch("http://localhost:5000/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      response = await fetch(uri, options);
    } else {
      return;
    }
  }
  return response;
};
