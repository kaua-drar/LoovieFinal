import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LoovieLogo from "../icons/LoovieLogo.svg";
import { SimpleLineIcons } from '@expo/vector-icons';

import Home from "../pages/Home/Home";
import SearchFilter from "../pages/Home/SearchFilter";
import Movie from "../pages/Home/Movie";
import Serie from "../pages/Home/Serie";
import DiscoverMovies from "../pages/Home/DiscoverMovies";
import DiscoverSeries from "../pages/Home/DiscoverSeries";
import Multisearch from "../pages/Home/Multisearch";

import TabEmCartaz from "../pages/Cinema/TabEmCartaz";
import HomeEmCartaz from "../pages/Cinema/Home";
import MovieEmCartaz from "../pages/Cinema/Movie";

import ProfileScreen from "../pages/Profile/ProfileScreen";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export function HomeStack() {

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
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 95,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            margin: 0,
            fontFamily: "Lato-Regular",
            fontWeight: "bold",
          },
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableHighlight
                style={{
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                  marginLeft: route.name == "Home" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "Home" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "Home" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "Home" ? "none" : "flex",
                    }}
                  />
                  <LoovieLogo
                    width={37.5}
                    height={37.5}
                    fill={"#FFF"}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </View>
              </TouchableHighlight>
              <Text
                style={{
                  color: "#FFF",
                  padding: 0,
                  margin: 0,
                  marginLeft: 2,
                  fontSize: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                LOOVIE
              </Text>
            </View>
          ),
          headerTitle: "",
          headerRight: () => (
            <Ionicons
              name="notifications"
              size={35}
              color="#FFF"
              style={{ padding: 0, marginRight: 22.5 }}
            />
          ),
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.ModalPresentationIOS,
        })}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="EmCartaz" component={TabEmCartaz} />
        <Stack.Screen
          name="SearchFilter"
          component={SearchFilter}
          options={({route, navigation}) => ({
            headerTitle: "Filtros",
            headerShown: true,
            headerRight: () => null,
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableHighlight
                style={{
                  borderRadius: 40,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                  marginLeft: 22.5,
                }}
                onPress={() =>
                  route.name === "Home" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "Home" ? true : false}
              >
                <Ionicons
                  name="arrow-back"
                  size={35}
                  color="#FFF"
                  style={{
                    display: route.name === "Home" ? "none" : "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="Movie"
          component={Movie}
          options={() => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}
        />
        <Stack.Screen
          name="Serie"
          component={Serie}
          options={() => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}
        />
        <Stack.Screen
          name="DiscoverMovies"
          component={DiscoverMovies}
          options={() => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}
        />
        <Stack.Screen
          name="DiscoverSeries"
          component={DiscoverSeries}
          options={() => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}
        />
        <Stack.Screen
          name="Multisearch"
          component={Multisearch}
          options={() => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}
        />
      </Stack.Navigator>
    );
  }
}

export function EmCartazStack() {
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
        showLabel="false"
        initialRouteName="Home"
        screenOptions={({ route, navigation }) => ({
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 95,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            margin: 0,
            fontFamily: "Lato-Regular",
            fontWeight: "bold",
          },
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableHighlight
                style={{
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 5,
                  marginLeft: route.name == "Home" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "Home" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "Home" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "Home" ? "none" : "flex",
                    }}
                  />
                  <LoovieLogo
                    width={37.5}
                    height={37.5}
                    fill={"#FFF"}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </View>
              </TouchableHighlight>
              <Text
                style={{
                  color: "#FFF",
                  padding: 0,
                  margin: 0,
                  marginLeft: 2,
                  fontSize: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                LOOVIE
              </Text>
            </View>
          ),
          headerTitle: "",
          headerRight: () => (
            <Ionicons
              name="notifications"
              size={35}
              color="#FFF"
              style={{ padding: 0, marginRight: 22.5 }}
            />
          ),
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.ModalPresentationIOS,
        })}
      >
        <Stack.Screen name="Home" component={HomeEmCartaz} />
        <Stack.Screen name="EmCartaz" component={TabEmCartaz} options={({navigation, route}, props ) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerLeft: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableHighlight
                  style={{
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    marginLeft: 2.5,
                  }}
                  onPress={() => navigation.navigate("Home")}
                  activeOpacity={0.8}
                  underlayColor="#ba5256"
                  disabled={false}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="arrow-back"
                      size={20}
                      color="#FFF"
                      style={{
                        display: "flex",
                      }}
                    />
                    <SimpleLineIcons
                      size={35}
                      color="#FFF"
                      name="location-pin"
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  </View>
                </TouchableHighlight>
                <Text
                  style={{
                    color: "#FFF",
                    padding: 0,
                    margin: 0,
                    marginLeft: 2,
                    fontSize: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {route.params.cityName}
                </Text>
              </View>
            ),
          })}/>
          <Stack.Screen name="Movie" component={MovieEmCartaz} 
          options={()=>({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
          })}/>
      </Stack.Navigator>
    );
  }
}

export function ProfileStack() {
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
        showLabel="false"
        initialRouteName="ProfileScreen"
        screenOptions={({ route }) => ({
          headerShown: route.name === "ProfileScreen" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 95,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "Lato-Regular",
            fontWeight: "bold",
          },
          headerTitle: "LOOVIE",
          headerRight: () => (
            <Ionicons
              name="notifications"
              size={35}
              color="#FFF"
              style={{ padding: 0, marginRight: 22.5 }}
            />
          ),
        })}
      >
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
      </Stack.Navigator>
    );
  }
}
