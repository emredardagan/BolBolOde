import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useGroupMembers } from '../../hooks/useGroupMembers';
import { useGroupExpenses } from '../../hooks/useExpenses';
import { simplifyDebts } from '../../services/algorithms/debt-settlement';
import { formatCurrency } from '../../services/algorithms/currency-conversion';
import { Currency } from '../../types/enums';
import { Balance, SettlementSuggestion } from '../../types/models';

interface BalanceScreenProps {
  groupId: string;
}

export default function BalanceScreen({ groupId }: BalanceScreenProps) {
  const { data: members } = useGroupMembers(groupId);
  const { data: expenses } = useGroupExpenses(groupId);

  // Calculate balances
  const balances: Balance[] = members?.map((member) => {
    // Mock calculation - should use balance calculation service
    const paid = expenses
      ?.filter((e) => e.payerId === member.id)
      .reduce((sum, e) => sum + e.baseCurrencyAmount, 0) || 0;

    const owed = expenses
      ?.filter((e) => e.participantIds.includes(member.id))
      .reduce((sum, e) => sum + e.baseCurrencyAmount / e.participantIds.length, 0) || 0;

    return {
      memberId: member.id,
      name: member.userId,
      balance: paid - owed,
    };
  }) || [];

  // Simplify debts
  const settlements = simplifyDebts(balances);

  const renderBalance = ({ item }: { item: Balance }) => (
    <View className="bg-white p-4 mb-3 rounded-lg border border-gray-200">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text
          className={`text-lg font-bold ${
            item.balance > 0 ? 'text-success-600' : 'text-danger-600'
          }`}
        >
          {item.balance > 0 ? '+' : ''}
          {formatCurrency(item.balance, Currency.TRY)}
        </Text>
      </View>
    </View>
  );

  const renderSettlement = ({ item }: { item: SettlementSuggestion }) => (
    <View className="bg-white p-4 mb-3 rounded-lg border border-gray-200">
      <Text className="text-gray-700">
        <Text className="font-semibold">{item.fromMemberName}</Text> →{' '}
        <Text className="font-semibold">{item.toMemberName}</Text>
      </Text>
      <Text className="text-lg font-bold text-primary-600 mt-1">
        {formatCurrency(item.amount, Currency.TRY)}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold">Bakiyeler</Text>
      </View>

      <View className="p-6">
        <Text className="text-lg font-semibold mb-3">Kişi Bakiyeleri</Text>
        {balances.length > 0 ? (
          <FlatList
            data={balances}
            renderItem={renderBalance}
            keyExtractor={(item) => item.memberId}
            scrollEnabled={false}
          />
        ) : (
          <Text className="text-gray-500">Henüz bakiye yok</Text>
        )}

        {settlements.length > 0 && (
          <>
            <Text className="text-lg font-semibold mb-3 mt-6">
              Önerilen Transferler
            </Text>
            <FlatList
              data={settlements}
              renderItem={renderSettlement}
              keyExtractor={(item, index) => `${item.fromMemberId}-${item.toMemberId}-${index}`}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </View>
  );
}

