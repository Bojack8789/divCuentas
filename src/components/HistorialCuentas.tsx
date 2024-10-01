import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { guardarDivisionCuenta, historialDeCuentas } from '../main'; // Importar la función y el historial

const HistorialCuentas = () => {
  const [actualizar, setActualizar] = useState(false); // Estado para forzar renderización al guardar cuentas

  const guardarCuenta = () => {
    guardarDivisionCuenta();
    setActualizar(!actualizar); // Forzar actualización del componente
  };

  const renderItem = ({ item }: { item: { id: number, fecha: string } }) => (
    <View style={styles.item}>
      <Text>{`Cuenta ID: ${item.id}, Fecha: ${item.fecha}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Guardar División de Cuenta" onPress={guardarCuenta} />
      <Text style={styles.title}>Historial de Cuentas:</Text>
      <FlatList
        data={historialDeCuentas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default HistorialCuentas;
