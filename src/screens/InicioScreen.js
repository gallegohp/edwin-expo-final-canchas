import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { globalStyles, colors } from '../styles/globalStyles';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine, VictoryPie } from 'victory-native';

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

  // Datos para gráfico de reservas por cancha
  const getReservasPorCancha = () => {
    const counts = {};
    reservas.forEach(r => {
      counts[r.canchaId] = (counts[r.canchaId] || 0) + 1;
    });
    return Object.keys(counts).map(id => ({
      cancha: canchas.find(c => c.id === id)?.nombre || id,
      reservas: counts[id],
    }));
  };

  const datosCanchas = getReservasPorCancha();

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>📊 Dashboard</Text>

      {/* Tarjetas de resumen */}
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardLabel}>Ingresos</Text>
          <Text style={styles.cardValue}>${totalIngresos.toFixed(2)}</Text>
        </View>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardLabel}>Gastos</Text>
          <Text style={styles.cardValue}>${totalGastos.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Balance</Text>
          <Text style={[styles.cardValue, { color: balance >= 0 ? colors.primary : colors.danger }]}>
            ${balance.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.card, styles.cardPurple]}>
          <Text style={styles.cardLabel}>Reservas</Text>
          <Text style={styles.cardValue}>{reservas.length}</Text>
        </View>
      </View>

      {/* Gráfico de ingresos semanales */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📈 Ingresos últimos 7 días</Text>
        <VictoryChart
          width={width - 40}
          height={200}
          theme={VictoryTheme.material}
          domainPadding={{ x: 20 }}
        >
          <VictoryBar
            data={datosIngresos}
            x="dia"
            y="ingreso"
            style={{
              data: { fill: colors.primary },
            }}
            labels={({ datum }) => `$${datum.ingreso.toFixed(2)}`}
          />
        </VictoryChart>
      </View>

      {/* Gráfico de reservas por cancha */}
      {datosCanchas.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>🏟️ Reservas por cancha</Text>
          <VictoryPie
            width={width - 40}
            height={200}
            data={datosCanchas}
            x="cancha"
            y="reservas"
            colorScale={['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0']}
            labelRadius={({ innerRadius }) => innerRadius + 25}
            labels={({ datum }) => `${datum.cancha}: ${datum.reservas}`}
          />
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