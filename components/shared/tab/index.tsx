import React, {useState} from 'react';
import {Animated, Dimensions, Text, TouchableOpacity} from "react-native";
import {TabView, SceneMap} from 'react-native-tab-view';
import {Box, useColorModeValue} from "native-base";
import {forEach, get} from "lodash";

const CustomTabView = ({routes = [], scenes = []}: any) => {
    const [index, setIndex] = useState(0);
    let initialScene = {};
    forEach(scenes, (_scene) => {
        // @ts-ignore
        initialScene[get(_scene, 'key')] = get(_scene, 'render');
    })
    const renderScene = SceneMap(initialScene);
    const initialLayout = {
        width: Dimensions.get('window').width
    };
    const renderTabBar = (props: any) => {
        return <Box flexDirection="row" bg={'white'}>
            {props.navigationState.routes.map((route: any, i: number) => {
                const color = index === i ? useColorModeValue('#000', '#e5e5e5') : useColorModeValue('#1f2937', '#a1a1aa');
                const borderColor = index === i ? '#00B592' : useColorModeValue('coolGray.200', 'gray.400');
                return <Box borderBottomWidth="3" borderColor={borderColor} flex={1}
                            cursor="pointer">
                    <TouchableOpacity onPress={() => {
                        setIndex(i);
                    }}>
                        <Animated.View alignItems="center"   style={{
                            padding:12,
                        }}><Text>{route.title}</Text></Animated.View>
                    </TouchableOpacity>
                </Box>;
            })}
        </Box>;
    };
    return (
        <TabView navigationState={{
            index,
            routes
        }} renderScene={renderScene} renderTabBar={renderTabBar} onIndexChange={setIndex} initialLayout={initialLayout}
                 style={{
                     marginTop: 12,
                     width: '98%',
                 }}/>
    );
};

export default CustomTabView;