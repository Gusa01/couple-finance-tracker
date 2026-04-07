import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/layout';
import { Messages } from '@/constants/messages';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title={Messages.tabs.dashboard} />

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-sm mb-1">
            Bienvenido
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            {user?.name || 'Usuario'}
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-sm mb-2">
            Resumen del mes
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-400 text-xs">Gastado</Text>
              <Text className="text-xl font-semibold text-gray-900">
                $0.00
              </Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Pendiente</Text>
              <Text className="text-xl font-semibold text-error-500">
                $0.00
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-gray-500 text-sm mb-4">
            Últimos gastos
          </Text>
          <View className="items-center py-8">
            <Text className="text-gray-400 text-center">
              No hay gastos registrados
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
