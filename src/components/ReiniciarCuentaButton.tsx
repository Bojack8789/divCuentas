import React from 'react';
import { View, Button, Alert } from 'react-native';
import { reiniciarCuentaActual } from '../main'; // Asegúrate de que la ruta sea correcta

const ReiniciarCuentaButton = () => {
  const handleReiniciarCuenta = () => {
    // Llama a la función para reiniciar la cuenta
    reiniciarCuentaActual();

    // Muestra una alerta para confirmar que la cuenta ha sido reiniciada
    Alert.alert("Éxito", "La cuenta actual ha sido reiniciada.");
  };

  return (
    <View>
      <Button title="Reiniciar Cuenta" onPress={handleReiniciarCuenta} />
    </View>
  );
};

export default ReiniciarCuentaButton;
