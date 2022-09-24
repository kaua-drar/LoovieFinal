import React, {useCallback} from "react";
import {
    createStackNavigator,
    CardStyleInterpolators,
    TransitionPresets,
  } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import MainTab from './MainTab';
import Login from '../pages/Login/Login'
import ProfileScreen from "../pages/Profile/ProfileScreen";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function LoginStack() {

    const [fontsLoaded] = useFonts({
      "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
    });
  
    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return null;
    } else {
      return (
        <Stack.Navigator
          onLayout={onLayoutRootView}
          showLabel="false"
          initialRouteName="Login"
          screenOptions={({ route, navigation }) => ({
            headerShown: false
          })}
        >
          <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
      );
    }
  }