import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import * as Application from 'expo-application';
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import { get } from "lodash";
import {useTranslation} from "react-i18next";
import useStore from "@/store";

const AppUpdateChecker = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const setUser = useStore(state => state.setUser);
    const {t} = useTranslation();
    const { data } = useFetchRequest({
        endpoint: ENDPOINTS.getMe,
        queryKey: KEYS.getMe,
    });

    useEffect(() => {
        setUser(data)
        if (!!get(data, 'version') && !!Application) {
            if (get(data, 'version') != Application?.nativeApplicationVersion) {
                setModalVisible(true);
            } else {
                setModalVisible(false);
            }
        }
    }, [data]);

    const handleUpdatePress = () => {
        const androidUrl = get(data, 'androidUrl');
        const iosUrl = get(data, 'iosUrl');

        const storeUrl = Platform.OS === 'android' ? androidUrl : iosUrl;

        if (storeUrl) {
            Linking.openURL(storeUrl).catch((err) =>
                console.error("Failed to open URL:", err)
            );
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{t("Ilovaning yangi versiyasi mavjud")}</Text>
                    <Text style={styles.modalMessage}>{t("Iltimos, ilovani yangilang")}</Text>
                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
                        <Text style={styles.updateButtonText}>{t("Yangilash")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    updateButton: {
        width: "100%",
        backgroundColor: '#007AFF',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    updateButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AppUpdateChecker;
