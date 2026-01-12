import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './screens/SplashScreen/SplashScreen';
import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import Register from './screens/Register/Register';
import TareasHoy from "./screens/TareasHoy/TareasHoy";
import IncidenciasHoy from "./screens/IncidenciasHoy/IncidenciasHoy";
import RevisionesSemana from "./screens/RevisionesSemana/RevisionesSemana";
import GestionEventos from "./screens/GestionEventos/GestionEventos";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TareasHoy" component={TareasHoy} />
        <Stack.Screen name="IncidenciasHoy" component={IncidenciasHoy} />
        <Stack.Screen name="RevisionesSemana" component={RevisionesSemana} />
        <Stack.Screen name="GestionEventos" component={GestionEventos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




