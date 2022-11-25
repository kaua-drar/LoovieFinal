import ExpoFastImage from "expo-fast-image";
import React, { useState } from "react";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { View, StyleSheet, Text, Image, Button, TouchableOpacity } from 'react-native';
import { useFonts } from "expo-font";


export default function App() {

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  var imageURL = 'https://i0.wp.com/semprefuigeek.com.br/wp-content/uploads/2022/04/Os-Vingadores-Originais.jpg?fit=1024%2C576&ssl=1';

  const [width, setWidth] = useState('');

  const [height, setHeight] = useState('');

  const getImageDimensions = () => {

    Image.getSize(imageURL, (Width, Height) => {
      setWidth(Width);
      setHeight(Height);

    }, (errorMsg) => {
      console.log(errorMsg);

    });

  }

  return (
    <View style={styles.container}>{/*
    <>
    <Text style={styleSheet.text}>
        Example of getSize on Image in React Native
      </Text>

      <Image source={{ uri: imageURL }}
        style={{ width: 300, height: 200, resizeMode: 'center', marginBottom: 14 }} />

      <Button onPress={getImageDimensions} title='Get Image Width Height Dimensions' />

      <Text style={styleSheet.text}>Image Width = {width}</Text>

      <Text style={styleSheet.text}>Image Height = {height}</Text>
    </>
     */}

      <TouchableOpacity>
        <View style={styles.postHeader}>
          <TouchableOpacity>
            <ExpoFastImage source={{ uri: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605" }} style={styles.userPicture} />
          </TouchableOpacity>
          <View style={styles.postTexts}>
            <View style={styles.postInfos}>
              <Text style={styles.userName}>@Drar</Text>
              <Text style={styles.postDate}>10 min</Text>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                <TouchableOpacity>
                  <Entypo name="dots-three-horizontal" size={24} color="#474747" />
                </TouchableOpacity>
              </View>

            </View>
            <Text style={styles.postDescription}>essa cena desse filme é realmente incrivel!
            </Text>
          </View>
        </View>
        <ExpoFastImage source={{ uri: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg" }} style={styles.postMedia} />
        <View>
          <TouchableOpacity>
            <FontAwesome5 name="comment" size={24} color="#474747" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="hearto" size={24} color="#474747" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Ver tags</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: "#0F0C0C"
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  postTexts: {
    flex: 1
  },
  postInfos: {
    flexDirection: "row",
    alignItems: "center"
  },
  userName: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 21
  },
  postDate: {
    color: "#474747",
    fontFamily: "Lato-Regular",
    fontSize: 16
  },
  postDescription: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 19,
    width: 250,
  },
  userPicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#9D0208"
  },
  postMedia: {
    width: 340,
    height: 253.3
  },

  text: {
    fontSize: 28,
    textAlign: 'center',
    color: 'red',
    paddingBottom: 10
  }

});