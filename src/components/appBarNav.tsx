import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

type ScreenName = 'Home' | 'Paso1' | 'Paso2' | 'Paso3' | 'Paso4' | 'Paso5';

const AppBarNav = ({ navigation, route }: NativeStackHeaderProps) => {
  const { name } = route;

  const screenOrder: ScreenName[] = ['Home', 'Paso1', 'Paso2', 'Paso3', 'Paso4', 'Paso5'];

  const goNext = () => {
    const currentIndex = screenOrder.indexOf(name as ScreenName);
    if (currentIndex < screenOrder.length - 1) {
      navigation.navigate(screenOrder[currentIndex + 1]);
    }
  };

  const goPrevious = () => {
    const currentIndex = screenOrder.indexOf(name as ScreenName);
    if (currentIndex > 1) { // Allow going back to Paso1, but not to Home
      navigation.navigate(screenOrder[currentIndex - 1]);
    }
  };

  const startProcess = () => {
    navigation.navigate('Paso1');
  };

  return (
    <View style={styles.container}>
      {name === 'Home' ? (
        <Button title="Iniciar Proceso" onPress={startProcess} />
      ) : (
        <>
          {name !== 'Paso1' && (
            <Button title="Anterior" onPress={goPrevious} />
          )}
          {name !== 'Paso5' && (
            <Button title="Siguiente" onPress={goNext} />
          )}
        </>
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