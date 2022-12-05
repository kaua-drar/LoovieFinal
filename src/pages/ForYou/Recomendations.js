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
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  query,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import Constants from "../../components/utilities/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import ExpoFastImage from "expo-fast-image";
import { FlatList } from "react-native-gesture-handler";
import ReadMore from "@fawazahmed/react-native-read-more";
import { SafeAreaView } from "react-native-safe-area-context";
import Star from "react-native-star-view";

export default function Recomendations({navigation}) {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [favoriteGenres, setFavoriteGenres] = useState(null);
  const [forYou, setForYou] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const width = Dimensions.get("window").width;

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const genreDictionary = (genreIds) => {
    let newGenres = [];

    const genres = [
      { id: 28, name: "Ação" },
      { id: 12, name: "Aventura" },
      { id: 16, name: "Animação" },
      { id: 35, name: "Comédia" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentário" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Família" },
      { id: 14, name: "Fantasia" },
      { id: 36, name: "História" },
      { id: 27, name: "Terror" },
      { id: 10402, name: "Música" },
      { id: 9648, name: "Mistério" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Ficção científica" },
      { id: 10770, name: "Cinema TV" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "Guerra" },
      { id: 37, name: "Faroeste" },
      { id: 10759, name: "Action & Adventure" },
      { id: 10762, name: "Kids" },
      { id: 10763, name: "News" },
      { id: 10764, name: "Reality" },
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 10766, name: "Soap" },
      { id: 10767, name: "Talk" },
      { id: 10768, name: "War & Politics" },
    ];

    genreIds.map((genre) => {
      newGenres.push(genres.find((e) => e.id == genre));
    });

    return newGenres;
  };

  const requests = async () => {
    setLoading(true);
    setRefreshing(true);

    await getDoc(doc(db, "userPreferences", auth.currentUser.uid)).then(
      (docSnap) => {
        console.log(docSnap.data());
        if (docSnap.exists()) {
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          setFavoriteGenres("");
        }
        const data = docSnap.data();
        const favoriteGenres = data.favoriteGenres;

        let today = new Date();
        let date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          today.getDate();

        let resultsGenresFavorites = [];

        favoriteGenres.map(async (genre, index) => {
          let reqMovie = await fetch(
            Constants.URL.DISCOVER_MOVIE_URL +
              Constants.URL.API_KEY +
              Constants.URL.LANGUAGE +
              Constants.URL.SORT_BY_POPULARITY_URL +
              Constants.URL.PAGE_URL +
              "1" +
              Constants.URL.LIMIT_VOTE_COUNT +
              "1000" +
              Constants.URL.WITH_GENRES_URL +
              genre.id
          );
          let jsonMovie = await reqMovie.json();

          let reqSerie = await fetch(
            Constants.URL.DISCOVER_TV_URL +
              Constants.URL.API_KEY +
              Constants.URL.LANGUAGE +
              Constants.URL.SORT_BY_POPULARITY_URL +
              Constants.URL.PAGE_URL +
              "1" +
              Constants.URL.WITH_GENRES_URL +
              genre.id
          );
          let jsonSerie = await reqSerie.json();

          resultsGenresFavorites = [
            ...resultsGenresFavorites,
            ...jsonMovie.results,
            ...jsonSerie.results,
          ];
          /*console.log(resultsGenresFavorites);*/
        });

        setTimeout(() => {
          let newResults = [];

          // Declare an empty object
          let uniqueResults = {};

          // Loop for the array elements
          for (let i in resultsGenresFavorites) {
            // Extract the title
            let objResult = resultsGenresFavorites[i]["id"];

            // Use the title as the index
            uniqueResults[objResult] = resultsGenresFavorites[i];
          }

          newResults.sort((a, b) => b.popularity - a.popularity);

          // Loop to push unique object into array
          for (let i in uniqueResults) {
            newResults.push(uniqueResults[i]);
          }

          setForYou([]);

          newResults.map((v) => {
            if ("name" in v === true) {
              setForYou((old) => [
                ...old,
                {
                  mediaType: "TV",
                  poster_path: Constants.URL.IMAGE_URL_ORIGINAL + v.poster_path,
                  mediaId: v.id,
                  mediaGenres: genreDictionary(v.genre_ids),
                  mediaOverview: v.overview,
                  mediaRating: v.vote_average,
                  mediaTitle: v.name,
                },
              ]);
            } else if ("title" in v === true) {
              setForYou((old) => [
                ...old,
                {
                  mediaType: "Movie",
                  poster_path: Constants.URL.IMAGE_URL_ORIGINAL + v.poster_path,
                  mediaId: v.id,
                  mediaGenres: genreDictionary(v.genre_ids),
                  mediaOverview: v.overview,
                  mediaRating: v.vote_average,
                  mediaTitle: v.title,
                },
              ]);
            }
          });
          setRefreshing(false);
          setLoading(false);
        }, 3000);
      }
    );
  };

  useEffect(() => {
    requests();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        horizontal={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={requests} />
        }
      >
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <FlatList
            data={forYou}
            style={styles.scrollview}
            initialNumToRender={3}
            pagingEnabled
            horizontal
            onMomentumScrollEnd={(event) => {
              setActiveIndex(event.nativeEvent.contentOffset.x / width);
            }}
            scrollEventThrottle={16}
            alignItems="center"
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.movieItem}
                  key={index}
                  onPress={() =>
                    navigation.navigate(
                      item.mediaType === "Movie" ? "MovieRecomendation" : "SerieRecomendation",
                      { mediaId: item.mediaId, mediaType: item.mediaType }
                    )
                  }
                >
                  <ExpoFastImage
                    source={{
                      uri: `${item.poster_path}`,
                    }}
                    style={styles.moviePoster}
                    resizeMode="cover"
                  />
                  <View style={styles.mediaInfosArea}>
                    <View style={{flexDirection: "row"}}>
                    <Text style={styles.mediaTitle}>{item.mediaTitle}</Text>
                    <View style={{flex: 1}}></View>
                    </View>
                    
                    <Text style={styles.mediaOverview} numberOfLines={6}>
                      Sinopse: {item.mediaOverview}
                    </Text>
                    <View style={styles.row}>
                      <Text style={styles.mediaGenres}>
                        Gêneros: {item.mediaGenres.map((genre, index) => index == (item.mediaGenres.length - 1) ? genre.name : `${genre.name}, `)}
                      </Text>
                      <Star
                        score={(item.mediaRating.toFixed(1) * 5) / 10}
                        style={styles.starStyle}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.mediaId}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  starStyle: {
    width: (Dimensions.get("window").width * 125) / 392.72,
    height: (Dimensions.get("window").width * 25) / 392.72,
  },
  row: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
    width: (Dimensions.get("window").width * 382.72) / 392.72,
  },
  mediaGenres: {
    width: (Dimensions.get("window").width * 260) / 392.72,
    color: "#FFF",
    margin: 0,
    fontSize: (Dimensions.get("window").width * 16) / 392.72,
    fontFamily: "Lato-Regular",
  },
  mediaOverview: {
    width: (Dimensions.get("window").width * 382.72) / 392.72,
    color: "#FFF",
    margin: 0,
    fontSize: (Dimensions.get("window").width * 16) / 392.72,
    fontFamily: "Lato-Regular"
  },
  mediaTitle: {
    color: "#FFF",
    fontSize: (Dimensions.get("window").width * 19) / 392.72,
    paddingBottom: (Dimensions.get("window").width * 5) / 392.72,
    paddingHorizontal: (Dimensions.get("window").width * 3) / 392.72,
    borderColor: "#9D0208",
    borderBottomWidth: 2,
    fontFamily: "Lato-Bold",
    marginBottom: (Dimensions.get("window").width * 10) / 392.72,
  },
  mediaInfosArea: {
    borderTopLeftRadius: (Dimensions.get("window").width * 10) / 392.72,
    borderTopRightRadius: (Dimensions.get("window").width * 10) / 392.72,
    top: (Dimensions.get("window").width * -200) / 392.72,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    height: (Dimensions.get("window").width * 200) / 392.72,
    padding: (Dimensions.get("window").width * 5) / 392.72
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    fontFamily: "Lato-Regular",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollview: {
    flex: 1,
    width: (Dimensions.get("window").width * 392.72) / 392.72,
    height: (Dimensions.get("window").width * 589.08) / 392.72,
  },
  movieItem: {},
  moviePoster: {
    width: (Dimensions.get("window").width * 392.72) / 392.72,
    height: (Dimensions.get("window").width * 589.08) / 392.72,
    marginTop: (Dimensions.get("window").width * 200) / 392.72,
  },
  movieBackdrop: {
    width: (Dimensions.get("window").width * 362) / 392.72,
    height: (Dimensions.get("window").width * 203.62) / 392.72,
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
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
});
