import { View, Text, StyleSheet } from "react-native";
import LoovieLogo from '../../icons/LoovieLogo.svg'
import { useFonts } from "expo-font";

export default function About() {
    const [fontsLoaded] = useFonts({
        "Lato-Regular": require("../../../assets/fonts/Lato-Regular.ttf"),
        "Lato-Bold": require("../../../assets/fonts/Lato-Bold.ttf"),
      });
    return (
        <View style={styles.container}>
            <View style={styles.empty}></View>
            <View style={styles.content}>
                <LoovieLogo
                    width={170}
                    height={170}
                    fill={"#9D0208"}
                />
                <Text style={styles.loovie}>LOOVIE</Text>
                <Text style={styles.version}>Versão 1.0.0</Text>
                <Text style={styles.team}>The S</Text>
            </View>
            <Text style={styles.copyright}>@Copyright 2022</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0F0C0C",
        flex: 1,
        justifyContent: 'space-between',
        alignItems: "center",
        paddingVertical: 12
    },
    empty: {
        height: 10,
        width: 2,
        backgroundColor: "#0F0C0C"
    },
    content: {
      alignItems: "center"  
    },
    loovie: {
        fontSize: 45,
        fontFamily: "Lato-Bold",
        color: "#FFF",
        marginTop: 25
    },
    version: {
        fontSize: 13,
        fontFamily: "Lato-Regular",
        color: "#D3D3D3",
        marginTop: 15
    },
    team: {
        fontSize: 17,
        fontFamily: "Lato-Regular",
        color: "#FFF",
        marginTop: 15
    },
    copyright: {
        fontSize: 13,
        fontFamily: "Lato-Regular",
        color: "#FFF"
    }
})