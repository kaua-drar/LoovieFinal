import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  newButtonArea: {
    position: "absolute",
    right: (Dimensions.get("window").width * 30) / 392.72,
    bottom: (Dimensions.get("window").width * 30) / 392.72,
    width: (Dimensions.get("window").width * 60) / 392.72,
    height: (Dimensions.get("window").width * 60) / 392.72,
    borderRadius: (Dimensions.get("window").width * 30) / 392.72,
    backgroundColor: "#9D0208",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
  },
  newButtonText: {
    fontSize: (Dimensions.get("window").width * 50) / 392.72,
    fontFamily: "Lato-Regular",
    color: "#FFF",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
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
    alignSelf: "center",
    marginTop: 10,
  },
  postOptions: {
    marginTop: 20,
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


export default styles;
