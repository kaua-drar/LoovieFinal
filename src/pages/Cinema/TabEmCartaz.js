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
} from "react-native";
import Image from "react-native-scalable-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function TabEmCartaz({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [bestRated, setBestRated] = useState([]);
  const name = route.params.name;
  const id = route.params.id;
  const cityName = route.params.cityName;
  const cityId = route.params.cityId;
  const uf = route.params.uf;

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });



  useEffect(() => {
    const requestMovies = async () => {
      setLoading(true);
      const req = await fetch(
        `https://api-content.ingresso.com/v0/templates/nowplaying/${cityId}/`
      );
      const json = await req.json();

      if (json) {
        setMovies(json);
        setRatedMovies([]);
        json.map((movie) => {
          if (movie.images.length != 1 && movie.rottenTomatoe != null) {
            setRatedMovies((rated) => [...rated, movie]);
          }
        });
      }
      setLoading(false);
    };

    requestMovies();
  }, []);

  const tryMainMovie = () => {
    try{
      return(
        <TouchableOpacity style={[styles.movieItem, { marginBottom: 20 }]} onPress={() => navigation.navigate("Movie", {movie: ratedMovies.sort(
          (a, b) =>
            b.rottenTomatoe.audienceScore -
            a.rottenTomatoe.audienceScore
        )[0], uf: uf, cityId: cityId})}>
          <Image
            width={(Dimensions.get("window").width * 362) / 392.72}
            source={{
              uri: ratedMovies.sort(
                (a, b) =>
                  b.rottenTomatoe.audienceScore -
                  a.rottenTomatoe.audienceScore
              )[0].images[1].url,
            }}
            style={styles.movieBackdrop}
          />
          <View style={styles.areaUm}>
            <View style={styles.areaDois}>
              <Text style={styles.movieTitle}>
                {
                  ratedMovies.sort(
                    (a, b) =>
                      b.rottenTomatoe.audienceScore -
                      a.rottenTomatoe.audienceScore
                  )[0].title
                }
              </Text>
              <Text style={styles.movieGenres}>
                {`${ratedMovies
                  .sort(
                    (a, b) =>
                      b.rottenTomatoe.audienceScore -
                      a.rottenTomatoe.audienceScore
                  )[0]
                  .genres.map((g) => " " + g)}`.slice(1)}
              </Text>
            </View>
            <View style={styles.ratingArea}>
              <FontAwesome name="star" size={18} color="#FFCF33" />
              <Text style={styles.movieRating}>
                {
                  ratedMovies.sort(
                    (a, b) =>
                      b.rottenTomatoe.audienceScore -
                      a.rottenTomatoe.audienceScore
                  )[0].rottenTomatoe.audienceScore
                }
                %
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    catch{
      return(null);
    }
    
  }

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        alignItems="center"
        justifyContent={loading == true ? "center" : "flex-start"}
      >
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <>
            {tryMainMovie()}
            <Text style={styles.title}>Em Cartaz</Text>
            <View style={styles.nowPlayingArea}>
              {movies.map((movie, i) => {
                try{
                  return (
                    <TouchableOpacity onPress={() => navigation.navigate("Movie", {movie: movie, uf: uf, cityId: cityId})} key={movie.id}>
                      <Image
                      key={i}
                      width={(Dimensions.get("window").width * 114) / 392.72}
                      source={{
                        uri: movie.images[0].url,
                      }}
                      style={[styles.moviePoster]}
                      />
                    </TouchableOpacity>
                  );
                }
                catch{
                  return(null);
                }
                
              })}
            </View>
            
          </>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    paddingHorizontal: (Dimensions.get("window").width * 20) / 392.72,
    paddingTop: "9%",
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
    marginBottom: 100
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
