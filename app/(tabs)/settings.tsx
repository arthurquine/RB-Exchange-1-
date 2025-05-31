import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Linking,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { Moon, Sun, Info, Mail } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(darkMode === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('darkMode', String(newValue));
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleContact = () => {
    router.push('/contact');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.darkContainer
    ]} edges={['top']}>
      <Header title="Settings" isDarkMode={isDarkMode} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Preferences</Text>
        
        <View style={[styles.settingsGroup, isDarkMode && styles.darkSettingsGroup]}>
          <View style={[styles.settingItem, isDarkMode && styles.darkSettingItem]}>
            <View style={styles.settingInfo}>
              {isDarkMode ? 
                <Moon size={22} color={isDarkMode ? COLORS.textDark : COLORS.text} /> :
                <Sun size={22} color={isDarkMode ? COLORS.textDark : COLORS.text} />
              }
              <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ 
                false: COLORS.border, 
                true: COLORS.primary 
              }}
              thumbColor={isDarkMode ? COLORS.cardBackgroundDark : COLORS.cardBackground}
            />
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>
        
        <View style={[styles.settingsGroup, isDarkMode && styles.darkSettingsGroup]}>
          <TouchableOpacity 
            style={[styles.settingItem, isDarkMode && styles.darkSettingItem]}
            activeOpacity={0.7}
            onPress={handleAbout}
          >
            <View style={styles.settingInfo}>
              <Info size={22} color={isDarkMode ? COLORS.textDark : COLORS.text} />
              <Text style={[styles.settingText, isDarkMode && styles.darkText]}>About RBExchange</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, isDarkMode && styles.darkSettingItem]}
            activeOpacity={0.7}
            onPress={handleContact}
          >
            <View style={styles.settingInfo}>
              <Mail size={22} color={isDarkMode ? COLORS.textDark : COLORS.text} />
              <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Contact Us</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, isDarkMode && styles.darkVersionText]}>Version 1.0.0</Text>
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
  darkContainer: {
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  darkText: {
    color: COLORS.textDark,
  },
  settingsGroup: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  darkSettingsGroup: {
    backgroundColor: COLORS.cardBackgroundDark,
    borderColor: COLORS.borderDark,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  darkSettingItem: {
    borderBottomColor: COLORS.borderDark,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  darkVersionText: {
    color: COLORS.textSecondaryDark,
  },
});