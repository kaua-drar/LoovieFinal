import React, { useState } from "react";

import { View, StyleSheet, Text, Image, Button } from 'react-native';

export default function App() {

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
    <View style={styleSheet.MainContainer}>

      <Text style={styleSheet.text}>
        Example of getSize on Image in React Native
      </Text>

      <Image source={{ uri: imageURL }}
        style={{ width: 300, height: 200, resizeMode: 'center', marginBottom: 14 }} />

      <Button onPress={getImageDimensions} title='Get Image Width Height Dimensions' />

      <Text style={styleSheet.text}>Image Width = {width}</Text>

      <Text style={styleSheet.text}>Image Height = {height}</Text>

    </View>
  );
}

const styleSheet = StyleSheet.create({

  MainContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },

  text: {
    fontSize: 28,
    textAlign: 'center',
    color: 'red',
    paddingBottom: 10
  }

});