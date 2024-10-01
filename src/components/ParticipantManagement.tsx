import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { agregarParticipante, editarParticipante, eliminarParticipante, listaDeParticipantes } from '../main';

const ParticipantManagement = () => {
  const [participantes, setParticipantes] = useState(listaDeParticipantes);
  const [nombre, setNombre] = useState('');
  const [nombreEditado, setNombreEditado] = useState('');
  const [idEditar, setIdEditar] = useState<number | null>(null);

  // Función para manejar agregar participante
  const handleAgregarParticipante = () => {
    if (nombre.trim()) {
      agregarParticipante(nombre);
      setParticipantes([...listaDeParticipantes]); // Actualizar la lista
      setNombre(''); // Limpiar input después de agregar
    }
  };

  // Función para manejar edición de participante
  const handleGuardarEdicion = (id: number) => {
    if (nombreEditado.trim()) {
      editarParticipante(id, nombreEditado);
      setIdEditar(null); // Salir del modo de edición
      setNombreEditado(''); // Limpiar el campo de edición
      setParticipantes([...listaDeParticipantes]); // Actualizar la lista
    }
  };

  // Función para manejar eliminación de participante
  const handleEliminarParticipante = (id: number) => {
    eliminarParticipante(id);
    setParticipantes([...listaDeParticipantes]); // Actualizar la lista después de eliminar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Participantes</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Participante"
          value={nombre}
          onChangeText={setNombre}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAgregarParticipante}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={participantes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {idEditar === item.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  placeholder="Nuevo Nombre"
                  value={nombreEditado}
                  onChangeText={setNombreEditado}
                />
                <TouchableOpacity style={styles.button} onPress={() => handleGuardarEdicion(item.id)}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setIdEditar(null)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.participantItem}>
                <Text style={styles.participantName}>{item.nombre} (ID: {item.id})</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => { setIdEditar(item.id); setNombreEditado(item.nombre); }}>
                    <Text style={styles.iconButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handleEliminarParticipante(item.id)}>
                    <Text style={styles.iconButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#0070f3',
    padding: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    flex: 1,
    fontSize: 16,
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
  editContainer: {
    flexDirection: 'column',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0070f3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ParticipantManagement;