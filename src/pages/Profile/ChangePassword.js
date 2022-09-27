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
} from "react-native";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import {
  getAuth,
  updatePassword,
  verifyPasswordResetCode,
  confirmPasswordReset,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";


export default function ChangePassword({ navigation, route, props }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleChangePassword = () => {
    Keyboard.dismiss();

    let regexPassword =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[-_@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/;

    console.log(password.length);
    console.log(regexPassword.test(password));

    if (password.length < 6 || password.length > 20) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208" />
          <Text style={styles.errorMessage}>
            A senha precisa ter entre 6 e 20 caracteres.
          </Text>
        </View>
      );
    } else if (regexPassword.test(password) == false) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208" />
          <Text style={styles.errorMessage}>Senha inválida.</Text>
        </View>
      );
    }
    if (password != confirmPassword) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208" />
          <Text style={styles.errorMessage}>As senhas não coincidem.</Text>
        </View>
      );
    } else if (
      regexPassword.test(password) == true &&
      password == confirmPassword &&
      password.length > 5 &&
      password.length < 21
    ) {
      reauthenticate()
        .then(() => {
          console.log("deu");
          const user = auth.currentUser;
          updatePassword(user, password)
            .then(() => {
              console.log("Senha Atualizada!");
              setErrorMessage(
                <View style={styles.errorMessageArea}>
                  <MaterialIcons name={"check"} size={24} color="#FFF" />
                  <Text style={styles.errorMessage}>
                    Senha alterada com sucesso!
                  </Text>
                </View>
              );
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
    }
  };

  const reauthenticate = async () => {
    var user = auth.currentUser;
    var cred = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  };


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        alignItems="center"
      >
        <View style={styles.content}>
          <View style={styles.changesArea}>
            <Text style={[styles.changeTitle, { marginTop: 40 }]}>
              Senha Atual
            </Text>
            <View style={styles.changeItem}>
              <TextInput
                placeholder="Digite sua senha atual"
                placeholderTextColor="#8F8F8F"
                style={styles.changeInput}
                onChangeText={(text) => setCurrentPassword(text)}
                secureTextEntry={currentPasswordVisible == false ? true : false}
              />
              <TouchableOpacity
                onPress={() =>
                  setCurrentPasswordVisible(!currentPasswordVisible)
                }
              >
                <Entypo
                  name={
                    currentPasswordVisible == false ? "eye" : "eye-with-line"
                  }
                  size={24}
                  color="#8F8F8F"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.passwordForgot}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <Text style={[styles.changeTitle, { marginTop: 40 }]}>
              Nova Senha
            </Text>
            <View style={styles.changeItem}>
              <TextInput
                placeholder="Adicione uma nova senha"
                placeholderTextColor="#8F8F8F"
                style={styles.changeInput}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={passwordVisible == false ? true : false}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Entypo
                  name={passwordVisible == false ? "eye" : "eye-with-line"}
                  size={24}
                  color="#8F8F8F"
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.changeTitle, { marginTop: 20 }]}>
              Confirmar Senha
            </Text>
            <View style={styles.changeItem}>
              <TextInput
                placeholder="Confirme sua nova senha"
                placeholderTextColor="#8F8F8F"
                style={styles.changeInput}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={confirmPasswordVisible == false ? true : false}
              />
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                <Entypo
                  name={
                    confirmPasswordVisible == false ? "eye" : "eye-with-line"
                  }
                  size={24}
                  color="#8F8F8F"
                />
              </TouchableOpacity>
            </View>
          </View>
          {errorMessage}
          <View style={styles.submitArea}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleChangePassword()}
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
    marginTop: 60,
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
    width: Dimensions.get("window").width,
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