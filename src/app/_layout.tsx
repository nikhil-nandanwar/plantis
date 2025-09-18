import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { NetworkIndicator } from "../components/NetworkStatus";
import { initializeServices } from "../services/initializationService";

export default function RootLayout() {
  useEffect(() => {
    // Initialize all services on app start
    initializeServices().catch((error) => {
      console.error('Failed to initialize app services:', error);
    });
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      <NetworkIndicator />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ErrorBoundary>
  );
}
