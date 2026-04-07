import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/layout';
import { Messages } from '@/constants/messages';
import { useAuthStore } from '@/stores/authStore';

export default function BalanceScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title={Messages.tabs.balance} />

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-sm mb-2">
            Tu balance
          </Text>
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-bold text-success-500">
              $0.00
            </Text>
            <Text className="text-gray-400 text-sm ml-2">
              a favor
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-sm mb-4">
            Desglose
          </Text>
          <View className="space-y-4">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-success-500/10 items-center justify-center mr-3">
                  <Ionicons name="arrow-down" size={20} color="#22c55e" />
                </View>
                <View>
                  <Text className="text-gray-900 font-medium">Te deben</Text>
                  <Text className="text-gray-400 text-xs">Total pendiente</Text>
                </View>
              </View>
              <Text className="text-success-500 font-semibold">$0.00</Text>
            </View>

            <View className="flex-row justify-between items-center py-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-error-500/10 items-center justify-center mr-3">
                  <Ionicons name="arrow-up" size={20} color="#ef4444" />
                </View>
                <View>
                  <Text className="text-gray-900 font-medium">Debes</Text>
                  <Text className="text-gray-400 text-xs">Total pendiente</Text>
                </View>
              </View>
              <Text className="text-error-500 font-semibold">$0.00</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-gray-500 text-sm mb-4">
            Historial de liquidaciones
          </Text>
          <View className="items-center py-8">
            <Ionicons name="checkmark-circle-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-400 text-center mt-4">
              No hay liquidaciones
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
