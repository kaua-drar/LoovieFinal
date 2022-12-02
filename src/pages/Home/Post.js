import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Keyboard,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import { useState, useEffect, useCallback, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  getAuth,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import Modal from "react-native-modal";
import { initializeApp } from "firebase/app";
import { firebaseConfig, firebase } from "../../../firebase-config";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ExpoFastImage from "expo-fast-image";
import { FontAwesome, Feather } from "@expo/vector-icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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
  addDoc,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import styles from "./styles/PostStyle";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { Video, AVPlaybackStatus } from "expo-av";
import { SwiperFlatList } from "react-native-swiper-flatlist";

export default function Post({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userInfos, setUserInfos] = useState(true);
  const [isTagging, setIsTagging] = useState(false);
  const refInput = useRef(null);
  const refFlatList = useRef(null);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [medias, setMedias] = useState([]);
  const [mediaComponent, setMediaComponent] = useState("");
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isVideoPicked, setIsVideoPicked] = useState(false);
  const [isImagePicked, setIsImagePicked] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const toggleInfoModal = (text) => {
    setMessage(text);
    setInfoModalVisible(!isInfoModalVisible);
  };

  const toggleModal = (text) => {
    setMessage(text);
    setModalVisible(!isModalVisible);
  };

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImagePicked
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setMedias([...medias, result.uri]);
      if (result.type === "video") {
        setIsVideoPicked(true);
      }
      if (result.type === "image") {
        setIsImagePicked(true);
      }
    }

    console.log(result);
  };

  const removeMedias = () => {
    setMedias([]);
    setMediaComponent("");
    setIsVideoPicked(false);
  };

  const removeMedia = (index) => {
    if (medias.length == 1) {
      setIsImagePicked(false);
    }
    let newMedias = [...medias];
    newMedias = newMedias.filter((item, i) => i != index);
    setMedias(newMedias);
    refFlatList.current.scrollToIndex({ index: 0 });
  };

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const requests = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserInfos({
        name: data.name,
        profilePictureURL: data.profilePictureURL,
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setUserInfos({});
    }

    setLoading(false);
  };

  useEffect(() => {
    async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission = galleryStatus == "granted";
    };
    requests();
  }, []);

  const getFocusInput = () => {
    refInput.current.focus();
  };

  const doTag = () => {
    setIsTagging(true);
    getFocusInput();
    console.log(isTagging);
  };

  const stopTag = () => {
    refInput.current.blur();
    Keyboard.dismiss();
    setIsTagging(false);
    console.log(isTagging);
    setNewTag("");
  };

  const addTag = (newTag) => {
    refInput.current.blur();
    Keyboard.dismiss();
    setIsTagging(false);
    setTags((old) => [...old, newTag.toUpperCase()]);
    console.log(tags);
    setNewTag("");
  };

  const removeTag = (index) => {
    console.log(index);
    refInput.current.blur();
    Keyboard.dismiss();
    setIsTagging(false);
    let newTags = [...tags];
    newTags = newTags.filter((item, i) => i != index);
    setTags(newTags);
  };

  const submit = async () => {
    await addDoc(collection(db, "posts"), {
      userId: auth.currentUser.uid,
      userName: userInfos.name,
      userProfilePictureURL: userInfos.profilePictureURL,
      postDate: serverTimestamp(),
      postDescription: description,
      postTags: tags,
      totalComments: 0,
      totalLikes: 0,
    }).then(async (post) => {
      const postId = post.id;
      console.log("post criado");
      medias
        .map(async (media, index) => {
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", media, true);
            xhr.send(null);
          });
          const ref = firebase
            .storage()
            .ref()
            .child(`postMedias/${post.id}-${index}`);
          const snapshot = ref.put(blob);
          snapshot.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
              setUploading(true);
            },
            (error) => {
              setUploading(false);
              console.log(error);
              blob.close();
              return;
            },
            () => {
              console.log("media no storage");
              snapshot.snapshot.ref.getDownloadURL().then(async (url) => {
                setUploading(false);
                console.log("Download URL: ", url);
                blob.close();
                await updateDoc(doc(collection(db, "posts"), `${post.id}`), {
                  postMedias: arrayUnion(url),
                }).then(() => {
                  console.log("media foi para o firestore");
                });
                return url;
              });
            }
          );
        })
    }).then(async (postId) => {
      await updateDoc(doc(collection(db, "posts"), `${postId}`), {
        postMediaType: isVideoPicked ? "video" : isImagePicked ? "image" : null,
      }).then(() => {
        console.log("mediaType definido");
        navigation.navigate("Feed");
      })
    });
  };

  const sla = async () => {
    const Ref = collection(db, "userPreferences");

    /*setDoc(doc(collection(Ref, auth.currentUser.uid, 'favoriteTags'), 'teste5'), {
      tagName: 'GREEN LANTERN',
      likeCount: 4
  }).then(()=>{
    console.log("foi")
  }).catch((e)=> {
    console.log(e.code, ": ", e.message)
  })*/

    const q = query(
      collection(Ref, auth.currentUser.uid, "favoriteTags"),
      orderBy("likeCount", "desc"),
      limit(2)
    );

    await getDocs(q)
      .then((e) => {
        e.forEach((doc) => {
          console.log(doc.data());
        });
      })
      .catch((e) => {
        console.log(e.code, ": ", e.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      )}
      {!loading && (
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#0F0C0C", paddingLeft: 0 },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                tags.length < 1
                  ? toggleInfoModal("Adicione pelo menos 1 tag.")
                  : submit()
              }
            >
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.postInfo}>
            <ExpoFastImage
              source={{ uri: userInfos.profilePictureURL }}
              style={styles.userPhoto}
            />
            <View style={styles.postInfos}>
              <TouchableOpacity onPress={() => sla()}>
                <Text style={styles.name}>{userInfos.name}</Text>
              </TouchableOpacity>
              <View style={styles.tagsArea}>
                <TouchableOpacity
                  style={[
                    styles.tagButton,
                    {
                      display: isTagging ? "none" : "flex",
                      marginRight:
                        (Dimensions.get("window").width * 10) / 392.72,
                    },
                  ]}
                  onPress={() =>
                    tags.length >= 10
                      ? toggleInfoModal(
                          "Você já adicionou 10 tags, remova alguma tag para poder adicionar uma nova."
                        )
                      : doTag(newTag)
                  }
                >
                  <AntDesign
                    name={"plus"}
                    size={18}
                    color="white"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.tagButtonText}>Adicionar Tag</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tagButton,
                    {
                      display: isTagging ? "flex" : "none",
                      marginRight:
                        (Dimensions.get("window").width * 10) / 392.72,
                    },
                  ]}
                  onPress={() => stopTag()}
                >
                  <TouchableOpacity onPress={() => stopTag()}>
                    <AntDesign
                      name={"close"}
                      size={18}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <TextInput
                    ref={refInput}
                    style={[styles.tagButtonText]}
                    value={newTag}
                    onChangeText={(text) => setNewTag(text)}
                    returnKeyType="done"
                    onSubmitEditing={(e) => addTag(e.nativeEvent.text)}
                  />
                </TouchableOpacity>
                <FlatList
                  horizontal
                  data={tags}
                  style={{
                    flex: 1,
                  }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[styles.tagButton, { backgroundColor: "#292929" }]}
                      onPress={() => removeTag(index)}
                      key={index}
                    >
                      <AntDesign
                        name={"close"}
                        size={18}
                        color="white"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.tagButtonText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, index) => index}
                  extraData={tags}
                />
              </View>
              <Text style={styles.notice}>Adicione entre 1 e 10 tags</Text>
            </View>
          </View>
          <View style={styles.inputArea}>
            <TextInput
              textAlignVertical="top"
              multiline
              placeholder="O que você está pensando?"
              placeholderTextColor={"#FFF"}
              style={styles.input}
              maxLength={400}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <SwiperFlatList
              ref={(component) => {
                refFlatList.current = component;
              }}
              data={medias}
              showPagination={medias.length > 1 ? true : false}
              paginationStyleItem={{
                width: 8,
                height: 8,
                marginHorizontal: 4,
              }}
              paginationDefaultColor="#76767F"
              paginationActiveColor="#9D0208"
              style={styles.imageCarousel}
              renderItem={({ item, index }) => {
                if (isImagePicked) {
                  return (
                    <View>
                      <ExpoFastImage
                        source={{
                          uri: item,
                        }}
                        style={styles.postMedia}
                      />
                      <TouchableOpacity
                        onPress={() => removeMedia(index)}
                        style={styles.closeButton}
                      >
                        <AntDesign name={"close"} size={30} color="white" />
                      </TouchableOpacity>
                    </View>
                  );
                } else if (isVideoPicked) {
                  return (
                    <View>
                      <Video
                        style={styles.postMedia}
                        source={{
                          uri: item,
                        }}
                        useNativeControls
                        volume={1}
                        resizeMode="contain"
                        isLooping
                      />
                      <TouchableOpacity
                        onPress={() => removeMedias()}
                        style={styles.closeButton}
                      >
                        <AntDesign name={"close"} size={30} color="white" />
                      </TouchableOpacity>
                    </View>
                  );
                }
              }}
              keyExtractor={(_, index) => index}
              extraData={medias}
            />
            <View style={styles.footer}>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.textLength}>{description.length}/400</Text>
                <Progress.Bar
                  borderColor="#9D0208"
                  unfilledColor="#292929"
                  color="#9D0208"
                  progress={description.length / 400}
                  width={60}
                />
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{ marginRight: 5 }}
                  onPress={() =>
                    isVideoPicked
                      ? toggleInfoModal(
                          "Anexe até 4 images, ou então, 1 vídeo. Remova o vídeo adicionado para anexar outros arquivos."
                        )
                      : medias.length == 4
                      ? toggleInfoModal(
                          "Anexe até 4 images, ou então, 1 vídeo. Remova uma das imagens adicionadas para anexar outras, ou então remova todas para anexar outros tipos de arquivos."
                        )
                      : pickMedia()
                  }
                >
                  <Feather
                    name="paperclip"
                    size={28}
                    color={
                      isVideoPicked
                        ? "#292929"
                        : medias.length == 4
                        ? "#292929"
                        : "#FFF"
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    toggleInfoModal("Anexe até 4 images, ou então, 1 vídeo.")
                  }
                >
                  <MaterialIcons name="info" size={22} color="#76767F" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal
            isVisible={isInfoModalVisible}
            onSwipeComplete={() => setInfoModalVisible(false)}
            swipeDirection="down"
            onSwipeThreshold={500}
            onBackdropPress={toggleInfoModal}
            style={{ margin: 0 }}
          >
            <View style={styles.infoModalArea}>
              <View style={styles.infoModalContent}>
                <TouchableOpacity
                  style={{
                    position: "relative",
                    top: (Dimensions.get("window").width * -35) / 392.72,
                    right: (Dimensions.get("window").width * -115) / 392.72,
                  }}
                  onPress={() => setInfoModalVisible(false)}
                >
                  <AntDesign name="closecircle" size={40} color="white" />
                </TouchableOpacity>

                <Text style={styles.errorMessage}>{message}</Text>
                <TouchableOpacity
                  style={styles.closeModal}
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Text style={styles.closeModalText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}
