import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { formatCurrency } from '../utils/helpers';

const { width } = Dimensions.get('window');

export default function InicioScreen() {
  const { canchas, reservas, finanzas, torneos } = useAppContext();

  const totalIngresos = finanzas
    .filter(f => f.tipo === 'ingreso')
    .reduce((sum, f) => sum + f.monto, 0);
  const totalGastos = finanzas
    .filter(f => f.tipo === 'gasto')
    .reduce((sum, f) => sum + f.monto, 0);
  const balance = totalIngresos - totalGastos;
  const canchasDisponibles = canchas.filter(c => !c.enMantenimiento).length;
  const canchasMantenimiento = canchas.filter(c => c.enMantenimiento).length;

  // Datos para gráfico de ingresos por día (últimos 7 días)
  const getUltimos7Dias = () => {
    const hoy = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(d.getDate() - i);
      const fechaStr = d.toISOString().split('T')[0];
      const total = reservas
        .filter(r => r.fecha === fechaStr)
        .reduce((sum, r) => sum + r.precio, 0);
      data.push({
        dia: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        ingreso: total,
      });
    }
    return data;
  };

  const datosIngresos = getUltimos7Dias();

  // Datos para gráfico de reservas por cancha (Pie)
  const getReservasPorCancha = () => {
    const counts = {};
    reservas.forEach(r => {
      counts[r.canchaId] = (counts[r.canchaId] || 0) + 1;
    });
    const result = Object.keys(counts).map(id => {
      const cancha = canchas.find(c => c.id === id);
      return {
        name: cancha?.nombre || id,
        count: counts[id],
        color: ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0'][Object.keys(counts).indexOf(id) % 5],
        legendFontColor: '#333',
        legendFontSize: 12,
      };
    });
    return result;
  };

  const datosCanchas = getReservasPorCancha();

  // Preparar datos para BarChart (ingresos)
  const barData = {
    labels: datosIngresos.map(d => d.dia),
    datasets: [{
      data: datosIngresos.map(d => d.ingreso),
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>📊 Dashboard</Text>

      {/* Tarjetas de resumen */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardLabel}>Ingresos</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalIngresos)}</Text>
        </View>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardLabel}>Gastos</Text>
          <Text style={styles.cardValue}>{formatCurrency(totalGastos)}</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Balance</Text>
          <Text style={[styles.cardValue, { color: balance >= 0 ? colors.primary : colors.danger }]}>
            {formatCurrency(balance)}
          </Text>
        </View>
        <View style={[styles.card, styles.cardPurple]}>
          <Text style={styles.cardLabel}>Reservas</Text>
          <Text style={styles.cardValue}>{reservas.length}</Text>
        </View>
      </View>

      {/* Gráfico de barras: ingresos últimos 7 días */}
      {datosIngresos.some(d => d.ingreso > 0) ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📈 Ingresos últimos 7 días</Text>
          <BarChart
            data={barData}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero={true}
            showValuesOnTopOfBars={true}
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>📈 Ingresos últimos 7 días</Text>
          <Text style={styles.noDataText}>No hay ingresos en los últimos 7 días</Text>
        </View>
      )}

      {/* Gráfico de pastel: reservas por cancha */}
      {datosCanchas.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🏟️ Reservas por cancha</Text>
          <PieChart
            data={datosCanchas}
            width={width - 40}
            height={200}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🏟️ Reservas por cancha</Text>
          <Text style={styles.noDataText}>No hay reservas registradas</Text>
        </View>
      )}

      {/* Estadísticas de canchas */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>⚽ Estado de canchas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{canchas.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{canchasDisponibles}</Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.danger }]}>{canchasMantenimiento}</Text>
            <Text style={styles.statLabel}>Mantenimiento</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{torneos.length}</Text>
            <Text style={styles.statLabel}>Torneos</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGreen: { backgroundColor: '#E8F5E9' },
  cardRed: { backgroundColor: '#FFEBEE' },
  cardBlue: { backgroundColor: '#E3F2FD' },
  cardPurple: { backgroundColor: '#F3E5F5' },
  cardLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});