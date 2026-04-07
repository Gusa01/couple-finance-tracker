import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { UserAvatar } from './UserAvatar';
import { Messages } from '@/constants/messages';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
}

export function Header({ title, showLogout = true }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center">
        {user && (
          <UserAvatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            size="md"
          />
        )}
        <View className="ml-3">
          <Text className="text-lg font-bold text-gray-900">
            {title}
          </Text>
          {user && (
            <Text className="text-xs text-gray-500">
              {user.name}
            </Text>
          )}
        </View>
      </View>

      {showLogout && (
        <Pressable
          onPress={logout}
          className="p-2 rounded-full active:bg-gray-100"
        >
          <Ionicons name="log-out-outline" size={24} color="#6b7280" />
        </Pressable>
      )}
    </View>
  );
}
