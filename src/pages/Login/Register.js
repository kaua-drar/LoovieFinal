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
import { getAuth, createUserWithEmailAndPassword, } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';
import { SafeAreaView } from "react-native-safe-area-context";
import LoovieLogo from '../../icons/LoovieLogo.svg'
import { useFonts } from "expo-font";
import { connect } from "react-redux";
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';




export default function Register({navigation, route, props}) {
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);


  const handleCreateAccount = () => {
    Keyboard.dismiss();

    let regexUser = /^(?=.*[a-z])[-.\\a-zA-Z0-9]{4,20}$/;
    let regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])[-_@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/;
    

    console.log(username.length);
    console.log(password.length);
    console.log(regexUser.test(username));
    console.log(regexPassword.test(password));


    if(name.length < 4 || name.length > 20) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>O nome precisa ter entre 4 e 20 caracteres.</Text>
        </View>
      );
    }
    if(username.length < 4 || username.length > 20) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>O nome de usuário precisa ter entre 4 e 20 caracteres.</Text>
        </View>
      );
    }
    else if(regexUser.test(username) == false) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>Nome de Usuário inválido.</Text>
        </View>
      );
    }
    if(password.length < 6 || password.length > 20) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>A senha precisa ter entre 6 e 20 caracteres.</Text>
        </View>
      );
    }
    else if(regexPassword.test(password) == false) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>Senha inválida.</Text>
        </View>
      );
    }
    if(password != confirmPassword) {
      setErrorMessage(
        <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>As senhas não coincidem.</Text>
        </View>
      );
    }
    else if (regexUser.test(username) == true && regexPassword.test(password) == true && password == confirmPassword && username.length > 3 && username.length < 21 && password.length > 5 && password.length < 21) {
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid;
        console.log(uid);
        const usersRef = collection(db, "users");

        await setDoc(doc(usersRef, uid), {
        username: username }).then(() => {
          navigation.navigate("ChooseGenres");
        })

        console.log('Account created!');
        const user = userCredential.user;
        console.log(user);
      })
      .catch(error => {
        console.log(error.code);
        setErrorMessage(
          <View style={styles.errorMessageArea}>
          <Foundation name="alert" size={24} color="#9D0208"/>
          <Text style={styles.errorMessage}>{error.code === "auth/account-exists-with-different-credential" || error.code === "auth/email-already-exists" || error.code === "auth/email-already-in-use" ? "E-mail já associado a outra conta." : error.code === "auth/invalid-display-name" ? "Nome de usuário inválido." : error.code === "auth/invalid-email-verified" || error.code === "auth/invalid-email" ? "E-mail inválido" : error.code === "auth/invalid-password" ? "A senha precisa ter pelo menos 6 caracteres." : null}</Text>
        </View>
        );
      })
      setErrorMessage(null);
    }
  }

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  } else {
  return (
    <SafeAreaView style={styles.container} keyboardShouldPersistTaps="handled">
        <LoovieLogo
            width={140}
            height={140}
            fill='#9D0208'
            style={{marginBottom: 20, marginTop: 40}}
        />
        <TextInput
          value={email}
          placeholder="E-mail"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          value={username}
          placeholder="Nome de Usuário"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          value={name}
          placeholder="Nome"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
          onChangeText={(text) => setName(text)}
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
        <View style={styles.passwordInputArea}>
          <TextInput
            value={confirmPassword}
            placeholder="Confirmar Senha"
            placeholderTextColor="#8F8F8F"
            style={styles.passwordInput}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={confirmPasswordVisible == false ? true : false}
          />
          <TouchableOpacity onPress={() => 
          setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Entypo name={confirmPasswordVisible == false ? "eye" : "eye-with-line"} size={24} color="#8F8F8F" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => handleCreateAccount()}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        {errorMessage}
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Login")}>
            <Text Text style={styles.text}>Já possui uma conta? </Text>
            <Text Text style={[styles.text, {borderBottomWidth: 1, borderColor: '#9D0208'}]}>Entre</Text>
            <Text Text style={styles.text}>.</Text>
          </TouchableOpacity>
        </View>
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
  height: 50,
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
  height: 45,
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