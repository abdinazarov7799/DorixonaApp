import React from 'react';
import {Redirect, Slot} from 'expo-router';
import {useGlobalContext} from "@/context";
import Loader from "../../components/shared/Loader";
import NativeSafeAreaView from "react-native-safe-area-context/src/specs/NativeSafeAreaView";

const AuthLayout = () => {
    const {user, isLoading} = useGlobalContext();
    if (user !== null) return <Redirect href={"/"}/>;
    return (<>
            {isLoading &&  <Loader />}
            <NativeSafeAreaView className={'flex-1'}>
                <Slot/>
            </NativeSafeAreaView>
        </>
    );
};

export default AuthLayout;