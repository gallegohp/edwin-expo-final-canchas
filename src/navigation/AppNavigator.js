import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';  // <--- CAMBIO

import InicioScreen from '../screens/InicioScreen';
import CanchasScreen from '../screens/CanchasScreen';
import NuevaCanchaScreen from '../screens/NuevaCanchaScreen';
import ReservasScreen from '../screens/ReservasScreen';
import NuevaReservaScreen from '../screens/NuevaReservaScreen';
import FinanzasScreen from '../screens/FinanzasScreen';
import TorneosScreen from '../screens/TorneosScreen';
import NuevoTorneoScreen from '../screens/NuevoTorneoScreen';
import DetalleTorneoScreen from '../screens/DetalleTorneoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CanchasStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ListaCanchas" component={CanchasScreen} options={{ title: 'Canchas' }} />
    <Stack.Screen name="NuevaCancha" component={NuevaCanchaScreen} options={{ title: 'Agregar Cancha' }} />
  </Stack.Navigator>
);

const ReservasStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ListaReservas" component={ReservasScreen} options={{ title: 'Reservas' }} />
    <Stack.Screen name="NuevaReserva" component={NuevaReservaScreen} options={{ title: 'Nueva Reserva' }} />
  </Stack.Navigator>
);

const TorneosStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ListaTorneos" component={TorneosScreen} options={{ title: 'Torneos' }} />
    <Stack.Screen name="NuevoTorneo" component={NuevoTorneoScreen} options={{ title: 'Crear Torneo' }} />
    <Stack.Screen name="DetalleTorneo" component={DetalleTorneoScreen} options={{ title: 'Detalle Torneo' }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Inicio') iconName = 'home-outline';
            else if (route.name === 'Canchas') iconName = 'football-outline';
            else if (route.name === 'Reservas') iconName = 'calendar-outline';
            else if (route.name === 'Finanzas') iconName = 'cash-outline';
            else if (route.name === 'Torneos') iconName = 'trophy-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Inicio" component={InicioScreen} />
        <Tab.Screen name="Canchas" component={CanchasStack} />
        <Tab.Screen name="Reservas" component={ReservasStack} />
        <Tab.Screen name="Finanzas" component={FinanzasScreen} />
        <Tab.Screen name="Torneos" component={TorneosStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}