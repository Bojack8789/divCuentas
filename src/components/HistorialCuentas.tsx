import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { guardarDivisionCuenta, historialDeCuentas, cargarCuentaDesdeHistorial, resetearCuenta, eliminarCuentaDelHistorial } from '../main';

const HistorialCuentas = () => {
  const [actualizar, setActualizar] = useState(false);
  const [nombreCuenta, setNombreCuenta] = useState('');

  const guardarCuenta = () => {
    if (nombreCuenta.trim() !== '') {
      guardarDivisionCuenta(nombreCuenta);
      setNombreCuenta('');
      setActualizar(!actualizar);
    } else {
      Alert.alert('Error', 'Por favor, ingrese un nombre para la cuenta');
    }
  };

  const cargarCuenta = (id: number) => {
    try {
      cargarCuentaDesdeHistorial(id);
      Alert.alert('Éxito', `Cuenta con ID ${id} ha sido cargada.`);
    } catch (error) {
      Alert.alert('Error', `Error al cargar la cuenta con ID ${id}: ${error.message}`);
    }
  };

  const eliminarCuenta = (id: number) => {
    console.log(`Intentando eliminar cuenta con ID: ${id}`);
    try {
      console.log(`Ejecutando eliminarCuentaDelHistorial(${id})`);
      const resultado = eliminarCuentaDelHistorial(id);
      console.log(`Resultado de la eliminación: ${resultado}`);
      
      if (resultado) {
        console.log(`Cuenta con ID ${id} eliminada exitosamente`);
        Alert.alert('Éxito', `Cuenta con ID ${id} ha sido eliminada.`);
        setActualizar(!actualizar);
      } else {
        console.log(`No se pudo eliminar la cuenta con ID ${id}`);
        Alert.alert('Error', `No se pudo eliminar la cuenta con ID ${id}.`);
      }
    } catch (error) {
      console.error(`Error al eliminar cuenta: ${error}`);
      Alert.alert('Error', `Error al eliminar la cuenta: ${error.message}`);
    }
    
    console.log('Estado actual del historial:', historialDeCuentas);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{`ID: ${item.id}, Nombre: ${item.nombre}, Fecha: ${item.fecha}`}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Cargar" onPress={() => cargarCuenta(item.id)} />
        <Button title="Eliminar" onPress={() => eliminarCuenta(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la cuenta"
        value={nombreCuenta}
        onChangeText={setNombreCuenta}
      />
      <Button title="Guardar División de Cuenta" onPress={guardarCuenta} />
      <Button title="Reiniciar Cuenta" onPress={() => { resetearCuenta(); setActualizar(!actualizar); }} />
      <Text style={styles.title}>Historial de Cuentas:</Text>
      <FlatList
        data={historialDeCuentas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        extraData={actualizar}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default HistorialCuentas;