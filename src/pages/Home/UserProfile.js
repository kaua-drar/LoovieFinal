import { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome5,
  Entypo,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import styles from "./styles/UserProfileStyle";
import stylesFeed from "./styles/FeedStyle";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  getDocs,
  query,
  where,
  limit,
  writeBatch,
  orderBy,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Video, AVPlaybackStatus } from "expo-av";
import ExpoFastImage from "expo-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "../../components/utilities/Constants";
import Star from "react-native-star-view";

export default function ProfileScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [options, setOptions] = useState(true);
  const [userInfos, setUserInfos] = useState({});
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [folders, setFolders] = useState([]);
  const [ratings, setRatings] = useState({});
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({});
  const [isFollowing, setIsFollowing] = useState(null);

  const uid = route.params.userId;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const Avaliacoes = () => {
    try {
      return (
        <View style={styles.avaliacoesArea}>
          <TouchableOpacity>
            <Text style={styles.avaliacoesTitulo}>Avaliações {">"}</Text>
          </TouchableOpacity>
          <View style={styles.avaliacaoArea}>
            <View style={styles.userInfo}>
              <ExpoFastImage
                style={styles.userImage}
                source={{
                  uri: Constants.URL.IMAGE_URL_ORIGINAL + ratings.mediaPoster,
                }}
              />
              <Text style={styles.userName}>{ratings.mediaName}</Text>
              <Text
                style={styles.avaliacaoData}
              >{`${ratings.ratingDate}`}</Text>
            </View>
            <View style={styles.avaliacao}>
              <View
                style={[
                  styles.score,
                  {
                    width: (Dimensions.get("window").width * 250) / 392.72,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
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
                    marginBottom: (Dimensions.get("window").height * 3) / 802.9,
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

  const postagens = () => {
    if (!options) {
      setOptions(!options);
    }
  };

  const biblioteca = () => {
    if (options) {
      setOptions(!options);
    }
  };

  const pressedFollow = async () => {
    if(!isFollowing) {
      await updateDoc(doc(db, "users", uid), {
        followers: increment(1),
      }).then(async () => {
        console.log("mais um pro perfil cara");
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          following: increment(1),
        }).then(async () => {
          console.log("mais um pro seu perfil");
          await updateDoc(doc(db, "userAnalytics", auth.currentUser.uid), {
            followingIds: arrayUnion(uid),
          }).then(() => {
            console.log("ta na sua lista");
            requests();
          })
        });
      });
    } else if(isFollowing) {
      await updateDoc(doc(db, "users", uid), {
        followers: increment(-1),
      }).then(async () => {
        console.log("menos um pro perfil do cara");
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          following: increment(-1),
        }).then(async () => {
          console.log("menos um pro seu perfil");
          await updateDoc(doc(db, "userAnalytics", auth.currentUser.uid), {
            followingIds: arrayRemove(uid),
          }).then(() => {
            console.log("saiu da sua lista");
            requests();
          })
        });
      });
    }
    
  };

  useFocusEffect(
    useCallback(() => {
      requests();

      return () => {
        setIsVisible(false);
      };
    }, [])
  );
  const handleSignOut = () => {
    toggleModal();
    auth
      .signOut()
      .then(() => {
        navigation.replace("Welcome");
      })
      .catch((error) => alert(error.message));
  };

  const requests = async () => {
    setRefreshing(true);
    setIsVisible(false);

    await getDoc(doc(db, "userAnalytics", auth.currentUser.uid)).then((v) => {
      console.log("PASSOOOOOOOOOOOOOOOOOUUUUUUUUUUUUUU");
      try {
        console.log(v.data().followingIds.some((e) => e == uid))
        setIsFollowing(v.data().followingIds.some((e) => e == uid));
      } catch {
        setIsFollowing(false);
      }
    });

    const citiesRef = collection(db, "posts");

    const queryPosts = await getDocs(
      query(
        collection(db, "posts"),
        where("userId", "==", `${uid}`),
        orderBy("postDate", "desc")
      )
    );

    setPosts([]);
    queryPosts.forEach((doc) => {
      setPosts((old) => [
        ...old,
        {
          postId: doc.id,
          userId: doc.data().userId,
          userName: doc.data().userName,
          userProfilePictureURL: doc.data().userProfilePictureURL,
          postDate: checkDate(doc.data().postDate.toDate()),
          postDescription: doc.data().postDescription,
          postMedias: doc.data().postMedias,
          postMediaType: doc.data().postMediaType,
          postTags: doc.data().postTags,
          totalLikes: doc.data().totalLikes,
          totalComments: doc.data().totalComments,
          isLiked: false,
        },
      ]);
    });

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserInfos({
        username: data.username,
        name: data.name,
        bio: data.bio,
        profilePictureURL: data.profilePictureURL,
        following: data.following,
        followers: data.followers,
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setUserInfos({});
    }

    console.log(auth.currentUser.photoURL);

    const docRefGenre = doc(db, "userPreferences", uid);
    const docSnapGenre = await getDoc(docRefGenre);

    if (docSnapGenre.exists()) {
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setFavoriteGenres("");
    }
    const data = docSnapGenre.data();
    setFavoriteGenres(data.favoriteGenres);

    const q = query(collection(db, "folders"), where("userId", "==", `${uid}`));

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

    /*console.log(favoriteGenres);
    console.log(folders);*/

    const queryRatings = query(
      collection(db, "ratings"),
      where("userId", "==", `${uid}`),
      limit(1)
    );

    const querySnapshotRatings = await getDocs(queryRatings);

    querySnapshotRatings.forEach((doc) => {
      console.log(doc.data());
      setRatings({
        mediaName: doc.data().mediaName,
        mediaId: doc.data().mediaId,
        mediaPoster: doc.data().mediaPoster,
        ratingText: doc.data().ratingText,
        rating: doc.data().rating,
        ratingDate: `${doc.data().ratingDate.toDate().getDate()}/${doc
          .data()
          .ratingDate.toDate()
          .getMonth()}/${doc.data().ratingDate.toDate().getFullYear()}`,
      });
    });

    setRefreshing(false);
    setIsVisible(true);
  };

  const checkDate = (postDate) => {
    let now = new Date();
    let difference = now - postDate;
    console.log(now, " - ", postDate, " = ", difference / 1000 / 60);
    return difference / 1000 < 60
      ? `${Math.ceil(difference / 1000)}s`
      : difference / 1000 < 3600
      ? `${parseInt(difference / 1000 / 60)}min`
      : difference / 1000 < 86400
      ? `${parseInt(difference / 1000 / 60 / 60)}h`
      : postDate.getFullYear() >= now.getFullYear()
      ? `${postDate.getDate()}/${postDate.getMonth()}`
      : `${postDate.getDate()}/${postDate.getMonth()}/${postDate.getFullYear()}`;
  };

  const headerHeight =
    (Dimensions.get("window").width * 327.2727355957031) / 392.72;

  return (
    <FlatList
      style={styles.container}
      alignItems="center"
      data={posts}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={requests} />
      }
      ListHeaderComponent={
        <View>
          <SafeAreaView style={styles.backdrop}>
            <Image
              style={styles.profilePicture}
              source={{
                uri:
                  userInfos.profilePictureURL == null
                    ? "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    : userInfos.profilePictureURL,
              }}
            />
          </SafeAreaView>
          <View style={styles.userNumbers}>
            <View style={styles.numberArea}>
              <Text style={styles.numberCount}>{userInfos.following}</Text>
              <Text style={styles.numberDescription}>Seguindo</Text>
            </View>
            <View style={styles.numberArea}>
              <Text style={styles.numberCount}>{userInfos.followers}</Text>
              <Text style={styles.numberDescription}>Seguidores</Text>
            </View>
            {isFollowing != null && isFollowing && (
              <TouchableOpacity
                style={[styles.profileButton, {backgroundColor: "#292929", marginLeft: (Dimensions.get("window").width * 5) / 392.72}]}
                onPress={() => pressedFollow()}
              >
                <Text style={styles.text}>Seguindo</Text>
              </TouchableOpacity>
            )}
            {isFollowing != null && !isFollowing && (
              <TouchableOpacity
                style={[styles.profileButton, {backgroundColor: "#9D0208", marginLeft: (Dimensions.get("window").width * 15) / 392.72}]}
                onPress={() => pressedFollow()}
              >
                <Text style={styles.text}>Seguir</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.userTexts}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.names}>
                <Text style={styles.name}>{userInfos.name}</Text>
                <Text style={styles.username}>@{userInfos.username}</Text>
              </View>
              <View style={{ flex: 1 }}></View>
            </View>

            <Text style={styles.bio}>{userInfos.bio}</Text>
          </View>
          {!isVisible && (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          )}
          {isVisible && (
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionArea,
                  {
                    borderBottomWidth: options ? 3 : 2,
                    borderColor: options ? "#9D0208" : "#292929",
                  },
                ]}
                onPress={() => postagens()}
              >
                <Text style={styles.optionText}>Postagens</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionArea,
                  {
                    borderBottomWidth: !options ? 3 : 2,
                    borderColor: !options ? "#9D0208" : "#292929",
                  },
                ]}
                onPress={() => biblioteca()}
              >
                <Text style={styles.optionText}>Biblioteca</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      }
      ListFooterComponent={
        !options &&
        isVisible && (
          <View>
            <View style={styles.itemArea}>
              <TouchableOpacity
                onPress={() => navigation.navigate("FavoriteGenres")}
              >
                <Text style={styles.itemText}>Gêneros favoritos{" >"}</Text>
              </TouchableOpacity>
              <View style={styles.itens}>
                <ScrollView
                  horizontal={true}
                  alignItems="center"
                  showsHorizontalScrollIndicator={false}
                >
                  {favoriteGenres.map((genre, index) => {
                    return (
                      <TouchableOpacity
                        style={{ alignItems: "center" }}
                        key={index}
                      >
                        <ExpoFastImage
                          source={{
                            uri: `${Constants.URL.IMAGE_URL_W300}${genre.backdrop_path}`,
                          }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginHorizontal: 5,
                          }}
                        />
                        <Text
                          style={[
                            styles.itemText,
                            {
                              fontSize: 14,
                              marginLeft: 0,
                              marginBottom: 0,
                              maxWidth: 100,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {genre.genreName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            <View
              style={[styles.itemArea, { marginTop: 20, marginBottom: 25 }]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("MyLibrary")}
              >
                <Text style={styles.itemText}>Minhas pastas{" >"}</Text>
              </TouchableOpacity>
              <View style={styles.itens}>
                <ScrollView
                  horizontal={true}
                  alignItems="center"
                  showsHorizontalScrollIndicator={false}
                >
                  {folders.map((folder, index) => {
                    return (
                      <TouchableOpacity
                        style={{ alignItems: "center" }}
                        key={index}
                        onPress={() =>
                          navigation.navigate("ChoosedFolder", {
                            folderId: folder.folderId,
                          })
                        }
                      >
                        <ExpoFastImage
                          source={{
                            uri: `${Constants.URL.IMAGE_URL_W300}${folder.posterPath}`,
                          }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            marginHorizontal: 5,
                          }}
                        />
                        <Text
                          style={[
                            styles.itemText,
                            {
                              fontSize: 14,
                              marginLeft: 0,
                              marginBottom: 0,
                              maxWidth: 100,
                              textAlign: "center",
                            },
                          ]}
                        >
                          {folder.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            <Avaliacoes />
          </View>
        )
      }
      disableVirtualization={true}
      windowSize={1}
      renderItem={({ item, index }) =>
        options &&
        isVisible && (
          <View
            style={{
              marginBottom: 50,
              width: (Dimensions.get("window").width * 340) / 392.72,
              alignSelf: "center",
            }}
          >
            <View style={stylesFeed.postHeader}>
              <TouchableOpacity style={{ marginRight: 8 }}>
                <ExpoFastImage
                  source={{
                    uri: item.userName == null ? "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605" : item.userProfilePictureURL,
                  }}
                  style={stylesFeed.userPicture}
                />
              </TouchableOpacity>
              <View style={stylesFeed.postTexts}>
                <View style={stylesFeed.postInfos}>
                  <Text
                    style={stylesFeed.userName}
                    onPress={() => console.log(data)}
                  >
                    {item.userName}
                  </Text>
                  <Text style={stylesFeed.postDate}>{item.postDate}</Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity>
                      <Entypo
                        name="dots-three-horizontal"
                        size={22}
                        color="#474747"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList
                  horizontal
                  data={item.postTags}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        stylesFeed.chipArea,
                        {
                          flexDirection: "row",
                          alignItems: "flex-end",
                        },
                      ]}
                    >
                      <Text style={[stylesFeed.chipText, { color: "#FFF" }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, i) => i}
                />
              </View>
            </View>
            <TouchableOpacity>
              <Text style={stylesFeed.postDescription}>
                {item.postDescription}
              </Text>
            </TouchableOpacity>

            {item.postMediaType === "image" ? (
              <SwiperFlatList
                onPressIn={() => console.log("clicou no flatlist")}
                autoplayDelay={2}
                showPagination
                data={item.postMedias}
                paginationStyleItem={{
                  width: 8,
                  height: 8,
                  marginHorizontal: 4,
                }}
                paginationDefaultColor="#76767F"
                paginationActiveColor="#9D0208"
                style={stylesFeed.imageCarousel}
                renderItem={({ item, index, i = index }) => {
                  return (
                    <ExpoFastImage
                      source={{
                        uri: item,
                      }}
                      style={stylesFeed.postMedia}
                    />
                  );
                }}
                keyExtractor={(_, index) => index}
              />
            ) : item.postMediaType === "video" ? (
              <Video
                style={stylesFeed.postMedia}
                source={{
                  uri: item.postMedias[0],
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                volume={1.0}
              />
            ) : null}

            <View style={stylesFeed.postOptions}>
              <TouchableOpacity onPress={() => likePress(item.isLiked, index)}>
                <AntDesign
                  name={item.isLiked ? "heart" : "hearto"}
                  size={22}
                  color="#FFF"
                />
              </TouchableOpacity>
              <Text style={stylesFeed.postNumbers}>{item.totalLikes}</Text>
              <TouchableOpacity style={{ marginLeft: 15 }}>
                <FontAwesome5 name="comment" size={22} color="#FFF" />
              </TouchableOpacity>
              <Text style={stylesFeed.postNumbers}>{item.totalComments}</Text>
            </View>
          </View>
        )
      }
      keyExtractor={(item) => item.postId}
    />
  );
}
