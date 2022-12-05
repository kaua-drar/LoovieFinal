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

export default function DeleteAccount({ navigation, route, props }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfos, setUserInfos] = useState({});
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
      setUserInfos({
        username: data.username,
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
    sla();
  }, []);

  const handleChangePassword = () => {
    Keyboard.dismiss();

    reauthenticate()
      .then(() => {
        console.log("deu");
        const user = auth.currentUser;
        updateEmail(user, email)
          .then(() => {
            console.log("E-mail Atualizado!");
            setErrorMessage(
              <View style={styles.errorMessageArea}>
                <MaterialIcons name={"check"} size={24} color="#FFF" />
                <Text style={styles.errorMessage}>
                  E-mail alterado com sucesso!
                </Text>
              </View>
            );
          })
          .catch((error) => {
            console.log("Ocorreu um erro: ", error.code);
            setErrorMessage(
              <View style={styles.errorMessageArea}>
                <Foundation name="alert" size={24} color="#9D0208" />
                <Text style={styles.errorMessage}>
                  {error.code ===
                    "auth/account-exists-with-different-credential" ||
                  error.code === "auth/email-already-exists" ||
                  error.code === "auth/email-already-in-use"
                    ? "E-mail já associado a outra conta."
                    : error.code === "auth/invalid-display-name"
                    ? "Nome de usuário inválido."
                    : error.code === "auth/invalid-email-verified" ||
                      error.code === "auth/invalid-email"
                    ? "E-mail inválido"
                    : error.code === "auth/invalid-password"
                    ? "A senha precisa ter pelo menos 6 caracteres."
                    : null}
                </Text>
              </View>
            );
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

  if (!fontsLoaded && loading == false) {
    return null;
  } else {
    return (
      <ScrollView style={styles.container} alignItems="center">
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <View style={styles.content}>
            <View style={styles.userArea}>
              <ExpoFastImage
                style={styles.userImage}
                source={{
                  uri:
                    userInfos.profilePictureURL === null
                      ? "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      : userInfos.profilePictureURL,
                }}
                resizeMode="cover"
              />
              <Text style={styles.userName}>@{userInfos.username}</Text>
            </View>

            <Text style={styles.warningTitle}>
              Isso irá excluir sua conta permanentemente
            </Text>
            <Text style={styles.warningText}>
              Você está prestes a iniciar o processo de exclusão permanente da
              sua conta.
            </Text>
            <Text style={styles.warningText}>
              Portanto, ela não poderá ser recuperada.
            </Text>
            <Text style={styles.warningText}>
              Tem certeza que deseja prosseguir?
            </Text>

            <View style={styles.submitArea}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => navigation.navigate("DeleteAccountConfirm")}
              >
                <Text style={styles.submitText}>Prosseguir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
    width: (Dimensions.get("window").width * 300) / 392.72,
    alignItems: "center",
    marginTop: 15,
  },
  userImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#FFF"
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
    borderColor: "#FFF",
    borderRadius: 10,
    backgroundColor: "#9D0208",
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
