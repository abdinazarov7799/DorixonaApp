import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { get, isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Button } from "native-base";
import ReactNativeOtpTextinput from "react-native-otp-textinput/index";
import useStore from "@/store";

const Login = () => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState("");
    const [isError, setIsError] = useState(false);
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const [timerCount, setTimer] = useState(60)
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
            onSuccess: () => {

            },
            onError: () => {

            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className={'flex-1 bg-white justify-between w-full p-6 max-w-[576px]'}>
                    <View className={"mt-28 mb-5 w-full max-w-[300px] mx-auto"}>
                        <Text className={'text-[28px] font-ALSSiriusBold mb-4 mt-6 text-center'}>{t("Tasdiqlash kodini kiriting")}</Text>
                        <Text className={'text-[15px] text-gray-500 mb-6 text-center font-ALSSiriusRegular'}>
                            {t(`Kiritilgan ${phone} telefon raqamingizga maxsus tasdiqlash kodini SMS tarzda yubordik`)}
                        </Text>

                        <ReactNativeOtpTextinput
                            inputCount={4}
                            autoFocus={true}
                            handleTextChange={(otp) => setOtp(otp)}
                            tintColor={"#246BB2"}
                        />

                        {isError && (
                            <Text className={"text-red-500 text-center font-ALSSiriusRegular"}>
                                {t("Noto‘g‘ri kod kiritdingiz, qaytadan urunib ko‘ring")}
                            </Text>
                        )}
                    </View>

                    <View>
                        <Button
                            isDisabled={timerCount !== 0}
                            variant={"unstyled"}
                            className={"mb-2 text-gray-200"}
                            onPress={reSendOtp}
                        >
                            <Text className={"font-ALSSiriusRegular"}>
                                {timerCount === 0 ? t("Kodni qayta yuborish") : t("Kodni qayta yuborish") + ": " + timerCount}
                            </Text>
                        </Button>
                        <Button
                            className={"bg-[#215ca0] p-4 rounded-lg"}
                            isDisabled={isPending || !otp}
                            onPress={() => setOtp(otp)}
                        >
                            <Text className={'font-ALSSiriusRegular text-white text-lg'}>{t("Tasdiqlash")}</Text>
                        </Button>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Login;
