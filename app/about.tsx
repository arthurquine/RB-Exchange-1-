import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About RBExchange</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>Overview</Text>
          <Text style={styles.description}>
            RBExchange is a specialized currency conversion app tailored for users in Algeria and similar markets, focusing on black market exchange rates. The app allows users to manually input custom exchange rates for currencies like the Algerian Dinar (DZD), Turkish Lira (TRY), Chinese Yuan (CNY), and others, converting them to EUR or USD.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Key Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>• Real-time currency conversion</Text>
            <Text style={styles.feature}>• Support for multiple currencies</Text>
            <Text style={styles.feature}>• Custom exchange rate input</Text>
            <Text style={styles.feature}>• Transaction history tracking</Text>
            <Text style={styles.feature}>• Dark mode support</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Version Information</Text>
          <Text style={styles.description}>
            Version: 1.0.0{'\n'}
            Release Date: 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  featureList: {
    gap: 8,
  },
  feature: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
  },
});