import React from 'react';
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { identifySchema } from "@/lib/validation";
import { Button } from 'native-base';
import MaskInput from 'react-native-mask-input';
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import usePostQuery from "@/hooks/api/usePostQuery";
import {ENDPOINTS} from "@/constants";
import {isEqual} from "lodash";

const Index = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { mutate, isPending } = usePostQuery({});

    const onSubmit = ({ phone }: any) => {
        mutate({ endpoint: ENDPOINTS.signIn, attributes: { phone } }, {
            onSuccess: ({ data: response }) => {
                if (isEqual(response, "OTP is sent")) {
                    router.push(`/auth/login/${phone}`);
                }
            },
            onError: (e) => {
                console.log(e);
            }
        });
    };

    return (
        <>
            <Formik
                onSubmit={onSubmit}
                initialValues={{ phone: "" }}
                validationSchema={identifySchema}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                  }) => (
                    <View className={'flex-1 bg-gray-100 justify-between w-full p-10 max-w-[576px]'}>
                        <View className={"mt-28 mb-16 w-full"}>
                            <Image
                                source={require('@/assets/images/phone-icon.png')}
                                style={{ width: 80, height: 80, margin: "auto" }}
                            />
                            <Text className={'text-[28px] font-bold mb-4 mt-6 text-center'}>
                                {t("Telefon raqamingiz")}
                            </Text>
                            <Text className={'text-[15px] text-gray-500 mb-6 text-center'}>
                                {t("Ro‘yxatdan o‘tish uchun telefon raqamingizni kiriting")}
                            </Text>
                            <MaskInput
                                className={clsx(
                                    'py-3 px-4 mt-4 rounded-lg text-base bg-white border',
                                    {
                                        'border-gray-300': !errors.phone && !touched.phone,
                                        'border-red-500': errors.phone && touched.phone,
                                        'border-blue-500': touched.phone && !errors.phone
                                    }
                                )}
                                placeholder="+998"
                                placeholderTextColor="#888"
                                keyboardType="phone-pad"
                                maxLength={17}
                                onBlur={handleBlur("phone")}
                                value={values.phone}
                                onChangeText={handleChange("phone")}
                                mask={['+', '9', '9', '8', ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                            />
                            {errors.phone && touched.phone && (
                                <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                    {t(errors.phone)}
                                </Text>
                            )}
                        </View>
                        <Button className={'mt-4 p-4 rounded-lg bg-blue-500'} onPress={handleSubmit}>
                            {t("Davom etish")}
                        </Button>
                    </View>
                )}
            </Formik>
        </>
    );
};

export default Index;