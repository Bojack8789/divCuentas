import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { calcularDivisionCuenta, repartir, listaDeParticipantes } from '../main';
import { Participante } from '../main';
import BalanceBarChart from './BalanceBarChart';

const CuentasManagement: React.FC = () => {
  const [totalCuenta, setTotalCuenta] = useState<number>(0);
  const [totalesPorParticipante, setTotalesPorParticipante] = useState<Map<string, number>>(new Map());
  const [transferencias, setTransferencias] = useState<{ desde: string, hacia: string, cantidad: number }[]>([]);

  useEffect(() => {
    const { totalCuenta, totalesPorParticipante } = calcularDivisionCuenta();
    setTotalCuenta(totalCuenta);
    setTotalesPorParticipante(totalesPorParticipante);

    const transferencias = repartir(listaDeParticipantes);
    setTransferencias(transferencias);
  }, []);

  const renderParticipante = ({ item }: { item: Participante }) => {
    const totalPuso = item.compras.reduce((sum, [, precio]) => sum + precio, 0);
    const totalDeberiaPoner = totalesPorParticipante.get(item.nombre) || 0;
    const saldoAFavor = totalPuso - totalDeberiaPoner;

    return (
      <View style={styles.participanteContainer}>
        <Text style={styles.participanteNombre}>{item.nombre}</Text>
        <Text>Total Puso: ${totalPuso.toFixed(2)}</Text>
        <Text>Total Debería Poner: ${totalDeberiaPoner.toFixed(2)}</Text>
        <Text style={[styles.saldoText, saldoAFavor >= 0 ? styles.saldoAFavor : styles.saldoEnContra]}>
          Saldo a Favor: ${saldoAFavor.toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderTransferencia = ({ item }: { item: { desde: string, hacia: string, cantidad: number } }) => (
    <Text style={styles.transferenciaText}>
      {item.desde} le debe pasar ${item.cantidad.toFixed(2)} a {item.hacia}
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen de Cuentas</Text>
      <Text style={styles.totalCuenta}>Total de la Cuenta: ${totalCuenta.toFixed(2)}</Text>
      <FlatList
        data={listaDeParticipantes}
        renderItem={renderParticipante}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
      <Text style={styles.title}>Transferencias</Text>
      <FlatList
        data={transferencias}
        renderItem={renderTransferencia}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <View style={styles.chartContainer}>
        <BalanceBarChart transferencias={transferencias} />
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  totalCuenta: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  participanteContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  participanteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  saldoText: {
    fontSize: 14,
    marginTop: 5,
  },
  saldoAFavor: {
    color: 'green',
  },
  saldoEnContra: {
    color: 'red',
  },
  transferenciaText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  chartContainer: {
    backgroundColor: 'lightgray',
    height: 450,
    marginTop: 20,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default CuentasManagement;
