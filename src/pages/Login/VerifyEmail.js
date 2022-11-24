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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
  const email = route.params.email;
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState(email);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const openInfoModal = (infoMessage) => {
    Keyboard.dismiss();
    setInfoMessage(infoMessage);
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
        <View style={styles.inputArea}>
          <View style={styles.empty}></View>
          <View style={styles.passwordInputArea}>
            <TextInput
              value={newEmail}
              placeholder="Confirmar Senha"
              placeholderTextColor="#8F8F8F"
              style={styles.passwordInput}
              onChangeText={(text) => setNewEmail(text)}
            />
            <TouchableOpacity
            >
                <FontAwesome5 name="edit" size={24} color="#8F8F8F" />
            </TouchableOpacity>
          </View>
          <View style={styles.empty}></View>
        </View>
        <Text style={styles.text}>{email}</Text>
        <Text style={styles.text}>
          Verifique sua caixa de entrada e sua caixa de spam, e siga as
          instruções antes de prosseguir.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  passwordInput: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    flex: 1,
    color: "#FFF",
  },
  passwordInputArea: {
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
  inputArea: {
    width: (Dimensions.get("window").width * 330) / 392.72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    height: 45,
    width: (Dimensions.get("window").width * 270) / 392.72,
    marginVertical: 10,
    backgroundColor: "#1f1f1f",
    color: "#FFF",
    borderRadius: 10,
    padding: 10,
    fontFamily: "Lato-Regular",
    fontSize: 16,
  },
});
