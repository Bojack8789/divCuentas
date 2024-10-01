// src/screens/Paso2.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ComprasManagement from '../components/ComprasManagement';

const Paso2 = () => {
  return (
    <View style={styles.container}>
<ComprasManagement />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',                // Centrar horizontalmente si el ancho no es completo

  },
  text: {
    fontSize: 24,
  },
});

export default Paso2;
