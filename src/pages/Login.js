import React from "react";
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
import styled from "styled-components/native";

const Input = styled.TextInput`
  height: 50px;
  width: 300px;
  margin: 20px 0;
  background-color: #1f1f1f;
  border-radius: 10px;
  color: #fff;
  padding: 10px;
`;
const Div = styled.View`
  justify-content: center;
`;
const Texto = styled.Text`
  color: #8f8f8f;
`;
const Botao = styled.TouchableOpacity`
  width: 135px;
  height: 50px;
  background-color: #0f0c0c;
  border: 2px solid #8f8f8f;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border-radius: 10px;
`;

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ alignItems: "center" }}>
        <View>
          <Image
            style={styles.logo}
            source={require("./src/icons/logo.png")}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Input
            placeholder="E-mail ou Usuário"
            placeholderTextColor="#8F8F8F"
            style={{ fontFamily: "Lato_400Regular" }}
          />
          <Input
            placeholder="Senha"
            placeholderTextColor="#8F8F8F"
            style={{ fontFamily: "Lato_400Regular" }}
          />
          <Texto style={{ marginVertical: 10 }}>Esqueceu sua senha?</Texto>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Botao>
              <Texto>Cadastrar</Texto>
            </Botao>
            <Botao>
              <Texto>Entrar</Texto>
            </Botao>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
