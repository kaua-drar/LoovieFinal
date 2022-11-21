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
import ChooseGenres from '../pages/Login/ChooseGenres';
import DeleteAccountConfirm from "../pages/Login/DeleteAccountConfirm";
import {
  getAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";


const Stack = createStackNavigator();


export default function MainNavigator() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  return (
    <Stack.Navigator
      showLabel="false"
      initialRouteName= "Preloader"
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
      <Stack.Screen name="ChooseGenres" component={ChooseGenres}/>
      <Stack.Screen name="DeleteAccountConfirm" component={DeleteAccountConfirm}/>
    </Stack.Navigator>
  );
}