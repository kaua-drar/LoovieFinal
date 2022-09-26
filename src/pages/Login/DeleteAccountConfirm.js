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
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  getAuth,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import ExpoFastImage from "expo-fast-image";
import LoovieLogo from "../../icons/LoovieLogo.svg";
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const DeleteAccountConfirm = ({ navigation, route, props }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const sla = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.username);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setUsername("");
    }

    loaded();
  };

  const loaded = useCallback(async () => {
    setLoading(false);
  }, [username]);

  useEffect(() => {
    sla();
  }, []);

  const handleChangePassword = () => {
    Keyboard.dismiss();

    reauthenticate()
      .then(() => {
        console.log("deu");
        const user = auth.currentUser;
        deleteUser(user)
          .then(() => {
            console.log("Usuário Excluído");
            navigation.navigate("Welcome");
          })
          .catch((error) => {
            console.log("Ocorreu um erro: ", error.code);
          });
      })
      .catch((error) => {
        console.log("nao deu: ", error.code);
        setErrorMessage(
          <View style={styles.errorMessageArea}>
            <Foundation name="alert" size={24} color="#9D0208" />
            <Text style={styles.errorMessage}>
              {error.code == "auth/wrong-password"
                ? "A senha atual está errada"
                : null}
            </Text>
          </View>
        );
      });
  };

  const reauthenticate = async () => {
    var user = auth.currentUser;
    var cred = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && loading == false) {
    return null;
  } else {
    return (
      <ScrollView>
        <SafeAreaView
          style={styles.container}
          onLayout={onLayoutRootView}
          alignItems="center"
        >
          {loading && (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          )}
          {!loading && (
            <View style={styles.content}>
              <LoovieLogo
                width={130}
                height={130}
                fill="#9D0208"
                style={{ marginBottom: 20}}
              />
              <Text style={styles.warningTitle}>Confirme sua senha</Text>
              <Text style={styles.warningText}>
                Digite sua senha para completar a exclusão permanente da sua
                conta.
              </Text>

              <View style={styles.changesArea}>
                <View style={styles.changeItem}>
                  <TextInput
                    placeholder="Digite sua senha"
                    placeholderTextColor="#8F8F8F"
                    style={styles.changeInput}
                    onChangeText={(text) => setCurrentPassword(text)}
                    secureTextEntry={
                      currentPasswordVisible == false ? true : false
                    }
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setCurrentPasswordVisible(!currentPasswordVisible)
                    }
                  >
                    <Entypo
                      name={
                        currentPasswordVisible == false
                          ? "eye"
                          : "eye-with-line"
                      }
                      size={24}
                      color="#8F8F8F"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {errorMessage}
              <View style={styles.submitArea}>
                <View style={styles.userArea}>
                  <ExpoFastImage
                    style={styles.userImage}
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1560255496715632643/oZr-_U7g_400x400.jpg",
                    }}
                    resizeMode="cover"
                  />
                  <Text style={styles.userName}>@{username}</Text>
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleChangePassword()}
                >
                  <Text style={styles.submitText}>Excluir Conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  sla: {},
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
  warningTitle: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 17,
    textAlign: "center",
  },
  warningText: {
    marginTop: 8,
    fontFamily: "Lato-Regular",
    color: "#8F8F8F",
    fontSize: 15,
    textAlign: "center",
  },
  userArea: {
    width: (Dimensions.get("window").width * 300) / 392.72,
    alignItems: "center",
    marginTop: 15,
  },
  userImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
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
    borderColor: "#FFF",
    borderRadius: 10,
    backgroundColor: "#9D0208",
    marginTop: 25,
  },
  submitArea: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  changesArea: {
    marginTop: 50,
    marginBottom: 15,
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
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    minHeight: Dimensions.get("window").height,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteAccountConfirm);
