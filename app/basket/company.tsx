import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {Button, Icon, Input} from "native-base";
import {router} from "expo-router";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import {BaseBottomSheet} from "@/components/shared/bottom-sheet";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import usePostQuery from "@/hooks/api/usePostQuery";
import useStore from "@/store";

const Company = () => {
    const {t} = useTranslation();
    const regionRef = useRef<BottomSheetModal>(null);
    const districtRef = useRef<BottomSheetModal>(null);
    const pharmacyRef = useRef<BottomSheetModal>(null);
    const [region,setRegion] = useState(null);
    const [openRegion, setOpenRegion] = useState(false);
    const [district,setDistrict] = useState(null);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [pharmacy,setPharmacy] = useState(null);
    const [openPharmacy, setOpenPharmacy] = useState(false);
    const [search, setSearch] = useState(null);
    const [pharmacyPhoneNumber,setPharmacyPhoneNumber] = useState(null);
    const {fullPrice,orders,setOrders} = useStore()

    const {data} = useFetchRequest({
        queryKey: KEYS.region_list,
        endpoint: ENDPOINTS.region_list,
    })
    const {data:districts} = useFetchRequest({
        queryKey: `${KEYS.district_list}_${region?.id}`,
        endpoint: `${ENDPOINTS.district_list}/${region?.id}`,
        enabled: !!region
    })
    const {data:pharmacies,refetch} = useFetchRequest({
        queryKey: `${KEYS.pharmacy_list}_${district?.id}`,
        endpoint: `${ENDPOINTS.pharmacy_list}/${district?.id}`,
        params: {search},
        enabled: !!district
    })
    console.log(district)
    useEffect(() => {
        refetch()
    }, [search]);

    const {mutate,isPending} = usePostQuery({})

    const handleSubmit = () => {
        const products = Object.values(orders)?.map(order => ({
            productId: order?.id,
            quantity: order?.count
        }))
        if (products && products?.length > 0) {
            mutate({
                endpoint: ENDPOINTS.orderAdd,
                attributes: {
                    pharmacyPhoneNumber,
                    pharmacyId: pharmacy?.id,
                    totalPrice: fullPrice,
                    products
                }
            },{
                onSuccess: (res) => {
                    setOrders({})
                    router.push("/orders");
                },
                onError: (err) => {console.log(err,'err')},
            })
        }
    }
    const handleOpenRegionSheet = () => {
        setOpenRegion(true)
        regionRef.current?.present();
    };

    const handleCloseRegionSheet = () => {
        setOpenRegion(false)
        regionRef.current?.dismiss();
    };

    const handleOpenDistrictsSheet = () => {
        setOpenDistrict(true)
        districtRef.current?.present();
    };

    const handleCloseDistrictsSheet = () => {
        setOpenDistrict(false)
        districtRef.current?.dismiss();
    };

    const handleOpenPharmacySheet = () => {
        setOpenPharmacy(true)
        pharmacyRef.current?.present();
    };

    const handleClosePharmacySheet = () => {
        setOpenPharmacy(false)
        pharmacyRef.current?.dismiss();
    };

    const RenderedItem = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (openRegion) {
                        setRegion(item)
                        setDistrict(null)
                        setPharmacy(null)
                        handleCloseRegionSheet()
                    }else if (openDistrict) {
                        setDistrict(item)
                        setPharmacy(null)
                        handleCloseDistrictsSheet()
                    }else {
                        setPharmacy(item)
                        handleClosePharmacySheet()
                    }
                }}
                className={"py-[10px]  border-b border-[#919DA63D] flex-row items-center justify-between"}
            >
                <View>
                    <Text className={"text-[15px]"}>{item?.name}</Text>
                    {
                        item?.address && <Text className={'text-[#919DA6] text-[13px]'}>{item?.address}</Text>
                    }
                </View>
                {
                    openRegion && region?.id == item?.id && (
                        <AntDesign name="check" size={24} color="#246BB2" />
                    )
                }
                {
                    openDistrict && district?.id == item?.id && (
                        <AntDesign name="check" size={24} color="#246BB2" />
                    )
                }
                {
                    openPharmacy && pharmacy?.id == item?.id && (
                        <AntDesign name="check" size={24} color="#246BB2" />
                    )
                }
            </TouchableOpacity>
        )
    }

    return (
        <View className="flex-1 bg-white relative p-[16px]">
            <BaseBottomSheet bottomSheetRef={regionRef} snap={"90%"}>
                <View className={"p-4"}>
                    <Text className={"font-ALSSiriusBold text-[20px] mb-2"}>{t("Viloyatni tanlang")}</Text>
                    <FlatList
                        data={data}
                        renderItem={({item}) => <RenderedItem item={item} />}
                        keyExtractor={item => item?.id}
                    />
                </View>
            </BaseBottomSheet>
            <BaseBottomSheet bottomSheetRef={districtRef} snap={"90%"}>
                <View className={"p-4"}>
                    <Text className={"font-ALSSiriusBold text-[20px] mb-2"}>{t("Tumanni tanlang")}</Text>
                    <FlatList
                        data={districts}
                        renderItem={({item}) => <RenderedItem item={item} />}
                        keyExtractor={item => item?.id}
                    />
                </View>
            </BaseBottomSheet>
            <BaseBottomSheet bottomSheetRef={pharmacyRef} snap={"90%"}>
                <View className={"p-4"}>
                    <View className={"bg-gray-100 p-2 rounded-[8px] mb-2"}>
                        <Input
                            variant="unstyled"
                            className={"text-gray-500 text-[15px]"}
                            value={search}
                            placeholder={t("Kerakli dorixonani izlab toping")}
                            onChangeText={(text) => setSearch(text ? text : null)}
                            InputLeftElement={
                                <Icon
                                    as={<Ionicons name="search" />}
                                    size={6}
                                    ml="3"
                                    mr="1"
                                    color="black"
                                />
                            }
                        />
                    </View>
                    <FlatList
                        data={pharmacies}
                        renderItem={RenderedItem}
                        keyExtractor={item => item?.id}
                    />
                </View>
            </BaseBottomSheet>
            <>
                <Ionicons name="arrow-back" size={24} color="#215ca0" onPress={() => router.back()} />
                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 4 }} className={'font-ALSSiriusBold'}>{t("Dorixonani haqida")}</Text>
                    <Text style={{ fontSize: 15, color: '#656E78' }} className={'font-ALSSiriusRegular'}>
                        {t("Dorixonaga tegishli boʻlgan maʻlumotlar bilan maydonlarni toʻldiring")}
                    </Text>
                </View>

                <View style={{ marginTop: 24 }}>
                    <TouchableOpacity onPress={handleOpenRegionSheet}>
                        <Input
                            className={"h-[56px] p-[16px]"}
                            placeholder={t("Viloyati")}
                            value={region ? `${t("Tanlangan viloyat:")} ${region?.name}` : ''}
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                            marginBottom={4}
                            isReadOnly
                            InputRightElement={<Ionicons name="chevron-forward" size={20} style={{marginRight: 18}}/>}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleOpenDistrictsSheet}>
                        <Input
                            className={"h-[56px] p-[16px]"}
                            placeholder={t("Tumani")}
                            value={district ? `${t("Tanlangan tuman:")} ${district?.name}` : ''}
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                            marginBottom={4}
                            isReadOnly
                            InputRightElement={<Ionicons name="chevron-forward" size={20} style={{marginRight: 18}} />}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Input
                            className={"h-[56px] p-[16px]"}
                            placeholder={t("Dorixona nomi")}
                            value={pharmacy?.name}
                            onChangeText={(text) => setPharmacy(text)}
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                            marginBottom={4}
                            InputRightElement={<Ionicons onPress={handleOpenPharmacySheet} name="chevron-forward" size={20} style={{marginRight: 18}} />}
                        />
                    </TouchableOpacity>

                    <Input
                        className={"h-[56px] p-[16px]"}
                        placeholder={t("Dorixona manzili")}
                        value={pharmacy?.address}
                        variant="unstyled"
                        backgroundColor="#B4C0CC29"
                        borderRadius={10}
                        marginBottom={4}
                    />

                    <Input
                        className={"h-[56px] p-[16px]"}
                        placeholder={t("Dorixona inn")}
                        value={pharmacy?.inn}
                        variant="unstyled"
                        backgroundColor="#B4C0CC29"
                        borderRadius={10}
                        marginBottom={4}
                    />

                    <Input
                        className={"h-[56px] p-[16px]"}
                        placeholder={t("Telefon raqami")}
                        onChangeText={(value) => setPharmacyPhoneNumber(value)}
                        value={pharmacyPhoneNumber}
                        keyboardType="phone-pad"
                        variant="unstyled"
                        backgroundColor="#B4C0CC29"
                        borderRadius={10}
                        marginBottom={4}
                    />

                </View>

                <View className={"absolute left-0 bottom-0 z-10 w-[100vw] h-[76px] p-[12px] bg-white border-t border-[#919DA63D]"}>
                    <Button
                        className={"bg-[#215ca0] w-full h-[44px] rounded-lg"}
                        onPress={handleSubmit}
                        isLoading={isPending}
                        isDisabled={isPending}
                    >
                        <Text className={"text-white font-ALSSiriusMedium text-[16px]"}>
                            {t("Arizani yuborish")}
                        </Text>
                    </Button>
                </View>
            </>
        </View>
    );
};

export default Company;