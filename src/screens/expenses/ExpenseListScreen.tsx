import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useGroupExpenses } from '../../hooks/useExpenses';
import { Expense } from '../../types/models';
import { formatCurrency } from '../../services/algorithms/currency-conversion';
import { Currency } from '../../types/enums';

interface ExpenseListScreenProps {
  groupId: string;
}

export default function ExpenseListScreen({ groupId }: ExpenseListScreenProps) {
  const { data: expenses, isLoading } = useGroupExpenses(groupId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const renderExpense = ({ item }: { item: Expense }) => (
    <TouchableOpacity className="bg-white p-4 mb-3 rounded-lg border border-gray-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold">{item.title}</Text>
          <Text className="text-gray-500 text-sm">
            {new Date(item.date.seconds * 1000).toLocaleDateString('tr-TR')}
          </Text>
          <Text className="text-gray-500 text-sm">{item.category}</Text>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-primary-600">
            {formatCurrency(item.baseCurrencyAmount, item.currency as Currency)}
          </Text>
          <Text className="text-gray-500 text-xs">{item.participantIds.length} kişi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {expenses && expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={renderExpense}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-center">
            Henüz harcama eklenmemiş
          </Text>
        </View>
      )}
    </View>
  );
}

