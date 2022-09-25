import React, {useCallback} from "react";
import {
    createStackNavigator,
    CardStyleInterpolators,
    TransitionPresets,
  } from "@react-navigation/stack";

import MainTab from './MainTab';
import Welcome from '../pages/Login/Welcome';
import Login from '../pages/Login/Login';
import Register from '../pages/Login/Register';
import Preloader from '../pages/Login/Preloader';

const Stack = createStackNavigator();


export default function MainNavigator() {

  return (
    <Stack.Navigator
      showLabel="false"
      initialRouteName="Preloader"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      })}
    >
      <Stack.Screen name="Welcome" component={Welcome}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="MainTab" component={MainTab}/>
      <Stack.Screen name="Preloader" component={Preloader}/>
    </Stack.Navigator>
  );
}