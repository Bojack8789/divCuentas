import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';

const BalanceBarChart = ({ transferencias }) => {
  const windowWidth = Dimensions.get('window').width;
  const chartWidth = windowWidth * 0.9;
  const middleX = chartWidth / 2;
  const minBarWidth = 80; // Ancho mínimo para las barras de receptores
  const textPadding = 10; // Padding para el texto dentro de las barras

  // Ref para medir el ancho del texto
  const textWidths = useRef({});
  const [, forceUpdate] = useState();

  // Agrupar transferencias por receptores
  const receptores = transferencias.reduce((acc, t) => {
    if (!acc[t.hacia]) acc[t.hacia] = { total: 0, deudores: [] };
    acc[t.hacia].total += t.cantidad;
    acc[t.hacia].deudores.push(t);
    return acc;
  }, {});

  // Encontrar el monto máximo para escalar
  const maxTotal = Math.max(...Object.values(receptores).map(r => r.total));

  const datosVisualizacion = Object.entries(receptores).map(([receptor, data]) => ({
    receptor,
    ...data,
    deudores: data.deudores.sort((a, b) => b.cantidad - a.cantidad),
  }));

  const barBaseHeight = 30;
  const deudorHeight = 25;
  const barSpacing = 50;

  const totalHeight = datosVisualizacion.reduce(
    (acc, { deudores }) =>
      acc + Math.max(barBaseHeight, deudores.length * deudorHeight) + barSpacing,
    0
  );

  useEffect(() => {
    // Forzar una actualización después de que los textos se hayan medido
    forceUpdate({});
  }, []);

  const measureText = (text, receptor) => {
    return function(width) {
      textWidths.current[receptor] = width;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gráfico de Transferencias</Text>
      <Svg width={chartWidth} height={totalHeight}>
        {datosVisualizacion.map(({ receptor, total, deudores }, index) => {
          let barLength = (total / maxTotal) * (chartWidth / 2 - 20);
          const textWidth = textWidths.current[receptor] || 0;
          
          // Asegurar que la barra sea al menos tan ancha como el texto más el padding
          barLength = Math.max(barLength, textWidth + textPadding * 2, minBarWidth);

          const barHeight = Math.max(barBaseHeight, deudores.length * deudorHeight);
          const y = datosVisualizacion
            .slice(0, index)
            .reduce(
              (acc, { deudores }) =>
                acc + Math.max(barBaseHeight, deudores.length * deudorHeight) + barSpacing,
              0
            );

          return (
            <React.Fragment key={index}>
              {/* Conexión entre deudores y receptores */}
              {deudores.map((d, i) => {
                const lineLength = Math.max(barLength, 80);
                return (
                  <React.Fragment key={i}>
                    <Line
                      x1={middleX - lineLength}
                      y1={y + (i + 0.5) * deudorHeight}
                      x2={middleX + barLength}
                      y2={y + barHeight / 2}
                      stroke="grey"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <Rect
                      x={middleX - lineLength}
                      y={y + i * deudorHeight}
                      width={lineLength}
                      height={deudorHeight}
                      fill="rgba(255, 100, 100, 1)"
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                    <SvgText
                      x={middleX - lineLength + 5}
                      y={y + (i + 0.5) * deudorHeight + 4}
                      textAnchor="start"
                      fill="white"
                      fontSize={lineLength < 80 ? "8" : "12"}
                    >
                      {`${d.desde}: $${d.cantidad.toFixed(0)}`}
                    </SvgText>
                  </React.Fragment>
                );
              })}

              {/* Barra de receptor */}
              <Rect
                x={middleX}
                y={y}
                width={barLength}
                height={barHeight}
                fill="rgba(100, 255, 100, 1)"
                stroke="#000"
                strokeWidth="0.5"
              />
              <SvgText
                x={middleX + 5}
                y={y + barHeight / 2 + 4}
                fill="black"
                fontSize="12"
                onLayout={measureText(`${receptor}: $${total.toFixed(0)}`, receptor)}
              >
                {`${receptor}: $${total.toFixed(0)}`}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default BalanceBarChart;