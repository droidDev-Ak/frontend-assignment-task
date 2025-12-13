const BASE_APP_URL = "http://localhost:3000/api";

export const apiRequest = async (endpoint, method, data=null) => {
  console.log(`${BASE_APP_URL}/${endpoint}`);
  const options = {
    method: method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_APP_URL}/${endpoint}`, { ...options });


  const result = await res.json();

  if (!result) {
    throw new Error(result.message || "API Error");
  }
  return result;
};
