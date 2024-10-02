import React from 'react';
import { Button } from 'react-native';
import { updateCuentaDelHistorial } from '../main';

interface ActualizarCuentaButtonProps {
  onUpdate?: () => void;
}

const ActualizarCuentaButton: React.FC<ActualizarCuentaButtonProps> = ({ onUpdate }) => {
  const handleUpdateCuenta = () => {
    const success = updateCuentaDelHistorial();
    if (success && onUpdate) {
      onUpdate();
    }
  };

  return (
    <Button
      title="Actualizar Cuenta"
      onPress={handleUpdateCuenta}
    />
  );
};

export default ActualizarCuentaButton;