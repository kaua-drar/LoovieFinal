import ExpoFastImage from "expo-fast-image";
import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import ImageViewer from "react-native-image-zoom-viewer";
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
  serverTimestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Video, AVPlaybackStatus } from "expo-av";

export default function Feed({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = React.useState({});
  const [imageOpen, setImageOpen] = useState("");
  const [position, setPosition] = useState(0);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const requests = async () => {
    setLoading(true);
    setRefreshing(true);

    const citiesRef = collection(db, "posts");

    const q = query(
      citiesRef,
      where("postTags", "array-contains-any", ["BATMAN"])
    );

    const querySnapshot = await getDocs(q);

    setPosts([]);
    querySnapshot.forEach((doc) => {
      setPosts((old) => [
        ...old,
        {
          postId: doc.id,
          userId: doc.data().userId,
          userName: doc.data().userName,
          userProfilePictureURL: doc.data().userProfilePictureURL,
          postDate: `${doc.data().postDate.toDate().getDate()}/${doc
            .data()
            .postDate.toDate()
            .getMonth()}/${doc.data().postDate.toDate().getFullYear()}`,
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

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    requests();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  var imageURL =
    "https://i0.wp.com/semprefuigeek.com.br/wp-content/uploads/2022/04/Os-Vingadores-Originais.jpg?fit=1024%2C576&ssl=1";

  const [width, setWidth] = useState("");

  const [height, setHeight] = useState("");

  const getImageDimensions = () => {
    Image.getSize(
      imageURL,
      (Width, Height) => {
        setWidth(Width);
        setHeight(Height);
      },
      (errorMsg) => {
        console.log(errorMsg);
      }
    );
  };

  const openImage = (i, index) => {
    setImages([]);
    posts[i].postMedias.map((v) => {
      setImages((old) => [
        ...old,
        {
          url: v,
        },
      ]);
    });
    setPosition(index);

    console.log("INDEEEEEEEEEEEEEEEEXXXXXXXX: ", index);

    toggleModal();
  };

  const likePress = (isLiked, index) => {
    if (isLiked == false) {
      let oldPosts = [...posts];
      oldPosts[index].isLiked = !oldPosts[index].isLiked;
      setPosts(oldPosts);
      console.log(posts[index]);
    } else if (isLiked == true) {
      let oldPosts = [...posts];
      oldPosts[index].isLiked = !oldPosts[index].isLiked;
      setPosts(oldPosts);
      console.log(posts[index]);
    }
  };

  const onViewCallBack = useCallback((viewableItems) => {
    setTimeout(() => {
      console.log(viewableItems.viewableItems[0]?.item.postId);
    }, 1000)
    
    // Use viewable items in state or as intended
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      )}
      {!loading && (
        <View>
          <TouchableOpacity
            style={styles.newButtonArea}
            onPress={() => navigation.navigate("Post")}
          >
            <Text style={styles.newButtonText}>+</Text>
          </TouchableOpacity>
          <FlatList
            onViewableItemsChanged={onViewCallBack}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 75,
              minimumViewTime: 2000,
            }}
            alignItems="center"
            data={posts}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={requests} />
            }
            ListHeaderComponentStyle={{ marginTop: 25 }}
            ListHeaderComponent={<View></View>}
            disableVirtualization={true}
            windowSize={1}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    marginBottom: 50,
                    width: (Dimensions.get("window").width * 340) / 392.72,
                  }}
                >
                  <View style={styles.postHeader}>
                    <TouchableOpacity style={{ marginRight: 8 }}>
                      <ExpoFastImage
                        source={{
                          uri: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605",
                        }}
                        style={styles.userPicture}
                      />
                    </TouchableOpacity>
                    <View style={styles.postTexts}>
                      <View style={styles.postInfos}>
                        <Text
                          style={styles.userName}
                          onPress={() => console.log(data)}
                        >
                          {item.userName}
                        </Text>
                        <Text style={styles.postDate}>10 min</Text>
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
                              styles.chipArea,
                              { flexDirection: "row", alignItems: "flex-end" },
                            ]}
                          >
                            <Text style={[styles.chipText, { color: "#FFF" }]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(_, i) => i}
                      />
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.postDescription}>
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
                      style={styles.imageCarousel}
                      renderItem={({ item, index, i = index }) => {
                        return (
                          <ExpoFastImage
                            source={{
                              uri: item,
                            }}
                            style={styles.postMedia}
                          />
                        );
                      }}
                      keyExtractor={(_, index) => index}
                    />
                  ) : item.postMediaType === "video" ? (
                    <Video
                      style={styles.postMedia}
                      source={{
                        uri: item.postMedias[0],
                      }}
                      useNativeControls
                      volume={1.0}
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  ) : null}

                  <View style={styles.postOptions}>
                    <TouchableOpacity
                      onPress={() => likePress(item.isLiked, index)}
                    >
                      <AntDesign
                        name={item.isLiked ? "heart" : "hearto"}
                        size={22}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                    <Text style={styles.postNumbers}>{item.totalLikes}</Text>
                    <TouchableOpacity style={{ marginLeft: 15 }}>
                      <FontAwesome5 name="comment" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.postNumbers}>{item.totalComments}</Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.postId}
          />
        </View>
      )}
      {/*
    <>
    <Text style={styleSheet.text}>
        Example of getSize on Image in React Native
      </Text>

      <Image source={{ uri: imageURL }}
        style={{ width: 300, height: 200, resizeMode: 'center', marginBottom: 14 }} />

      <Button onPress={getImageDimensions} title='Get Image Width Height Dimensions' />

      <Text style={styleSheet.text}>Image Width = {width}</Text>

      <Text style={styleSheet.text}>Image Height = {height}</Text>
    </>
     */}

      {/*<Modal visible={isModalVisible} transparent={isModalVisible}>
        <TouchableOpacity
          style={styles.imageButtons}
          onPress={() => toggleModal()}
        >
          <Ionicons name="arrow-back" size={30} color="#FFF" />
        </TouchableOpacity>

        <ImageViewer
          imageUrls={images}
          index={position}
          renderIndicator={() => null}
          enableSwipeDown={true}
          onSwipeDown={toggleModal}
        />
    </Modal>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  newButtonArea: {
    position: "absolute",
    right: (Dimensions.get("window").width * 30) / 392.72,
    bottom: (Dimensions.get("window").width * 30) / 392.72,
    width: (Dimensions.get("window").width * 60) / 392.72,
    height: (Dimensions.get("window").width * 60) / 392.72,
    borderRadius: (Dimensions.get("window").width * 30) / 392.72,
    backgroundColor: "#9D0208",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
  },
  newButtonText: {
    fontSize: (Dimensions.get("window").width * 50) / 392.72,
    fontFamily: "Lato-Regular",
    color: "#FFF",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
  },
  loadingText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  imageCarousel: {
    maxHeight: (Dimensions.get("window").width * 340) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    marginTop: 10,
    marginBottom: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  images: {
    width: (Dimensions.get("window").width * 340) / 392.72,
    height: (Dimensions.get("window").width * 253.3) / 392.72,
  },
  imageButtons: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000000,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageViewer: {
    flex: 1,
    backgroundColor: "#000",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postTexts: {
    flex: 1,
  },
  postInfos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userName: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 18) / 392.72,
  },
  postDate: {
    color: "#474747",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 13) / 392.72,
    marginLeft: 8,
  },
  chipArea: {
    borderRadius: (Dimensions.get("window").width * 7) / 392.72,
    padding: (Dimensions.get("window").width * 8) / 392.72,
    margin: (Dimensions.get("window").width * 4) / 392.72,
    backgroundColor: "#9D0208",
  },
  chipText: {
    fontFamily: "Lato-Bold",
    color: "#000",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
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
    marginBottom: 2,
  },
  badgeText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 10,
  },
  postDescription: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 16) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    marginTop: 2,
  },
  userPicture: {
    width: (Dimensions.get("window").width * 65) / 392.72,
    height: (Dimensions.get("window").width * 65) / 392.72,
    borderRadius: (Dimensions.get("window").width * 32.5) / 392.72,
    borderWidth: 3,
    borderColor: "#76767F",
  },
  postMedia: {
    width: (Dimensions.get("window").width * 340) / 392.72,
    height: (Dimensions.get("window").width * 253.3) / 392.72,
    alignSelf: "center",
    marginTop: 10,
  },
  postOptions: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  postNumbers: {
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#474747",
    marginLeft: 5,
  },
  text: {
    fontSize: 28,
    textAlign: "center",
    color: "red",
    paddingBottom: 10,
  },
});
