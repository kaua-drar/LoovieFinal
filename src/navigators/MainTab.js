import React, { useCallback } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import LoovieLogo from '../icons/LoovieLogo.svg';
import { FontAwesome5 } from '@expo/vector-icons';

import { HomeStack, ExplorerStack, ForYouStack, EmCartazStack, ProfileStack } from "./MainStack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";

const Tab = createMaterialTopTabNavigator();


export default function MainTab({ route }) {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  const isTabBarVisible = (route) => {
    const routeName = route.state ? route.state.routes[route.state.index]?.name : (route.params ? route.params.screen : 'HOME');

    return [
      'DeleteAccountConfirm'
    ].includes(routeName);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Tab.Navigator
        tabBarPosition="bottom"
        initialRouteName="HomeTab"
        screenOptions={({ route }) => ({
          swipeEnabled: isTabBarVisible(route),
          tabBarOptions: {
            showIcon: true,
            showLabel: false,
            tabBarHideOnKeyboard: true,
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#9D0208",
          },
          tabBarIconStyle: {
            height: 60,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarIcon: ({ focused, color, size }) => {
            let colorCode;
            colorCode = focused ? "#9D0208" : "#FFF";
            if (route.name === "HomeTab") {
              return (
                <TouchableOpacity>
                  <Entypo name="home" size={40} color={colorCode} />
                </TouchableOpacity>
              );
            } else if (route.name === "ExplorerTab") {
              return (
                <TouchableOpacity>
                  <FontAwesome name="search" size={40} color={colorCode} />
                </TouchableOpacity>
              );
            } else if (route.name === "ForYouTab") {
              return (
                <TouchableOpacity>
                  <LoovieLogo
                    width={45}
                    height={45}
                    fill={colorCode}
                  />
                </TouchableOpacity>
              );
            } else if (route.name === "CinemaTab") {
              return (
                <TouchableOpacity>
                  <Entypo name="ticket" size={40} color={colorCode} />
                </TouchableOpacity>
              );
            } else if (route.name === "ProfileTab") {
              return (
                <TouchableOpacity>
                  <FontAwesome name="user" size={40} color={colorCode} />
                </TouchableOpacity>
              );
            }

            // You can return any component that you like here!
          },

          tabBarStyle: {
            backgroundColor: "#0F0C0C",
            borderColor: "#292929",
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            display: "none",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="ExplorerTab" component={ExplorerStack} />
        <Tab.Screen name="ForYouTab" component={ForYouStack} />
        <Tab.Screen name="CinemaTab" component={EmCartazStack} options={() => ({
          lazyPlaceholder: () => (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          )
        })} />
        <Tab.Screen name="ProfileTab" component={ProfileStack}
          options={() => ({
          })} />
      </Tab.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  loadingText: {
    color: "#FFF",
  },
  loadingArea: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#0F0C0C',
    paddingTop: 95
  },
})
