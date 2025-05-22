import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,  // Asegúrate de que el header esté visible
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                // Acción al presionar el botón de retroceso
                navigation.goBack();
              }}
              style={{ marginLeft: 15 }}>
              <Text style={{ color: '#fff', fontSize: 18 }}>Atrás</Text> {/* Texto "Atrás" */}
            </TouchableOpacity>
          ),
          cardStyle: { backgroundColor: '#121212' }, // Fondo oscuro
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Usuario" component={Usuario} />
        <Stack.Screen name="Menu" component={Menu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
