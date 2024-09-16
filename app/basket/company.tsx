import React from 'react';
import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {Button, Input} from "native-base";
import {router} from "expo-router";
import * as Yup from "yup";
import {Formik} from "formik";

const validationSchema = Yup.object().shape({
    region: Yup.string().required("Viloyatni kiriting"),
    district: Yup.string().required("Tumanini kiriting"),
    pharmacyName: Yup.string().required("Dorixona nomini kiriting"),
    address: Yup.string().required("Dorixona manzilini kiriting"),
    phone: Yup.string().required("Telefon raqamini kiriting"),
});

const Company = () => {
    const {t} = useTranslation();
    return (
        <View className="flex-1 bg-white relative p-[16px]">
            <Formik
                initialValues={{
                    region: '',
                    district: '',
                    pharmacyName: '',
                    address: '',
                    phone: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <Ionicons name="arrow-back" size={24} color="#215ca0" onPress={() => router.back()} />
                        <View style={{ marginTop: 12 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 4 }}>{t("Dorixonani haqida")}</Text>
                            <Text style={{ fontSize: 15, color: '#656E78' }}>
                                {t("Dorixonaga tegishli boʻlgan maʻlumotlar bilan maydonlarni toʻldiring")}
                            </Text>
                        </View>

                        <View style={{ marginTop: 24 }}>
                            <Input
                                className={"h-[56px] p-[16px]"}
                                placeholder={t("Viloyati")}
                                onChangeText={handleChange('region')}
                                onBlur={handleBlur('region')}
                                value={values.region}
                                variant="filled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                marginBottom={4}
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={{marginRight: 18}}/>}
                            />
                            {touched.region && errors.region && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>{errors.region}</Text>
                            )}

                            <Input
                                className={"h-[56px] p-[16px]"}
                                placeholder={t("Tumani")}
                                onChangeText={handleChange('district')}
                                onBlur={handleBlur('district')}
                                value={values.district}
                                variant="filled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                marginBottom={4}
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={{marginRight: 18}} />}
                            />
                            {touched.district && errors.district && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>{errors.district}</Text>
                            )}

                            <Input
                                className={"h-[56px] p-[16px]"}
                                placeholder={t("Dorixona nomi")}
                                onChangeText={handleChange('pharmacyName')}
                                onBlur={handleBlur('pharmacyName')}
                                value={values.pharmacyName}
                                variant="filled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                marginBottom={4}
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={{marginRight: 18}} />}
                            />
                            {touched.pharmacyName && errors.pharmacyName && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>{errors.pharmacyName}</Text>
                            )}

                            <Input
                                className={"h-[56px] p-[16px]"}
                                placeholder={t("Dorixona manzili")}
                                onChangeText={handleChange('address')}
                                onBlur={handleBlur('address')}
                                value={values.address}
                                variant="filled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                marginBottom={4}
                            />
                            {touched.address && errors.address && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>{errors.address}</Text>
                            )}

                            <Input
                                className={"h-[56px] p-[16px]"}
                                placeholder={t("Telefon raqami")}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                keyboardType="phone-pad"
                                variant="filled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                marginBottom={4}
                            />
                            {touched.phone && errors.phone && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>{errors.phone}</Text>
                            )}
                        </View>

                        <View className={"absolute left-0 bottom-0 z-10 w-[100vw] h-[76px] p-[12px] bg-white border-t border-[#919DA63D]"}>
                            <Button
                                className={"bg-[#215ca0] w-full h-[44px] rounded-lg"}
                                onPress={handleSubmit}
                            >
                                <Text className={"text-white font-medium text-[16px]"}>
                                    {t("Arizani yuborish")}
                                </Text>
                            </Button>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    );
};

export default Company;