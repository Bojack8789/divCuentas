import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ButtonGoToHome = () => {
  const navigation = useNavigation();

  const goHome = () => {
    navigation.navigate('Home');
  };

  return <Button title="Ir a Home" onPress={goHome} />;
};

export default ButtonGoToHome;