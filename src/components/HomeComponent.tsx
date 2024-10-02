import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { guardarDivisionCuenta, historialDeCuentas, cargarCuentaDesdeHistorial, resetearCuenta } from '../main';

const HomeComponent = () => {
  const [showAccountList, setShowAccountList] = useState(false);
  const [showNewAccountInput, setShowNewAccountInput] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [accounts, setAccounts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Cargar las cuentas del historial al montar el componente
    setAccounts(historialDeCuentas);
  }, []);

  const handleNewAccount = () => {
    setShowNewAccountInput(true);
  };

  const saveNewAccount = () => {
    if (newAccountName.trim() !== '') {
      guardarDivisionCuenta(newAccountName);
      setNewAccountName('');
      setShowNewAccountInput(false);
      // Actualizar la lista de cuentas
      setAccounts(historialDeCuentas);
      // Navegar al Paso 1
      navigation.navigate('Paso1');
    } else {
      alert('Por favor, ingrese un nombre para la cuenta');
    }
  };

  const handleLoadAccount = (id) => {
    try {
      cargarCuentaDesdeHistorial(id);
      alert(`Cuenta con ID ${id} ha sido cargada.`);
      navigation.navigate('Paso1');
    } catch (error) {
      alert(`Error al cargar la cuenta con ID ${id}: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DIVCUENTAS</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewAccount}>
          <Text style={styles.buttonText}>Nueva Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowAccountList(!showAccountList)}
        >
          <Text style={styles.buttonText}>Cargar Cuenta</Text>
        </TouchableOpacity>
      </View>

      {showNewAccountInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la nueva cuenta"
            value={newAccountName}
            onChangeText={setNewAccountName}
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveNewAccount}>
            <Text style={styles.buttonText}>Guardar e Iniciar</Text>
          </TouchableOpacity>
        </View>
      )}

      {showAccountList && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuentas Guardadas</Text>
          <FlatList
            data={accounts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.accountItem}
                onPress={() => handleLoadAccount(item.id)}
              >
                <Text style={styles.accountName}>{item.nombre}</Text>
                <Text style={styles.accountDate}>{item.fecha}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0070f3',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  accountItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountName: {
    fontSize: 16,
    color: '#333',
  },
  accountDate: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 4,
  },
});

export default HomeComponent;