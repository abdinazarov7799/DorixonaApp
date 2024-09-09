import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/context";
import usePostQuery from "@/hooks/api/usePostQuery";
import { ENDPOINTS } from "@/constants";
import { get, isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "native-base";
import ReactNativeOtpTextinput from "react-native-otp-textinput/index";

const Login = () => {
    const { t } = useTranslation();
    const { setToken } = useGlobalContext();
    const [otp, setOtp] = useState("");
    const [isError, setIsError] = useState(false);
    const { phone } = useLocalSearchParams();
    const router = useRouter();
    const { mutate, isPending } = usePostQuery({});

    useEffect(() => {
        if (otp && String(otp).length === 4) {
            setIsError(false);
            mutate({ endpoint: ENDPOINTS.signIn, attributes: { phone, otp } }, {
                onSuccess: ({ data: response }) => {
                    if (isEqual(response, "Go to sign up")) {
                        router.push(`/auth/sign-up/${phone}`);
                    } else {
                        setToken(get(response, 'access_token'));
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

    return (
        <View className={'flex-1 bg-gray-100 justify-between w-full p-6 max-w-[576px]'}>
            <Text className={'text-[28px] font-bold mb-4 mt-6 text-center'}>{t("Tasdiqlash kodini kiriting")}</Text>
            <Text className={'text-[15px] text-gray-500 mb-6 text-center'}>
                {t(`Kiritilgan ${phone} telefon raqamingizga maxsus tasdiqlash kodini SMS tarzda yubordik`)}
            </Text>

            <ReactNativeOtpTextinput
                inputCount={4}
                handleTextChange={(otp) => setOtp(otp)}
            />

            {isError && (
                <Text className={"text-red-500 text-center"}>
                    {t("Noto‘g‘ri kod kiritdingiz, qaytadan urunib ko‘ring")}
                </Text>
            )}

            <Button
                className={"bg-blue-500 p-4 rounded-lg"}
                isDisabled={isPending || !otp}
                onPress={() => setOtp(otp)}
            >
                {isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    t("Tasdiqlash")
                )}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    otpText: {
        marginTop: 20,
        fontSize: 18,
    },
});

export default Login;
