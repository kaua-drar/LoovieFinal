import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import styles from "./styles/ProfileScreenStyle";

export default function ProfileScreen() {
  const [options, setOptions] = useState(true);

  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
  });

  const toggleOptions = () => {
    setOptions(!options);
  }

  return (
    <ScrollView style={styles.container} alignItems="center">
      <View style={styles.header}>
        <View style={styles.barsRow}>
          <TouchableOpacity>
            <FontAwesome5 name="bars" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.profilePicture}
          source={{
            uri: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20220227211605",
          }}
        />
      </View>
      <View style={styles.userNumbers}>
        <View style={styles.numberArea}>
          <Text style={styles.numberCount}>250</Text>
          <Text style={styles.numberDescription}>Seguindo</Text>
        </View>
        <View style={styles.numberArea}>
          <Text style={styles.numberCount}>4.8k</Text>
          <Text style={styles.numberDescription}>Seguidores</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userTexts}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.names}>
            <Text style={styles.name}>Kaua Drar</Text>
            <Text style={styles.username}>@Drar</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>

        <Text style={styles.bio}>
          Amo filmes e séries, principalmente os de terror. Me sigam!!!
        </Text>
      </View>
      <View style={styles.optionsRow}>
        <TouchableOpacity style={[styles.optionArea, {borderBottomWidth: options ? 3 : 2, borderColor: options ? "#9D0208" : "#292929"}]} onPress={() => toggleOptions()}>
          <Text style={styles.optionText}>Postagens</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionArea, {borderBottomWidth: !options ? 3 : 2, borderColor: !options ? "#9D0208" : "#292929"}]} onPress={() => toggleOptions()}>
          <Text style={styles.optionText}>Biblioteca</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
