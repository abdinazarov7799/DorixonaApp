import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { get, isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import { Button } from "native-base";
import ReactNativeOtpTextinput from "react-native-otp-textinput/index";
import useStore from "@/store";

const Login = () => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState("");
    const [isError, setIsError] = useState(false);
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [timerCount, setTimer] = useState(60);
    const [chargeTimer, setChargeTimer] = useState(false);
    const { mutate, isPending } = usePostQuery({});
    const { mutate: sendOtp } = usePostQuery({});
    const setAccessToken = useStore(state => state.setAccessToken);
    const setRefreshToken = useStore(state => state.setRefreshToken);
    const setUser = useStore(state => state.setUser);

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                if (lastTimerCount === 0) {
                    return 0;
                } else {
                    lastTimerCount <= 1 && clearInterval(interval);
                    return lastTimerCount - 1;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [chargeTimer]);

    useEffect(() => {
        if (otp && String(otp).length === 4) {
            setIsError(false);
            mutate({ endpoint: ENDPOINTS.signIn, attributes: { phoneNumber: phone, otp } }, {
                onSuccess: ({ data: response }) => {
                    if (isEqual(response, "Go to sign up")) {
                        router.push(`/auth/sign-up/${phone}`);
                    } else {
                        const user = {
                            id: response.id,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            phoneNumber: response.phoneNumber,
                        };
                        setUser(user);
                        setRefreshToken(get(response, 'refreshToken'));
                        setAccessToken(get(response, 'accessToken'));
                        router.push(`/`);
                    }
                },
                onError: (e) => {
                    setIsError(true);
                    console.log(e);
                }
            });
        }
    }, [otp]);

    const reSendOtp = () => {
        setTimer(60);
        setChargeTimer(true);
        sendOtp({ endpoint: ENDPOINTS.signIn, attributes: { phoneNumber: phone } }, {
            onSuccess: () => {},
            onError: () => {}
        });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{t("Tasdiqlash kodini kiriting")}</Text>
                        <Text style={styles.subHeaderText}>
                            {t(`Kiritilgan ${phone} telefon raqamingizga maxsus tasdiqlash kodini SMS tarzda yubordik`)}
                        </Text>

                        <ReactNativeOtpTextinput
                            inputCount={4}
                            autoFocus={true}
                            handleTextChange={(otp) => setOtp(otp)}
                            tintColor={"#246BB2"}
                        />

                        {isError && (
                            <Text style={styles.errorText}>
                                {t("Noto‘g‘ri kod kiritdingiz, qaytadan urunib ko‘ring")}
                            </Text>
                        )}
                    </View>

                    <View>
                        <Button
                            isDisabled={timerCount !== 0}
                            variant={"unstyled"}
                            style={styles.resendButton}
                            onPress={reSendOtp}
                        >
                            <Text style={styles.resendButtonText}>
                                {timerCount === 0 ? t("Kodni qayta yuborish") : t("Kodni qayta yuborish") + ": " + timerCount}
                            </Text>
                        </Button>
                        <Button
                            style={styles.confirmButton}
                            isDisabled={isPending || !otp}
                            onPress={() => setOtp(otp)}
                        >
                            <Text style={styles.confirmButtonText}>{t("Tasdiqlash")}</Text>
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between",
        width: "100%",
        padding: 24,
        maxWidth: 576,
    },
    headerContainer: {
        marginTop: 112,
        marginBottom: 20,
        width: "100%",
        maxWidth: 300,
        alignSelf: "center",
    },
    headerText: {
        fontSize: 28,
        fontFamily: "ALSSiriusBold",
        marginBottom: 16,
        marginTop: 24,
        textAlign: "center",
    },
    subHeaderText: {
        fontSize: 15,
        color: "gray",
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "ALSSiriusRegular",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        fontFamily: "ALSSiriusRegular",
    },
    resendButton: {
        marginBottom: 8,
    },
    resendButtonText: {
        fontFamily: "ALSSiriusRegular",
        color: "gray",
    },
    confirmButton: {
        backgroundColor: "#215ca0",
        paddingVertical: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    confirmButtonText: {
        fontFamily: "ALSSiriusRegular",
        color: "white",
        fontSize: 18,
    },
});

export default Login;
