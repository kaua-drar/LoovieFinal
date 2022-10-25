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
  Dimensions,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "../../components/utilities/Constants";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import ExpoFastImage from "expo-fast-image";

export default function MyLibrary({ navigation, route, props }) {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const sla = async () => {
    setLoading(true);
    setRefreshing(true);

    const q = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    setFolders([]);
    querySnapshot.forEach((doc) => {
      setFolders((old) =>
        [
          ...old,
          {
            folderId: doc.id,
            userId: doc.data().userId,
            name: doc.data().name,
            posterPath: doc.data().medias[0].posterPath,
          },
        ].sort(function (a, b) {
          let x = a.name.toUpperCase(),
            y = b.name.toUpperCase();

          return x == y ? 0 : x > y ? 1 : -1;
        })
      );
    });

    console.log(folders);

    setRefreshing(false);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      sla();

      return () => {
        setIsVisible(false);
      };
    }, [])
  );
  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={sla} />
        }
      >
        {!loading && isVisible && (
          <View style={styles.content}>
            <ScrollView>
              {folders.map((folder) => {
                return (
                  <TouchableOpacity
                    style={styles.button}
                    key={folder.folderId}
                    onPress={() => addToFolder(folder.folderId)}
                  >
                    <ExpoFastImage
                      source={{
                        uri: `${Constants.URL.IMAGE_URL_W500}${folder.posterPath}`,
                      }}
                      style={styles.folderImage}
                    />
                    <Text style={styles.buttonText}>{folder.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
  },
  buttonText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 17,
    marginLeft: 15,
  },
  button: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
  },
  folderImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
});
