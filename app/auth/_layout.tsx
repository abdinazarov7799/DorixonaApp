import React from 'react';
import {Redirect, Slot} from 'expo-router';
import useStore from "@/store";
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthLayout = () => {
    const user = useStore(state => state.user)
    if (user !== null) return <Redirect href={"/"}/>;
    return (<>
            <SafeAreaView className={'flex-1'}>
                <Slot/>
            </SafeAreaView>
        </>
    );
};

export default AuthLayout;