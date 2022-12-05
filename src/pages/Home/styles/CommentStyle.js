import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C0C",
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  inputViewArea: {
    position: 'absolute',
    bottom: 0,
    padding: (Dimensions.get("window").width * 10) / 392.72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F0C0C",
  },
  userProfilePicture: {
    width: (Dimensions.get("window").width * 65) / 392.72,
    height: (Dimensions.get("window").width * 65) / 392.72,
    borderRadius: (Dimensions.get("window").width * 32.5) / 392.72,
    borderColor: "#9D0208",
    borderWidth: 2
  },
  inputArea: {
    flexDirection: "row",
    marginLeft: (Dimensions.get("window").width * 10) / 392.72,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: (Dimensions.get("window").width * 9) / 392.72,
    maxHeight: (Dimensions.get("window").width * 55) / 392.72,
    borderColor: "#9D0208",
    borderWidth: 1,
    borderRadius: (Dimensions.get("window").width * 30) / 392.72
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontFamily: "Lato-Regular",
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    marginRight: (Dimensions.get("window").width * 8) / 392.72,
  },
  commentArea: {
    flexDirection: "row",
    padding: (Dimensions.get("window").width * 10) / 392.72,
    borderTopWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    marginBottom: (Dimensions.get("window").width * 10) / 392.72
  },
  commentText: {
    fontSize: (Dimensions.get("window").width * 17) / 392.72,
    color: "#FFF",
    width: (Dimensions.get("window").width * 340) / 392.72
  },
  numbersRow: {
    flexDirection: "row",
    width: (Dimensions.get("window").width * 340) / 392.72,
    marginTop: (Dimensions.get("window").width * 7) / 392.72
  },
  commentNumbers: {
    fontSize: (Dimensions.get("window").width * 15) / 392.72,
    color: "#474747",
  },
});

export default styles;
