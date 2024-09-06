import React, {useState} from 'react';
import {View, Text, Image} from "react-native";
import {useRouter} from "expo-router";
import {Formik} from "formik";
import {identifySchema} from "@/lib/validation";
import {Button, Heading} from 'native-base';
import MaskInput from 'react-native-mask-input';
import {get} from "lodash";
import clsx from "clsx";
import usePostQuery from "@/hooks/api/usePostQuery";
import {ENDPOINTS} from "@/constants";
import {useTranslation} from "react-i18next";
import {useGlobalContext} from "@/context";
import Loader from "@/components/shared/Loader";

const Index = () => {
    const [loading,setLoading] = useState(false);
    const {t} = useTranslation()
    const router = useRouter();
    const {setToken} = useGlobalContext()
    const [authData, setAuthData] = useState(null)
    const {mutate: identifyRequest, isPending} = usePostQuery({})

    const onSubmit = ({phone}: any, {setErrors}: any) => {
        identifyRequest({endpoint: ENDPOINTS.identity, attributes: {phone}}, {
            onSuccess: ({data: response}) => {
                if (get(response, 'phone') && !get(response, 'abs_employee_id')) {
                    setErrors({phone: 'You are not a bank employee'})
                } else if (get(response, 'phone') && get(response, 'abs_employee_id')) {
                    router.push(`/auth/login/${get(response, 'phone')}`)
                }
            },
            onError: (e) => {
                setErrors({phone: 'User not found'})
            }
        })
    }

    return (
        <>
            {loading && <Loader />}
            <Formik
                onSubmit={onSubmit}
                initialValues={{phone: ""}}
                validationSchema={identifySchema}
            >
                {

                    ({
                         handleChange,
                         handleBlur,
                         handleSubmit,
                         values,
                         errors,
                         touched,
                     }) => {
                        return (<>
                            <View className={'flex-1 bg-gray-100 justify-between w-full p-10 max-w-[576px]'}>
                                <View className={"mt-28 mb-16 w-full"}>
                                    <Image source={require('@/assets/images/lang-icon.png')} style={{width: 80, height: 80, margin: "auto"}}/>
                                    <Text className={'text-[28px] font-bold mb-4 mt-6 text-center'}>{t("Telefon raqamingiz")}</Text>
                                    <Text className={'text-[15px] text-gray-500 mb-6 text-center'}>
                                        {t("Ro‘yxatdan o‘tish uchun telefon raqamingizni kiriting")}
                                    </Text>
                                    <MaskInput
                                        className={clsx('py-1 p-4 mt-4 rounded-lg text-base bg-white', {'border-red-500': errors.phone && touched.phone})}
                                        onBlur={handleBlur("phone")}
                                        value={values.phone}
                                        onChangeText={handleChange("phone")}
                                        mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
                                    />
                                    {errors.phone && touched.phone && (
                                        <Text className={'text-red-500 font-normal text-xs mt-1'}>
                                            {t(errors.phone)}
                                        </Text>
                                    )}
                                </View>
                                <Button isLoading={isPending} className={'mt-4 p-4 rounded-lg bg-blue-500'} mode="contained"
                                        onPress={handleSubmit}>
                                    {t("Davom etish")}
                                </Button>
                            </View>
                        </>)
                    }
                }
            </Formik>
        </>
    );
};

export default Index;