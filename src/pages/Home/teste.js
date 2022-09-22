import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Constants from "../../components/utilities/Constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import Image from "react-native-scalable-image";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function TabHomeScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [multisearch, setMultisearch] = useState([]);
  const [pageNow, setPageNow] = useState(0);
  const [search, setSearch] = useState(route.params.search);
  const sortBy = route.params.sortBy;
  let pageArray = [];
  const [loaded, setLoaded] = useState(false);
  

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const requests = async (page) => {
    setLoaded(false);
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
    if (page) {
      console.log(page);
      setLoading(true);

      const req = await fetch(
        Constants.URL.MULTISEARCH_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.QUERY_URL +  + Constants.URL.PAGE_URL + page
      );
      console.log(Constants.URL.MULTISEARCH_URL + Constants.URL.API_KEY + Constants.URL.LANGUAGE + Constants.URL.QUERY_URL + search + Constants.URL.PAGE_URL + page);
      
      const json = await req.json();

      if (json) {
        for (const obj of json.results) {
          if (obj.poster_path != null) {
            obj.poster_path =
              Constants.URL.IMAGE_URL_ORIGINAL + obj.poster_path;
          }
        }
        setMultisearch(json);
      }

      setPageNow(page);

      setLoading(false);
    }
  };

  useEffect(() => {
    let page = 1;
    requests(page);
  }, []);


  const research = (index) => {
    removeGenre(index);
    let page = 1
    requests(page);
  }

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
    requests(page);
  };
  const backPage = () => {
    if(pageNow > 1 ) {
      setPageNow(pageNow - 1);
    }
    let pageCorrect = pageNow - 1;
    requests(pageCorrect);
  };

  const forwardPage = () => {
    setPageNow(pageNow + 1);
    let pageCorrect = pageNow + 1;
    requests(pageCorrect);
  };

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        alignItems="center"
        onLayout={onLayoutRootView}
        justifyContent={loading || !loaded ? "center" : "flex-start"}
      >
            {loading || !loaded &&(
              <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            )}
            {!loading && (
              <View style={[styles.content, {display: loaded == true ? 'flex' : 'none'}]}>
              <View style={{flexDirection: 'row', justifyContent: 'center', width: (Dimensions.get("window").width * 360) / 392.72, marginBottom: 10,}}>
                <Text style={[styles.title, {fontSize: 20, marginLeft: 0}]}>Resultados</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: (Dimensions.get("window").width * 362) / 392.72, marginBottom: 10}}>
                <Text style={[styles.title, {alignSelf:'flex-start'}]}>{multisearch.total_results == 1 ? `${multisearch.total_results} título encontrado` : `${multisearch.total_results} títulos encontrados`}</Text>
              </View>
              <View style={styles.results}>
              {multisearch.results.map((media, index) => {
                if(media.poster_path != null) {
                  return (
                    <TouchableOpacity onPress={()=>navigation.navigate("Movie", {mediaId: media.id})} key={index} style={styles.mediaItem}>
                      <Image
                        key={index}
                        width={(Dimensions.get("window").width * 114) / 392.72}
                        source={{
                        uri: `${media.poster_path}`
                        }}
                        style={styles.mediaPoster}
                      />
                      <Text style={styles.mediaTitle}>{media.title}</Text>
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
    height: '100%',
    width: '100%',
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
