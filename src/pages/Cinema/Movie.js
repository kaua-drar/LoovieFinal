import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight
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
import styled from "styled-components/native";

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();


const DateButton = styled.TouchableOpacity`
  align-items: center;
  margin-horizontal: 12px;
  border-bottom-width: 3px;
  padding-bottom: 5px;
  border-color:${props=>props.selected?'#9D0208':'#0F0C0C'};
`;
const DateText = styled.Text`
  color:#FFF;
  font-family:Lato-Regular;
  font-size: 20px;
`;
const DayText = styled.Text`
  color: #FFF;
  font-family:Lato-Regular;
  fontsize:10px;
`;

export default function Movie({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [menu, setMenu] = useState(true);
  const [toggle, setToggle] = useState(true);
  const movie = route.params.movie;
  const uf = route.params.uf;
  const cityId = route.params.cityId;

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const tryYoutube = () => {
      try{
        let trailer = movie.trailers[0].url.split("v=");
        return(
          <YoutubePlayer
          height={(338 / 16) * 9}
          width={338}
          play={playing}
          videoId={`${trailer[1]}`}
          onChangeState={onStateChange}
          />
        );
      } catch {
        return (null);
      }
  }

  const tryDirector = () => {
    try {
      return(
        <Text style={styles.mediaDetail}>
          Diretor:{" "}
          {
            movie.director
          }
        </Text>
      )
    } catch {
      return(null);
    }
  };
  const tryCertifications = () => {
    try {
      return(
        <Text style={styles.mediaDetail}>
        Classificação:{" "}
        {
          movie.contentRating
        }
        </Text>
        );
    }
    catch{ 
      return(null)
    }
  };

  const tryCast = () => {
    try{
      return(
        <Text style={styles.mediaDetail}>
          Elenco:{" "}
          {movie.cast}
        </Text>
      )
    }
    catch{
      return(null)
    }
  }

  const tryRating = () => {
    try{
      return(
        <View style={styles.mediaDetail}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text style={styles.note}>{(movie.rottenTomatoe.criticsScore / 10).toFixed(1)}</Text>
          <Text style={styles.noteof}>/10</Text>
        </View>
        <Star score={(movie.rottenTomatoe.criticsScore * 5) / 100} style={styles.starStyle}/>
        </View>
      )
    }
    catch{
      return(null)
    }
  }

  const tryDuration = () => {
    try{
      return(
        <Text style={styles.mediaDetail}>
          Duração: {Math.floor(movie.duration / 60)}h{" "}
          {movie.duration % 60}m
        </Text>
      );
    }
    catch{
      return(null);
    }
  }

  const tryGenres = () => {
    try{
      return(
        <>
          <Text style={styles.mediaDetail}>Gêneros:</Text>
          <View style={styles.genres}>
            <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
              {movie.genres.map((genre, index) => {
                return (
                  <Text style={styles.genre} key={index}>
                    {genre}
                  </Text>
                );
              })}
            </ScrollView>
          </View>
        </>
      );
    }
    catch{
      return(null);
    }
  }

  const tries = () => {
    tryYoutube();
    tryDirector();
    tryCertifications();
    tryCast();
  }

  const changeDate = (index) => {
    console.log(index)
    let selecteds = [...sessions]
    selecteds.find(item => item.selected == true).selected = false;
    selecteds[index].selected = true;
    setSessions(selecteds);
  }


  useEffect(() => {
    const requests = async () => {
      setLoading(true);
      const req = await fetch(
        `https://api-content.ingresso.com/v0/sessions/city/${cityId}/event/${movie.id}/`
      );

      console.log(`https://api-content.ingresso.com/v0/sessions/city/${cityId}/event/${movie.id}/`);
      const json = await req.json();

      if (json) {
        for (const obj of json) {
          obj.selected = false;
        }
        json[0].selected = true;
        setSessions(json);
      }

      setLoading(false);
    };

    requests();
  }, []);

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
      <ScrollView
        onLayout={onLayoutRootView}
        style={styles.container}
        alignItems="center"
        justifyContent={loading ? "center" : "flex-start"}
      >
        <View style={styles.headerMenu}>
          <TouchableOpacity style={[styles.menuButton, {backgroundColor: menu == true ? '#292929' : 'transparent'}]} onPress={() => setMenu(true)} disabled={menu == true   ? true : false}>
            <Text style={styles.menuText}>DETALHES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuButton, {marginLeft: 10, backgroundColor: menu == false ? '#292929' : 'transparent'}]} onPress={() => setMenu(false)} disabled={menu == false ? true : false}>
            <Text style={styles.menuText}>SESSÕES</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.content, {display: menu == true ? 'flex' : 'none'}]}>
            <View style={styles.header}>
              <Text style={styles.title}>{movie.title.toUpperCase()}</Text>
            </View>
            <View style={styles.mediaArea}>
              <View style={styles.movieItem}>
                <Image
                  width={(Dimensions.get("window").width * 180) / 392.72}
                  source={{
                    uri: `${movie.images[0].url}`,
                  }}
                  style={styles.mediaPoster}
                  resizeMode="cover"
                />
                {tryRating()}
              </View>
              <View style={styles.mediaDetails}>
                {tryDirector()}
                {tryDuration()}
                {tryCast()}
                {tryCertifications()}
                {tryGenres()}
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
                <TouchableOpacity onPress={() => setToggle(false)}>
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
                  {movie.synopsis}
                </ReadMore>
                <View style={{display: toggle == false ? "flex" : "none"}}>
                  {tryYoutube()}
                </View>
                
              </View>
            </View>
          </View>
        {loading && (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
        {!loading && (
          <View style={[styles.sessions, {display: menu == false ? 'flex' : 'none'}]}>
            <View style={styles.location}>
              <Text style={{color: '#9D0208', fontSize: 22.5, fontFamily: 'Lato-Bold'}}>{uf}</Text>
              <Text style={{color: '#9D0208', fontSize: 22.5, fontFamily: 'Lato-Bold'}}>{movie.city}</Text>
            </View>
            <View style={{maxHeight: 75, maxWidth: (Dimensions.get("window").width * 372) / 392.72, marginTop: 25,}}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {sessions.map((item, index) => {
                  if(item.isToday == true) {
                    return(
                      <DateButton key={index} selected={item.selected} onPress={() => changeDate(index)}>
                        <DateText>{item.dateFormatted}</DateText>
                        <DayText DayText>hoje</DayText>
                      </DateButton>
                    ); 
                  }
                  else {
                    return(
                      <DateButton key={index} selected={item.selected} onPress={() => changeDate(index)}>
                        <DateText>{item.isToday == true ? "hoje" :  item.dateFormatted}</DateText>
                        <DayText DayText>{item.dayOfWeek}</DayText>
                      </DateButton>
                    ); 
                  }
                })}
              </ScrollView>
            </View>
            <View style={{height: '100%', width: Dimensions.get("window").width, marginTop: 10}}>
              <ScrollView>
                {sessions.find(item => item.selected == true).theaters.map((v, index) => {
                  return(
                    <View>
                    <TouchableOpacity style={styles.theaterArea} key={index}>
                    <Text style={styles.theaterText}>{v.name}</Text>
                    </TouchableOpacity>
                    {v.rooms.map((x, index) => {
                      return(
                        <TouchableOpacity style={styles.sessionArea} key={index}>
                          <View style={styles.sessionInfo}>
                            <Text style={[styles.sessionText, {minWidth: 65,}]}>{x.name}</Text>
                            <View style={styles.cardHour}>
                              <Text style={styles.sessionText}>{x.sessions[0].time}</Text>
                            </View>
                            {x.sessions[0].types.map((y) => {
                              return(
                                <View style={[styles.cardType, {backgroundColor: y.alias === ("2D" || "3D") ? "#474747" : "#9D0208"}]} key={y.alias}>
                                  <Text style={styles.sessionText}>{y.alias}</Text>
                                </View>
                              )
                            })}
                          </View>
                        </TouchableOpacity>
                      )
                    })}
                    </View>
                  );
                  
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardHour: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5
  },
  cardType: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  sessionArea: {
    flexDirection: 'column',
    height: 50,
    width: Dimensions.get("window").width,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#474747',
    marginBottom: 5,
  },
  theaterArea: {
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    flexDirection: 'column',
    height: 50,
    width: Dimensions.get("window").width,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#474747',
    marginBottom: 5,
    backgroundColor: '#474747'
  },
  theaterText: {
    color: '#FFF',
    fontSize: 17.5,
    fontFamily: 'Lato-Bold'
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    justifyContent: 'space-around'
  },
  sessionText: {
    color: '#FFF',
    fontSize: 17.5,
    fontFamily: 'Lato-Regular'
  },
  location: {
    flexDirection: 'row',
    paddingHorizontal: (Dimensions.get("window").width * 70) / 392.72,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessions: {
    flexDirection: 'column',
    height: '100%'
  },
  headerMenu: {
    flexDirection: 'row',
    height: 60,
    width: Dimensions.get("window").width,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  menuButton: {
    padding: 10,
    borderRadius: 10
  },
  menuText: {
    fontFamily: 'Lato-Bold',
    color: '#FFF',
    fontSize: 17.5
  },
  starStyle: {
    width: (Dimensions.get("window").width * 125) / 392.72,
    height: (Dimensions.get("window").width * 25) / 392.72,
    marginBottom: (Dimensions.get("window").height * 5) / 802.9,
  },
  movieItem: {
    marginVertical: (Dimensions.get("window").height * 7) / 802.9,
    height: '100%'
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
    alignSelf: 'center',
    width: Dimensions.get("window").width,
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
    flexDirection: "column",
    backgroundColor: '#0F0C0C',
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
    marginBottom: (Dimensions.get("window").height * 5) / 802.9,
    color: "#FFF",
    fontSize:
      (Dimensions.get("window").height / Dimensions.get("window").width) * 10,
    textAlign: "left",
    marginHorizontal: (Dimensions.get("window").width * 11) / 392.72,
    fontFamily: 'Lato-Regular'
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
