import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native";
import Image from "react-native-scalable-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function TabEmCartaz({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [openUfDropdown, setOpenUfDropdown] = useState(false);
  const [openCitiesDropdown, setOpenCitiesDropdown] = useState(false);
  const [openTheatersDropdown, setOpenTheatersDropdown] = useState(false);
  const [showUfDropdown, setShowUfDropdown] = useState(false);
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);
  const [showTheatersDropdown, setShowTheatersDropdown] = useState(false);
  const [ufSelected, setUfSelected] = useState("");
  const [citySelected, setCitySelected] = useState("");
  const [citiesNotDone, setCitiesNotDone] = useState([]);
  const [uf, setUf] = useState([]);
  const [cities, setCities] = useState([]);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const requestMovies = async () => {
    setShowUfDropdown(false);
    setLoading(true);
    const req = await fetch("https://api-content.ingresso.com/v0/theaters");
    const json = await req.json();

    if (json) {
      let newUf = [];

      // Declare an empty object
      let uniqueUf = {};

      // Loop for the array elements
      for (let i in json) {
        // Extract the title
        let objUf = json[i]["uf"];

        // Use the title as the index
        uniqueUf[objUf] = json[i];
      }

      // Loop to push unique object into array
      for (let i in uniqueUf) {
        newUf.push(uniqueUf[i]);
      }
      newUf.sort(function (a, b) {
        if (a.uf < b.uf) {
          return -1;
        }
        if (a.uf > b.uf) {
          return 1;
        }
        return 0;
      });
      // Display the unique objects
      setUf([]);
      newUf.map((v) => {
        setUf((old) => [...old, { uf: v.uf }]);
      });

      let newCity = [];

      // Declare an empty object
      let uniqueCity = {};

      // Loop for the array elements
      for (let i in json) {
        // Extract the title
        let objCity = json[i]["cityName"];

        // Use the title as the index
        uniqueCity[objCity] = json[i];
      }

      // Loop to push unique object into array
      for (let i in uniqueCity) {
        newCity.push(uniqueCity[i]);
      }
      newCity.sort(function (a, b) {
        if (a.cityName < b.cityName) {
          return -1;
        }
        if (a.cityName > b.cityName) {
          return 1;
        }
        return 0;
      });
      // Display the unique objects

      setCitiesNotDone([]);
      newCity.map((v) => {
        setCitiesNotDone((old) => [
          ...old,
          { name: v.cityName, id: v.cityId, uf: v.uf },
        ]);
      });

      // Loop to push unique object into array

      // Display the unique objects

    }

    console.log(uf);

    setShowUfDropdown(true);
    setLoading(false);
  };
  useEffect(() => {
    requestMovies();
  }, []);

  const ufPicked = async (item) => {
    setLoading(true);
    setShowCitiesDropdown(false);

    setCities([]);
    citiesNotDone.map((v) => {
      if (v.uf === item) {
        setCities((old) => [...old, v]);
      }
    });

    console.log(cities);

    setUfSelected(item);
    setShowUfDropdown(false);
    setShowCitiesDropdown(true);
    setLoading(false);
  };

  const closeDropdowns = async () => {
    setOpenUfDropdown(false);
    setOpenCitiesDropdown(false);
    setOpenTheatersDropdown(false);
  };

  const backToUf = async () => {
    setShowUfDropdown(true);
    setShowCitiesDropdown(false);
    setShowTheatersDropdown(false);
    setOpenUfDropdown(true);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View
        style={styles.container}
        alignItems="center"
      >
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <View style={{
            width: "100%",
            height: "100%",
          }}>
            <View
              style={{
                display: showUfDropdown == true ? "flex" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => closeDropdowns()}
              >
                <View style={styles.content}>
                  <TouchableOpacity
                    style={[styles.dropdown]}
                    onPress={() => setOpenUfDropdown(!openUfDropdown)}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontFamily: "Lato-Bold",
                        fontSize: 17,
                      }}
                    >
                      Selecione um estado
                    </Text>
                    <MaterialIcons
                      name={
                        openUfDropdown == false
                          ? "keyboard-arrow-down"
                          : "keyboard-arrow-up"
                      }
                      size={30}
                      color="#9D0208"
                      style={{ height: 30 }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 10,
                      display: openUfDropdown == false ? "none" : "flex",
                      maxHeight: 200,
                      padding: 5,
                      backgroundColor: "#292929",
                      marginTop: 2,
                    }}
                  >
                    <ScrollView>
                      {uf.map((uf) => {
                        return (
                          <TouchableHighlight
                            style={[styles.option]}
                            onPress={() => ufPicked(uf.uf)}
                            underlayColor="#9D0208"
                            key={uf.uf}
                          >
                            <Text
                              style={{
                                color: "#FFF",
                                fontFamily: "Lato-Bold",
                                fontSize: 17,
                              }}
                            >
                              {uf.uf}
                            </Text>
                          </TouchableHighlight>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                display: showCitiesDropdown == true ? "flex" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => closeDropdowns()}
                style={{
                    display: showCitiesDropdown == true ? "flex" : "none",
                  }}
              >
                <View style={[styles.content, { height: '100%' }]}>
                    <TouchableOpacity
                    style={[styles.dropdown, {marginBottom: 30}]}
                    onPress={() => backToUf()}
                    >
                    <Text
                      style={{
                        color: "#FFF",
                        fontFamily: "Lato-Bold",
                        fontSize: 17,
                      }}
                    >
                      {ufSelected}
                    </Text>
                    <MaterialIcons
                      name={"check"}
                      size={25}
                      color="#9D0208"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dropdown]}
                    onPress={() => setOpenCitiesDropdown(!openCitiesDropdown)}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontFamily: "Lato-Bold",
                        fontSize: 17,
                      }}
                    >
                      Selecione uma cidade
                    </Text>
                    <MaterialIcons
                      name={
                        openCitiesDropdown == false
                          ? "keyboard-arrow-down"
                          : "keyboard-arrow-up"
                      }
                      size={30}
                      color="#9D0208"
                      style={{ height: 30 }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      borderRadius: 10,
                      display: openCitiesDropdown == false ? "none" : "flex",
                      maxHeight: 200,
                      padding: 5,
                      backgroundColor: "#292929",
                      marginTop: 2,
                    }}
                  >
                    <ScrollView>
                      {cities.map((city) => {
                        return (
                          <TouchableHighlight
                            style={[styles.option]}
                            underlayColor="#9D0208"
                            key={city.id}
                            onPress={() => navigation.navigate("EmCartaz", {cityId: city.id, cityName: city.name, uf: ufSelected})}
                          >
                            <Text
                              style={{
                                color: "#FFF",
                                fontFamily: "Lato-Bold",
                                fontSize: 17,
                              }}
                            >
                              {city.name}
                            </Text>
                          </TouchableHighlight>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chipArea: {
    borderRadius: 7,
    padding: 12,
    margin: 4,
    backgroundColor: "#76767F",
    height: 40,
  },
  chipText: {
    fontFamily: "Lato-Bold",
    color: "#000",
    fontSize: 15,
  },
  badge: {
    marginLeft: 5,
    backgroundColor: "#9D0208",
    width: 14,
    height: 14,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  },
  badgeText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 10,
  },
  content: {
    alignItems: "center",
    height: 290,
    paddingHorizontal: (Dimensions.get("window").width * 20) / 392.72,
    paddingTop: 40,
  },
  dropdown: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#292929",
    maxHeight: 50,
    width: 300,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  option: {
    flexDirection: "row",
    width: 290,
    maxHeight: 50,
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    alignItems: "center",
  },
  title: {
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#9D0208",
    color: "#FFF",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    marginLeft: (Dimensions.get("window").width * 5) / 392.72,
    marginBottom: (Dimensions.get("window").height * 10) / 802.9,
  },
  movieBackdrop: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  moviePoster: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
    margin: (Dimensions.get("window").width * 5) / 392.72,
  },
  nowPlayingArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: (Dimensions.get("window").width * 372) / 392.72,
    justifyContent: "flex-start",
    marginBottom: 100,
  },
  loadingArea: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
  },
  totalMoviesText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  movieItem: {
    marginBottom: 30,
    flexDirection: "column",
    alignItems: "center",
  },
  movieImage: {
    height: 400,
  },
  areaUm: {
    flexDirection: "row",
    paddingHorizontal: "2%",
    margin: 5,
  },
  areaDois: {
    flex: 1,
    justifyContent: "center",
  },
  movieTitle: {
    color: "#FFF",
    fontSize: 18,
  },
  movieGenres: {
    color: "#FFF",
    fontSize: 15,
  },
  ratingArea: {
    width: "15%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  movieRating: {
    justifyContent: "center",
    color: "#FFF",
    fontSize: 17,
  },
  areaInput: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    height: 50,
    color: "#FFF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#292929",
    borderRadius: 20,
  },
  input: {
    fontFamily: "Lato-Regular",
    fontSize: 15,
    flex: 1,
    color: "#8F8F8F",
    alignItems: "center",
  },
  botao: {
    borderWidth: 2,
    backgroundColor: "#FFF",
  },
});
