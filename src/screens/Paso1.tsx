// src/screens/Paso1.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ParticipantManagement from '../components/ParticipantManagement';

const Paso1 = () => {
  return (
        
    <View style={styles.container}>
    <ParticipantManagement />
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

});

export default Paso1;
