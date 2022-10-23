import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "../../components/utilities/Constants";
import styled from "styled-components/native";
import { useIsFocused } from '@react-navigation/native';

const Stack = createStackNavigator();

const ChipArea = styled.TouchableOpacity`
  border-radius:7px;
  padding:12px;
  margin:4px;
  backgroundColor:${props=>props.selected?'#9D0208':'#474747'};
  height:40px;
`;
const ChipText = styled.Text`
  font-family:Lato-Bold;
  color:#FFF;
  font-size:15px;
`;


export default function SearchFilter({ navigation, route }) {
  const isFocused = useIsFocused();
  const [genres, setGenres] = useState([]);
  const [mediaTypeRadio, setMediaTypeRadio] = useState(()=>{
    try{
      return(route.params.mediaType);
    }
    catch{
      return("movie")
    }
  });
  const [sortByRadio, setSortByRadio] = useState(()=>{
    try{
      return(route.params.sortBy);
    }
    catch{
      return("pop")
    }
  });
  const [loading, setLoading] = useState(true);

  const movies = () => {
    setMediaTypeRadio("movie");
    requestMovieGenres();
  }
  const series = () => {
    setMediaTypeRadio("tv");
    requestTVGenres();
  }
  
  const requestMovieGenres = async () => {
    setLoading(true);
    const reqMovie =  await fetch(
      Constants.URL.MOVIE_GENRES_URL +
        Constants.URL.API_KEY +
        Constants.URL.LANGUAGE
    );
    const jsonMovie = await reqMovie.json();
    if (jsonMovie) {
      for (const obj of jsonMovie.genres) {
        obj.selected = false;
      }
      setGenres(()=>{
      try{
        return(route.params.genres);
      }
      catch{
        return(jsonMovie.genres)
      }
    });
    }
    setLoading(false);
  };
  const requestTVGenres = async () => {
    setLoading(true);
    const reqSerie = await fetch(
      Constants.URL.TV_GENRES_URL +
        Constants.URL.API_KEY +
        Constants.URL.LANGUAGE
    );
    const jsonSerie = await reqSerie.json();
    if (jsonSerie) {
      for (const obj of jsonSerie.genres) {
        obj.selected = false;
      }
      setGenres(jsonSerie.genres);
    }
    setLoading(false);
  };

  useEffect(() => {
    requestMovieGenres();
  }, [isFocused]);

  const toggleChip = (index) => {
    let selecteds = [...genres]
    selecteds[index].selected = !selecteds[index].selected;
    setGenres(selecteds);
    console.log(genres[index]);
  };
  const getSelectedGenres = () => {
    navigation.navigate("DiscoverMovies", {selectedGenres: genres.map((genre)=>{
      if(genre.selected == true) {
        setSelectedGenres((old) => [...old, genre.id]);
      }
    }).toString()})
  }

  const [fontsLoaded] = useFonts({
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
    "Lato-Black": require("../../../assets/fonts/Lato-Black.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        alignItems="center"
        horizontal={false}
      >
          <View style={styles.content}>
            <View style={styles.filtersArea}>
              <View style={styles.mediaTypeArea}>
                <Text style={[styles.radioText, {marginBottom: 15}]}>Tipo de Mídia:</Text>
                <TouchableOpacity style={styles.radioTouchable} onPress={()=>movies()}>
                  <Text style={styles.radioText}>Filmes</Text>
                  <View style={[styles.radio, {backgroundColor: mediaTypeRadio === "movie" ? '#9D0208' : '#474747'}]}></View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioTouchable} onPress={()=>series()}>
                  <Text style={styles.radioText}>Séries</Text>
                  <View style={[styles.radio, {backgroundColor: mediaTypeRadio === "tv" ? '#9D0208' : '#474747'}]}></View>
                </TouchableOpacity>
              </View>
              <View style={styles.sortByArea}>
                <Text style={[styles.radioText, {marginBottom: 15}]}>Ordenar por:</Text>
                <TouchableOpacity style={[styles.radioTouchable, {width: 170}]} onPress={()=>setSortByRadio("pop")}>
                  <Text style={styles.radioText}>Popularidade</Text>
                  <View style={[styles.radio, {backgroundColor: sortByRadio == "pop" ? '#9D0208' : '#474747'}]}></View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.radioTouchable, {width: 170}]} onPress={()=>setSortByRadio("date")}>
                  <Text style={styles.radioText}>Data de Lançamento</Text>
                  <View style={[styles.radio, {backgroundColor: sortByRadio == "date" ? '#9D0208' : '#474747'}]}></View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.radioTouchable, {width: 170, marginBottom: 0}]} onPress={()=>setSortByRadio("av")}>
                  <Text style={styles.radioText}>Mais Avaliados</Text>
                  <View style={[styles.radio, {backgroundColor: sortByRadio == "av" ? '#9D0208' : '#474747'}]}></View>
                </TouchableOpacity>
              </View>
            </View>
        {!loading && (
          <View style={styles.genresArea}>
            <Text style={{color:'#FFF', fontSize: 15, fontFamily: 'Lato-Bold', marginBottom: 16}} onPress={()=>console.log(Date())}>Gêneros</Text>
            <View style={styles.chipsArea}>
              {genres.map((genre, index)=>(
                <ChipArea key={index} onPress={() => toggleChip(index)} selected={genre.selected}>
                  <ChipText>{genre.name}</ChipText>
                </ChipArea>
              ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate(mediaTypeRadio === "movie" ? "DiscoverMovies" : mediaTypeRadio === "tv" ? "DiscoverSeries" : null, {genres: genres, sortBy: sortByRadio == "pop" ? Constants.URL.SORT_BY_POPULARITY_URL : sortByRadio == "date" ? Constants.URL.SORT_BY_RELEASE_DATE : sortByRadio == "av" ? Constants.URL.SORT_BY_VOTE_COUNT : null})}>
              <Text style={{color: '#FFF', fontSize: 17}}>Buscar</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    paddingHorizontal: 16,
    paddingTop: "9%",
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 50
  },
  filtersArea: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    width: '100%',
    justifyContent: "space-between",
  },
  radioTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 75,
    marginBottom: 12
  },
  radioText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Lato-Bold'
  },
  radio: {
    width: 17,
    height: 17,
    borderRadius: 5
  },
  genresArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: 'center',
    paddingTop: 20,
    borderTopWidth: 1.5,
    borderColor: '#9D0208',
    marginTop: 20,
  },
  chipsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#9D0208',
    borderRadius: 7
  }
 
});
