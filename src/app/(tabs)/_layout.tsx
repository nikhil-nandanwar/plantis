import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { NatureIcon } from "../../components/ui";

// Enhanced icon components for tabs with better styling
const ScanIcon = ({ focused }: { focused: boolean }) => (
  <View className="items-center justify-center">
    <NatureIcon 
      name="camera" 
      size="md" 
      variant={focused ? "contained" : "default"}
      color={focused ? "primary" : "neutral"}
    />
  </View>
);

const HistoryIcon = ({ focused }: { focused: boolean }) => (
  <View className="items-center justify-center">
    <NatureIcon 
      name="history" 
      size="md" 
      variant={focused ? "contained" : "default"}
      color={focused ? "primary" : "neutral"}
    />
  </View>
);

const TipsIcon = ({ focused }: { focused: boolean }) => (
  <View className="items-center justify-center">
    <NatureIcon 
      name="tips" 
      size="md" 
      variant={focused ? "contained" : "default"}
      color={focused ? "primary" : "neutral"}
    />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          paddingBottom: Platform.OS === 'ios' ? 20 : 12,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 88 : 72,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ScanIcon,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tips",
          tabBarIcon: TipsIcon,
        }}
      />
    </Tabs>
  );
}