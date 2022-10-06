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
  RefreshControl
} from "react-native";
import Constants from "../../components/utilities/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import Image from "react-native-scalable-image";
import ExpoFastImage from 'expo-fast-image';
import {
  query,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  updateDoc,
  where,
  getDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";

const Stack = createStackNavigator();

export default function TabHomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [favoriteGenres, setFavoriteGenres] = useState(null)
  const [forYou, setForYou] = useState([])

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const requests = async () => {
    setLoading(true);
    setRefreshing(true);

    const reqTrending = await fetch(
      Constants.URL.TRENDING_URL + Constants.URL.API_KEY
    );
    const jsonTrending = await reqTrending.json();

    if (jsonTrending) {
      for (const obj of jsonTrending.results) {
        if (obj.backdrop_path != null) {
          obj.backdrop_path =
            Constants.URL.IMAGE_URL_W780 + obj.backdrop_path;
        }
        if (obj.poster_path != null) {
          obj.poster_path =
            Constants.URL.IMAGE_URL_W185 + obj.poster_path;
        }
      }
      setTrending(jsonTrending);
    }

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setFavoriteGenres("");
    }
    const data = docSnap.data();
    const favoriteGenres = data.favoriteGenres;

    /*let today = new Date();
    let date = today.getFullYear()+"-"+(today.getMonth()+1).toString().padStart(2, '0')+"-"+today.getDate();*/
    

    const reqPersonal1M = await fetch(
      Constants.URL.DISCOVER_MOVIE_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.LIMIT_VOTE_COUNT + "1000" + Constants.URL.WITH_GENRES_URL + favoriteGenres[0].id
    );
    const jsonPersonal1M = await reqPersonal1M.json();

    const reqPersonal1S = await fetch(
      Constants.URL.DISCOVER_TV_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.WITH_GENRES_URL + favoriteGenres[0].id
    );
    const jsonPersonal1S = await reqPersonal1S.json();


    const reqPersonal2M = await fetch(
      Constants.URL.DISCOVER_MOVIE_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.LIMIT_VOTE_COUNT + "1000" + Constants.URL.WITH_GENRES_URL + favoriteGenres[1].id
    );
    const jsonPersonal2M = await reqPersonal2M.json();

    
    const reqPersonal2S = await fetch(
      Constants.URL.DISCOVER_TV_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.WITH_GENRES_URL + favoriteGenres[1].id
    );
    const jsonPersonal2S = await reqPersonal2S.json();


    const reqPersonal3M = await fetch(
      Constants.URL.DISCOVER_MOVIE_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.LIMIT_VOTE_COUNT + "1000" + Constants.URL.WITH_GENRES_URL + favoriteGenres[2].id
    );
    const jsonPersonal3M = await reqPersonal3M.json();

    const reqPersonal3S = await fetch(
      Constants.URL.DISCOVER_TV_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.WITH_GENRES_URL + favoriteGenres[2].id
    );
    const jsonPersonal3S = await reqPersonal3S.json();


    const reqPersonal4M = await fetch(
      Constants.URL.DISCOVER_MOVIE_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.LIMIT_VOTE_COUNT + "1000" + Constants.URL.WITH_GENRES_URL + favoriteGenres[3].id
    );
    const jsonPersonal4M = await reqPersonal4M.json();

    const reqPersonal4S = await fetch(
      Constants.URL.DISCOVER_TV_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.WITH_GENRES_URL + favoriteGenres[3].id
    );
    const jsonPersonal4S = await reqPersonal4S.json();


    const reqPersonal5M = await fetch(
      Constants.URL.DISCOVER_MOVIE_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.LIMIT_VOTE_COUNT + "1000" + Constants.URL.WITH_GENRES_URL + favoriteGenres[4].id
    );
    const jsonPersonal5M = await reqPersonal5M.json();

    const reqPersonal5S = await fetch(
      Constants.URL.DISCOVER_TV_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.SORT_BY_POPULARITY_URL + Constants.URL.PAGE_URL + "1" + Constants.URL.WITH_GENRES_URL + favoriteGenres[4].id
    );
    const jsonPersonal5S = await reqPersonal5S.json();

    let resultsGenresFavorites = [...jsonPersonal1M.results, ...jsonPersonal1S.results, ...jsonPersonal2M.results, ...jsonPersonal2S.results, ...jsonPersonal3M.results, ...jsonPersonal3S.results, ...jsonPersonal4M.results, ...jsonPersonal4S.results, ...jsonPersonal5M.results, ...jsonPersonal5S.results];


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

    newResults.sort(
      (a, b) => b.popularity - a.popularity
    );

    // Loop to push unique object into array
    for (let i in uniqueResults) {
      newResults.push(uniqueResults[i]);
    }

    setForYou([]);

    newResults.map((v) => {
      if ('name' in v === true) {
        setForYou(old => [...old, {mediaType: "TV", poster_path: Constants.URL.IMAGE_URL_W185 + v.poster_path, mediaId: v.id}])
      }
      else if ('title' in v === true) {
        setForYou(old => [...old, {mediaType: "Movie", poster_path: Constants.URL.IMAGE_URL_W185 + v.poster_path, mediaId: v.id}])
      }
    })

    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    requests();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        alignItems="center"
        horizontal={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={requests} />
        }
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
        
        {!loading && (
          <View style={[styles.content]}>
            <Text style={styles.title}>Principais Buscas</Text>
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
                      key={index}
                      onPress={() =>
                        navigation.navigate(media.media_type === "movie" ? "Movie" : "Serie", { mediaId: media.id, mediaType: media.media_type })
                      }
                    >
                      <ExpoFastImage
                        source={{
                        uri: `${media.poster_path}`
                        }}
                        style={styles.moviePoster}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>

            <Text style={[styles.title, {marginTop: 20}]}>Para você</Text>
            <ScrollView
              style={styles.scrollview}
              horizontal={true}
              alignItems="center"
              showsHorizontalScrollIndicator={false}
            >
              {forYou.map((media, index) => {
                return (
                  <TouchableOpacity
                    style={styles.movieItem}
                    key={index}
                    onPress={() =>
                      navigation.navigate(media.mediaType === "Movie" ? "Movie" : "Serie", { mediaId: media.mediaId, mediaType: media.mediaType })
                    }
                  >
                    <ExpoFastImage
                      source={{
                      uri: `${media.poster_path}`
                      }}
                      style={styles.moviePoster}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <Text style={[styles.title, { marginTop: 20 }]}>Em Alta</Text>
            <TouchableOpacity style={[styles.movieItem, { marginBottom: 100 }]} onPress={() =>
                        navigation.navigate(trending.results.sort(
                          (a, b) => b.popularity - a.popularity
                        )[0].mediaType === "Movie" ? "Movie" : "Serie", { mediaId: trending.results.sort(
                          (a, b) => b.popularity - a.popularity
                        )[0].id, mediaType: trending.results.sort(
                          (a, b) => b.popularity - a.popularity
                        )[0].media_type })
                      }>
              <ExpoFastImage
              source={{
                uri: `${trending.results.sort(
                  (a, b) => b.popularity - a.popularity
                )[0].backdrop_path}`
                }}
                style={styles.movieBackdrop}
                resizeMode="cover"
              />
            </TouchableOpacity>
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
    width: (Dimensions.get("window").width * 114) / 392.72,
    height: (Dimensions.get("window").width * 171) / 392.72,
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  movieBackdrop: {
    width:(Dimensions.get("window").width * 362) / 392.72,
    height: (Dimensions.get("window").width * 203.62) / 392.72,
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
