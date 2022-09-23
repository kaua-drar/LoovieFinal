import React, {useCallback} from "react";
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
import * as SplashScreen from "expo-splash-screen";
import { connect } from "react-redux";

SplashScreen.preventAutoHideAsync();


const Register = ({navigation, route, props}) => {
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
      <KeyboardAvoidingView style={{ alignItems: "center", flex: 1, justifyContent: 'center',}}>
        <LoovieLogo
            width={160}
            height={160}
            fill='#9D0208'
            style={{marginBottom: 20, marginTop: 30}}
        />
        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
        />
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
        />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
        />
        <TextInput
          placeholder="Confirmar Senha"
          placeholderTextColor="#8F8F8F"
          style={styles.input}
        />
        <TouchableOpacity style={{ marginVertical: 5 }}>
          <Text style={styles.text}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate("Login")}>
            <Text Text style={styles.text}>Já possui uma conta? </Text>
            <Text Text style={[styles.text, {borderBottomWidth: 1, borderColor: '#9D0208'}]}>Entre</Text>
            <Text Text style={styles.text}>.</Text>
          </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);