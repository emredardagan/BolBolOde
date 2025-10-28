import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { signOutUser } from '../../lib/firebase/auth';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const { user, userData } = useAuth();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Çıkmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await signOutUser();
          logout();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-8 border-b border-gray-200">
        <View className="items-center">
          <View className="w-20 h-20 bg-primary-600 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl">{userData?.avatar || '👤'}</Text>
          </View>
          <Text className="text-xl font-bold">{userData?.name || user?.email}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>
      </View>
      
      <View className="p-6">
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Profil Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Ayarlar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Hakkında</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-red-50 p-4 rounded-lg border border-red-200 mt-6"
          onPress={handleLogout}
        >
          <Text className="text-lg font-semibold text-red-600 text-center">
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

