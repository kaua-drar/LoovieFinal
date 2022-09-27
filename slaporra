import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebaseConfig from './firebaseConfig.tsx';
import { initializeApp } from 'firebase/app'; //validate yourself
import { getStorage, ref, uploadBytes } from 'firebase/storage'; //access the storage database

initializeApp(firebaseConfig);

export default function App() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const storage = getStorage(); //the storage itself
      const ref = ref(storage, 'image.jpg'); //how the image will be addressed inside the storage

      //convert image to array of bytes
      const img = await fetch(result.uri);
      const bytes = await img.blob();

      await uploadBytes(ref, bytes); //upload images
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
      <TouchableHighlight onPress={pickImage}>
        <Text>select image</Text>
      </TouchableHighlight>
    </View>
  );
}
