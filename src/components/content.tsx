import { Text, View } from "react-native";

export default function Content() {
    return (

        <View className="flex-1">
            <View className="py-12 md:py-24 lg:py-32 xl:py-48">
                <View className="px-4 md:px-6">
                    <View className="flex flex-col items-center gap-4 text-center">
                        <Text
                            role="heading"
                            className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                        >
                            Welcome to Project ACME
                        </Text>
                        <Text className="mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400">
                            Discover and collaborate on acme. Explore our services now.
                        </Text>

                        <View className="gap-4">
                            <Text className="text-lg font-medium underline">
                                Explore
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}