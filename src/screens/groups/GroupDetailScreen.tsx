import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGroup } from '../../hooks/useGroups';

export default function GroupDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const id = (route.params as any)?.id;
  const { data: group, isLoading } = useGroup(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Grup bulunamadı</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold">{group.name}</Text>
        <Text className="text-gray-500">{group.description}</Text>
      </View>
      
      <View className="p-6">
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Harcamalar</Text>
          <Text className="text-gray-500">{group.totalExpenses} harcama</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Bakiyeler</Text>
          <Text className="text-gray-500">Bakiye özeti</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-white p-4 rounded-lg border border-gray-200"
          onPress={() => {}}
        >
          <Text className="text-lg font-semibold">Üyeler</Text>
          <Text className="text-gray-500">{group.memberCount} üye</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

