import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { cargarCuentaDesdeHistorial } from '../main'; // Importar la función

type CargarCuentaButtonProps = {
  idCuenta: number; // Prop que recibe el ID de la cuenta a cargar
};

const CargarCuentaButton: React.FC<CargarCuentaButtonProps> = ({ idCuenta }) => {
  // Función para manejar el evento de presionar el botón
  const handlePress = () => {
    cargarCuentaDesdeHistorial(idCuenta); // Llamar a la función cuando se presiona el botón
  };

  return (
    <View style={styles.container}>
      <Button
        title={`Cargar Cuenta #${idCuenta}`}
        onPress={handlePress}
        color="#6200EE" // Puedes cambiar el color del botón si lo deseas
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

export default CargarCuentaButton;
