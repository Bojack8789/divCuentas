// src/screens/Paso4.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CuentasManagement from '../components/CuentasManagement';

const Paso4 = () => {
  return (
    <View style={styles.container}>
      <CuentasManagement />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default Paso4;
