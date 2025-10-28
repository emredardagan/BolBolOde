import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup, getUserGroups, getGroup } from '../lib/firebase/firestore';
import { Group } from '../types/models';
import { CreateGroupRequest } from '../types/api';
// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
import { Timestamp } from 'firebase/firestore';

/**
 * Hook to fetch user's groups
 */
export function useUserGroups(userId: string | undefined) {
  return useQuery({
    queryKey: ['groups', userId],
    queryFn: () => (userId ? getUserGroups(userId) : []),
    enabled: !!userId,
  });
}

/**
 * Hook to fetch a single group
 */
export function useGroup(groupId: string | undefined) {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => (groupId ? getGroup(groupId) : null),
    enabled: !!groupId,
  });
}

/**
 * Hook to create a new group
 */
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupRequest): Promise<Group> => {
      const groupId = uuidv4();
      const group: Group = {
        id: groupId,
        name: data.name,
        description: data.description || null,
        baseCurrency: data.baseCurrency,
        emoji: data.emoji || null,
        avatarUrl: null,
        ownerId: '', // Will be set from auth
        startDate: Timestamp.fromDate(data.startDate),
        endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
        status: 'Active',
        memberCount: 1,
        totalExpenses: 0,
        totalAmount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        deletedAt: null,
      };

      await createGroup(group);
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

