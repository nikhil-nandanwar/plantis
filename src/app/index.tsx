import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/header";
import Content from "../components/content";
import Footer from "../components/footer";

export default function Page() {
  return (
    <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
      <View className="flex flex-1">
        <Header />
        <Content />
        <Footer />
      </View>
    </SafeAreaView>
  );
}

