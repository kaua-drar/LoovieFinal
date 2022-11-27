import ExpoFastImage from "expo-fast-image";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TouchableHighlight,
} from "react-native";
import { useFonts } from "expo-font";
import ImageViewer from "react-native-image-zoom-viewer";
import { FlatList } from "react-native-gesture-handler";

export default function Feed({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [borderRadius, setBorderRadius] = useState(
    (Dimensions.get("window").width * 15) / 392.72
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
  });

  var imageURL =
    "https://i0.wp.com/semprefuigeek.com.br/wp-content/uploads/2022/04/Os-Vingadores-Originais.jpg?fit=1024%2C576&ssl=1";

  const [width, setWidth] = useState("");

  const [height, setHeight] = useState("");

  const getImageDimensions = () => {
    Image.getSize(
      imageURL,
      (Width, Height) => {
        setWidth(Width);
        setHeight(Height);
      },
      (errorMsg) => {
        console.log(errorMsg);
      }
    );
  };

  const images = [
    {
      id: 1,
      url: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg",
    },
    {
      id: 2,
      url: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg",
    },
    {
      id: 3,
      url: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg",
    },
    {
      id: 4,
      url: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg",
    },
  ];

  const changeActiveIndex = (e) => {};

  return (
    <View style={[styles.container]}>
      <ScrollView style={[styles.container, {maxHeight: Dimensions.get("window").height}]} alignItems="center">
        {/*
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

        <View>
          <View style={styles.postHeader}>
            <TouchableOpacity style={{ marginRight: 8 }}>
              <ExpoFastImage
                source={{
                  uri: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605",
                }}
                style={styles.userPicture}
              />
            </TouchableOpacity>
            <View style={styles.postTexts}>
              <View style={styles.postInfos}>
                <Text style={styles.userName}>@Drar</Text>
                <Text style={styles.postDate}>10 min</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity>
                    <Entypo
                      name="dots-three-horizontal"
                      size={22}
                      color="#474747"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView horizontal={true} justifyContent="flex-start">
                <TouchableOpacity
                  style={[
                    styles.chipArea,
                    { flexDirection: "row", alignItems: "flex-end" },
                  ]}
                >
                  <Text style={[styles.chipText, { color: "#FFF" }]}>
                    Batman
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chipArea,
                    { flexDirection: "row", alignItems: "flex-end" },
                  ]}
                >
                  <Text style={[styles.chipText, { color: "#FFF" }]}>
                    Bruce Wayne
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chipArea,
                    {
                      flexDirection: "row",
                      alignItems: "flex-end",
                      backgroundColor: "#76767F",
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: "#FFF" }]}>
                    Ver mais
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>4</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
          <Text style={styles.postDescription}>
            essa cena desse filme é realmente incrivel!essa cena desse filme é
            realmente incrivel!essa cena desse filme é realmente incrivel!essa
            cena desse filme é realmente incrivel!essa cena desse filme é
            realmente incrivel!essa cena desse filme é realmente incrivel!essa
            cena desse filme é realmente incrivel!essa cena desse filme é
            realmente incrivel!
          </Text>
          <FlatList
            data={images}
            style={styles.imageCarousel}
            pagingEnabled
            horizontal
            onMomentumScrollEnd={(e) => {
              setActiveIndex(
                Math.round(
                  e.nativeEvent.contentOffset.x /
                    ((Dimensions.get("window").width * 340) / 392.72)
                )
              );
            }}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item?.id)}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleModal()}>
                <ExpoFastImage
                  source={{
                    uri: item.url,
                  }}
                  style={styles.postMedia}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.dotsContainer}>
            {images.map((_, i) => (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === activeIndex ? "#9D0208" : "#76767F",
                  },
                ]}
                key={i}
              />
            ))}
          </View>
          {/*<TouchableOpacity onPress={() => toggleModal()}>
            <ExpoFastImage
              source={{
                uri: "https://pm1.narvii.com/6704/42eda7be653b6818be6bf1be390b8c3845a1a6e7_hq.jpg",
              }}
              style={styles.postMedia}
            />
            </TouchableOpacity>*/}

          <View style={styles.postOptions}>
            <TouchableOpacity>
              <AntDesign name="hearto" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.postNumbers}>500</Text>
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <FontAwesome5 name="comment" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.postNumbers}>40</Text>
          </View>
        </View>

        <Modal visible={isModalVisible} transparent={isModalVisible}>
          <TouchableOpacity
            style={styles.imageButtons}
            onPress={() => toggleModal()}
          >
            <Ionicons name="arrow-back" size={30} color="#FFF" />
          </TouchableOpacity>

          <ImageViewer
            imageUrls={images}
            renderIndicator={() => null}
            enableSwipeDown={true}
            onSwipeDown={toggleModal}
          />
        </Modal>
        <TouchableOpacity
        style={styles.newButtonArea}
        onPress={() => navigation.navigate("Post")}
      >
        <Text style={styles.newButtonText}>+</Text>
      </TouchableOpacity>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  imageCarousel: {
    maxHeight: (Dimensions.get("window").width * 340) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    marginTop: 10,
    marginBottom: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  images: {
    width: (Dimensions.get("window").width * 340) / 392.72,
    height: (Dimensions.get("window").width * 253.3) / 392.72,
  },
  imageButtons: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000000,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageViewer: {
    flex: 1,
    backgroundColor: "#000",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  newButtonArea: {
    position: "absolute",
    right: (Dimensions.get("window").width * 0) / 392.72,
    bottom: (Dimensions.get("window").width * -20) / 392.72,
    width: (Dimensions.get("window").width * 60) / 392.72,
    height: (Dimensions.get("window").width * 60) / 392.72,
    borderRadius: (Dimensions.get("window").width * 30) / 392.72,
    backgroundColor: "#9D0208",
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    fontSize: (Dimensions.get("window").width * 50) / 392.72,
    fontFamily: "Lato-Regular",
    color: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postTexts: {
    flex: 1,
  },
  postInfos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userName: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 18) / 392.72,
  },
  postDate: {
    color: "#474747",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 13) / 392.72,
    marginLeft: 8,
  },
  chipArea: {
    borderRadius: (Dimensions.get("window").width * 7) / 392.72,
    padding: (Dimensions.get("window").width * 8) / 392.72,
    margin: (Dimensions.get("window").width * 4) / 392.72,
    backgroundColor: "#9D0208",
  },
  chipText: {
    fontFamily: "Lato-Bold",
    color: "#000",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
  },
  badge: {
    marginLeft: 5,
    backgroundColor: "#9D0208",
    width: 14,
    height: 14,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    marginBottom: 2,
  },
  badgeText: {
    fontFamily: "Lato-Bold",
    color: "#FFF",
    fontSize: 10,
  },
  postDescription: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 16) / 392.72,
    width: (Dimensions.get("window").width * 340) / 392.72,
    marginTop: 2,
  },
  userPicture: {
    width: (Dimensions.get("window").width * 65) / 392.72,
    height: (Dimensions.get("window").width * 65) / 392.72,
    borderRadius: (Dimensions.get("window").width * 32.5) / 392.72,
    borderWidth: 3,
    borderColor: "#76767F",
  },
  postMedia: {
    width: (Dimensions.get("window").width * 340) / 392.72,
    height: (Dimensions.get("window").width * 253.3) / 392.72,
  },
  postOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  postNumbers: {
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#474747",
    marginLeft: 5,
  },
  text: {
    fontSize: 28,
    textAlign: "center",
    color: "red",
    paddingBottom: 10,
  },
});
