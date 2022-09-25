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

SplashScreen.preventAutoHideAsync();


const Login = ({navigation, route, props}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    setEmail('');
    setPassword('');
    const unsubscribed = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate("MainTab");
      }
    })

    return unsubscribed
  }, [])

  const handleSignIn = () => {
    Keyboard.dismiss();

    let regexUser = /^(?=.*[a-z])[-.\\a-zA-Z0-9]{4,20}$/;
    let regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])[-_@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/;
    
    console.log(password.length);
    console.log(regexPassword.test(password));

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in!');
        const user = userCredential.user;
        setErrorMessage(null);
        console.log(user);
      })
      .catch(error => {
        console.log(error.code);
        setErrorMessage(
          <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>{error.code === "auth/wrong-password" ? "Senha errada." : error.code === "auth/invalid-email" ? "E-mail inválido" : error.code === "auth/user-not-found" ? "E-mail errado ou não cadastrado." : null}</Text>
        </View>
        )
      })
  }

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } else {
  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardAvoidingView style={{ alignItems: "center", flex: 1, justifyContent: 'flex-start',}}>
        <LoovieLogo
          width={140}
          height={140}
          fill='#9D0208'
          style={{marginBottom: 20, marginTop: 100}}
        />
        <TextInput
          value={email}
          placeholder="E-mail"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordInputArea}>
          <TextInput
            value={password}
            placeholder="Senha"
            placeholderTextColor="#8F8F8F"
            style={styles.passwordInput}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={passwordVisible == false ? true : false}
          />
          <TouchableOpacity onPress={() => 
          setPasswordVisible(!passwordVisible)}>
            <Entypo name={passwordVisible == false ? "eye" : "eye-with-line"} size={24} color="#8F8F8F" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginVertical: 5 }}>
          <Text style={styles.text}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleSignIn()}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        {errorMessage}
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Register")}>
            <Text Text style={styles.text}>Não possui uma conta? </Text>
            <Text Text style={[styles.text, {borderBottomWidth: 1, borderColor: '#9D0208'}]}>Cadastre-se</Text>
            <Text Text style={styles.text}>.</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  }
}

const styles = StyleSheet.create({
  errorMessageArea: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'center',
    marginTop: 5,
    width: (Dimensions.get("window").width * 300) / 392.72
  },
  errorMessage: {
    fontSize: 15,
    color: '#FFF',
    fontStyle: 'Lato-Regular',
    marginLeft: 5,
    textAlign: 'center'
  },
  passwordInput: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    flex: 1,
    color: '#FFF',
  },
  passwordInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    width: 300,
    marginVertical: 10,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between'
  },
  buttonText: {
    color: '#FFF', 
    fontFamily: 'Lato-Regular',
    fontSize: 17
  },
  button: {
    width: 200,
    height: 45,
    backgroundColor: '#0f0c0c',
    borderColor:'#8f8f8f',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10
  },
  text: {
    color: '#8f8f8f',
    fontFamily: "Lato-Regular",
    fontSize: 15
  },
  input: {
    height: 50,
    width: 300,
    marginVertical: 10,
    backgroundColor: '#1f1f1f',
    color: '#FFF',
    borderRadius: 10,
    padding: 10,
    fontFamily: "Lato-Regular",
    fontSize: 16
  },
  container: {
    flex: 1,
    backgroundColor: "#0f0c0c",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 35,
  },
});

const mapStateToProps = (state) => {
  return{
    name:state.userReducer.name,
    email:state.userReducer.email
  };
}

const mapDispatchToProps = (dispatch) => {
  return{
    setName:(name) => dispatch({type:'SET_NAME', payload:{ name }})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);