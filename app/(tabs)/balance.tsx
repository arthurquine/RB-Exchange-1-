import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { formatCurrency } from '@/utils/formatters';
import { CURRENCIES } from '@/data/currencies';
import EmptyState from '@/components/EmptyState';
import { ArrowRightLeft } from 'lucide-react-native';

export default function BalanceScreen() {
  const { transactions } = useTransactionHistory();
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'EUR'>('EUR');

  // Calculate balances
  const balances = React.useMemo(() => {
    const balanceMap = new Map();

    transactions.forEach(transaction => {
      // Only process transactions in the selected display currency
      if (transaction.targetCurrency === displayCurrency) {
        const key = transaction.currencyCode;
        const currentBalance = balanceMap.get(key) || {
          buys: 0,
          sells: 0,
          currency: CURRENCIES.find(c => c.code === key),
          targetCurrency: transaction.targetCurrency,
        };

        if (transaction.type === 'buy') {
          currentBalance.buys += transaction.amount;
        } else {
          currentBalance.sells += transaction.amount;
        }

        balanceMap.set(key, currentBalance);
      }
    });

    return Array.from(balanceMap.entries()).map(([code, data]) => ({
      code,
      ...data,
      netTotal: (data.buys - data.sells) * (transactions.find(t => 
        t.currencyCode === code && t.targetCurrency === data.targetCurrency
      )?.rate || 0),
    }));
  }, [transactions, displayCurrency]);

  // Calculate total net balance in DZD for all currencies
  const totalNetBalanceDZD = React.useMemo(() => {
    return transactions.reduce((total, transaction) => {
      const amount = transaction.type === 'buy' ? transaction.amount : -transaction.amount;
      return total + (amount * transaction.rate);
    }, 0);
  }, [transactions]);

  const toggleDisplayCurrency = () => {
    setDisplayCurrency(current => current === 'USD' ? 'EUR' : 'USD');
  };

  const renderBalanceItem = ({ item }) => (
    <View style={styles.balanceItem}>
      <View style={styles.currencyInfo}>
        <Image source={{ uri: item.currency.flagUrl }} style={styles.flag} />
        <View style={styles.currencyDetails}>
          <Text style={styles.currencyName}>{item.currency.name}</Text>
          <Text style={styles.currencyCode}>{item.code}</Text>
        </View>
      </View>
      <View style={styles.balanceDetails}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Buys:</Text>
          <Text style={styles.balanceValue}>
            {formatCurrency(item.buys, displayCurrency)}
          </Text>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Sells:</Text>
          <Text style={styles.balanceValue}>
            {formatCurrency(item.sells, displayCurrency)}
          </Text>
        </View>
        <View style={[styles.balanceRow, styles.netTotalRow]}>
          <Text style={styles.netTotalLabel}>Net Total:</Text>
          <Text style={[
            styles.netTotalValue,
            item.netTotal > 0 ? styles.positive : styles.negative
          ]}>
            {formatCurrency(item.buys - item.sells, displayCurrency)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Balance Summary" />
      
      {transactions.length > 0 ? (
        <>
          <TouchableOpacity 
            style={styles.currencySelector}
            onPress={toggleDisplayCurrency}
          >
            <Text style={styles.currencySelectorLabel}>Show transactions in:</Text>
            <View style={styles.currencySelectorButton}>
              <Text style={styles.currencySelectorText}>{displayCurrency}</Text>
              <ArrowRightLeft size={16} color={COLORS.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.totalBalanceCard}>
            <Text style={styles.totalBalanceLabel}>Total Net Balance (DZD):</Text>
            <Text style={[
              styles.totalBalanceValue,
              totalNetBalanceDZD > 0 ? styles.positive : styles.negative
            ]}>
              {formatCurrency(totalNetBalanceDZD, 'DZD')}
            </Text>
          </View>

          {balances.length > 0 ? (
            <FlatList
              data={balances}
              renderItem={renderBalanceItem}
              keyExtractor={item => item.code}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Text style={styles.noTransactionsText}>
                No transactions in {displayCurrency}
              </Text>
            </View>
          )}
        </>
      ) : (
        <EmptyState
          title="No transactions yet"
          description="Your balance summary will appear here once you make transactions"
          icon="history"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  currencySelectorLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  currencySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  currencySelectorText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  totalBalanceCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalBalanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  totalBalanceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.text,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  balanceItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  currencyDetails: {
    marginLeft: 12,
  },
  currencyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  currencyCode: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceDetails: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  netTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 0,
  },
  netTotalLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.text,
  },
  netTotalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.error,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noTransactionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});