import { ExpenseCategory } from '../types/models';

export interface CategoryInfo {
  id: string;
  emoji: string;
  nameTR: string;
  nameEN: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  [ExpenseCategory.Food]: {
    id: ExpenseCategory.Food,
    emoji: '🍽️',
    nameTR: 'Yemek',
    nameEN: 'Food',
  },
  [ExpenseCategory.Transport]: {
    id: ExpenseCategory.Transport,
    emoji: '🚗',
    nameTR: 'Ulaşım',
    nameEN: 'Transport',
  },
  [ExpenseCategory.Accommodation]: {
    id: ExpenseCategory.Accommodation,
    emoji: '🏨',
    nameTR: 'Konaklama',
    nameEN: 'Accommodation',
  },
  [ExpenseCategory.Entertainment]: {
    id: ExpenseCategory.Entertainment,
    emoji: '🎮',
    nameTR: 'Eğlence',
    nameEN: 'Entertainment',
  },
  [ExpenseCategory.Shopping]: {
    id: ExpenseCategory.Shopping,
    emoji: '🛍️',
    nameTR: 'Alışveriş',
    nameEN: 'Shopping',
  },
  [ExpenseCategory.Other]: {
    id: ExpenseCategory.Other,
    emoji: '📦',
    nameTR: 'Diğer',
    nameEN: 'Other',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

