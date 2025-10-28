import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { GroupMember } from '../../types/models';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';

interface MemberListProps {
  members: GroupMember[];
}

export default function MemberList({ members }: MemberListProps) {
  const renderMember = ({ item }: { item: GroupMember }) => (
    <Card className="p-4 mb-3">
      <View className="flex-row items-center">
        <Avatar name={item.userId} size="md" className="mr-3" />
        <View className="flex-1">
          <Text className="text-lg font-semibold">{item.userId}</Text>
          <Text className="text-gray-500 text-sm">{item.role}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View className="flex-1">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold">Üyeler ({members.length})</Text>
      </View>
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

