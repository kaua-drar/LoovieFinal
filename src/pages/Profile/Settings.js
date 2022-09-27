import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { useFonts } from "expo-font";
import { getAuth, verifyPasswordResetCode } from "firebase/auth";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";


export default function Settings({ navigation, route, props }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gerais</Text>
        <View style={styles.changesArea}>
          <Text style={styles.changeTitle}>E-mail</Text>
          <View style={styles.changeItem}>
            <Text style={styles.changeText}>{auth.currentUser.email}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ChangeEmail")}>
              <FontAwesome5 name="edit" size={27.5} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.changeTitle, { marginTop: 30 }]}>Senha</Text>
          <View style={styles.changeItem}>
            <Text style={[styles.changeText, { marginTop: 10 }]}>
              **********
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
              <FontAwesome5 name="edit" size={27.5} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.desativeArea}>
          <TouchableOpacity style={styles.desativeButton} onPress={() => navigation.navigate("DeleteAccount")}>
            <MaterialIcons name="delete" size={27.5} color="#FFF" />
            <Text style={styles.desativeText}>Excluir Conta</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={27.5}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  sla: {},
  desativeText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
  },
  desativeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (Dimensions.get("window").width * 250) / 392.72,
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderColor: '#9D0208'
  },
  desativeArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: "4%",
  },
  changesArea: {
    marginTop: 80,
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
  changeText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    alignItems: "center",
    paddingTop: "4%",
  },
  title: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
  },
});