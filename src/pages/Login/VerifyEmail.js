import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Dimensions,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { SafeAreaView } from "react-native-safe-area-context";
import LoovieLogo from "../../icons/LoovieLogo.svg";
import { useFonts } from "expo-font";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";

export default function Register({ navigation, route, props }) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const email = route.params.email;
  const password = route.params.password;
  const [infoMessage, setInfoMessage] = useState("");

  const proceed = async () => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    await reauthenticateWithCredential(auth.currentUser, credential).then(
      () => {
        console.log(auth.currentUser.emailVerified);
        if (auth.currentUser.emailVerified === true) {
          setInfoMessage(
            <View style={styles.infoMessageArea}>
              <MaterialIcons name={"check"} size={24} color="#FFF" />
              <Text style={styles.infoMessage}>
                Seu e-mail foi verificado com sucesso!
              </Text>
            </View>
          );
          setTimeout(() => {
            navigation.navigate("ChooseGenres");
          }, 1000);
        } else if (auth.currentUser.emailVerified === false) {
          setInfoMessage(
            <View style={styles.infoMessageArea}>
              <Foundation name="alert" size={24} color="#9D0208" />
              <Text style={styles.infoMessage}>
                Seu e-mail ainda não foi verificado!
              </Text>
            </View>
          );
        }
      }
    );
  };

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <LoovieLogo width={170} height={170} fill={"#9D0208"} />
        <Text style={styles.title}>E-mail de verificação enviado!</Text>
            <Text style={styles.text}>
              Um e-mail de verificação foi enviado para:
            </Text>

            <Text style={[styles.text, {fontFamily: "Lato-Bold"}]}>
              {email}
            </Text>
            <Text style={styles.text}>
              Verifique sua caixa de entrada e sua caixa de spam, e siga as
              instruções antes de prosseguir.
            </Text>
            <TouchableOpacity
              style={[styles.submitButton, { marginTop: 20 }]}
              onPress={() => proceed()}
            >
              <Text style={styles.submitText}>Prosseguir</Text>
            </TouchableOpacity>
        {infoMessage}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoMessageArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 15,
    width: (Dimensions.get("window").width * 300) / 392.72,
  },
  infoMessage: {
    fontSize: 15,
    color: "#FFF",
    fontStyle: "Lato-Regular",
    marginLeft: 5,
    textAlign: "center",
  },
  submitText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 18,
  },
  submitButton: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: (Dimensions.get("window").width * 10) / 392.72,
    paddingHorizontal: (Dimensions.get("window").width * 35) / 392.72,
    borderWidth: 2,
    borderColor: "#9D0208",
    borderRadius: 10,
    backgroundColor: "#141414",
  },
  container: {
    backgroundColor: "#0F0C0C",
    flex: 1,
    alignItems: "center",
    paddingVertical: "20%",
    paddingTop: "30%",
    alignItems: "center",
  },
  empty: {
    height: 10,
    width: 2,
    backgroundColor: "#0F0C0C",
  },
  content: {
    alignItems: "center",
  },
  loovie: {
    fontSize: 45,
    fontFamily: "Lato-Bold",
    color: "#FFF",
    marginTop: 25,
  },
  text: {
    width: (Dimensions.get("window").width * 300) / 392.72,
    fontSize: 15,
    fontFamily: "Lato-Regular",
    color: "#D3D3D3",
    marginTop: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 21,
    fontFamily: "Lato-Regular",
    color: "#FFF",
    marginTop: 40,
    marginBottom: 15,
  },
  copyright: {
    fontSize: 13,
    fontFamily: "Lato-Regular",
    color: "#FFF",
  },
  input: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    flex: 1,
    color: "#FFF",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    width: (Dimensions.get("window").width * 270) / 392.72,
    marginVertical: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  empty: {
    width: 24,
    height: 24,
    backgroundColor: "#0f0c0c",
  },
});
