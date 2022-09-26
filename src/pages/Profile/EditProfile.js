import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  getAuth,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ExpoFastImage from "expo-fast-image";
import { FontAwesome } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

const EditProfile = ({ navigation, route, props }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {}, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && loading == false) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        onLayout={onLayoutRootView}
        alignItems="center"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Editar Perfil</Text>
          <TouchableOpacity style={styles.userArea} onPress={()=>choosePhotoFromLibrary()}>
            <View
              style={{ height: 50, alignItems: "center" }}
            >
              <ExpoFastImage
                style={styles.userImage}
                source={{
                  uri: "https://pbs.twimg.com/profile_images/1560255496715632643/oZr-_U7g_400x400.jpg",
                }}
                resizeMode="cover"
              ></ExpoFastImage>
              <View style={styles.layer}></View>
              <FontAwesome
                name="plus"
                size={50}
                color="white"
                style={{ top: -325, zIndex: 1000 }}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.changesArea}>
            <Text style={[styles.changeTitle, { marginTop: 40 }]}>
              Nome de Usuário
            </Text>
            <View style={styles.changeItem}>
              <TextInput
                placeholder="Digite seu novo nome de usuário"
                placeholderTextColor="#8F8F8F"
                style={styles.changeInput}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
          </View>

          <View style={styles.submitArea}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={()=>choosePhotoFromLibrary()}
            >
              <Text style={styles.submitText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  sla: {},
  warningTitle: {
    marginTop: 40,
    marginBottom: 4,
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 19,
    textAlign: "center",
  },
  warningText: {
    marginTop: 8,
    fontFamily: "Lato-Regular",
    color: "#8F8F8F",
    fontSize: 16,
    textAlign: "center",
  },
  userArea: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 150,
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: "#ADADAD",
    borderWidth: 5,
  },
  layer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: -200,
  },
  userName: {
    marginTop: 8,
    color: "#FFF",
    fontSize: 19,
    fontFamily: "Lato-Regular",
  },
  errorMessageArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
    width: (Dimensions.get("window").width * 300) / 392.72,
  },
  errorMessage: {
    fontSize: 15,
    color: "#FFF",
    fontStyle: "Lato-Regular",
    marginLeft: 5,
    textAlign: "center",
  },
  passwordForgot: {
    color: "#8F8F8F",
    fontSize: 16,
    fontFamily: "Lato-Regular",
    marginTop: 10,
  },
  submitText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 21,
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: (Dimensions.get("window").width * 15) / 392.72,
    paddingHorizontal: (Dimensions.get("window").width * 35) / 392.72,
    borderWidth: 2,
    borderColor: "#9D0208",
    borderRadius: 10,
    backgroundColor: "#141414",
  },
  submitArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "4%",
  },
  changesArea: {
    marginTop: 20,
    width: (Dimensions.get("window").width * 300) / 392.72,
  },
  changeTitle: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
    marginBottom: 8,
  },
  changeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: "#9D0208",
  },
  changeInput: {
    flex: 1,
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
  },
  content: {
    width: (Dimensions.get("window").width * 300) / 392.72,
    minHeight: 600,
    flex: 1,
    paddingTop: "4%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
  },
  title: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 18,
  },
});

const mapStateToProps = (state) => {
  return {
    name: state.userReducer.name,
    email: state.userReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch({ type: "SET_NAME", payload: { name } }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
