// فایل: src/utils/apiFetch.ts

const BASE_URL = "http://localhost:8000/v1";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, defaultOptions);

  const isAuthRoute = endpoint.includes("/auth/login") || endpoint.includes("/auth/register");

  if (response.status === 401 && !isAuthRoute) {
    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await fetch(`${BASE_URL}${endpoint}`, defaultOptions);
      } else {
        // فقط اگر کاربر در صفحه محافظت‌شده باشد و لاگین نباشد، او را به لاگین می‌فرستیم
        if (typeof window !== "undefined" && !endpoint.includes("/auth/me")) {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      // خطا در ارتباط با رفرش توکن، نادیده گرفته می‌شود
    }
  }

  const originalJson = response.json.bind(response);
  
  response.json = async () => {
    const parsedData = await originalJson();
    if (parsedData && parsedData.data !== undefined) {
      return parsedData.data;
    }
    return parsedData;
  };

  return response;
}