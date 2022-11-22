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
import LoovieLogo from "../icons/LoovieLogo.svg";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import HomeExplorer from "../pages/Explorer/HomeExplorer";
import SearchFilter from "../pages/Explorer/SearchFilter";
import Movie from "../pages/Explorer/Movie";
import Serie from "../pages/Explorer/Serie";
import DiscoverMovies from "../pages/Explorer/DiscoverMovies";
import DiscoverSeries from "../pages/Explorer/DiscoverSeries";
import Multisearch from "../pages/Explorer/Multisearch";
import Ratings from "../pages/Explorer/Ratings";

import Feed from "../pages/Home/Feed";

import Recomendations from "../pages/ForYou/Recomendations";

import TabEmCartaz from "../pages/Cinema/TabEmCartaz";
import HomeEmCartaz from "../pages/Cinema/HomeEmCartaz";
import MovieEmCartaz from "../pages/Cinema/MovieEmCartaz";

import ProfileScreen from "../pages/Profile/ProfileScreen";
import Settings from "../pages/Profile/Settings";
import ChangePassword from "../pages/Profile/ChangePassword";
import ChangeEmail from "../pages/Profile/ChangeEmail";
import DeleteAccount from "../pages/Profile/DeleteAccount";
import EditProfile from "../pages/Profile/EditProfile";
import FavoriteGenres from "../pages/Profile/FavoriteGenres";
import MyLibrary from "../pages/Profile/MyLibrary";
import ChoosedFolder from "../pages/Profile/ChoosedFolder";

const Stack = createStackNavigator();

export function HomeStack() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Stack.Navigator
        showLabel="false"
        initialRouteName="Feed"
        screenOptions={({ route, navigation }) => ({
          unmountOnBlur: true,
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 75,
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
                  marginLeft: route.name == "Feed" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "Feed" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "Feed" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "Feed" ? "none" : "flex",
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
        <Stack.Screen name="Feed" component={Feed} />
      </Stack.Navigator>
    );
  }
}

export function ExplorerStack() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Stack.Navigator
        showLabel="false"
        initialRouteName="HomeExplorer"
        screenOptions={({ route, navigation }) => ({
          unmountOnBlur: true,
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 75,
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
                  marginLeft: route.name == "HomeExplorer" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "HomeExplorer" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "HomeExplorer" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "HomeExplorer" ? "none" : "flex",
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
        <Stack.Screen name="HomeExplorer" component={HomeExplorer} />
        <Stack.Screen name="EmCartaz" component={TabEmCartaz} />
        <Stack.Screen
          name="SearchFilter"
          component={SearchFilter}
          options={({ route, navigation }) => ({
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
        <Stack.Screen
          name="Ratings"
          component={Ratings}
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

export function ForYouStack() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Stack.Navigator
        showLabel="false"
        initialRouteName="Recomendations"
        screenOptions={({ route, navigation }) => ({
          unmountOnBlur: true,
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 75,
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
                  marginLeft: route.name == "Recomendations" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "Recomendations" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "Recomendations" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "Recomendations" ? "none" : "flex",
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
        <Stack.Screen name="Recomendations" component={Recomendations} />
      </Stack.Navigator>
    );
  }
}

export function EmCartazStack() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Stack.Navigator
        showLabel="false"
        initialRouteName="HomeEmCartaz"
        screenOptions={({ route, navigation }) => ({
          unmountOnBlur: true,
          headerShown: route.name === "SearchFilter" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 75,
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
                  marginLeft: route.name == "HomeEmCartaz" ? 22.5 : 2.5,
                }}
                onPress={() =>
                  route.name === "HomeEmCartaz" ? null : navigation.goBack()
                }
                activeOpacity={0.8}
                underlayColor="#ba5256"
                disabled={route.name === "HomeEmCartaz" ? true : false}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color="#FFF"
                    style={{
                      display: route.name === "HomeEmCartaz" ? "none" : "flex",
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
        <Stack.Screen name="HomeEmCartaz" component={HomeEmCartaz} />
        <Stack.Screen
          name="EmCartaz"
          component={TabEmCartaz}
          options={({ navigation, route }, props) => ({
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
                  onPress={() => navigation.navigate("HomeEmCartaz")}
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
          })}
        />
        <Stack.Screen
          name="MovieEmCartaz"
          component={MovieEmCartaz}
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

export function ProfileStack() {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Stack.Navigator
        showLabel="false"
        initialRouteName="ProfileScreen"
        screenOptions={({ route }) => ({
          unmountOnBlur: true,
          headerShown: route.name === "ProfileScreen" ? false : true,
          headerStyle: {
            backgroundColor: "#9D0208",
            height: 75,
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
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={({ navigation, route }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerTitle: "Configurações",
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
                <AntDesign
                  name="close"
                  size={32}
                  color="#FFF"
                  style={{
                    display: "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={({ navigation, route }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerTitle: "Alterar Senha",
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
                <AntDesign
                  name="close"
                  size={32}
                  color="#FFF"
                  style={{
                    display: "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={({ navigation, route }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerTitle: "Alterar E-mail",
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
                <AntDesign
                  name="close"
                  size={32}
                  color="#FFF"
                  style={{
                    display: "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={({ navigation, route }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerTitle: "Excluir Conta",
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
                <AntDesign
                  name="close"
                  size={32}
                  color="#FFF"
                  style={{
                    display: "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={({ navigation, route }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            gestureVelocityImpact: 1,
            headerTitle: "Configurações",
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
                <AntDesign
                  name="close"
                  size={32}
                  color="#FFF"
                  style={{
                    display: "flex",
                  }}
                />
              </TouchableHighlight>
            ),
          })}
        />
        <Stack.Screen
          name="FavoriteGenres"
          component={FavoriteGenres}
          options={({ route, navigation }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: "Gêneros Favoritos",
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
          name="MyLibrary"
          component={MyLibrary}
          options={({ route, navigation }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: "Minha Biblioteca",
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
          name="ChoosedFolder"
          component={ChoosedFolder}
          options={({ route, navigation }) => ({
            gestureEnabled: false,
            gestureDirection: "vertical",
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerTitle: route.params.folderName,
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
      </Stack.Navigator>
    );
  }
}
