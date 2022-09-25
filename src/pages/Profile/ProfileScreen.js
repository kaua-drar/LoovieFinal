import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
  Dimensions,
  ScrollView,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';


SplashScreen.preventAutoHideAsync();


const ProfileScreen = ({navigation, route, props}) => {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Welcome")
    })
    .catch(error => alert(error.message))
  }

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const sla = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.username);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setUsername("");
    }
    setLoading(false);
  }

  useEffect( () => {
    sla();
  }, [])

  
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView style={styles.container}>
        <StatusBar
        animated={true}
        backgroundColor="#9D0208"/>
        {loading &&(
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading &&(
          <View onLayout={onLayoutRootView} style={styles.content}>
            <View style={styles.profile}>
                <TouchableOpacity onPress={toggleModal} style={{alignSelf: 'flex-end', margin: 10}}>
                  <Feather name="settings" size={27.5} color="white" />
                </TouchableOpacity>
                
                <Image
                style={styles.profileImage}
                source={{
                  uri: "https://pbs.twimg.com/profile_images/1560255496715632643/oZr-_U7g_400x400.jpg",
                }}
                />
                
            </View>
            <View style={styles.body}>
              <Text style={{color: '#FFF', fontSize: 20, fontFamily: 'Lato-Regular', marginBottom: 25}}>{username}</Text>
              
              <View style={styles.itemArea}>
                <Text style={styles.itemText}>Gêneros favoritos{' >'}</Text>
                <View style={styles.itens}>
                  <ScrollView></ScrollView>
                </View>
              </View>

              <View style={[styles.itemArea, {marginTop: 35, marginBottom: 50}]}>
                <Text style={styles.itemText}>Minha biblioteca{' >'}</Text>
                <View style={styles.itens}>
                  <ScrollView></ScrollView>
                </View>
              </View>
            </View>

            <Modal isVisible={isModalVisible} onSwipeComplete={() => setModalVisible(false)} swipeDirection="down" onSwipeThreshold={500} onBackdropPress={toggleModal}>
              <View style={styles.modalArea}>
                <View style={styles.modalContent}>
                  <View style={styles.barra}></View>
                  <TouchableOpacity style={styles.button}>
                    <FontAwesome5 name="edit" size={27.5} color="white" />
                    <Text style={styles.buttonText}>Configuração de Perfil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Feather name="settings" size={27.5} color="white" />
                    <Text style={styles.buttonText}>Configuração Geral</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <AntDesign name="infocirlceo" size={27.5} color="white" />
                    <Text style={styles.buttonText}>Sobre</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 30, width: '100%'}}>
                    <TouchableOpacity style={styles.button} onPress={() => handleSignOut()}>
                      <MaterialIcons name="exit-to-app" size={27.5} color="white" />
                      <Text style={styles.buttonText}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  buttonText: {
    fontFamily: 'Lato-Regular',
    color: '#FFF',
    fontSize: 15,
    marginLeft: 15
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: '#5C5C5C',
    alignItems: 'center'
  },
  itens: {
    flex: 1,
    height: 110,
    backgroundColor: '#292929',
    marginHorizontal: '2%',
    borderRadius: 5
  },
  itemArea: {
    width: Dimensions.get('window').width,
  },
  itemText: {
    marginLeft: 30,
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Lato-Regular',
    marginBottom: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0C0C',
  },
  body: {
    alignItems: 'center'
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
  },
  profile: {
    width: Dimensions.get('window').width,
    height: 180,
    backgroundColor: '#9D0208',
    alignItems: 'center',
    marginBottom: 110
  },
  profileImage: {
    position: 'relative',
    bottom: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#ADADAD',
  },
  modalArea: {
    flex: 1,
    justifyContent: 'flex-end',
    width: Dimensions.get("window").width
  },
  modalContent: {
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 460,
    width: Dimensions.get("window").width,
    backgroundColor: '#292929',
    alignItems: 'center',
    paddingTop: 15
  },
  barra: {
    height: 7.5,
    width: 60,
    borderRadius: 5,
    backgroundColor: '#5C5C5C',
    marginBottom: 30
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);