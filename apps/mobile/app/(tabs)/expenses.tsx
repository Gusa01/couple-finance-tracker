import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/layout';
import { Messages } from '@/constants/messages';

export default function ExpensesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title={Messages.tabs.expenses} />

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <Text className="text-gray-500 text-sm mb-2">
            Gastos del mes
          </Text>
          <Text className="text-3xl font-bold text-gray-900">
            $0.00
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-gray-500 text-sm mb-4">
            Lista de gastos
          </Text>
          <View className="items-center py-8">
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-400 text-center mt-4">
              No hay gastos registrados
            </Text>
            <Text className="text-gray-400 text-center text-sm mt-1">
              Presiona + para agregar un gasto
            </Text>
          </View>
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-600 rounded-full items-center justify-center shadow-lg active:bg-primary-700"
        onPress={() => {
          // TODO: Navigate to add expense
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
