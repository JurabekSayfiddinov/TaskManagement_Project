import axios, { type InternalAxiosRequestConfig } from "axios";

type AuthRequest = InternalAxiosRequestConfig & {
  sessionId?: string | null;
  retried?: boolean;
};

type Tokens = { access_token: string; refresh_token: string };

const baseURL = "http://127.0.0.1:3000/api/v1";
let pendingRefresh: { sessionId: string; promise: Promise<void> } | undefined;

export const api = axios.create({ baseURL });

export function saveSession(token: string, refreshToken: string) {
  localStorage.setItem("auth_session", crypto.randomUUID());
  localStorage.setItem("token", token);
  localStorage.setItem("refresh_token", refreshToken);
}

function clearSession() {
  localStorage.removeItem("auth_session");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("workspaceSlug");
}

function revokeRefreshToken(refreshToken: string) {
  void axios.post(`${baseURL}/auth/logout`, { refresh_token: refreshToken }).catch(() => {
    // Local logout still works if the server cannot be reached.
  });
}

export function logoutSession() {
  const refreshToken = localStorage.getItem("refresh_token");
  clearSession();
  if (refreshToken) revokeRefreshToken(refreshToken);
}

function signInAgain() {
  clearSession();
  window.location.replace("/login");
}

api.interceptors.request.use((config: AuthRequest) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("auth_session");
    if (config.retried && config.sessionId !== sessionId) {
      throw new Error("The session changed before retry.");
    }
    config.sessionId = sessionId;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

async function refreshTokens(sessionId: string) {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    signInAgain();
    throw new Error("Please sign in again.");
  }

  try {
    const { data } = await axios.post<Tokens>(`${baseURL}/auth/refresh`, {
      refresh_token: refreshToken,
    });

    if (localStorage.getItem("auth_session") !== sessionId) {
      revokeRefreshToken(data.refresh_token);
      throw new Error("The session changed during refresh.");
    }
    if (localStorage.getItem("refresh_token") === refreshToken) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    }
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      localStorage.getItem("auth_session") === sessionId &&
      localStorage.getItem("refresh_token") === refreshToken
    ) {
      signInAgain();
    }
    throw error;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (typeof window === "undefined" || !axios.isAxiosError(error)) throw error;

    const request = error.config as AuthRequest | undefined;
    const response = error.response;
    if (
      !request ||
      request.retried ||
      response?.status !== 401 ||
      response.data?.error?.message !== "Invalid or expired access token"
    ) {
      throw error;
    }

    const sessionId = localStorage.getItem("auth_session");
    const token = localStorage.getItem("token");
    if (request.sessionId !== sessionId || !token) throw error;
    if (!sessionId) {
      signInAgain();
      throw error;
    }

    request.retried = true;

    // If another request already refreshed the access token, retry with it.
    if (request.headers.get("Authorization") === `Bearer ${token}`) {
      if (pendingRefresh?.sessionId !== sessionId) {
        const promise = refreshTokens(sessionId).finally(() => {
          if (pendingRefresh?.promise === promise) pendingRefresh = undefined;
        });
        pendingRefresh = { sessionId, promise };
      }
      await pendingRefresh.promise;
    }

    if (localStorage.getItem("auth_session") !== sessionId) throw error;
    return api(request);
  },
);
