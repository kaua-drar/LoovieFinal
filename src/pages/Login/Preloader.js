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
  signInWithEmailAndPassword,
  updateProfile,
  updateCurrentUser,
  confirmPasswordReset,
  updatePhoneNumber,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import { SafeAreaView } from "react-native-safe-area-context";
import LoovieLogo from "../../icons/LoovieLogo.svg";
import { useFonts } from "expo-font";
import { connect } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import ExpoFastImage from "expo-fast-image";
import * as SplashScreen from "expo-splash-screen";

export default function Preloader({ navigation }) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (auth) {
      await SplashScreen.hideAsync();
      if (auth) {
        navigation.navigate("MainTab");
      } else {
        navigation.navigate("Welcome");
      }
      
    }
  }, [auth]);

  return (
    <SafeAreaView onLayout={onLayoutRootView} style={{backgroundColor: "#0F0C0C"}}>

    </SafeAreaView>
  )

  
}
