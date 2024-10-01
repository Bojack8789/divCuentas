// src/screens/Paso3.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ParticipacionManagement from '../components/ParticipacionManagement';

const Paso3 = () => {
  return (
    <View style={styles.container}>
      <ParticipacionManagement/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default Paso3;
