import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  currencyCode: string;
  currencyName: string;
  type: 'buy' | 'sell';
  amount: number;
  rate: number;
  targetCurrency: 'USD' | 'EUR';
  total: number;
  timestamp: string;
}

const STORAGE_KEY = '@transactions';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedTransactions = JSON.parse(stored);
        // Sort transactions by timestamp in descending order (newest first)
        const sortedTransactions = parsedTransactions.sort((a: Transaction, b: Transaction) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setTransactions(sortedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      // Add new transaction to the beginning of the array
      const newTransactions = [transaction, ...transactions];
      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
      // Update state
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setTransactions([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return {
    transactions,
    addTransaction,
    clearHistory,
  };
}