import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';


// cada navegacao em uma variavel diferente
// createStackNavigator cria por padrao a barra superior
const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      // desabilitamos a barra superior e aplicamos a mesma cor de fundo
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' }
    }}
    // initialRouteName="SignUp"
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
