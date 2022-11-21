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
  StatusBar,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import Constants from "../../components/utilities/Constants";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';
import ExpoFastImage from 'expo-fast-image';


export default function ProfileScreen ({navigation, route, props}) {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [folders, setFolders] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const handleSignOut = () => {
    toggleModal();
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
    setLoading(true);
    setRefreshing(true);
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

    const docRefGenre = doc(db, "users", auth.currentUser.uid);
    const docSnapGenre = await getDoc(docRefGenre);

    if (docSnapGenre.exists()) {
      
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      setFavoriteGenres("");
    }
    const data = docSnapGenre.data();
    setFavoriteGenres(data.favoriteGenres);

    const q = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    setFolders([]);
    querySnapshot.forEach((doc) => {
      setFolders((old) =>
        [
          ...old,
          {
            folderId: doc.id,
            userId: doc.data().userId,
            name: doc.data().name,
            posterPath: doc.data().medias[0].posterPath,
          },
        ].sort(function (a, b) {
          let x = a.name.toUpperCase(),
            y = b.name.toUpperCase();

          return x == y ? 0 : x > y ? 1 : -1;
        })
      );
    });

    console.log(favoriteGenres);
    console.log(folders);

    setRefreshing(false);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() =>{
      setIsVisible(true)
      sla();

      return ()=>{
        setIsVisible(false);
      }
    }, [])
  );


  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={sla} />
      }>
        <StatusBar
        animated={true}
        backgroundColor="#9D0208"
        />
        {loading && !isVisible &&(
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && isVisible &&(
          <View style={styles.content}>
            <View style={styles.profile}>
                <TouchableOpacity onPress={toggleModal} style={{alignSelf: 'flex-end', margin: 10}}>
                  <FontAwesome5 name="bars" size={27.5} color="white" />
                </TouchableOpacity>
                
                <ExpoFastImage
                style={styles.profileImage}
                source={{
                  uri: auth.currentUser.photoURL == null ? "https://pbs.twimg.com/media/Fdnl8v_XoAE2vQX?format=jpg&name=large" : auth.currentUser.photoURL,
                }}
                />
                
            </View>
            <View style={styles.body}>
              <Text style={{color: '#FFF', fontSize: 20, fontFamily: 'Lato-Regular', marginBottom: 25}}>@{username}</Text>
              
              <View style={styles.itemArea}>
                <TouchableOpacity onPress={() => navigation.navigate("FavoriteGenres")}>
                  <Text style={styles.itemText}>Gêneros favoritos{' >'}</Text>
                </TouchableOpacity>
                <View style={styles.itens}>
                  <ScrollView horizontal={true} alignItems="center" showsHorizontalScrollIndicator={false}>
                    {favoriteGenres.map((genre, index) => {
                      return(
                        <TouchableOpacity style={{alignItems: 'center'}} key={index}>
                          <ExpoFastImage source={{uri: `${Constants.URL.IMAGE_URL_W300}${genre.backdrop_path}`}} style={{width: 100, height: 100, borderRadius: 50, marginHorizontal: 5}}/>
                          <Text style={[styles.itemText, {fontSize: 14, marginLeft: 0, marginBottom: 0, maxWidth: 100, textAlign: 'center'}]}>{genre.genreName}</Text>
                        </TouchableOpacity>
                        
                      )
                    })}
                  </ScrollView>
                </View>
              </View>


              <View style={[styles.itemArea, {marginTop: 35, marginBottom: 50}]}>
                <TouchableOpacity onPress={() => navigation.navigate("MyLibrary")}>
                <Text style={styles.itemText}>Minha biblioteca{' >'}</Text>
                </TouchableOpacity>
                <View style={styles.itens}>
                  <ScrollView horizontal={true} alignItems="center" showsHorizontalScrollIndicator={false}>
                    {folders.map((folder, index) => {
                      return(
                        <TouchableOpacity style={{alignItems: 'center'}} key={index} onPress={() => navigation.navigate("ChoosedFolder", {folderId: folder.folderId})}>
                          <ExpoFastImage source={{uri: `${Constants.URL.IMAGE_URL_W300}${folder.posterPath}`}} style={{width: 100, height: 100, borderRadius: 50, marginHorizontal: 5}}/>
                          <Text style={[styles.itemText, {fontSize: 14, marginLeft: 0, marginBottom: 0, maxWidth: 100, textAlign: 'center'}]}>{folder.name}</Text>
                        </TouchableOpacity>
                        
                      )
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>

            <Modal isVisible={isModalVisible} onSwipeComplete={() => setModalVisible(false)} swipeDirection="down" onSwipeThreshold={500} onBackdropPress={toggleModal} style={{margin: 0}}>
              <View style={styles.modalArea}>
                <View style={styles.modalContent}>
                  <View style={styles.barra}></View>
                  <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(false);
                  navigation.navigate("EditProfile");}}>
                    <FontAwesome5 name="edit" size={27.5} color="white" />
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => {setModalVisible(false);
                  navigation.navigate("Settings");}}>
                    <Feather name="settings" size={27.5} color="white" />
                    <Text style={styles.buttonText}>Configurações Gerais</Text>
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
    height: Dimensions.get("window").height
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
    height: 150,
    backgroundColor: '#292929',
    marginHorizontal: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5
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
    marginBottom: 50
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