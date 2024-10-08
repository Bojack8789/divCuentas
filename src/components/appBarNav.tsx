import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ScreenName = 'Home' | 'Paso1' | 'Paso2' | 'Paso3' | 'Paso4' | 'Paso5';

const { width } = Dimensions.get('window');

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
    if (currentIndex > 1) {
      navigation.navigate(screenOrder[currentIndex - 1]);
    }
  };

  const isFirstStep = name === 'Paso1';
  const isLastStep = name === 'Paso5';

  if (name === 'Home') {
    return null;
  }

  const renderButton = (text: string, onPress: () => void, iconName: string, isFullWidth: boolean, isPrevious: boolean) => (
    <TouchableOpacity
      style={[
        styles.button,
        isFullWidth ? styles.buttonFullWidth : styles.buttonHalfWidth,
        isPrevious && styles.buttonPrevious
      ]}
      onPress={onPress}
    >
      {isPrevious && <Icon name={iconName} size={24} color="#fff" style={styles.icon} />}
      <Text style={styles.buttonText}>{text}</Text>
      {!isPrevious && <Icon name={iconName} size={24} color="#fff" style={styles.icon} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isFirstStep && renderButton('SIGUIENTE', goNext, 'arrow-forward', true, false)}
      {isLastStep && renderButton('ANTERIOR', goPrevious, 'arrow-back', true, true)}
      {!isFirstStep && !isLastStep && (
        <>
          {renderButton('ANTERIOR', goPrevious, 'arrow-back', false, true)}
          {renderButton('SIGUIENTE', goNext, 'arrow-forward', false, false)}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    padding: 10,
    height: 60,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9400D3',
    height: 40,
    borderRadius: 0, // Hace los botones cuadrados
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonHalfWidth: {
    width: (width - 20) / 2, // 50% del ancho disponible
  },
  buttonFullWidth: {
    width: width - 20, // Ancho completo menos el padding del contenedor
  },
  buttonPrevious: {
    backgroundColor: '#B682EF', // Color más claro para el botón ANTERIOR
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginHorizontal: 8,
  },
  icon: {
    marginHorizontal: 4,
  },
});

export default AppBarNav;