import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExpandableTipCard } from "../../components/tips";
import { tipCategories } from "../../services/tipsService";
import { Typography, Card, AnimatedView, NatureIcon } from "../../components/ui";

export default function TipsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('general-care');

  const currentCategory = tipCategories.find(cat => cat.id === selectedCategory);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        {/* Header with Animation */}
        <AnimatedView animation="slideDown" className="mb-8">
          <View className="flex-row items-center mb-4">
            <NatureIcon name="tips" size="lg" variant="contained" color="warning" animated animationType="glow" className="mr-3" />
            <View className="flex-1">
              <Typography variant="h2" weight="bold" className="mb-1">
                Plant Care Tips
              </Typography>
              <Typography variant="body1" color="secondary">
                Comprehensive guide to keeping your plants healthy
              </Typography>
            </View>
          </View>
        </AnimatedView>

        {/* Category Selector */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-3"
          >
            {tipCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category.id
                    ? 'bg-primary-green border-primary-green'
                    : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{category.icon}</Text>
                  <Text
                    className={`font-semibold ${
                      selectedCategory === category.id
                        ? 'text-white'
                        : 'text-text-primary'
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Description */}
        {currentCategory && (
          <AnimatedView animation="scaleIn" className="mb-6">
            <Card variant="elevated" padding="md" shadow rounded="xl">
              <View className="flex-row items-center mb-3">
                <Text className="text-2xl mr-3">{currentCategory.icon}</Text>
                <Typography variant="h4" weight="semibold" className="flex-1">
                  {currentCategory.name}
                </Typography>
              </View>
              <Typography variant="body2" color="secondary">
                {currentCategory.description}
              </Typography>
            </Card>
          </AnimatedView>
        )}

        {/* Tips List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {currentCategory?.tips.map((tip) => (
            <ExpandableTipCard
              key={tip.id}
              tip={tip}
            />
          ))}

          {/* Pro Tip */}
          <AnimatedView animation="fadeIn" delay={300} className="mt-4">
            <Card variant="gradient" padding="lg" rounded="xl" shadow>
              <View className="flex-row items-start">
                <NatureIcon name="sprout" size="lg" variant="soft" color="success" animated animationType="bounce" className="mr-4" />
                <View className="flex-1">
                  <Typography variant="h4" weight="semibold" color="inverse" className="mb-3">
                    Pro Tip
                  </Typography>
                  <Typography variant="body2" color="inverse" className="leading-6">
                    Use the scan feature regularly to catch potential issues early. 
                    Early detection is key to maintaining healthy plants! Check back here 
                    for specific treatment advice when you detect any problems.
                  </Typography>
                </View>
              </View>
            </Card>
          </AnimatedView>

          {/* Bottom Spacing */}
          <View className="h-8" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}