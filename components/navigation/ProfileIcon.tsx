import React from 'react';
import {IconButton, Icon} from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const ProfileIcon = () => {
    const router = useRouter();
    return (<IconButton onPress={()=>router.push("/profile")}
            icon={<Icon size={8} as={MaterialCommunityIcons} name={'account-outline'}
                        color={'#00B592'}/>}/>
    );
};

export default ProfileIcon;