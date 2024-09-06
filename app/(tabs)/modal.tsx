import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View} from "react-native";
import {useLocalSearchParams, useNavigation} from "expo-router";
import {ScrollView} from "native-base";
import {get} from "lodash";
import PdfViewer from "@/components/pdf-viewer";
import Back from "@/components/back";

const Modal = () => {
    const navigation = useNavigation();
    let [active,setActive] = useState(null)
    const params = useLocalSearchParams();
    let {type='incoming',id = null, file } = params;

    useEffect(() => {
        if(file){
            // @ts-ignore
            setActive(file)
        }
    }, [file]);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: get(active,'title'),
            headerLeft: () => <Back url={`${type}/${id}`}/>,
        });
    }, [navigation,active]);
    if(typeof active === "string"){
        active = JSON.parse(active) || null
    }
    return (<>
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 5,
        }}>
            <ScrollView style={{flex: 1}}>
                        {get(active, 'src') && <PdfViewer url={get(active, 'src')}/>}
            </ScrollView>

        </View>

        </>
    );
};

export default Modal;