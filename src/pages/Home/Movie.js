import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Constants from "../../components/utilities/Constants";
import Image from "react-native-scalable-image";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import { Entypo } from "@expo/vector-icons";
import ReadMore from "@fawazahmed/react-native-read-more";
import YoutubePlayer from "react-native-youtube-iframe";
import Star from 'react-native-star-view';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function Media({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [cast, setCast] = useState([]);
  const [fullCast, setFullCast] = useState([]);
  const [director, setDirector] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [certification, setCertification] = useState("");
  const [trailer, setTrailer] = useState("");
  const [playing, setPlaying] = useState(false);
  const [toggle, setToggle] = useState(true);
  const mediaId = route.params.mediaId;

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const tryYoutube = () => {
    if(toggle == false) {
      try{
        return(
          <YoutubePlayer
          height={(338 / 16) * 9}
          width={338}
          play={playing}
          videoId={`${trailer}`}
          onChangeState={onStateChange}
        />
        );
      } catch {
        return (null);
      }
    }
    else {
      return (null)
    }
  }

  const tryDirector = () => {
    try {
      setDirector(
        <Text style={styles.mediaDetail}>
          Diretor:{" "}
          {
            fullCast.find(
              (person) =>
                person.known_for_department === "Directing" ||
                person.department === "Directing"
            ).name
          }
        </Text>
      );
    } catch {
      null;
    }
  };
  const tryCertifications = () => {
    setCertification(()=>{
      try {
        if(certifications.results.find(
          (item) => item.iso_3166_1 === "BR"
        ).release_dates[0].certification != "") {
          return(
            <Text style={styles.mediaDetail}>
          Classificação:{" "}
          {
            certifications.results.find(
              (item) => item.iso_3166_1 === "BR"
            ).release_dates[0].certification
          }
        </Text>
          )
        }
        else{
          return(null)
        }
      }
      catch{ 
        return(null)
      }
    }
    )
  };
  const tryWatchProviders = () => {
    try {
      return (
        <>
        <Text style={[styles.mediaDetail, {marginTop: (Dimensions.get("window").height * 10) / 802.9,}]}>Onde assistir:</Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{maxWidth: '100%', marginLeft: 7.5}}>
          {watchProviders.results.BR.flatrate.map((providers, index)=>{
          return(
            <Image
            width={(Dimensions.get("window").width * 50) / 392.72}
            source={{
              uri: `${Constants.URL.IMAGE_URL_ORIGINAL}${providers.logo_path}`,
            }}
            style={{marginHorizontal: 2.5, borderRadius: 10}}
            resizeMode="cover" key={index}/>
          )
          })
          }
        </ScrollView>
        </>
      )
    }
    catch{ 
      return(null)
    }
  };

  const tryCast = () => {
    if(cast.length > 3) {
      return(
        <Text style={styles.mediaDetail}>
          Elenco:{" "}
          {cast.map((item, index) => {
            if (index < 3) {
              return item.name + ", ";
            } else if (index == 3) {
              return item.name;
            }
          })}
        </Text>
      )
    }
    else{
      return (null)
    }
  }

  const tries = () => {
    tryDirector();
    tryCertifications();
  }


  useEffect(() => {
    console.log(mediaId);
    const requests = async () => {

      setLoading(true);

      const reqDetails = await fetch(
        Constants.URL.MOVIE_DETAILS_URL +
          `${mediaId}` +
          Constants.URL.API_KEY +
          Constants.URL.LANGUAGE
      );

      const jsonDetails = await reqDetails.json();

      if (jsonDetails) {
        setDetails(jsonDetails);
      }

      const reqCredits = await fetch(
        Constants.URL.MOVIE_DETAILS_URL +
          `${mediaId}` +
          Constants.URL.CREDITS_URL +
          Constants.URL.API_KEY +
          Constants.URL.LANGUAGE
      );
      const jsonCredits = await reqCredits.json();

      if (jsonCredits) {
        setCast([]);
        jsonCredits.cast.map((person) => {
          if (person.known_for_department === "Acting") {
            setCast((actor) => [...actor, person]);
          }
        });
        setFullCast([]);
        await jsonCredits.cast.map((person) => {
          setFullCast((item) => [...item, person]);
        });
        await jsonCredits.crew.map((person) => {
          setFullCast((item) => [...item, person]);
        });
      }

      const reqCertifications = await fetch(
        Constants.URL.MOVIE_DETAILS_URL +
          `${mediaId}` +
          Constants.URL.RELEASE_DATES_URL +
          Constants.URL.API_KEY
      );
      const jsonCertifications = await reqCertifications.json();

      if (jsonCertifications) {
        setCertifications(jsonCertifications);
      }

      const reqTrailer = await fetch(
        Constants.URL.MOVIE_DETAILS_URL +
          `${mediaId}` +
          Constants.URL.VIDEOS_URL +
          Constants.URL.API_KEY +
          Constants.URL.LANGUAGE
      );
      const jsonTrailer = await reqTrailer.json();

      if (jsonTrailer) {
        try {
          setTrailer(jsonTrailer.results[0].key);
        }
        catch {
        setTrailer("");
        }
        
      }

      const reqWatchProviders = await fetch(
        Constants.URL.MOVIE_DETAILS_URL +
          `${mediaId}` +
          Constants.URL.WATCH_PROVIDERS_URL +
          Constants.URL.API_KEY
      );
      const jsonWatchProviders = await reqWatchProviders.json();

      if (jsonWatchProviders) {
        setWatchProviders(jsonWatchProviders);
      }

      setLoading(false);
    };

    requests();
  }, []);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
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
      <ScrollView
        onLayout={onLayoutRootView}
        style={styles.container}
        alignItems="center"
        justifyContent={loading ? "center" : "flex-start"}
      >
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <View style={[styles.content, {display: 'flex'}]}>
            <View style={styles.header} onLayout={() => tries()}>
              <Text style={styles.title}>{details.title.toUpperCase()}</Text>
              <TouchableOpacity style={{alignItems: 'flex-start'}}>
                <Entypo name="plus" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.mediaArea}>
              <View style={styles.movieItem}>
                <Image
                  width={(Dimensions.get("window").width * 170) / 392.72}
                  source={{
                    uri: `${Constants.URL.IMAGE_URL_W500}${details.poster_path}`,
                  }}
                  style={styles.mediaPoster}
                  resizeMode="cover"
                />
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text style={styles.note}>{details.vote_average.toFixed(1)}</Text>
                  <Text style={styles.noteof}>/10</Text>
                </View>
                <Star score={(details.vote_average.toFixed(1)*5)/10} style={styles.starStyle}/>
              </View>
              
              <View style={styles.mediaDetails}>
                {director}
                <Text style={styles.mediaDetail}>
                  Duração: {Math.floor(details.runtime / 60)}h{" "}
                  {details.runtime % 60}m
                </Text>
                {tryCast()}
                {certification}
                <Text style={styles.mediaDetail}>Gêneros:</Text>
                <View style={styles.genres}>
                  <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
                    {details.genres.map((genre, index) => {
                      return (
                        <Text style={styles.genre} key={index}>
                          {genre.name}
                        </Text>
                      );
                    })}
                  </ScrollView>
                </View>
                {tryWatchProviders()}
              </View>
            </View>
            <View style={styles.mediaDetails2}>
              <View style={styles.toggleOptions}>
                <TouchableOpacity onPress={() => setToggle(true)}>
                  <Text
                    style={[
                      styles.toggleOption,
                      toggle == true
                        ? styles.toggleActive
                        : styles.toggleInactive,
                        {marginRight: 4}
                    ]}
                  >
                    Descrição
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setToggle(false)} style={{display: trailer === ""  ? 'none' : 'flex'}}>
                  <Text
                    style={[
                      styles.toggleOption,
                      toggle == false
                        ? styles.toggleActive
                        : styles.toggleInactive,
                    ]}
                  >
                    Trailer
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.toggledOptionsArea,
                  {
                    borderRadius: 13,
                    borderTopLeftRadius: toggle == true ? 0 : 13,
                    fontSize: 15,
                  },
                ]}
              >
                <ReadMore
                  style={{
                    textAlign: "justify",
                    color: "#FFF",
                    display: toggle == true ? "flex" : "none",
                    margin: 0,
                    fontSize: 15
                  }}
                  numberOfLines={5}
                >
                  {details.overview}
                </ReadMore>
                {tryYoutube()}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  starStyle: {
    width: (Dimensions.get("window").width * 125) / 392.72,
    height: (Dimensions.get("window").width * 25) / 392.72,
    marginBottom: (Dimensions.get("window").height * 5) / 802.9,
  },
  movieItem: {
    justifyContent: 'center'
  },
  note: {
    color: '#FFF',
    fontFamily: 'Lato-Bold',
    fontSize: 30
  },
  noteof: {
    color: '#FFF',
    fontFamily: 'Lato-Regular',
    fontSize: 20,
    marginBottom: 1.5
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  content: {
    marginBottom: 100,
    width: Dimensions.get("window").width,
    alignItems: "center",
    flex: 1,
    justifySelf: "flex-start"
  },
  header: {
    width: (Dimensions.get("window").width * 362) / 392.72,
    flexDirection: "row",
  },
  genres: {
    flexDirection: "column",
    flex: 1,
    height: 30,
    marginLeft: 7.5,
    maxHeight: 32
  },
  genre: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "#FFF",
    height: 30,
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 2.5,
  },
  mediaArea: {
    flexDirection: "row",
    overflow: "scroll",
    width: (Dimensions.get("window").width * 372) / 392.72,
  },
  mediaDetails: {
    flex: 1,
  },
  mediaDetail: {
    fontSize: 15,
    color: "#FFF",
    marginVertical: (Dimensions.get("window").height * 5) / 802.9,
    marginLeft: 10,
  },
  mediaPoster: {
    borderRadius:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 6,
  },
  container: {
    flex: 1,
    paddingTop: "9%",
    flexDirection: "column",
    backgroundColor: '#0F0C0C'
  },
  loadingArea: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
  },
  title: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#9D0208",
    paddingBottom: (Dimensions.get("window").height * 5) / 802.9,
    marginBottom: (Dimensions.get("window").height * 20) / 802.9,
    marginHorizontal: 5,
    color: "#FFF",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    textAlign: "left",
  },
  mediaDetails2: {
    width: '100%',
    alignItems: "center",
    justifyContent: 'center',
    width: (Dimensions.get("window").width * 372) / 392.72,
  },
  toggleOptions: {
    width: '100%',
    flexDirection: "row",
    marginTop: (Dimensions.get("window").height * 15) / 802.9,
  },
  toggleOption: {
    padding: 10,
    color: "#FFF",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    fontSize: 17,
    marginBottom: 4,
    borderRadius: 10,
  },
  toggleActive: {
    marginBottom: 0,
    borderBottomWidth: 4,
    borderColor: "#292929",
    backgroundColor: "#292929",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleInactive: {
    backgroundColor: "#474747",
  },
  toggledOptionsArea: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 10) / 392.72,
    backgroundColor: "#292929",
    color: "#FFF",
  },
});
