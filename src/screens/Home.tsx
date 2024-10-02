// src/screens/Paso1.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ParticipantManagement from '../components/ParticipantManagement';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import HomeComponent from '../components/HomeComponent';

const Home = () => {
  const navigation = useNavigation();
  const [key, setKey] = React.useState(0); // Estado para la clave

  useFocusEffect(
    React.useCallback(() => {
      setKey(prevKey => prevKey + 1); // Incrementa la clave cada vez que la pantalla está en foco
    }, [])
  );

  return (
    <View style={styles.container}>
      <HomeComponent key={key} /> {/* Asigna la key */}
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

export default Home;
