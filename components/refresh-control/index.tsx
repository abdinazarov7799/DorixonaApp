import React,{useState,useCallback} from 'react';
import {RefreshControl, SafeAreaView, ScrollView} from "react-native";

export default function ScreenRefreshControl({children,cb=(any)=>{}}){
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cb(()=>setRefreshing(false));
    }, []);
    return (
        <SafeAreaView style={{flex:1}}>
            <ScrollView
                contentContainerStyle={{flex:1}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {children}
            </ScrollView>
        </SafeAreaView>
    );
};
