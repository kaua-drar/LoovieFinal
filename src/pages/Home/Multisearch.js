import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput
} from "react-native";
import Constants from "../../components/utilities/Constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import Image from "react-native-scalable-image";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function TabHomeScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [multisearch, setMultisearch] = useState([]);
  const [pageNow, setPageNow] = useState(0);
  const [textNow, setTextNow] = useState("");
  const text = route.params.text;
  let pageArray = [];
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState("");
  const [results, setResults] = useState([]);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const requests = async (page, text) => {
    const search = text.replace(/ /g, "%20");
    setLoaded(false);
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
    if (page) {
      console.log(page);
      setLoading(true);

      const req = await fetch(
        Constants.URL.MULTISEARCH_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.QUERY_URL + search + Constants.URL.PAGE_URL + page
      );
      console.log(Constants.URL.MULTISEARCH_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.QUERY_URL + search + Constants.URL.PAGE_URL + page);
      
      const json = await req.json();

      if (json) {
        setMultisearch([]);
        json.results.map((item) => {
          if(item.media_type === "movie" || item.media_type === "tv") {
            setMultisearch((old) => [...old, item]);
          }
          if(item.media_type === "person") {
            item.known_for.map((media) => {
              if(media.media_type === "movie" || media.media_type === "tv") {
                setMultisearch((old) => [...old, media]);
              }
            });
          }
        });
      }

      console.log(multisearch);


      setPageNow(page);
      setSearched(text);

      setLoading(false);
    }
  };

  useEffect(() => {
    let page = 1;
    requests(page, text);
  }, []);

  const navigationBar = () => {
    pageArray = [];
    let page = pageNow;
    if(page == 1){
      for(let i = page; i < page + 5 && i <= multisearch.total_pages; i++){
        pageArray.push(
          <TouchableOpacity onPress={() => i == page ? null : changePageByNumber(i)} key={i} activeOpacity={i == page ? 1 : 0.2}>
            <Text style={i == page ? styles.pageSelected : styles.page}>{i}</Text>
          </TouchableOpacity>
          
        )
      }
    } else if (page == 2) {
      for(let i = page-1; i < page + 4 && i <= multisearch.total_pages; i++){
        pageArray.push(
          <TouchableOpacity onPress={() => i == page ? null : changePageByNumber(i)} key={i} activeOpacity={i == page ? 1 : 0.2}>
            <Text style={i == page ? styles.pageSelected : styles.page}>{i}</Text>
          </TouchableOpacity>
          
        )
      }
    } else if (page == 3){
      for(let i = page - 2; i < page + 3 && i <= multisearch.total_pages; i++){
        pageArray.push(
          <TouchableOpacity onPress={() => i == page ? null : changePageByNumber(i)} key={i} activeOpacity={i == page ? 1 : 0.2}>
            <Text style={i == page ? styles.pageSelected : styles.page}>{i}</Text>
          </TouchableOpacity>
          
        )
      }
    } else {
      pageArray.push(
        <View style={{flexDirection:'row', alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={() => changePageByNumber(1)} key={1} activeOpacity={0.2}>
            <Text style={[styles.page, {marginRight: 0}]}>1</Text>
          </TouchableOpacity>
          <Text key={null} style={[styles.page, {marginHorizontal: 0}]}>...</Text>
        </View>
        
      )
      for(let i = page - 1; i < page + 3 && i <= multisearch.total_pages; i++){
        pageArray.push(
          <TouchableOpacity onPress={() => i == page ? null : changePageByNumber(i)} key={i} activeOpacity={i == page ? 1 : 0.2}>
            <Text style={i == page ? styles.pageSelected : styles.page}>{i}</Text>
          </TouchableOpacity>
          
        )
      }
    }
    
    if(multisearch.total_pages > 1) {
      return(
        <View style={styles.navigation}>
          <TouchableOpacity style={{marginRight: (Dimensions.get("window").width * 12.5) / 392.72}} onPress={() => pageNow > 1 ? backPage() : null}>
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
          {pageArray}
          <TouchableOpacity style={{marginLeft: (Dimensions.get("window").width * 12.5) / 392.72}} onPress={() => pageNow == multisearch.total_pages ? null : forwardPage()}>
            <Ionicons name="chevron-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )
    }
  };

  const changePageByNumber = (page) => {
    setPageNow(page);
    if(searched != "") {
      requests(page, searched);
    }
    else {
      requests(page, text);
    }
  };
  const backPage = () => {
    if(pageNow > 1 ) {
      setPageNow(pageNow - 1);
    }
    let pageCorrect = pageNow - 1;
    if(searched != "") {
      requests(pageCorrect, searched);
    }
    else {
      requests(pageCorrect, text);
    }
    
  };

  const forwardPage = () => {
    setPageNow(pageNow + 1);
    let pageCorrect = pageNow + 1;
    if(searched != "") {
      requests(pageCorrect, searched);
    }
    else {
      requests(pageCorrect, text);
    }
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        alignItems="center"
        onLayout={onLayoutRootView}
      >
        <View style={styles.areaInput}>
          <TextInput
            placeholder="O que você procura?"
            placeholderTextColor="#8F8F8F"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing = {(event) => requests(1, event.nativeEvent.text)}
          />
          {search.length > 0 && (
            <>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setSearch("")}
              >
                <MaterialIcons name="clear" size={24} color="#8F8F8F" />
              </TouchableOpacity>
            </>
          )}
      </View>
            {loading || !loaded &&(
              <View style={styles.loadingArea}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            )}
            {!loading && (
              <View style={[styles.content, {display: loaded == true ? 'flex' : 'none'}]}>
              <View style={{flexDirection: 'row', justifyContent: 'center', width: (Dimensions.get("window").width * 360) / 392.72, marginBottom: 10,}}>
                <Text style={[styles.title, {fontSize: 20, marginLeft: 0}]}>Resultados para: "{searched}"</Text>
              </View>
              <View style={styles.results}>
              {multisearch.map((media, index) => {
                if(media.poster_path != null && (media.title || media.name)) {
                  return (
                    <TouchableOpacity onPress={()=>navigation.navigate(media.media_type === "movie" ? "Movie" : media.media_type === "tv" ? "Serie" : null, {mediaId: media.id})} key={index} style={styles.mediaItem}>
                      <Image
                        key={index}
                        width={(Dimensions.get("window").width * 114) / 392.72}
                        source={{
                        uri: `${Constants.URL.IMAGE_URL_ORIGINAL}${media.poster_path}`
                        }}
                        style={styles.mediaPoster}
                      />
                      <Text style={styles.mediaTitle}>{media.title}{media.name}</Text>
                    </TouchableOpacity>
                  );
                }
              })}
              </View>
              {navigationBar()}
              </View>
            )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  areaInput: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    height: (Dimensions.get("window").height * 50) / 802.9,
    color: "#FFF",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    paddingVertical: (Dimensions.get("window").height * 10) / 802.9,
    paddingHorizontal: (Dimensions.get("window").height * 15) / 802.9,
    backgroundColor: "#292929",
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    marginBottom: (Dimensions.get("window").height * 33) / 802.9,
  },
  input: {
    fontFamily: "Lato-Regular",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 7.7,
    flex: 1,
    color: "#8F8F8F",
    alignItems: "center",
  },
  page: {
    color: '#76767F',
    fontFamily: 'Lato-Regular',
    fontSize: 25,
    marginHorizontal: (Dimensions.get("window").width * 12.5) / 392.72
  },
  pageSelected: {
    color: '#FFF',
    fontFamily: 'Lato-Bold',
    fontSize: 35,
    marginHorizontal: (Dimensions.get("window").width * 12.5) / 392.72
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  mediaItem: {
    width: (Dimensions.get("window").width * 124) / 392.72,
    alignItems: 'center'
  },
  mediaPoster: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
    margin: (Dimensions.get("window").width * 5) / 392.72,
  },
  mediaTitle: {
    width: (Dimensions.get("window").width * 110) / 392.72,
    marginBottom: (Dimensions.get("window").width * 5) / 392.72,
    color: '#FFF',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    fontSize: 12
  },
  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#0F0C0C",
    paddingHorizontal: (Dimensions.get("window").width * 20) / 392.72,
    paddingTop: "9%",
  },
  content: {
    alignItems: 'center',
    marginBottom: 100
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
  title: {
    fontFamily: "Lato-Bold",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderColor: "#9D0208",
    color: "#FFF",
    fontSize: 17,
    marginLeft: (Dimensions.get("window").width * 5) / 392.72,
  },
  results: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: (Dimensions.get("window").width * 372) / 392.72,
    justifyContent: "flex-start",
    marginBottom: 30
  },
  chipArea: {
    borderRadius:7,
    padding: 12,
    margin: 4,
    backgroundColor: '#76767F',
    height: 40
  },
  chipText: {
    fontFamily: 'Lato-Bold',
    color: '#000',
    fontSize: 15,
  },
  badge: {
    marginLeft: 5,
    backgroundColor: '#9D0208',
    width: 14,
    height: 14,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },
  badgeText: {
  fontFamily: 'Lato-Bold',
  color: '#FFF',
  fontSize: 10,
  }
});
