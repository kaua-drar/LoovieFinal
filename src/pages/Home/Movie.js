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
import Modal from "react-native-modal";
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
  serverTimestamp
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "react-native-star-rating-widget";
import { useFocusEffect } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Media({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [cast, setCast] = useState([]);
  const [fullCast, setFullCast] = useState([]);
  const [director, setDirector] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [certification, setCertification] = useState("");
  const [trailer, setTrailer] = useState("");
  const [playing, setPlaying] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [toggleModal, setToggleModal] = useState(true);
  const [toggleInputModal, setToggleInputModal] = useState(true);
  const [toggleRateModal, setToggleRateModal] = useState(true);
  const [mediaId, setMediaId] = useState(route.params.mediaId);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInputModalVisible, setInputModalVisible] = useState(false);
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderInfo, setFolderInfo] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [refreshing, setRefreshing] = useState(true);
  const [ratingText, setRatingText] = useState("");
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState({});

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const addToFolder = async (folderId) => {
    const pickedFolder = [];

    const docSnap = await getDoc(doc(db, "folders", folderId));

    if (docSnap.exists()) {
      pickedFolder.push(docSnap.data());
      console.log(pickedFolder);
      if (
        !(
          pickedFolder[0].medias.filter((e) => e.mediaId === `M${details.id}`)
            .length > 0
        )
      ) {
        pickedFolder[0].medias.push({
          mediaId: `M${details.id}`,
          posterPath: details.poster_path,
          title: details.title,
        });
        await updateDoc(doc(collection(db, "folders"), folderId), {
          medias: pickedFolder[0].medias,
        })
          .catch((error) => console.log(error.code))
          .finally(() => {
            console.log("funfou");
            setToggleInputModal(false);
            setToggleModal(false);
            setModalVisible(false);
            setInputModalVisible(false);
            requests();
          });
      } else if (
        pickedFolder[0].medias.filter((e) => e.mediaId === `M${details.id}`)
          .length > 0
      ) {
        // doc.data() will be undefined in this case
        console.log("Já tá na pasta");
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const handleToggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleToggleInputModal = () => {
    setInputModalVisible(!isInputModalVisible);
  };
  const handleToggleRateModal = () => {
    setIsRateModalVisible(!isRateModalVisible);
  };

  const createNewFolder = async () => {
    await setDoc(doc(collection(db, "folders")), {
      userId: auth.currentUser.uid,
      name: folderName,
      medias: [
        {
          mediaId: `M${details.id}`,
          title: details.title,
          posterPath: details.poster_path,
        },
      ],
    }).then(() => {
      console.log("funfou");
      setToggleInputModal(false);
      setToggleModal(false);
      setModalVisible(false);
      setInputModalVisible(false);
      requests();
    });
  };

  const submitCritic = async () => {
    let today = new Date();
    let date =
      (today.getDate() + 1).toString().padStart(2, "0") +
      "/" +
      (today.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      today.getFullYear();
    console.log(rating);

    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const username = data.username;

    await setDoc(doc(collection(db, "ratings")), {
      userId: auth.currentUser.uid,
      mediaId: `M${details.id}`,
      ratingText: ratingText,
      rating: rating * 2,
      ratingDate: date,
      userName: username,
      timestamp: serverTimestamp()
    }).then(() => {
      console.log("funfou");
      setToggleRateModal(false);
      setIsRateModalVisible(false);
      requests();
    });
  };

  const tryYoutube = () => {
    if (toggle == false) {
      try {
        return (
          <YoutubePlayer
            height={(338 / 16) * 9}
            width={338}
            play={playing}
            videoId={`${trailer}`}
            onChangeState={onStateChange}
          />
        );
      } catch {
        return null;
      }
    } else {
      return null;
    }
  };

  const tryDirector = () => {
    try {
      setDirector(
        <Text style={styles.mediaDetail}>
          Diretor:{" "}
          {
            fullCast.find(
              (person) =>
                person.known_for_department === "Directing" ||
                person.department === "Directing"
            ).name
          }
        </Text>
      );
    } catch {
      null;
    }
  };
  const tryCertifications = () => {
    setCertification(() => {
      try {
        if (
          certifications.results.find((item) => item.iso_3166_1 === "BR")
            .release_dates[0].certification != ""
        ) {
          return (
            <Text style={styles.mediaDetail}>
              Classificação:{" "}
              {
                certifications.results.find((item) => item.iso_3166_1 === "BR")
                  .release_dates[0].certification
              }
            </Text>
          );
        } else {
          return null;
        }
      } catch {
        return null;
      }
    });
  };
  const tryWatchProviders = () => {
    try {
      return (
        <>
          <Text
            style={[
              styles.mediaDetail,
              { marginTop: (Dimensions.get("window").height * 10) / 802.9 },
            ]}
          >
            Onde assistir:
          </Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ maxWidth: "100%", marginLeft: 7.5 }}
          >
            {watchProviders.results.BR.flatrate.map((providers, index) => {
              return (
                <Image
                  width={(Dimensions.get("window").width * 50) / 392.72}
                  source={{
                    uri: `${Constants.URL.IMAGE_URL_ORIGINAL}${providers.logo_path}`,
                  }}
                  style={{ marginHorizontal: 2.5, borderRadius: 10 }}
                  resizeMode="cover"
                  key={index}
                />
              );
            })}
          </ScrollView>
        </>
      );
    } catch {
      return null;
    }
  };

  const tryCast = () => {
    if (cast.length > 3) {
      return (
        <Text style={styles.mediaDetail}>
          Elenco:{" "}
          {cast.map((item, index) => {
            if (index < 3) {
              return item.name + ", ";
            } else if (index == 3) {
              return item.name;
            }
          })}
        </Text>
      );
    } else {
      return null;
    }
  };

  const Avaliacoes = () => {
    try {
      return (
        <View style={styles.avaliacoesArea}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Ratings", {
                mediaId: `M${details.id}`,
                title: details.title,
              })
            }
          >
            <Text style={styles.avaliacoesTitulo}>Avaliações {">"}</Text>
          </TouchableOpacity>
          <View style={styles.avaliacaoArea}>
            <View style={styles.userInfo}>
              <ExpoFastImage
                style={styles.userImage}
                source={{
                  uri: "https://pbs.twimg.com/media/Fdnl8v_XoAE2vQX?format=jpg&name=large",
                }}
              />
              <Text style={styles.userName}>{ratings.userName}</Text>
              <Text style={styles.avaliacaoData}>{ratings.ratingDate}</Text>
            </View>
            <View style={styles.avaliacao}>
              <View
                style={[
                  styles.score,
                  { width: (Dimensions.get("window").width * 250) / 392.72, },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={[styles.note, { fontSize: 23 }]}>
                    {ratings.rating.toFixed(1)}
                  </Text>
                  <Text style={[styles.noteof, { fontSize: 17 }]}>/10</Text>
                </View>
                <Star
                  score={(ratings.rating.toFixed(1) * 5) / 10}
                  style={{
                      marginBottom:
                        (Dimensions.get("window").height * 3) / 802.9,
                      width: (Dimensions.get("window").width * 125) / 392.72,
                      height: (Dimensions.get("window").width * 25) / 392.72,
                    }}
                />
              </View>
              <Text style={styles.avaliacaoText}>{ratings.ratingText}</Text>
            </View>
          </View>
        </View>
      );
    } catch {
      return null;
    }
  };

  const tries = () => {
    tryDirector();
    tryCertifications();
  };

  const requests = async () => {
    setRefreshing(true);
    setLoading(true);

    setMediaId(route.params.mediaId);

    const reqDetails = await fetch(
      Constants.URL.MOVIE_DETAILS_URL +
        `${mediaId}` +
        Constants.URL.API_KEY +
        Constants.URL.LANGUAGE
    );

    const jsonDetails = await reqDetails.json();

    if (jsonDetails) {
      setDetails(jsonDetails);
    }

    const reqCredits = await fetch(
      Constants.URL.MOVIE_DETAILS_URL +
        `${mediaId}` +
        Constants.URL.CREDITS_URL +
        Constants.URL.API_KEY +
        Constants.URL.LANGUAGE
    );
    const jsonCredits = await reqCredits.json();

    if (jsonCredits) {
      setCast([]);
      jsonCredits.cast.map((person) => {
        if (person.known_for_department === "Acting") {
          setCast((actor) => [...actor, person]);
        }
      });
      setFullCast([]);
      await jsonCredits.cast.map((person) => {
        setFullCast((item) => [...item, person]);
      });
      await jsonCredits.crew.map((person) => {
        setFullCast((item) => [...item, person]);
      });
    }

    const reqCertifications = await fetch(
      Constants.URL.MOVIE_DETAILS_URL +
        `${mediaId}` +
        Constants.URL.RELEASE_DATES_URL +
        Constants.URL.API_KEY
    );
    const jsonCertifications = await reqCertifications.json();

    if (jsonCertifications) {
      setCertifications(jsonCertifications);
    }

    const reqTrailer = await fetch(
      Constants.URL.MOVIE_DETAILS_URL +
        `${mediaId}` +
        Constants.URL.VIDEOS_URL +
        Constants.URL.API_KEY +
        Constants.URL.LANGUAGE
    );
    const jsonTrailer = await reqTrailer.json();

    if (jsonTrailer) {
      try {
        setTrailer(jsonTrailer.results[0].key);
      } catch {
        setTrailer("");
      }
    }

    const reqWatchProviders = await fetch(
      Constants.URL.MOVIE_DETAILS_URL +
        `${mediaId}` +
        Constants.URL.WATCH_PROVIDERS_URL +
        Constants.URL.API_KEY
    );
    const jsonWatchProviders = await reqWatchProviders.json();

    if (jsonWatchProviders) {
      setWatchProviders(jsonWatchProviders);
    }

    const q = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    setFolders([]);
    querySnapshot.forEach((doc) => {
      setFolders((old) =>
        [
          ...old,
          {
            folderId: doc.id,
            userId: doc.data().userId,
            name: doc.data().name,
            posterPath: doc.data().medias[0].posterPath,
          },
        ].sort(function (a, b) {
          let x = a.name.toUpperCase(),
            y = b.name.toUpperCase();

          return x == y ? 0 : x > y ? 1 : -1;
        })
      );
    });

    const queryRatings = query(
      collection(db, "ratings"),
      where("mediaId", "==", `M${mediaId}`),
      limit(1)
    );

    const querySnapshotRatings = await getDocs(queryRatings);

    setRatings({});
    querySnapshotRatings.forEach((doc) => {
      setRatings({
        userName: doc.data().userName,
        ratingText: doc.data().ratingText,
        rating: doc.data().rating,
        ratingDate: doc.data().ratingDate,
      });
    });

    console.log(ratings);

    setToggleModal(false);
    setToggleInputModal(false);

    setLoading(false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      requests();

      return () => {
        console.log(mediaId);
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
            <View style={styles.header} onLayout={() => tries()}>
              <Text style={styles.title}>{details.title.toUpperCase()}</Text>
              <TouchableOpacity
                style={{ alignItems: "flex-start" }}
                onPress={() => handleToggleModal()}
              >
                <Entypo name="plus" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.mediaArea}>
              <View style={styles.movieItem}>
                <ExpoFastImage
                  source={{
                    uri: `${Constants.URL.IMAGE_URL_W500}${details.poster_path}`,
                  }}
                  style={styles.mediaPoster}
                  resizeMode="cover"
                />
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={styles.note}>
                    {details.vote_average.toFixed(1)}
                  </Text>
                  <Text style={styles.noteof}>/10</Text>
                </View>
                <Star
                  score={(details.vote_average.toFixed(1) * 5) / 10}
                  style={styles.starStyle}
                />
              </View>

              <View style={styles.mediaDetails}>
                {director}
                <Text style={styles.mediaDetail}>
                  Duração: {Math.floor(details.runtime / 60)}h{" "}
                  {details.runtime % 60}m
                </Text>
                {tryCast()}
                {certification}
                <Text style={styles.mediaDetail}>Gêneros:</Text>
                <View style={styles.genres}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {details.genres.map((genre, index) => {
                      return (
                        <Text style={styles.genre} key={index}>
                          {genre.name}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </View>
                {tryWatchProviders()}
              </View>
            </View>
            <View style={styles.mediaDetails2}>
              <View style={styles.toggleOptions}>
                <TouchableOpacity onPress={() => setToggle(true)}>
                  <Text
                    style={[
                      styles.toggleOption,
                      toggle == true
                        ? styles.toggleActive
                        : styles.toggleInactive,
                      { marginRight: 4 },
                    ]}
                  >
                    Descrição
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setToggle(false)}
                  style={{ display: trailer === "" ? "none" : "flex" }}
                >
                  <Text
                    style={[
                      styles.toggleOption,
                      toggle == false
                        ? styles.toggleActive
                        : styles.toggleInactive,
                    ]}
                  >
                    Trailer
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.toggledOptionsArea,
                  {
                    borderRadius: 13,
                    borderTopLeftRadius: toggle == true ? 0 : 13,
                    fontSize: 15,
                  },
                ]}
              >
                <ReadMore
                  style={{
                    textAlign: "justify",
                    color: "#FFF",
                    display: toggle == true ? "flex" : "none",
                    margin: 0,
                    fontSize: 15,
                  }}
                  numberOfLines={5}
                >
                  {details.overview}
                </ReadMore>
                {tryYoutube()}
              </View>
              <Avaliacoes />
              <TouchableOpacity
                style={styles.avalieButtonArea}
                onPress={() => handleToggleRateModal()}
              >
                <Text style={styles.avalieButtonText}>Deixe sua avaliação</Text>
                <FontAwesome name="pencil-square" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={isModalVisible}
              onSwipeComplete={() => setModalVisible(false)}
              swipeDirection="down"
              onSwipeThreshold={500}
              onBackdropPress={handleToggleModal}
              propagateSwipe={true}
              style={{margin: 0}}
            >
              <View style={styles.modalArea}>
                <View style={styles.modalContent}>
                  <View style={styles.barra}></View>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      height: 260,
                    }}
                  >
                    <ScrollView>
                      {folders.map((folder) => {
                        return (
                          <TouchableOpacity
                            style={styles.button}
                            key={folder.folderId}
                            onPress={() => addToFolder(folder.folderId)}
                          >
                            <ExpoFastImage
                              source={{
                                uri: `${Constants.URL.IMAGE_URL_W500}${folder.posterPath}`,
                              }}
                              style={styles.folderImage}
                            />
                            <Text style={styles.buttonText}>{folder.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginBottom: 10,
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleToggleInputModal()}
                    >
                      <View style={styles.createFolderButton}>
                        <Entypo name="plus" size={30} color="white" />
                      </View>
                      <Text style={styles.buttonText}>Criar Pasta</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={isInputModalVisible}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              onBackdropPress={handleToggleInputModal}
              style={{margin: 0}}
            >
              <View style={styles.inputModalArea}>
                <View style={styles.inputModalContent}>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleToggleInputModal()}>
                      <AntDesign
                        name="close"
                        size={32}
                        color="#FFF"
                        style={{
                          display: "flex",
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.errorMessage}>Salvar na Pasta</Text>
                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={() => createNewFolder()}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { marginLeft: 0, fontSize: 17 },
                        ]}
                      >
                        Criar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.changesArea}>
                    <View style={styles.changeItem}>
                      <Text style={[styles.changeTitle]}>Nome da Pasta</Text>
                      <TextInput
                        placeholder="Digite o nome da sua nova pasta"
                        placeholderTextColor="#8F8F8F"
                        style={[styles.changeInput, {borderBottomWidth: 1, borderColor: "#9D0208"}]}
                        onChangeText={(text) => setFolderName(text)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={isRateModalVisible}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              onBackdropPress={handleToggleRateModal}
              style={{margin: 0}}
            >
              <View style={styles.inputModalArea}>
                <View style={styles.inputModalContent}>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleToggleRateModal()}>
                      <AntDesign
                        name="close"
                        size={32}
                        color="#FFF"
                        style={{
                          display: "flex",
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.errorMessage}>Avaliação</Text>
                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={() => submitCritic()}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { marginLeft: 0, fontSize: 17 },
                        ]}
                      >
                        Enviar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.changesArea}>
                    <View style={styles.changeItem}>
                      <Text style={[styles.changeTitle]}>Avalie</Text>
                      <View style={styles.rateInputArea}>
                        <ScrollView horizontal={false}>
                          <TextInput
                            placeholder="Deixe sua avaliação aqui."
                            placeholderTextColor="#8F8F8F"
                            style={[styles.changeInput]}
                            onChangeText={(text) => setRatingText(text)}
                            multiline={true}
                          />
                        </ScrollView>
                      </View>
                      <StarRating
                        rating={rating}
                        onChange={setRating}
                        enableHalfStar={true}
                        starSize={30}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
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
    width: (Dimensions.get("window").width * 225) / 392.72,
  },
  avaliacoesArea: {
    marginTop: 20,
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
    borderWidth: 1,
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
    width: (Dimensions.get("window").width * 125) / 392.72,
    height: (Dimensions.get("window").width * 25) / 392.72,
    marginBottom: (Dimensions.get("window").height * 5) / 802.9,
  },
  movieItem: {
    justifyContent: "center",
  },
  note: {
    color: "#FFF",
    fontFamily: "Lato-Bold",
    fontSize: 30,
  },
  noteof: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
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
    paddingTop: "2%",
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
    marginHorizontal: 5,
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
