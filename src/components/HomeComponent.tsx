import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  guardarDivisionCuenta, 
  historialDeCuentas, 
  cargarCuentaDesdeHistorial, 
  resetearCuenta, 
  eliminarCuentaDelHistorial
} from '../main';


const { width, height } = Dimensions.get('window');

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
    backgroundColor: '#1ec3ea', // Fondo principal
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: height * 0.05,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05,
  },
  button: {
    backgroundColor: '#4bb4ca',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    marginBottom: height * 0.02,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.045,
  },
  card: {
    backgroundColor: '#88a19f',
    borderRadius: 10,
    padding: 15,
    marginTop: height * 0.02,
    maxHeight: height * 0.5,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#6aabb5',
    marginBottom: 8,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  accountDate: {
    fontSize: width * 0.03,
    color: '#a6988a',
  },
  deleteButton: {
    backgroundColor: '#6aabb5',
    padding: width * 0.02,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03,
  },
  inputContainer: {
    marginBottom: height * 0.02,
    width: '100%',
  },
  input: {
    height: height * 0.06,
    borderColor: '#4bb4ca',
    borderWidth: 1,
    marginBottom: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4bb4ca',
    padding: height * 0.02,
    borderRadius: 25,
    width: '80%',
    alignSelf: 'center',
  },
  listContainer: {
    backgroundColor: '#6aabb5',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  listItem: {
    backgroundColor: '#88a19f',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
  },
});

export default HomeComponent;