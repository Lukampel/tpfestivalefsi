import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import InscripcionScreen from './src/screens/InscripcionScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <InscripcionScreen />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eaf4ff' },
});
