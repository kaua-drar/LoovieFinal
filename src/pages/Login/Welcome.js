import React, {useCallback, useEffect, useState} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoovieLogo from '../../icons/LoovieLogo.svg'
import { useFonts } from "expo-font";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';

const Stack = createStackNavigator();


export default function Welcome({ navigation, route, props }){

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("MainTab");
      }
    })

    unsubscribed();
  }, [])

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ alignItems: "center" }}>
        <View>
          <LoovieLogo
            width={180}
            height={180}
            fill='#9D0208'
            style={{marginBottom: 35}}
          />
        </View>
        <View style={{ alignItems: "center" }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.text}>Bem vindo ao Loovie</Text>
        </View>
        
          <View style={{ flexDirection: "row", marginTop: 30 }}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  }
}

const styles = StyleSheet.create({
  buttonText: {
  color: '#FFF', 
  fontFamily: 'Lato-Regular',
  fontSize: 17
  },
  button: {
  width: 135,
  height: 50,
  backgroundColor: '#0f0c0c',
  borderColor:'#FFF',
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  borderRadius: 10
  },
  text: {
  fontSize: 22,
  color: '#FFF',
  fontFamily: "Lato-Regular" 
  },
  input: {
  height: 50,
  width: 300,
  marginVertical: 20,
  backgroundColor: '#1f1f1f',
  color: '#FFF',
  borderRadius: 10,
  padding: 10,
  fontFamily: "Lato-Regular" 
  },
  container: {
    flex: 1,
    backgroundColor: "#0f0c0c",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 35,
  },
});