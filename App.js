import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { MockProvider } from './utils/MockContext';
import { LanguageProvider } from './utils/LanguageContext';

export default function App() {
  return (
    <MockProvider>
      <LanguageProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaProvider>
      </LanguageProvider>
    </MockProvider>
  );
}
