import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from 'react-redux';
import Store from './src/Store';


import MainTab from "./src/navigators/MainTab";
import MainNavigator from './src/navigators/MainNavigator';

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <MainNavigator/>
      </NavigationContainer>
    </Provider>
  );
}
