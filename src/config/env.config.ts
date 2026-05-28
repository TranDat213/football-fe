import { log } from "console";

export const env = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",

  // App Info
  appName: process.env.NEXT_PUBLIC_APP_NAME || "BullManHotel",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

  // Enviroment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

// Validate required env variables
if (!env.apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}

// Log enviroment info (development only)
if (env.isDevelopment) {
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🚀 API URL:", env.apiUrl);
  console.log("📱 App:", env.appName, env.appVersion);
}