import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, Card, AnimatedView, NatureIcon, Button } from "../../components/ui";

export default function HistoryScreen() {
  const handleStartScanning = () => {
    // TODO: Navigate to scan screen
    console.log("Navigate to scan screen");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        {/* Header with Animation */}
        <AnimatedView animation="slideDown" className="mb-8">
          <View className="flex-row items-center mb-4">
            <NatureIcon name="history" size="lg" variant="contained" className="mr-3" />
            <View className="flex-1">
              <Typography variant="h2" weight="bold" className="mb-1">
                Scan History
              </Typography>
              <Typography variant="body1" color="secondary">
                Track your plant health journey
              </Typography>
            </View>
          </View>
        </AnimatedView>

        {/* Enhanced Empty State */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center items-center py-20">
            <AnimatedView animation="bounceIn" delay={300} className="items-center">
              {/* Illustration */}
              <Card variant="gradient" padding="xl" rounded="2xl" className="mb-8 items-center">
                <View className="flex-row space-x-2 mb-4">
                  <NatureIcon name="leaf" size="lg" variant="contained" color="success" animated animationType="float" />
                  <NatureIcon name="camera" size="lg" variant="contained" color="primary" animated animationType="pulse" />
                  <NatureIcon name="sprout" size="lg" variant="contained" color="warning" animated animationType="bounce" />
                </View>
                <NatureIcon name="history" size="2xl" variant="soft" color="neutral" animated animationType="glow" />
              </Card>

              {/* Empty State Content */}
              <Typography variant="h3" weight="semibold" align="center" className="mb-3">
                No Scans Yet
              </Typography>
              <Typography variant="body1" color="secondary" align="center" className="mb-8 max-w-sm leading-relaxed">
                Your plant scan history will appear here. Start by analyzing your first plant to begin tracking its health journey.
              </Typography>

              {/* Call to Action */}
              <Button
                variant="primary"
                size="lg"
                leftIcon="📷"
                onPress={handleStartScanning}
                shadow
                gradient
                className="mb-4"
              >
                Start Your First Scan
              </Button>

              <Button
                variant="soft"
                size="md"
                leftIcon="💡"
                onPress={() => console.log("View tips")}
              >
                Learn About Plant Care
              </Button>
            </AnimatedView>

            {/* Features Preview */}
            <AnimatedView animation="fadeIn" delay={600} className="mt-12 w-full">
              <Typography variant="body2" weight="semibold" color="secondary" align="center" className="mb-4">
                What you'll see here:
              </Typography>
              
              <View className="space-y-3">
                <AnimatedView animation="slideLeft" delay={700}>
                  <Card variant="soft" padding="sm" interactive rounded="xl">
                    <View className="flex-row items-center">
                      <NatureIcon name="healthy" size="md" variant="contained" color="success" animated animationType="pulse" className="mr-3" />
                      <View className="flex-1">
                        <Typography variant="body2" weight="medium">Scan Results</Typography>
                        <Typography variant="caption" color="secondary">Health status and confidence levels</Typography>
                      </View>
                    </View>
                  </Card>
                </AnimatedView>

                <AnimatedView animation="slideLeft" delay={800}>
                  <Card variant="soft" padding="sm" interactive rounded="xl">
                    <View className="flex-row items-center">
                      <NatureIcon name="tips" size="md" variant="contained" color="warning" animated animationType="glow" className="mr-3" />
                      <View className="flex-1">
                        <Typography variant="body2" weight="medium">Care Recommendations</Typography>
                        <Typography variant="caption" color="secondary">Personalized tips for each plant</Typography>
                      </View>
                    </View>
                  </Card>
                </AnimatedView>

                <AnimatedView animation="slideLeft" delay={900}>
                  <Card variant="soft" padding="sm" interactive rounded="xl">
                    <View className="flex-row items-center">
                      <NatureIcon name="sprout" size="md" variant="contained" color="primary" animated animationType="bounce" className="mr-3" />
                      <View className="flex-1">
                        <Typography variant="body2" weight="medium">Progress Tracking</Typography>
                        <Typography variant="caption" color="secondary">Monitor plant health over time</Typography>
                      </View>
                    </View>
                  </Card>
                </AnimatedView>
              </View>
            </AnimatedView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}