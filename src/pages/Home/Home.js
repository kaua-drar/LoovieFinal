import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "../../components/utilities/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import Image from "react-native-scalable-image";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function TabHomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setLoaded(false)
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
    const requests = async () => {
      setLoading(true);
      const reqTrending = await fetch(
        Constants.URL.TRENDING_URL + Constants.URL.API_KEY
      );
      const jsonTrending = await reqTrending.json();

      if (jsonTrending) {
        for (const obj of jsonTrending.results) {
          if (obj.backdrop_path != null) {
            obj.backdrop_path =
              Constants.URL.IMAGE_URL_ORIGINAL + obj.backdrop_path;
          }
          if (obj.poster_path != null) {
            obj.poster_path =
              Constants.URL.IMAGE_URL_ORIGINAL + obj.poster_path;
          }
        }
        setTrending(jsonTrending);
      }

      setLoading(false);
    };

    requests();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        onLayout={onLayoutRootView}
        style={styles.container}
        alignItems="center"
        horizontal={false}
      >
        <View style={styles.areaInput}>
            <TextInput
              placeholder="O que você procura?"
              placeholderTextColor="#8F8F8F"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              onSubmitEditing = {(event) => navigation.navigate("Multisearch", {text: event.nativeEvent.text})}
            />
            {search.length > 0 && (
              <>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => setSearch("")}
                >
                  <MaterialIcons name="clear" size={24} color="#8F8F8F" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() =>
              navigation.navigate("SearchFilter")
            }>
              <FontAwesome
                name="sliders"
                size={24}
                color="#8F8F8F"
              />
            </TouchableOpacity>
        </View>
        {loading || !loaded && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <View style={[styles.content, {display: loaded == true ? 'flex' : 'none'}]}>
            <TouchableOpacity>
              <Text style={styles.title}>Principais Buscas</Text>
            </TouchableOpacity>

            <ScrollView
              style={styles.scrollview}
              horizontal={true}
              alignItems="center"
              showsHorizontalScrollIndicator={false}
            >
              {trending.results.map((media, index) => {
                if (media.poster_path) {
                  return (
                    <TouchableOpacity
                      style={styles.movieItem}
                      key={media.id}
                      onPress={() =>
                        navigation.navigate(media.media_type === "movie" ? "Movie" : "Serie", { mediaId: media.id, mediaType: media.media_type })
                      }
                    >
                      <Image
                        width={(Dimensions.get("window").width * 114) / 392.72}
                        source={{
                          uri: `${media.poster_path}`,
                        }}
                        style={styles.moviePoster}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
            <Text style={[styles.title, { marginTop: 20 }]}>Em Alta</Text>
            <View style={[styles.movieItem, { marginBottom: 100 }]}>
              <Image
                source={{
                  uri: `${
                    trending.results.sort(
                      (a, b) => b.popularity - a.popularity
                    )[0].backdrop_path
                  }`,
                }}
                width={(Dimensions.get("window").width * 362) / 392.72}
                style={styles.movieBackdrop}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  areaInput: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    height: (Dimensions.get("window").height * 50) / 802.9,
    color: "#FFF",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    paddingVertical: (Dimensions.get("window").height * 10) / 802.9,
    paddingHorizontal: (Dimensions.get("window").height * 15) / 802.9,
    backgroundColor: "#292929",
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    marginBottom: (Dimensions.get("window").height * 33) / 802.9,
  },
  input: {
    fontFamily: "Lato-Regular",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 7.7,
    flex: 1,
    color: "#8F8F8F",
    alignItems: "center",
  },
  scrollview: {
    width: (Dimensions.get("window").width * 372) / 392.72,
    maxHeight: (Dimensions.get("window").height * 200) / 802.9,
  },
  movieItem: {
    marginHorizontal: (Dimensions.get("window").width * 5) / 392.72,
  },
  moviePoster: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  movieBackdrop: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    paddingHorizontal: (Dimensions.get("window").width * 20) / 392.72,
    paddingTop: "10%",
    fontFamily: "Lato-Regular",
  },
  content: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  title: {
    fontFamily: "Lato-Regular",
    alignSelf: "flex-start",
    borderBottomWidth: 1,
    borderColor: "#9D0208",
    color: "#FFF",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    marginLeft: (Dimensions.get("window").width * 5) / 392.72,
    marginBottom: (Dimensions.get("window").height * 10) / 802.9,
  },
});
