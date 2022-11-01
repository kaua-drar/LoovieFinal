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
import Modal from "../../components/react-native-modal";
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
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase-config";
import ExpoFastImage from "expo-fast-image";

export default function MyLibrary({ navigation, route, props }) {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedFolder, setPickedFolder] = useState("");
  const [pickedFolderId, setPickedFolderId] = useState();
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const requests = async () => {
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

  const handleToggleModal = (folderUrl, folderName, folderId) => {
    setIsModalVisible(!isModalVisible);
    setPickedFolder(
      <View style={styles.button}>
        <ExpoFastImage
          source={{
            uri: `${Constants.URL.IMAGE_URL_W500}${folderUrl}`,
          }}
          style={styles.folderImage}
        />
        <Text style={styles.buttonText}>{folderName}</Text>
      </View>
    );
    setPickedFolderId(folderId);
  };

  const handleToggleRenameModal = (folderUrl) => {
    setIsRenameModalVisible(!isRenameModalVisible);
  };

  const renameFolder = async () => {
    await updateDoc(doc(db, "folders", `${pickedFolderId}`), {
      name: newFolderName,
    }).then(() => {
      console.log("funfou");
      setIsModalVisible(false);
      setIsRenameModalVisible(false);
      requests();
    });
  };

  const handleToggleDeleteModal = (folderUrl) => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const deleteFolder = async () => {
    await deleteDoc(doc(db, "folders", `${pickedFolderId}`)).then(() => {
      console.log("funfou");
      setIsModalVisible(false);
      setIsDeleteModalVisible(false);
      requests();
    });
  };

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      requests();

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
          <RefreshControl refreshing={refreshing} onRefresh={requests} />
        }
      >
        {!loading && isVisible && (
          <View style={styles.content}>
            {folders.map((folder) => {
              return (
                <TouchableOpacity
                  style={styles.button}
                  key={folder.folderId}
                  onPress={() => navigation.navigate("ChoosedFolder", {folderId: folder.folderId})}
                  onLongPress={() => {
                    handleToggleModal(
                      folder.posterPath,
                      folder.name,
                      folder.folderId
                    );
                  }}
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
            <Modal
              testID={"modal"}
              isVisible={isModalVisible}
              onSwipeComplete={() => setIsModalVisible(false)}
              swipeDirection="down"
              onSwipeThreshold={500}
              onBackdropPress={handleToggleModal}
              propagateSwipe={true}
            >
              <View style={styles.modalArea}>
                <View style={styles.modalContent}>
                  <View style={styles.barra}></View>
                  {pickedFolder}
                  <TouchableOpacity
                    style={[styles.option, { marginTop: 10 }]}
                    onPress={() => {
                      setIsModalVisible(false);
                      handleToggleRenameModal();
                    }}
                  >
                    <FontAwesome5 name="edit" size={27.5} color="white" />
                    <Text style={styles.optionText}>Renomear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.option, { marginBottom: 25 }]}
                    onPress={() => {
                      setIsModalVisible(false);
                      handleToggleDeleteModal();
                    }}
                  >
                    <MaterialIcons name="delete" size={27.5} color="white" />
                    <Text style={[styles.optionText]}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={isRenameModalVisible}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              onBackdropPress={() => handleToggleRenameModal()}
            >
              <View style={styles.inputModalArea}>
                <View style={styles.inputModalContent}>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleToggleRenameModal()}>
                      <AntDesign
                        name="close"
                        size={32}
                        color="#FFF"
                        style={{
                          display: "flex",
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.errorMessage}>Renomear Pasta</Text>
                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={() => renameFolder()}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { marginLeft: 0, fontSize: 17, marginTop: 0 },
                        ]}
                      >
                        Criar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.changesArea}>
                    <View style={styles.changeItem}>
                      <Text style={[styles.changeTitle]}>Nome da Pasta</Text>
                      <TextInput
                        placeholder="Digite um novo nome para a pasta"
                        placeholderTextColor="#8F8F8F"
                        style={styles.changeInput}
                        onChangeText={(text) => setNewFolderName(text)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={isDeleteModalVisible}
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              animationInTiming={600}
              animationOutTiming={600}
              backdropTransitionInTiming={600}
              backdropTransitionOutTiming={600}
              onBackdropPress={() => handleToggleDeleteModal()}
            >
              <View style={styles.inputModalArea}>
                <View style={styles.inputModalContent}>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => handleToggleDeleteModal()}>
                      <AntDesign
                        name="close"
                        size={32}
                        color="#FFF"
                        style={{
                          display: "flex",
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.errorMessage}>Excluir Pasta</Text>
                    <View
                      style={{width: 30, height: 1}}
                      onPress={() => renameFolder()}
                    ></View>
                  </View>

                  <View style={styles.changesArea}>
                    <View style={[styles.changeItem, {borderBottomWidth: 0}]}>
                      <Text
                        style={[
                          styles.changeTitle,
                          { width: 250, textAlign: "center" },
                        ]}
                      >
                        Tem certeza que deseja excluir a pasta?
                      </Text>
                      <View style={styles.deleteButtonsArea}>
                        <TouchableOpacity
                          style={[styles.createButton, {backgroundColor: "white", padding: 10}]}
                          onPress={() => handleToggleDeleteModal()}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { marginLeft: 0, fontSize: 17, marginTop: 0, color: "#9D0208" },
                            ]}
                          >
                            Não
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.createButton, {padding: 10}]}
                          onPress={() => deleteFolder()}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { marginLeft: 0, fontSize: 17, marginTop: 0 },
                            ]}
                          >
                            Sim
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  deleteButtonsArea: {
    flexDirection: "row",
    paddingHorizontal: 65,
    justifyContent: "space-between",
    marginTop: 10
  },
  container: {
    paddingTop: "9%",
    flex: 1,
    backgroundColor: "#0F0C0C",
    paddingHorizontal: (Dimensions.get("window").width * 20) / 392.72,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "10%",
  },
  buttonText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 19,
    marginTop: 7,
    width: 150,
    textAlign: "center"
  },
  button: {
    margin: 10,
    flexDirection: "column",
    marginBottom: 10,
    alignItems: "center",
  },
  folderImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  modalArea: {
    flex: 1,
    justifyContent: "flex-end",
    width: Dimensions.get("window").width,
  },
  modalContent: {
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: Dimensions.get("window").width,
    backgroundColor: "#292929",
    alignItems: "center",
    paddingTop: 15,
  },
  barra: {
    height: 7.5,
    width: 60,
    borderRadius: 5,
    backgroundColor: "#5C5C5C",
    marginBottom: 30,
  },
  optionText: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    fontSize: 15,
    marginLeft: 15,
  },
  option: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: "#5C5C5C",
    alignItems: "center",
  },
  inputModalArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  inputModalContent: {
    paddingHorizontal: 15,
    borderRadius: 25,
    height: (Dimensions.get("window").width * 270) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    backgroundColor: "#292929",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
  changesArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  changeTitle: {
    width: "100%",
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
    marginBottom: 10,
  },
  changeItem: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#9D0208",
  },
  changeInput: {
    width: (Dimensions.get("window").width * 270) / 392.72,
    height: 20,
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 17,
  },
  createButton: {
    padding: 8,
    backgroundColor: "#9D0208",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  errorMessage: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: 20,
    textAlign: "center",
  },
});
