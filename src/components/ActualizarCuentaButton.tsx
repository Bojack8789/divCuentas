import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { actualizarCuenta, cuentaActualId } from '../main'; // Ajusta la ruta de importación según sea necesario

interface ActualizarCuentaButtonProps {
  onUpdate?: () => void;
}

const ActualizarCuentaButton: React.FC<ActualizarCuentaButtonProps> = ({ onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleActualizarCuenta = () => {
    setIsUpdating(true);
    const success = actualizarCuenta();
    setIsUpdating(false);

    if (success) {
      Alert.alert(
        "Éxito",
        `La cuenta con ID ${cuentaActualId} ha sido actualizada correctamente.`,
        [{ text: "OK" }]
      );
      if (onUpdate) {
        onUpdate();
      }
    } else {
      Alert.alert(
        "Error",
        cuentaActualId === null
          ? "No hay una cuenta activa para actualizar."
          : `No se pudo actualizar la cuenta con ID ${cuentaActualId}.`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleActualizarCuenta}
      disabled={isUpdating}
    >
      <Text style={styles.buttonText}>
        {isUpdating ? 'Actualizando...' : 'Actualizar Cuenta'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActualizarCuentaButton;