import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import MainTab from "./src/navigators/MainTab";

export default function App() {
  return (
    <NavigationContainer>
      <MainTab />
    </NavigationContainer>
  );
}
