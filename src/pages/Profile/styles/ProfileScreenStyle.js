import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
  },
  header: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").width * 140) / 392.72,
    backgroundColor: "#9D0208",
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
    bottom: -20,
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
  button: {
    paddingHorizontal: (Dimensions.get("window").width * 5) / 392.72,
    paddingVertical: (Dimensions.get("window").width * 8) / 392.72,
    backgroundColor: "#9D0208",
    borderRadius: (Dimensions.get("window").width * 10) / 392.72,
    marginLeft: (Dimensions.get("window").width * 5) / 392.72
  },
  text: {
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
  },
  userTexts: {
    top: (Dimensions.get("window").width * -5) / 392.72,
    marginLeft: (Dimensions.get("window").width * 30) / 392.72,
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
    marginTop: (Dimensions.get("window").width * 20) / 392.72
  },
  optionArea: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 5
  },
  optionText: {
    fontSize: (Dimensions.get("window").width * 19) / 392.72,
    color: "#FFF",
    fontFamily: "Lato-Regular",
  }
});

export default styles;
