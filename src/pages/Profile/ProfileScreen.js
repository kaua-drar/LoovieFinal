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
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";

SplashScreen.preventAutoHideAsync();


export default function TabAboutScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
      <SafeAreaView onLayout={onLayoutRootView} style={styles.container}>
        <View style={styles.parent}>
          <Feather name="settings" size={27.5} color="black" style={{alignSelf: 'flex-end'}}/>
          <Image
          style={styles.profile}
          source={require('../../../assets/profile/levi.png')}
          />
        </View>
        <Button title="Show modal" onPress={toggleModal} />

        <Modal isVisible={isModalVisible} onSwipeComplete={() => setModalVisible(false)} swipeDirection="down" onSwipeThreshold={500}>
          <View style={styles.modalArea}>
            <View style={styles.modalContent}>
              <Text>Hello!</Text>
              <Button title="Hide modal" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0C0C',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  parent: {
    width: '100%',
    height: 200,
    backgroundColor: '#9D0208',
    alignItems: 'center',
  },
  profile: {
    position: 'relative',
    bottom: -50,
    width: 200,
    height: 200,
    backgroundColor: '#00F',
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#ADADAD'
  },
  modalArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 65,
    width: Dimensions.get("window").width
  },
  modalContent: {
    height: 400,
    width: Dimensions.get("window").width,
    backgroundColor: '#292929'
  }
});