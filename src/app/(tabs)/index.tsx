import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, Button, Card, AnimatedView, NatureIcon } from "../../components/ui";

export default function ScanScreen() {
  const handleCameraPress = () => {
    // TODO: Implement camera functionality in future task
    console.log("Camera pressed");
  };

  const handleGalleryPress = () => {
    // TODO: Implement gallery functionality in future task
    console.log("Gallery pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          {/* Header with Animation */}
          <AnimatedView animation="slideDown" className="mb-8">
            <View className="flex-row items-center mb-4">
              <NatureIcon name="leaf" size="lg" variant="contained" className="mr-3" />
              <View className="flex-1">
                <Typography variant="h2" weight="bold" className="mb-1">
                  Scan Your Plant
                </Typography>
                <Typography variant="body1" color="secondary">
                  AI-powered disease detection
                </Typography>
              </View>
            </View>
            <Typography variant="body1" color="secondary" className="leading-relaxed">
              Take a photo or select from gallery to detect plant diseases and get instant care recommendations
            </Typography>
          </AnimatedView>

          {/* Upload Options with Enhanced Cards */}
          <View className="flex-1 justify-center space-y-6 min-h-96">
            <AnimatedView animation="slideUp" delay={200}>
              <Card variant="elevated" padding="lg" shadow interactive className="shadow-nature">
                <Button
                  variant="primary"
                  size="xl"
                  leftIcon="📷"
                  onPress={handleCameraPress}
                  fullWidth
                  shadow
                  gradient
                  className="mb-4"
                >
                  Take Photo
                </Button>
                <View className="items-center">
                  <NatureIcon name="camera" size="xl" variant="contained" animated animationType="pulse" className="mb-4" />
                  <Typography variant="h4" weight="semibold" align="center" className="mb-2">
                    Capture Live
                  </Typography>
                  <Typography variant="body2" color="secondary" align="center">
                    Use your camera to capture a plant leaf in real-time
                  </Typography>
                </View>
              </Card>
            </AnimatedView>

            <AnimatedView animation="slideUp" delay={400}>
              <Card variant="soft" padding="lg" interactive>
                <Button
                  variant="outline"
                  size="xl"
                  leftIcon="🖼️"
                  onPress={handleGalleryPress}
                  fullWidth
                  className="mb-4"
                >
                  Choose from Gallery
                </Button>
                <View className="items-center">
                  <NatureIcon name="gallery" size="xl" variant="outlined" animated animationType="float" className="mb-4" />
                  <Typography variant="h4" weight="semibold" align="center" className="mb-2">
                    Select Photo
                  </Typography>
                  <Typography variant="body2" color="secondary" align="center">
                    Choose an existing photo from your device gallery
                  </Typography>
                </View>
              </Card>
            </AnimatedView>
          </View>

          {/* Enhanced Help Section */}
          <AnimatedView animation="fadeIn" delay={600} className="mt-8">
            <Card variant="glass" padding="md" rounded="xl">
              <View className="flex-row items-start">
                <NatureIcon name="tips" size="md" variant="contained" color="warning" animated animationType="glow" className="mr-3 mt-1" />
                <View className="flex-1">
                  <Typography variant="body2" weight="semibold" color="primary" className="mb-2">
                    Pro Tips for Best Results:
                  </Typography>
                  <View className="space-y-1">
                    <View className="flex-row items-center">
                      <NatureIcon name="sun" size="xs" variant="soft" color="warning" className="mr-2" />
                      <Typography variant="caption" color="secondary">
                        Ensure the leaf is well-lit with natural light
                      </Typography>
                    </View>
                    <View className="flex-row items-center">
                      <NatureIcon name="leaf" size="xs" variant="soft" color="success" className="mr-2" />
                      <Typography variant="caption" color="secondary">
                        Fill most of the frame with the leaf
                      </Typography>
                    </View>
                    <View className="flex-row items-center">
                      <NatureIcon name="camera" size="xs" variant="soft" color="info" className="mr-2" />
                      <Typography variant="caption" color="secondary">
                        Avoid blurry or dark images
                      </Typography>
                    </View>
                    <View className="flex-row items-center">
                      <NatureIcon name="diseased" size="xs" variant="soft" color="error" className="mr-2" />
                      <Typography variant="caption" color="secondary">
                        Focus on areas showing symptoms
                      </Typography>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </AnimatedView>

          {/* Quick Stats or Features */}
          <AnimatedView animation="fadeIn" delay={800} className="mt-6">
            <Card variant="outlined" padding="md" rounded="xl">
              <View className="flex-row justify-around">
                <AnimatedView animation="bounceIn" delay={900} className="items-center">
                  <NatureIcon name="success" size="md" variant="contained" color="success" animated animationType="pulse" className="mb-2" />
                  <Typography variant="caption" color="secondary" align="center" weight="medium">
                    95% Accuracy
                  </Typography>
                </AnimatedView>
                <AnimatedView animation="bounceIn" delay={1000} className="items-center">
                  <NatureIcon name="sprout" size="md" variant="contained" color="primary" animated animationType="bounce" className="mb-2" />
                  <Typography variant="caption" color="secondary" align="center" weight="medium">
                    Instant Results
                  </Typography>
                </AnimatedView>
                <AnimatedView animation="bounceIn" delay={1100} className="items-center">
                  <NatureIcon name="tips" size="md" variant="contained" color="warning" animated animationType="glow" className="mb-2" />
                  <Typography variant="caption" color="secondary" align="center" weight="medium">
                    Care Tips
                  </Typography>
                </AnimatedView>
              </View>
            </Card>
          </AnimatedView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}