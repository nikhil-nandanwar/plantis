import { Text, View } from "react-native";

export default function Footer() {
    return (
        <View
            className="flex   items-center border-t border-gray-200 dark:border-gray-700    bg-gray-50 dark:bg-gray-900"
        >
            <View className="py-6 flex-1 items-start px-4 md:px-6 ">
                <Text className={"text-center text-gray-800"}>
                    © {new Date().getFullYear()} Me
                </Text>
            </View>
        </View>
    );
}