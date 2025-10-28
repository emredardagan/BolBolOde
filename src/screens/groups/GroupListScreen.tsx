import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useUserGroups } from '../../hooks/useGroups';
import { Group } from '../../types/models';

export default function GroupListScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: groups, isLoading } = useUserGroups(user?.uid);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-3 rounded-lg border border-gray-200"
      onPress={() => navigation.navigate('GroupDetail' as never, { id: item.id } as never)}
    >
      <View className="flex-row items-center">
        <Text className="text-2xl mr-3">{item.emoji || '💰'}</Text>
        <View className="flex-1">
          <Text className="text-lg font-semibold">{item.name}</Text>
          <Text className="text-gray-500">{item.memberCount} üye</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold">Gruplarım</Text>
      </View>
      
      {groups && groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-center mb-4">
            Henüz grup oluşturmadınız
          </Text>
          <TouchableOpacity
            className="bg-primary-600 rounded-lg px-6 py-3"
            onPress={() => navigation.navigate('CreateGroup' as never)}
          >
            <Text className="text-white font-semibold">İlk Grubunu Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-16 h-16 items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('CreateGroup' as never)}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}

