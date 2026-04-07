import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-primary-600 font-semibold">
            Volver al inicio
          </Text>
        </Link>
      </View>
    </>
  );
}
