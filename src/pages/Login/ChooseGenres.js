import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback
} from "react-native";
import ExpoFastImage from 'expo-fast-image';
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import LoovieLogo from '../../icons/LoovieLogo.svg'
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from "../../components/utilities/Constants";
import Image from "react-native-scalable-image";
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../firebase-config';


SplashScreen.preventAutoHideAsync();

const GenreItem = styled.TouchableOpacity`
  border-color: ${props=>props.selected?'#9D0208':'#0F0C0C'};
  alignItems: center;
  border-width: 4px;
  border-radius: 10px;
  width: ${(Dimensions.get("window").width * 184) / 392.72}px;
  height: ${(Dimensions.get("window").width * 127) / 392.72}px;
  marginBottom: ${(Dimensions.get("window").width * 5) / 392.72}px;
`;


const ProfileScreen = ({navigation, route, props}) => {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [genres, setGenres] = useState([]);
  const [username, setUsername] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  const toggleChip = (index) => {
    let selecteds = [...genres]
    selecteds[index].selected = !selecteds[index].selected;
    setGenres(selecteds);
    console.log(genres[index]);
  };

  const handleSubmit = () => {
    let selectedGenres = [];
    genres.map((genre)=>{
      if(genre.selected == true) {
        selectedGenres.push(genre)
      }
    });
    console.log(selectedGenres);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const sla = async () => {
    const docsSnap = await getDocs(collection(db, "genres"));

    setGenres([]);
    docsSnap.forEach(doc => {
      setGenres(old => [...old, {id: doc.id, genreName: doc.data().name, backdrop_path: doc.data().backdrop_path, poster_path: doc.data().poster_path, selected: false}].sort(function(a,b) {
        let x = a.genreName.toUpperCase(),
        y = b.genreName.toUpperCase();
  
        return x == y ? 0 : x > y ? 1 : -1;
      }));
    });

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

    setTimeout(() => {
      setLoading(false);
    }, 5000);
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
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        {loading &&(
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading &&(
          <View style={styles.content}>
            
            <ScrollView>
              <View style={styles.header}>
                <LoovieLogo
                  width={160}
                  height={160}
                  fill='#9D0208'
                  style={{marginBottom: 20, marginTop: 20}}
                />
                <Text style={styles.title}>Olá, {username}!</Text>
                <Text style={styles.text}>Escolha gêneros que goste de assistir. Isso vai nos ajudar a recomendar algo que você goste.</Text>
              </View>
              <View style={styles.results}>
                {genres.map((genre, index) => {
                  return(
                    <GenreItem key={genre.id} selected={genre.selected} onPress={() => toggleChip(index)}>
                      <ExpoFastImage
                        source={{
                          uri: `${Constants.URL.IMAGE_URL_W780}${genre.backdrop_path}`,
                        }}
                        resizeMode="cover"
                        style={styles.mediaBackdrop}
                      />
                      <View style={styles.genreNameArea}>
                        <Text style={styles.genreName}>{genre.genreName}</Text>
                      </View>
                    </GenreItem>
                      
                      
                  )
                })}
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <View style={styles.footerContent}>
                <TouchableOpacity style={styles.submit} onPress={() => handleSubmit()}>
                  <Text style={styles.submitText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal isVisible={isModalVisible} onSwipeComplete={() => setModalVisible(false)} swipeDirection="down" onSwipeThreshold={500} onBackdropPress={toggleModal}>
              <View style={styles.modalArea}>
                <View style={styles.modalContent}>
                  
                </View>
              </View>
            </Modal>
          </View>
        )}
        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  submitText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Lato-Bold'
  },
  submit: {
    height: (Dimensions.get("window").width * 60) / 392.72,
    width: (Dimensions.get("window").width * 170) / 392.72,
    backgroundColor: '#0F0C0C',
    borderColor: '#FFF',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  footer: {
    height: (Dimensions.get("window").width * 0) / 392.72,
    width: Dimensions.get("window").width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: (Dimensions.get("window").width * -60) / 392.72
  },
  footerContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: (Dimensions.get("window").width * 125) / 392.72,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    color: '#FFF',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
  },
  text: {
    color: '#FFF',
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    textAlign: 'center',
    marginTop: (Dimensions.get("window").width * 15) / 392.72,
    width: (Dimensions.get("window").width * 250) / 392.72,
  },
  mediaBackdrop: {
    width: (Dimensions.get("window").width * 178) / 392.72,
    height: (Dimensions.get("window").width * 100.125) / 392.72,
    borderRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30
  },
  results: {
    paddingHorizontal: (Dimensions.get("window").width * 10) / 392.72,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: (Dimensions.get("window").width * 125) / 392.72
  },
  genreName: {
    color: '#FFF',
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    opacity: 1,
    marginTop: (Dimensions.get("window").width * 7.5) / 392.72,
    textAlign: 'center'
  },
  genreNameArea: {
    width: (Dimensions.get("window").width * 178) / 392.72,
    height: (Dimensions.get("window").width * 50) / 392.72,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    position: 'relative',
    top: (Dimensions.get("window").width * -30) / 392.72,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0C0C',
    justifyContent: 'flex-start'
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-start',
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);