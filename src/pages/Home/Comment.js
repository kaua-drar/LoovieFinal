import ExpoFastImage from "expo-fast-image";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import styles from "./styles/CommentStyle";
import stylesFeed from "./styles/FeedStyle";
import { useFonts } from "expo-font";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  query,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  where,
  getDoc,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  orderBy
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Video, AVPlaybackStatus } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

export default function Comment({ navigation, route }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [userInfos, setUserInfos] = useState({});
  const item = route.params.item;

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const submitComment = async () => {
    if (comment.length > 0) {
      const docRef = doc(db, "posts", item.postId);
      const colRef = collection(docRef, "comments");
      addDoc(colRef, {
        commentText: comment,
        commentDate: serverTimestamp(),
        totalLikes: 0,
        userId: auth.currentUser.uid,
        userUsername: userInfos.username,
      }).then(() => {
        console.log("comentário adicionado");
        requests();
      });
    }
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

  const requests = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const docUserRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docUserRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserInfos({
        username: data.username,
        profilePictureURL: data.profilePictureURL,
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setUserInfos({});
    }

    getDoc(doc(db, "userAnalytics", auth.currentUser.uid)).then((v) => {
      console.log("analytics pego");
      const docRef = doc(db, "posts", item.postId);
      const colRef = collection(docRef, "comments");

      const q = query(colRef, orderBy("commentDate", "desc"))

      getDocs(q).then((docSnap) => {
        console.log("comentários pegos");
        setComments([]);
        docSnap.forEach((doc) => {
          setComments((old) => [
            ...old,
            {
              commentId: doc.id,
              userId: doc.data().userId,
              userUsername: doc.data().userUsername,
              totalLikes: doc.data().totalLikes,
              commentDate: checkDate(doc.data().commentDate.toDate()),
              commentText: doc.data().commentText,
              isLiked: false,
            },
          ]);
        });
        setLoading(false);
      });
    });
  };

  const likePress = async (isLiked, index) => {
    if (!isLiked) {
        let oldComments = [...comments];
        oldComments[index].isLiked = !oldComments[index].isLiked;
        oldComments[index].totalLikes = oldComments[index].totalLikes + 1;
        setComments(oldComments);
        console.log(comments[index]);
      }
    if (isLiked) {
      let oldComments = [...comments];
      oldComments[index].isLiked = !oldComments[index].isLiked;
      oldComments[index].totalLikes = oldComments[index].totalLikes - 1;
      setComments(oldComments);
      console.log(comments[index]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      requests();

      return () => {
        setLoading(true);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {!loading && (
        <FlatList
          data={comments}
          alignItems="center"
          ListFooterComponent={<View></View>}
          ListFooterComponentStyle={{ marginBottom: 100 }}
          ListHeaderComponent={
            <View
              style={{
                marginTop: 20,
                marginBottom: 50,
                width: (Dimensions.get("window").width * 340) / 392.72,
                alignSelf: "center",
              }}
            >
              <View style={stylesFeed.postHeader}>
                <TouchableOpacity
                  style={{ marginRight: 8 }}
                  onPress={() =>
                    item.userId === auth.currentUser.uid
                      ? navigation.navigate("MainTab", { screen: "ProfileTab" })
                      : navigation.navigate("UserProfile", {
                          userId: item.userId,
                        })
                  }
                >
                  <ExpoFastImage
                    source={{
                      uri:
                        item.userName == null
                          ? "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                          : item.userProfilePictureURL,
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
                  </View>
                  <FlatList
                    horizontal
                    data={item.postTags}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          stylesFeed.chipArea,
                          { flexDirection: "row", alignItems: "flex-end" },
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
                  showPagination={item.postMedias.length > 1 ? true : false}
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
            </View>
          }
          renderItem={({ item, index }) => {
            return (
              <View style={styles.commentArea}>
                <View style={styles.commentInfos}>
                  <Text
                    style={[styles.commentText, { fontFamily: "Lato-Regular" }]}
                  >
                    <Text
                      style={[styles.commentText, { fontFamily: "Lato-Bold" }]}
                    >
                      @{item.userUsername} -{" "}
                    </Text>
                    {item.commentText}
                  </Text>
                  <View style={styles.numbersRow}>
                    <Text
                      style={[
                        styles.commentNumbers,
                        {
                          marginRight:
                            (Dimensions.get("window").width * 22) / 392.72,
                        },
                      ]}
                    >
                      {item.commentDate}
                    </Text>
                    <Text style={styles.commentNumbers}>
                      {item.totalLikes == 1
                        ? `${item.totalLikes} curtida`
                        : `${item.totalLikes} curtidas`}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => likePress(item.isLiked, index)}
                >
                  <AntDesign
                    name={item.isLiked ? "heart" : "hearto"}
                    size={22}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.commentId}
        />
      )}
      {!loading && (
        <View style={styles.inputViewArea}>
          <ExpoFastImage
            source={{
              uri:
                userInfos.profilePictureURL == null
                  ? "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  : userInfos.profilePictureURL,
            }}
            style={styles.userProfilePicture}
          />

          <View style={styles.inputArea}>
            <TextInput
              placeholder={`Comentar como ${userInfos.username}`}
              placeholderTextColor="#474747"
              style={styles.input}
              onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity onPress={() => submitComment()}>
              <Octicons
                name="paper-airplane"
                size={(Dimensions.get("window").width * 25) / 392.72}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
