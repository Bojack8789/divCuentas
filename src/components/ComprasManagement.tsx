import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listaDeParticipantes, agregarCompra, editarCompra, eliminarCompra } from '../main'; // Importar las funciones

const ComprasManagement = () => {
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [idParticipante, setIdParticipante] = useState<number | null>(null);
  const [productoOriginal, setProductoOriginal] = useState<string | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [comprasActualizadas, setComprasActualizadas] = useState(listaDeParticipantes);

  useEffect(() => {
    setComprasActualizadas([...listaDeParticipantes]);
  }, [listaDeParticipantes]);

  // Función para validar si el valor es numérico
  const esNumeroValido = (texto: string) => {
    const regex = /^[0-9]*\.?[0-9]*$/;  // Acepta números enteros y decimales
    return regex.test(texto);
  };

  const handleAgregarCompra = () => {
    if (idParticipante !== null && producto && precio && esNumeroValido(precio)) {
      const precioNum = parseFloat(precio); // Convertir a número
      console.log('Intentando agregar compra:', { idParticipante, producto, precio: precioNum });
      const resultado = agregarCompra(parseInt(idParticipante), producto, precioNum); // Asegúrate de que idParticipante sea un número
      console.log('Resultado de agregar compra:', resultado);
      if (resultado) {
        Alert.alert('Compra agregada correctamente');
        setProducto('');
        setPrecio('');
      } else {
        Alert.alert('Error al agregar la compra');
      }
    } else {
      Alert.alert('Por favor, complete todos los campos con datos válidos');
    }
  };

  const handleEditarCompra = () => {
    if (idParticipante !== null && producto && precio && esNumeroValido(precio)) {
      const resultado = editarCompra(idParticipante, productoOriginal!, producto, parseFloat(precio));
      if (resultado) {
        Alert.alert('Compra editada correctamente');
        setModoEdicion(false);
        resetForm();
        actualizarLista();
      } else {
        Alert.alert('Error al editar la compra');
      }
    } else {
      Alert.alert('Por favor, ingrese datos válidos para editar la compra');
    }
  };

  const handleEliminarCompra = (id: number, producto: string) => {
    const resultado = eliminarCompra(id, producto);
    if (resultado) {
      Alert.alert('Compra eliminada correctamente');
      actualizarLista();
    } else {
      Alert.alert('Error al eliminar la compra');
    }
  };

  const resetForm = () => {
    setProducto('');
    setPrecio('');
    setProductoOriginal(null);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(false);
    resetForm(); // Restablece el formulario para volver al modo de agregar
  };

  const ordenarParticipantes = () => {
    const participantesConCompras = comprasActualizadas.filter(participante => participante.compras.length > 0);
    const participantesSinCompras = comprasActualizadas.filter(participante => participante.compras.length === 0);
    participantesConCompras.sort((a, b) => a.id - b.id);
    participantesSinCompras.sort((a, b) => a.id - b.id);
    return [...participantesConCompras, ...participantesSinCompras];
  };

  const actualizarLista = () => {
    setComprasActualizadas([...listaDeParticipantes]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{modoEdicion ? 'Editar Compra' : 'Agregar Compra'}</Text>

      <Picker
        selectedValue={idParticipante}
        onValueChange={(itemValue) => setIdParticipante(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar Participante" value={null} />
        {comprasActualizadas.map(participante => (
          <Picker.Item key={participante.id} label={participante.nombre} value={participante.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Producto"
        value={producto}
        onChangeText={setProducto}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={(texto) => {
          if (esNumeroValido(texto)) {
            setPrecio(texto);
          } else {
            Alert.alert('Ingrese solo valores numéricos');
          }
        }}
        keyboardType="numeric"
      />

      {!modoEdicion ? (
        <Button title="Agregar Compra" onPress={handleAgregarCompra} />
      ) : (
        <>
          <Button title="Guardar Cambios" onPress={handleEditarCompra} />
          <Button title="Cancelar Edición" onPress={handleCancelarEdicion} color="red" />
        </>
      )}

      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={ordenarParticipantes()}  // Usa la lista ordenada
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.participantName}>{item.nombre} (ID: {item.id})</Text>
              {item.compras.length > 0 ? (
                item.compras.map((compra, index) => (
                  <View key={index} style={styles.compraItem}>
                    <Text>{compra[0]}: ${compra[1]}</Text>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                          setModoEdicion(true);
                          setProducto(compra[0]);
                          setPrecio(compra[1].toString());
                          setIdParticipante(item.id);
                          setProductoOriginal(compra[0]);
                        }}
                      >
                        <Text style={styles.iconButtonText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleEliminarCompra(item.id, compra[0])}
                      >
                        <Text style={styles.iconButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No hay compras registradas.</Text>
              )}
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el contenedor ocupe toda la pantalla
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1, // Permite que el ScrollView ocupe el espacio restante
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  compraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  iconButtonText: {
    fontSize: 20,
  },
});

export default ComprasManagement;
