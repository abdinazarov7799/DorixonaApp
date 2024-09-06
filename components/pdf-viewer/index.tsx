import React from 'react';
import {Dimensions} from "react-native";
import {get} from "lodash";
import Pdf from "react-native-pdf";
const PdfViewer = (props:any) => {
    return (
       <>
           <Pdf minScale={0.5}  trustAllCerts={false} style={{
                width:Dimensions.get('window').width-20,
                height:Dimensions.get('window').height-150}} source={{uri:get(props,'url','#'),cache: true}} />
        </>
    );
};

export default PdfViewer;
