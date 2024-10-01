// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Paso1 from './src/screens/Paso1';
import Paso2 from './src/screens/Paso2';
import Paso3 from './src/screens/Paso3';
import Paso4 from './src/screens/Paso4';
import Paso5 from './src/screens/Paso5';
import AppBarNav from './src/components/appBarNav';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Paso1">
        <Stack.Screen
          name="Paso1"
          component={Paso1}
          options={{ header: (props) => <AppBarNav {...props} /> }}
        />
        <Stack.Screen
          name="Paso2"
          component={Paso2}
          options={{ header: (props) => <AppBarNav {...props} /> }}
        />
        <Stack.Screen
          name="Paso3"
          component={Paso3}
          options={{ header: (props) => <AppBarNav {...props} /> }}
        />
        <Stack.Screen
          name="Paso4"
          component={Paso4}
          options={{ header: (props) => <AppBarNav {...props} /> }}
        />
        <Stack.Screen
          name="Paso5"
          component={Paso5}
          options={{ header: (props) => <AppBarNav {...props} /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
