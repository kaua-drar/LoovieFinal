import React from "react";
import { View, Text } from "react-native";
import ExpoFastImage from 'expo-fast-image';
import { getAuth, updateProfile } from "firebase/auth";
import { firebaseConfig } from "../../../firebase-config";
import { initializeApp } from "firebase/app";

export default function Teste({navigation, route, props}){

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return(
        <View style={{flex: 1}}>
            <ExpoFastImage source={{uri: auth.currentUser.photoURL}} style={{width: 100, height: 100}}/>
        </View>
    )
}