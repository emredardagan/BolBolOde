import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateExpense } from '../../hooks/useExpenses';
import { useGroupMembers } from '../../hooks/useGroups';
import { CURRENCY_LIST } from '../../constants/currencies';
import { CATEGORY_LIST } from '../../constants/categories';
import { Currency } from '../../types/enums';
import { toMinorUnits } from '../../services/algorithms/currency-conversion';

interface AddExpenseScreenProps {
  groupId: string;
}

export default function AddExpenseScreen({ groupId }: AddExpenseScreenProps) {
  const navigation = useNavigation();
  const createExpense = useCreateExpense();
  const { data: members } = useGroupMembers(groupId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.TRY);
  const [category, setCategory] = useState('Food');
  const [payerId, setPayerId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const handleToggleParticipant = (memberId: string) => {
    if (participantIds.includes(memberId)) {
      setParticipantIds(participantIds.filter((id) => id !== memberId));
    } else {
      setParticipantIds([...participantIds, memberId]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !amount || !payerId || participantIds.length === 0) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const amountMinor = toMinorUnits(parseFloat(amount), currency);

    try {
      await createExpense.mutateAsync({
        groupId,
        title,
        amount: amountMinor,
        currency,
        category,
        date: new Date(),
        payerId,
        splitType: 'equal',
        participantIds,
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-6">
        <Text className="text-2xl font-bold mb-6">Harcama Ekle</Text>

        <Text className="text-gray-700 mb-2">Başlık *</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          placeholder="Örn: Restoran Yemeği"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-gray-700 mb-2">Tutar *</Text>
        <View className="flex-row mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 mr-2"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View className="w-24 border border-gray-300 rounded-lg justify-center px-2">
            <Text className="text-center font-semibold">{currency}</Text>
          </View>
        </View>

        <Text className="text-gray-700 mb-2">Kategori</Text>
        <View className="flex-row flex-wrap mb-4">
          {CATEGORY_LIST.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className={`mr-2 mb-2 px-4 py-2 rounded-lg border ${
                category === cat.id
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => setCategory(cat.id)}
            >
              <Text
                className={
                  category === cat.id ? 'text-white' : 'text-gray-700'
                }
              >
                {cat.emoji} {cat.nameTR}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-700 mb-2">Ödeyen Kişi *</Text>
        {members?.map((member) => (
          <TouchableOpacity
            key={member.id}
            className={`border rounded-lg p-3 mb-2 ${
              payerId === member.id
                ? 'bg-primary-50 border-primary-600'
                : 'bg-white border-gray-300'
            }`}
            onPress={() => setPayerId(member.id)}
          >
            <Text className="font-semibold">{member.userId}</Text>
          </TouchableOpacity>
        ))}

        <Text className="text-gray-700 mb-2 mt-4">Dahil Olan Kişiler *</Text>
        {members?.map((member) => (
          <TouchableOpacity
            key={member.id}
            className={`border rounded-lg p-3 mb-2 ${
              participantIds.includes(member.id)
                ? 'bg-primary-50 border-primary-600'
                : 'bg-white border-gray-300'
            }`}
            onPress={() => handleToggleParticipant(member.id)}
          >
            <Text className="font-semibold">{member.userId}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="bg-primary-600 rounded-lg py-3 mt-6"
          onPress={handleSubmit}
          disabled={createExpense.isPending}
        >
          {createExpense.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Harcamayı Kaydet
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

