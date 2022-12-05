import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    width: Dimensions.get("window").width
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
  },
  loadingText: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  newButtonArea: {
    position: "absolute",
    right: (Dimensions.get("window").width * 30) / 392.72,
    bottom: (Dimensions.get("window").width * -200) / 392.72,
    width: (Dimensions.get("window").width * 60) / 392.72,
    height: (Dimensions.get("window").width * 60) / 392.72,
    borderRadius: (Dimensions.get("window").width * 30) / 392.72,
    backgroundColor: "#9D0208",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  newButtonText: {
    fontSize: (Dimensions.get("window").width * 50) / 392.72,
    fontFamily: "Lato-Regular",
    color: "#FFF",
  },
  backdrop: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").width * 140) / 392.72,
    backgroundColor: "#292929",
    marginBottom: (Dimensions.get("window").width * 30) / 392.72,
  },
  barsRow: {
    padding: (Dimensions.get("window").width * 10) / 392.72,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  profilePicture: {
    height: (Dimensions.get("window").width * 140) / 392.72,
    width: (Dimensions.get("window").width * 140) / 392.72,
    bottom: (Dimensions.get("window").width * -35) / 392.72,
    borderWidth: 2,
    borderColor: "#9D0208",
    borderRadius: (Dimensions.get("window").width * 70) / 392.72,
    marginLeft: (Dimensions.get("window").width * 5) / 392.72,
  },
  userNumbers: {
    flexDirection: "row",
    alignItems: "center",
    top: (Dimensions.get("window").width * -30) / 392.72,
    left: (Dimensions.get("window").width * 135) / 392.72,
    marginTop: (Dimensions.get("window").width * 15) / 392.72,
  },
  numberArea: {
    alignItems: "center",
    marginHorizontal: (Dimensions.get("window").width * 5) / 392.72,
  },
  numberCount: {
    fontSize: (Dimensions.get("window").width * 17) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  numberDescription: {
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  profileButton: {
    paddingHorizontal: (Dimensions.get("window").width * 5) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 8) / 392.72,
    borderRadius: (Dimensions.get("window").width * 10) / 392.72,
  },
  text: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 18) / 392.72,
  },
  userTexts: {
    top: (Dimensions.get("window").width * -10) / 392.72,
    marginLeft: (Dimensions.get("window").width * 30) / 392.72,
    marginBottom: (Dimensions.get("window").width * 20) / 392.72
  },
  names: {
    alignItems: "center"
  },
  name: {
    fontSize: (Dimensions.get("window").width * 19) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  username: {
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#474747",
    fontFamily: "Lato-Regular",
    marginTop: (Dimensions.get("window").width * 2) / 392.72
  },
  bio: {
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
    marginRight: (Dimensions.get("window").width * 30) / 392.72,
    marginTop: (Dimensions.get("window").width * 10) / 392.72
  },
  optionsRow: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    marginBottom: (Dimensions.get("window").width * 30) / 392.72
  },
  optionArea: {
    flex: 1,
    alignItems: "center",
    paddingBottom: (Dimensions.get("window").width * 5) / 392.72
  },
  optionText: {
    fontSize: (Dimensions.get("window").width * 19) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
  },
  itens: {
    flex: 1,
    height: (Dimensions.get("window").width * 150) / 392.72,
    backgroundColor: "#292929",
    marginHorizontal: "2%",
    borderRadius: 5,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  itemArea: {
    width: Dimensions.get("window").width,
  },
  itemText: {
    marginLeft: (Dimensions.get("window").width * 30) / 392.72,
    color: "#FFF",
    fontSize: (Dimensions.get("window").width * 17) / 392.72,
    fontFamily: "Lato-Regular",
    marginBottom: (Dimensions.get("window").width * 5) / 392.72,
  },
  note: {
    color: "#FFF",
    fontFamily: "Lato-Bold",
    fontSize: (Dimensions.get("window").width * 30) / 392.72,
  },
  noteof: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 20) / 392.72,
    marginBottom: (Dimensions.get("window").width * 1.5) / 392.72,
  },
  avaliacoesArea: {
    width: Dimensions.get("window").width,
  },
  avaliacoesTitulo: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    fontSize: (Dimensions.get("window").width * 17) / 392.72,
    marginBottom: (Dimensions.get("window").width * 5) / 392.72,
    marginLeft: (Dimensions.get("window").width * 30) / 392.72,
  },
  userInfo: {
    justifyContent: "center",
  },
  userImage: {
    width: (Dimensions.get("window").width * 80) / 392.72,
    height: (Dimensions.get("window").width * 80) / 392.72,
    borderRadius: (Dimensions.get("window").width * 40) / 392.72,
    borderWidth: 2,
    borderColor: "#FFF",
    marginBottom: (Dimensions.get("window").width * 5) / 392.72,
  },
  userName: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    width: (Dimensions.get("window").width * 80) / 392.72,
    textAlign: "center",
    fontSize: (Dimensions.get("window").width * 14) / 392.72,
  },
  avaliacaoData: {
    fontFamily: "Lato-Regular",
    color: "#FFF",
    textAlign: "center",
    fontSize: (Dimensions.get("window").width * 14) / 392.72,
  },
  avaliacaoText: {
    textAlign: "justify",
    color: "#FFF",
    margin: 0,
    fontSize: (Dimensions.get("window").width * 14) / 392.72,
    width: (Dimensions.get("window").width * 250) / 392.72,
  },
  avaliacaoArea: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#292929",
    justifyContent: "space-between",
    marginHorizontal: "2%",
    paddingHorizontal: (Dimensions.get("window").width * 12) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 10) / 392.72,
    borderRadius: (Dimensions.get("window").width * 10) / 392.72,
  },
});

export default styles;
