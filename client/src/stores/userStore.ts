import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';

interface User {
  id: number;
  username: string;
  password: string;
}

interface TokenPayload {
  userId: number;
  exp: number;
  iat: number;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    token: null as string | null,
    refreshToken: null as string | null,
    username: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.token !== null;
    },
  },

  actions: {
    async register(username: String, password: String): Promise<void> {
      try {
        console.log(import.meta.env.VITE_API_URL + 'register');
        const response = await fetch(import.meta.env.VITE_API_URL + 'register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log(data.message);
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    authenticateWithTokens(token: string, refreshToken: string): void {
      // Set the tokens in the store
      this.token = token;
      this.refreshToken = refreshToken;
    },

    loadAuthenticationState(): void {
      // Load tokens from local storage if available
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        // Set the tokens in the store
        this.authenticateWithTokens(token, refreshToken);
      }
    },

    async authenticate(username: string, password: string): Promise<void> {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + 'authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        const token = data.token;
        const refreshToken = data.refreshToken;

        // Set the username in the store
        this.username = username;

        // Set the tokens in the store
        this.authenticateWithTokens(token, refreshToken);

        // Save tokens to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        console.log('Authentication successful');
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    async refreshAccessToken(): Promise<void> {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const response = await fetch(import.meta.env.VITE_API_URL + 'refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        this.token = data.token;

        console.log('Access token refreshed');
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    logout(): void {
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    async accessProtectedRoute(): Promise<void> {
      try {
        await this.ensureAccessToken();

        const response = await fetch(import.meta.env.VITE_API_URL + 'protected', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Access denied');
        }

        const data = await response.json();
        console.log(data.message);
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    decodeToken(): void {
      if (this.token) {
        const decoded = jwtDecode<TokenPayload>(this.token);
        console.log('Decoded token:', decoded);
      }
    },

    async ensureAccessToken(): Promise<void> {
      if (this.token) {
        const decoded = jwtDecode<TokenPayload>(this.token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          // Access token has expired, refresh it
          await this.refreshAccessToken();
        }
      }
    },
  },
  persist: true,
  // Initialize the store on application startup
  // beforeMount() {
  //   this.loadAuthenticationState();
  // },
});
