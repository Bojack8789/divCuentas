import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
import { guardarDivisionCuenta, historialDeCuentas, cargarCuentaDesdeHistorial, resetearCuenta } from '../main'; // Importar las funciones necesarias
import CargarCuentaButton from './CargarCuentaButton'; // Importar el botón para cargar cuenta

const HistorialCuentas = () => {
  const [actualizar, setActualizar] = useState(false);
  const [nombreCuenta, setNombreCuenta] = useState('');

  // Función para guardar una nueva división de cuenta
  const guardarCuenta = () => {
    if (nombreCuenta.trim() !== '') {
      guardarDivisionCuenta(nombreCuenta);
      setNombreCuenta(''); // Limpiar el input después de guardar
      setActualizar(!actualizar); // Forzar actualización del componente
    } else {
      alert('Por favor, ingrese un nombre para la cuenta');
    }
  };

  // Función para cargar la cuenta seleccionada desde el historial
  const cargarCuenta = (id: number) => {
    try {
      cargarCuentaDesdeHistorial(id); // Llama a la función que carga la cuenta desde el historial
      alert(`Cuenta con ID ${id} ha sido cargada.`);
    } catch (error) {
      alert(`Error al cargar la cuenta con ID ${id}: ${error.message}`);
    }
  };

  // Renderizado de cada elemento del historial
  const renderItem = ({ item }: { item: { id: number; nombre: string; fecha: string } }) => (
    <View style={styles.item}>
      <Text>{`ID: ${item.id}, Nombre: ${item.nombre}, Fecha: ${item.fecha}`}</Text>
      {/* Botón para cargar la cuenta específica */}
      <Button title="Cargar Cuenta" onPress={() => cargarCuenta(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la cuenta"
        value={nombreCuenta}
        onChangeText={setNombreCuenta}
      />
      <Button title="Guardar División de Cuenta" onPress={guardarCuenta} />
      {/* Botón para reiniciar la cuenta */}
      <Button title="Reiniciar Cuenta" onPress={resetearCuenta} />
      <Text style={styles.title}>Historial de Cuentas:</Text>
      {/* FlatList que muestra el historial de cuentas */}
      <FlatList
        data={historialDeCuentas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        extraData={actualizar} // Para forzar la actualización del FlatList cuando cambie el estado
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
