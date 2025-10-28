import { useQuery } from '@tanstack/react-query';
import { getGroupMembers } from '../lib/firebase/firestore';
import { GroupMember } from '../types/models';

/**
 * Hook to fetch group members
 */
export function useGroupMembers(groupId: string | undefined) {
  return useQuery({
    queryKey: ['members', groupId],
    queryFn: () => (groupId ? getGroupMembers(groupId) : []),
    enabled: !!groupId,
  });
}

/**
 * Hook to fetch a single group member
 */
export function useGroupMember(
  groupId: string | undefined,
  memberId: string | undefined
) {
  return useQuery({
    queryKey: ['member', groupId, memberId],
    queryFn: async () => {
      if (!groupId || !memberId) return null;
      const members = await getGroupMembers(groupId);
      return members.find((m) => m.id === memberId) || null;
    },
    enabled: !!groupId && !!memberId,
  });
}

