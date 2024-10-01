import React, { useState, useEffect } from 'react';
import { View, Text, Button, CheckBox, ScrollView, StyleSheet } from 'react-native';
import { listaDeParticipantes, modificarParticipacion } from '../main';

const ParticipacionManagement: React.FC = () => {
  const [mostrarDetalles, setMostrarDetalles] = useState<{ [key: number]: boolean }>({});
  const [forceUpdate, setForceUpdate] = useState(false); // Estado para forzar re-render

  const productos = Array.from(new Set(listaDeParticipantes.flatMap(participante => participante.compras.map(compra => compra[0]))));

  const inicializarParticipacionSiNoExiste = () => {
    listaDeParticipantes.forEach(participante => {
      productos.forEach(producto => {
        if (!participante.participa.has(producto)) {
          participante.participa.set(producto, true);
        }
      });
    });
  };

  useEffect(() => {
    inicializarParticipacionSiNoExiste();
  }, [listaDeParticipantes]);

  const toggleDetalles = (id: number) => {
    setMostrarDetalles((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCheckboxChange = (id: number, producto: string, checked: boolean) => {
    const success = modificarParticipacion(id, producto, checked);
    if (!success) {
      console.error(`Error al modificar la participación para el participante con ID ${id}`);
    }
    // Actualizamos forceUpdate para forzar el re-render
    setForceUpdate(!forceUpdate);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {listaDeParticipantes.map((participante) => (
          <View key={participante.id} style={{ marginBottom: 20 }}>
            <Button title={participante.nombre} onPress={() => toggleDetalles(participante.id)} />
            {mostrarDetalles[participante.id] && (
              <View style={{ paddingLeft: 20 }}>
                {productos.map((producto) => (
                  <View key={producto} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      value={participante.participa.get(producto) || false}
                      onValueChange={(newValue: any) => handleCheckboxChange(participante.id, producto, newValue)}
                    />
                    <Text>{producto}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
});

export default ParticipacionManagement;
