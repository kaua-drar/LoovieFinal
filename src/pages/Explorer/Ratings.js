import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import Constants from "../../components/utilities/Constants";
import Image from "react-native-scalable-image";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import ReadMore from "@fawazahmed/react-native-read-more";
import YoutubePlayer from "react-native-youtube-iframe";
import Star from "react-native-star-view";
import ExpoFastImage from "expo-fast-image";
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
  limit,
  getCountFromServer,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import { useFocusEffect } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Media({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const mediaId = route.params.mediaId;
  const title = route.params.title;

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const requests = async () => {
    setRefreshing(true);
    setLoading(true);

    const queryRatings = query(
      collection(db, "ratings"),
      where("mediaId", "==", `${mediaId}`),
      limit(10)
    );

    const querySnapshotRatings = await getDocs(queryRatings);

    setRatings([]);
    querySnapshotRatings.forEach((doc) => {
      setRatings((old) => [
        ...old,
        {
          userName: doc.data().userName,
          userProfilePictureURL: doc.data().userProfilePictureURL,
          ratingText: doc.data().ratingText,
          rating: doc.data().rating,
          ratingDate: `${doc.data().ratingDate.toDate().getDate()}/${doc
            .data()
            .ratingDate.toDate()
            .getMonth()}/${doc.data().ratingDate.toDate().getFullYear()}`,
        },
      ]);
    });

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      requests();

      return () => {
        null;
      };
    }, [])
  );

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        alignItems="center"
        justifyContent={loading ? "center" : "flex-start"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={requests} />
        }
      >
        {!loading && (
          <View style={[styles.content, { display: "flex" }]}>
            <View style={styles.header}>
              <Text style={styles.title} onPress={() => console.log(ratings)}>
                AVALIAÇÕES - {title.toUpperCase()}
              </Text>
            </View>
            <View style={styles.mediaDetails2}>
              <View style={styles.avaliacoesArea}>
                <ScrollView>
                  {ratings.map((rating) => {
                    return (
                      <View style={styles.avaliacaoArea} key={rating.ratingId}>
                        <View style={styles.userInfo}>
                          <ExpoFastImage
                            style={styles.userImage}
                            source={{
                              uri: rating.userProfilePictureURL,
                            }}
                          />
                          <Text style={styles.userName}>{rating.userName}</Text>
                          <Text style={styles.avaliacaoData}>
                            {rating.ratingDate}
                          </Text>
                        </View>
                        <View style={styles.avaliacao}>
                          <View style={styles.score}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                              }}
                            >
                              <Text style={styles.note}>
                                {rating.rating.toFixed(1)}
                              </Text>
                              <Text style={styles.noteof}>/10</Text>
                            </View>
                            <Star
                              score={(rating.rating.toFixed(1) * 5) / 10}
                              style={styles.starStyle}
                            />
                          </View>
                          <Text style={styles.avaliacaoText}>
                            {rating.ratingText}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  avalieButtonArea: {
    backgroundColor: "#474747",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  avalieButtonText: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    fontSize: 17,
    marginRight: 10,
  },
  score: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: (Dimensions.get("window").width * 250) / 392.72,
  },
  avaliacoesArea: {
  },
  avaliacoesTitulo: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    fontSize: 17,
    marginBottom: 5,
  },
  userInfo: {
    justifyContent: "center",
  },
  userImage: {
    width: (Dimensions.get("window").width * 80) / 392.72,
    height: (Dimensions.get("window").width * 80) / 392.72,
    borderRadius: (Dimensions.get("window").width * 40) / 392.72,
    borderWidth: 2,
    borderColor: "#FFF",
    marginBottom: 5,
  },
  userName: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    width: (Dimensions.get("window").width * 80) / 392.72,
    textAlign: "center",
    fontSize: 14,
  },
  avaliacaoData: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    textAlign: "center",
    fontSize: 14,
  },
  avaliacaoText: {
    textAlign: "justify",
    color: "#FFF",
    margin: 0,
    fontSize: 15,
    width: (Dimensions.get("window").width * 250) / 392.72,
  },
  avaliacaoArea: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#292929",
    width: (Dimensions.get("window").width * 372) / 392.72,
    justifyContent: "space-between",
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 10) / 392.72,
    borderRadius: 10,
    marginVertical: 15,
  },
  changesArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  changeTitle: {
    width: "100%",
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
    marginBottom: 10,
  },
  changeItem: {
    paddingBottom: 5,
  },
  changeInput: {
    width: (Dimensions.get("window").width * 315) / 392.72,
    minHeight: 20,
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
    textAlignVertical: "top",
    padding: 10,
  },
  rateInputArea: {
    backgroundColor: "#3D3D3D",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9D0208",
    height: 250,
    marginBottom: 10,
  },
  createButton: {
    padding: 8,
    backgroundColor: "#9D0208",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  errorMessage: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
    textAlign: "center",
  },
  closeModal: {
    height: (Dimensions.get("window").width * 60) / 392.72,
    width: (Dimensions.get("window").width * 120) / 392.72,
    backgroundColor: "#FFF",
    borderColor: "#0F0C0C",
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: (Dimensions.get("window").width * 10) / 392.72,
  },
  closeModalText: {
    color: "#0F0C0C",
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  inputModalArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  inputModalContent: {
    paddingHorizontal: 15,
    borderRadius: 25,
    height: (Dimensions.get("window").width * 440) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    backgroundColor: "#292929",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
  folderImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  createFolderButton: {
    backgroundColor: "#3D3D3D",
    height: 60,
    width: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 17,
    marginLeft: 15,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  modalArea: {
    flex: 1,
    justifyContent: "flex-end",
    width: Dimensions.get("window").width,
  },
  modalContent: {
    paddingHorizontal: 80,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: 400,
    width: Dimensions.get("window").width,
    backgroundColor: "#292929",
    alignItems: "center",
    paddingTop: 15,
  },
  barra: {
    height: 7.5,
    width: 60,
    borderRadius: 5,
    backgroundColor: "#5C5C5C",
    marginBottom: 30,
  },
  itens: {
    flex: 1,
    height: 110,
    backgroundColor: "#292929",
    marginHorizontal: "2%",
    borderRadius: 5,
  },
  itemArea: {
    width: Dimensions.get("window").width,
  },
  itemText: {
    marginLeft: 30,
    color: "#FFF",
    fontSize: 17,
    fontFamily: "Lato-Regular",
    marginBottom: 5,
  },
  starStyle: {
    marginBottom: (Dimensions.get("window").height * 3) / 802.9,
    width: (Dimensions.get("window").width * 125) / 392.72,
    height: (Dimensions.get("window").width * 25) / 392.72,
  },
  movieItem: {
    justifyContent: "center",
  },
  note: {
    color: "#FFF",
    fontFamily: "Lato-Bold",
    fontSize: 23,
  },
  noteof: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
    marginBottom: 1.5,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  content: {
    marginBottom: 100,
    width: Dimensions.get("window").width,
    alignItems: "center",
    flex: 1,
    justifySelf: "flex-start",
  },
  header: {
    width: (Dimensions.get("window").width * 362) / 392.72,
    flexDirection: "row",
  },
  genres: {
    flexDirection: "column",
    flex: 1,
    height: 30,
    marginLeft: 7.5,
    maxHeight: 32,
  },
  genre: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "#FFF",
    height: 30,
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 2.5,
  },
  mediaArea: {
    flexDirection: "row",
    overflow: "scroll",
    width: (Dimensions.get("window").width * 372) / 392.72,
  },
  mediaDetails: {
    flex: 1,
  },
  mediaDetail: {
    fontSize: 15,
    color: "#FFF",
    marginVertical: (Dimensions.get("window").height * 5) / 802.9,
    marginLeft: 10,
  },
  mediaPoster: {
    width: (Dimensions.get("window").width * 170) / 392.72,
    height: (Dimensions.get("window").width * 255) / 392.72,
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  container: {
    flex: 1,
    paddingTop: "9%",
    flexDirection: "column",
    backgroundColor: "#0F0C0C",
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
  title: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#9D0208",
    paddingBottom: (Dimensions.get("window").height * 5) / 802.9,
    marginBottom: (Dimensions.get("window").height * 20) / 802.9,
    color: "#FFF",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    textAlign: "left",
  },
  mediaDetails2: {
    alignItems: "center",
    justifyContent: "center",
    width: (Dimensions.get("window").width * 372) / 392.72,
  },
  toggleOptions: {
    width: "100%",
    flexDirection: "row",
    marginTop: (Dimensions.get("window").height * 15) / 802.9,
  },
  toggleOption: {
    padding: 10,
    color: "#FFF",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    fontSize: 17,
    marginBottom: 4,
    borderRadius: 10,
  },
  toggleActive: {
    marginBottom: 0,
    borderBottomWidth: 4,
    borderColor: "#292929",
    backgroundColor: "#292929",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleInactive: {
    backgroundColor: "#474747",
  },
  toggledOptionsArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 10) / 392.72,
    backgroundColor: "#292929",
    color: "#FFF",
  },
});
