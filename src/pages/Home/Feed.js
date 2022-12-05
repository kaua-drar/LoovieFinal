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
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { getAuth } from "firebase/auth";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Video, AVPlaybackStatus } from "expo-av";
import styles from "./styles/FeedStyle";

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

    await getDoc(doc(db, "userAnalytics", auth.currentUser.uid)).then(
      async (v) => {
        console.log("data", v.data().likedPosts);
        const citiesRef = collection(db, "posts");

        const q = query(
          citiesRef,
          where("postTags", 'array-contains-any', ["BATMAN", "DC"])
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
              postDate: checkDate(doc.data().postDate.toDate()),
              postDescription: doc.data().postDescription,
              postMedias: doc.data().postMedias,
              postMediaType: doc.data().postMediaType,
              postTags: doc.data().postTags,
              totalLikes: doc.data().totalLikes,
              totalComments: doc.data().totalComments,
              isLiked: v.data().likedPosts.some((e) => e == doc.id),
            },
          ]);
        });
        setLoading(false);
        setRefreshing(false);
      }
    );
  };

  useEffect(() => {
    requests();
  }, []);

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

  const likePress = async (isLiked, index) => {
    const Ref = collection(db, "userAnalytics");
    if (isLiked == false) {
      let oldPosts = [...posts];
      oldPosts[index].isLiked = !oldPosts[index].isLiked;
      oldPosts[index].totalLikes = oldPosts[index].totalLikes + 1;
      setPosts(oldPosts);
      console.log(posts[index]);


      await updateDoc(doc(db, "posts", oldPosts[index].postId), {
        totalLikes: increment(1),
      }).then(async () => {
        console.log("like adicionado")
        await updateDoc(doc(db, "userAnalytics", auth.currentUser.uid), {
          likedPosts: arrayUnion(oldPosts[index].postId),
        })
          .then(() => {
            console.log("tag adicionada");
            posts[index].postTags.map(async (item) => {
              console.log(item);
  
              const Ref = collection(db, "userAnalytics");
  
              const docSnap = await getDoc(
                doc(
                  collection(Ref, auth.currentUser.uid, "favoriteTags"),
                  item.replace(" ", "_")
                )
              );
  
              if (docSnap.exists()) {
                await updateDoc(
                  doc(
                    collection(Ref, auth.currentUser.uid, "favoriteTags"),
                    item.replace(" ", "_")
                  ),
                  {
                    likeCount: increment(1),
                  }
                ).then(() => {
                  console.log("tag atualizada");
                });
              } else {
                // doc.data() will be undefined in this case
                await setDoc(
                  doc(
                    collection(Ref, auth.currentUser.uid, "favoriteTags"),
                    item.replace(" ", "_")
                  ),
                  {
                    tagName: item,
                    likeCount: 1,
                  }
                ).then(() => {
                  console.log("tag criada");
                });
              }
            });
          })
          .catch((e) => {
            console.log(e.code, ": ", e.message);
          });
      })
      
    } else if (isLiked == true) {
      let oldPosts = [...posts];
      oldPosts[index].isLiked = !oldPosts[index].isLiked;
      oldPosts[index].totalLikes = oldPosts[index].totalLikes - 1;
      setPosts(oldPosts);
      console.log(posts[index]);
      await updateDoc(doc(db, "posts", oldPosts[index].postId), {
        totalLikes: increment(-1),
      }).then(async () => {
        await updateDoc(doc(db, "userAnalytics", auth.currentUser.uid), {
          likedPosts: arrayRemove(oldPosts[index].postId),
        })
        .then(() => {
          console.log("tag removida");
          posts[index].postTags.map(async (item) => {
            console.log(item);

            const Ref = collection(db, "userAnalytics");

            const docSnap = await getDoc(
              doc(
                collection(Ref, auth.currentUser.uid, "favoriteTags"),
                item.replace(" ", "_")
              )
            );
            if (docSnap.exists()) {
              await updateDoc(
                doc(
                  collection(Ref, auth.currentUser.uid, "favoriteTags"),
                  item.replace(" ", "_")
                ),
                {
                  likeCount: increment(-1),
                }
              ).then(() => {
                console.log("tag atualizada");
              });
            }
          });
        }).catch((e) => {
          console.log(e.code, ": ", e.message);
        });
      })
    }
  };

  const onViewCallBack = useCallback((viewableItems) => {
    if (viewableItems.viewableItems[0]?.item.postId == undefined) {
      console.log(
        "ESTÁ INDEFINIDO: ",
        viewableItems.viewableItems[0]?.item.postId
      );
    } else {
      console.log("DEFINIDASSO: ", viewableItems.viewableItems[0]?.item.postId);

      updateDoc(doc(db, "userAnalytics", auth.currentUser.uid), {
        viewedPosts: arrayUnion(viewableItems.viewableItems[0]?.item.postId),
      })
        .then(() => {
          console.log("foi");
        })
        .catch((e) => {
          console.log(e.code, ": ", e.message);
        });
    }

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
            /*onViewableItemsChanged={onViewCallBack}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 75,
              minimumViewTime: 2000,
            }}*/
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
                    <TouchableOpacity style={{ marginRight: 8 }} onPress={() => item.userId === auth.currentUser.uid ? navigation.navigate("MainTab", {screen: "ProfileTab"}) : navigation.navigate("UserProfile", {userId: item.userId})}>
                      <ExpoFastImage
                        source={{
                          uri: item.userName == null ? "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605" : item.userProfilePictureURL,
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
                        <Text style={styles.postDate}>{item.postDate}</Text>
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
                      resizeMode="contain"
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                      volume={1.0}
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
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => navigation.navigate("Comment", {item: item})}>
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
