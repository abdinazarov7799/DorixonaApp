import React from 'react';
import {View, Dimensions, ActivityIndicator} from "react-native";

const Loader = () => {
    const {height,width} = Dimensions.get("window");
    return (
       <View style={{flex:1,alignItems:'center',justifyContent:'center',position:'absolute',top:0,left:0,height,width,zIndex:10,backgroundColor:'rgba(255,255,255,0.9)'}}>
          <ActivityIndicator size={40} style={{marginBottom:'75%'}} />
       </View>
    );
};



export default Loader;