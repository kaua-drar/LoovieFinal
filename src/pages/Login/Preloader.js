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
  Dimensions
} from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updateCurrentUser, confirmPasswordReset, updatePhoneNumber } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';
import { SafeAreaView } from "react-native-safe-area-context";
import LoovieLogo from '../../icons/LoovieLogo.svg'
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { connect } from "react-redux";
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';

export default function Preloader( {navigation} ) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(user => {
        if (user) {
            navigation.navigate("ChooseGenres");
        }
        else {
            navigation.navigate("Welcome");
        }
        })
        return unsubscribed
    }, [])
}