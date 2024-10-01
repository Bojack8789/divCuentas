// src/components/appBarNav.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

const AppBarNav = ({ navigation, route }: NativeStackHeaderProps) => {
  const { name } = route;

  const goNext = () => {
    switch (name) {
      case 'Paso1':
        navigation.navigate('Paso2');
        break;
      case 'Paso2':
        navigation.navigate('Paso3');
        break;
      case 'Paso3':
        navigation.navigate('Paso4');
        break;
      case 'Paso4':
        navigation.navigate('Paso5');
        break;
      default:
        break;
    }
  };

  const goPrevious = () => {
    switch (name) {
      case 'Paso2':
        navigation.navigate('Paso1');
        break;
      case 'Paso3':
        navigation.navigate('Paso2');
        break;
      case 'Paso4':
        navigation.navigate('Paso3');
        break;
      case 'Paso5':
        navigation.navigate('Paso4');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {name !== 'Paso1' && (
        <Button title="Anterior" onPress={goPrevious} />
      )}
      {name !== 'Paso5' && (
        <Button title="Siguiente" onPress={goNext} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default AppBarNav;
