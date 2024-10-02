import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  guardarDivisionCuenta, 
  historialDeCuentas, 
  cargarCuentaDesdeHistorial, 
  resetearCuenta, 
  eliminarCuentaDelHistorial
} from '../main';

type HistorialCuenta = {
  id: number;
  nombre: string;
  fecha: string;
  cuenta: {
    totalCuenta: number;
    totalesPorParticipante: { [key: string]: number };
    comprasPorParticipante: { [key: string]: [string, number][] };
  };
};

const HomeComponent: React.FC = () => {
  const [showAccountList, setShowAccountList] = useState<boolean>(false);
  const [showNewAccountInput, setShowNewAccountInput] = useState<boolean>(false);
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [accounts, setAccounts] = useState<HistorialCuenta[]>([]);
  const navigation = useNavigation();

  const actualizarListaCuentas = useCallback(() => {
    setAccounts([...historialDeCuentas]);
  }, []);

  useEffect(() => {
    actualizarListaCuentas();
  }, [actualizarListaCuentas]);

  const handleNewAccount = () => {
    setShowNewAccountInput(true);
  };

  const saveNewAccount = () => {
    if (newAccountName.trim() !== '') {
      guardarDivisionCuenta(newAccountName);
      setNewAccountName('');
      setShowNewAccountInput(false);
      actualizarListaCuentas();
      navigation.navigate('Paso1' as never);
    } else {
      Alert.alert('Error', 'Por favor, ingrese un nombre para la cuenta');
    }
  };

  const handleLoadAccount = (id: number) => {
    try {
      cargarCuentaDesdeHistorial(id);
      Alert.alert('Éxito', `Cuenta con ID ${id} ha sido cargada.`);
      navigation.navigate('Paso1' as never);
    } catch (error) {
      Alert.alert('Error', `Error al cargar la cuenta con ID ${id}: ${(error as Error).message}`);
    }
  };

  const handleDeleteAccount = (id: number) => {
    console.log(`Intentando eliminar cuenta con ID: ${id}`);
    try {
      console.log(`Ejecutando eliminarCuentaDelHistorial(${id})`);
      const resultado = eliminarCuentaDelHistorial(id);
      console.log(`Resultado de la eliminación: ${resultado}`);
      
      if (resultado) {
        console.log(`Cuenta con ID ${id} eliminada exitosamente`);
        Alert.alert('Éxito', `Cuenta con ID ${id} ha sido eliminada.`);
        actualizarListaCuentas();
      } else {
        console.log(`No se pudo eliminar la cuenta con ID ${id}`);
        Alert.alert('Error', `No se pudo eliminar la cuenta con ID ${id}.`);
      }
    } catch (error) {
      console.error(`Error al eliminar cuenta: ${error}`);
      Alert.alert('Error', `Error al eliminar la cuenta: ${(error as Error).message}`);
    }
    
    console.log('Estado actual del historial:', historialDeCuentas);
  };

  const renderAccountItem = ({ item }: { item: HistorialCuenta }) => (
    <View style={styles.accountItem}>
      <TouchableOpacity 
        style={styles.accountInfo}
        onPress={() => handleLoadAccount(item.id)}
      >
        <Text style={styles.accountName}>{item.nombre}</Text>
        <Text style={styles.accountDate}>{item.fecha}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteAccount(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DIVCUENTAS</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewAccount}>
          <Text style={styles.buttonText}>Nueva Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            setShowAccountList(!showAccountList);
            if (!showAccountList) {
              actualizarListaCuentas();
            }
          }}
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
            renderItem={renderAccountItem}
            keyExtractor={(item) => item.id.toString()}
            extraData={accounts}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    color: '#333',
  },
  accountDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
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