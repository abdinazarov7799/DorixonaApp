import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Dimensions
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Button, Icon, Input } from "native-base";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BaseBottomSheet } from "@/components/shared/bottom-sheet";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import { ENDPOINTS, KEYS } from "@/constants";
import usePostQuery from "@/hooks/api/usePostQuery";
import {useStore} from "@/store";
import {get, isEmpty} from "lodash";

const Company = () => {
    const { t } = useTranslation();
    const regionRef = useRef<BottomSheetModal>(null);
    const districtRef = useRef<BottomSheetModal>(null);
    const pharmacyRef = useRef<BottomSheetModal>(null);
    const [region, setRegion] = useState(null);
    const [openRegion, setOpenRegion] = useState(false);
    const [district, setDistrict] = useState(null);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [pharmacy, setPharmacy] = useState(null);
    const [openPharmacy, setOpenPharmacy] = useState(false);
    const [search, setSearch] = useState(null);
    const [pharmacyName, setPharmacyName] = useState("");
    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [inn,setInn] = useState("");
    const [pharmacyPhoneNumber, setPharmacyPhoneNumber] = useState(null);
    const [error, setError] = useState('');
    const { fullPrice, orders, setOrders } = useStore();

    const { data } = useFetchRequest({
        queryKey: KEYS.region_list,
        endpoint: ENDPOINTS.region_list,
    });
    const { data: districts } = useFetchRequest({
        queryKey: `${KEYS.district_list}_${region?.id}`,
        endpoint: `${ENDPOINTS.district_list}/${region?.id}`,
        enabled: !!region
    });
    const { data: pharmacies, refetch } = useFetchRequest({
        queryKey: `${KEYS.pharmacy_list}_${district?.id}`,
        endpoint: `${ENDPOINTS.pharmacy_list}/${district?.id}`,
        params: { search },
        enabled: !!district
    });

    useEffect(() => {
        refetch();
    }, [search]);

    const { mutate, isPending } = usePostQuery({});
    const handleSubmit = () => {
        const products = Object.values(orders)?.map(order => ({
            productId: order?.id,
            quantity: order?.count
        }));
        if (products && products?.length > 0) {
            mutate({
                endpoint: ENDPOINTS.orderAdd,
                attributes: {
                    districtId: district?.id,
                    pharmacyPhoneNumber,
                    pharmacyName,
                    pharmacyAddress,
                    inn,
                    pharmacyId: pharmacy?.id,
                    totalPrice: fullPrice,
                    products
                }
            }, {
                onSuccess: (res) => {
                    if (get(res,'data') == "Order limit exceeded") {
                        setError(get(res,'data'))
                    }else {
                        setOrders({});
                        router.push("/orders");
                    }
                },
                onError: (err) => {
                    console.log(err, 'err');
                },
            })
        }
    };

    const handleOpenRegionSheet = () => {
        setOpenRegion(true);
        regionRef.current?.present();
    };

    const handleCloseRegionSheet = () => {
        setOpenRegion(false);
        regionRef.current?.dismiss();
    };

    const handleOpenDistrictsSheet = () => {
        setOpenDistrict(true);
        districtRef.current?.present();
    };

    const handleCloseDistrictsSheet = () => {
        setOpenDistrict(false);
        districtRef.current?.dismiss();
    };

    const handleOpenPharmacySheet = () => {
        setOpenPharmacy(true);
        pharmacyRef.current?.present();
    };

    const handleClosePharmacySheet = () => {
        setOpenPharmacy(false);
        pharmacyRef.current?.dismiss();
    };

    const RenderedItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                if (openRegion) {
                    setRegion(item);
                    setDistrict(null);
                    setPharmacy(null);
                    handleCloseRegionSheet();
                } else if (openDistrict) {
                    setDistrict(item);
                    setPharmacy(null);
                    handleCloseDistrictsSheet();
                } else {
                    setPharmacy(item);
                    handleClosePharmacySheet();
                }
            }}
            style={styles.listItem}
        >
            <View>
                <Text style={styles.itemText}>{item?.name}</Text>
                {item?.address && <Text style={styles.itemAddress}>{item?.address}</Text>}
            </View>
            {(openRegion && region?.id === item?.id) ||
            (openDistrict && district?.id === item?.id) ||
            (openPharmacy && pharmacy?.id === item?.id) ? (
                <AntDesign name="check" size={24} color="#246BB2" />
            ) : null}
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <BaseBottomSheet bottomSheetRef={regionRef} snap={"90%"}>
                        <View style={styles.sheetContainer}>
                            <Text style={styles.sheetTitle}>{t("Viloyatni tanlang")}</Text>
                            <FlatList data={data} renderItem={({ item }) => <RenderedItem item={item} />} keyExtractor={item => item?.id} />
                        </View>
                    </BaseBottomSheet>

                    <BaseBottomSheet bottomSheetRef={districtRef} snap={"90%"}>
                        <View style={styles.sheetContainer}>
                            <Text style={styles.sheetTitle}>{t("Tumanni tanlang")}</Text>
                            <FlatList data={districts} renderItem={({ item }) => <RenderedItem item={item} />} keyExtractor={item => item?.id} />
                        </View>
                    </BaseBottomSheet>

                    <BaseBottomSheet bottomSheetRef={pharmacyRef} snap={"90%"}>
                        <View style={styles.sheetContainer}>
                            <View style={styles.searchContainer}>
                                <Input
                                    variant="unstyled"
                                    style={styles.searchInput}
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
                            <FlatList data={pharmacies} renderItem={({ item }) => <RenderedItem item={item} />} keyExtractor={item => item?.id} />
                        </View>
                    </BaseBottomSheet>

                    <Ionicons name="arrow-back" size={24} color="#215ca0" onPress={() => router.back()} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{t("Dorixonani haqida")}</Text>
                        <Text style={styles.headerSubtitle}>
                            {t("Dorixonaga tegishli boʻlgan maʻlumotlar bilan maydonlarni toʻldiring")}
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={handleOpenRegionSheet}>
                            <Input
                                style={styles.input}
                                placeholder={t("Viloyati")}
                                value={region ? `${t("Tanlangan viloyat:")} ${region?.name}` : ''}
                                variant="unstyled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                isReadOnly
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={styles.iconRight} />}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleOpenDistrictsSheet}>
                            <Input
                                style={styles.input}
                                placeholder={t("Tumani")}
                                value={district ? `${t("Tanlangan tuman:")} ${district?.name}` : ''}
                                variant="unstyled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                isReadOnly
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={styles.iconRight} />}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleOpenPharmacySheet}>
                            <Input
                                style={styles.input}
                                placeholder={t("Dorixona nomi")}
                                value={pharmacy?.name ? pharmacy?.name : pharmacyName}
                                onChangeText={(text) => {
                                    if (!!pharmacy) {
                                        setPharmacy(null)
                                    }
                                    setPharmacyName(text ? text : "")
                                }}
                                variant="unstyled"
                                backgroundColor="#B4C0CC29"
                                borderRadius={10}
                                InputRightElement={<Ionicons name="chevron-forward" size={20} style={styles.iconRight} />}
                            />
                        </TouchableOpacity>

                        <Input
                            style={styles.input}
                            placeholder={t("Dorixona manzili")}
                            value={pharmacy?.address ? pharmacy?.address : pharmacyAddress}
                            onChangeText={(text) => setPharmacyAddress(text ? text : "")}
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                        />

                        <Input
                            style={styles.input}
                            placeholder={t("Dorixona inn")}
                            value={pharmacy?.inn ? pharmacy?.inn : inn}
                            onChangeText={(text) => setInn(text ? text : "")}
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                        />

                        <Input
                            style={styles.input}
                            placeholder={t("Telefon raqami")}
                            onChangeText={(value) => setPharmacyPhoneNumber(value)}
                            value={pharmacyPhoneNumber}
                            keyboardType="phone-pad"
                            variant="unstyled"
                            backgroundColor="#B4C0CC29"
                            borderRadius={10}
                        />
                    </View>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.errorTitle}>
                            {error && !isEmpty(error) && t(error)}
                        </Text>
                    </View>

                    <View style={styles.submitButtonContainer}>
                        <Button
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            isLoading={isPending}
                            isDisabled={isPending || !district || !region || !pharmacyPhoneNumber}
                        >
                            <Text style={styles.submitButtonText}>
                                {t("Arizani yuborish")}
                            </Text>
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
        backgroundColor: "white",
        padding: 16,
    },
    sheetContainer: {
        padding: 16,
    },
    sheetTitle: {
        fontFamily: "ALSSiriusBold",
        fontSize: 20,
        marginBottom: 8,
    },
    listItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#919DA63D",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemText: {
        fontSize: 15,
        fontFamily: "ALSSiriusRegular",
    },
    itemAddress: {
        color: "#919DA6",
        fontFamily: "ALSSiriusRegular",
        fontSize: 13,
    },
    headerTextContainer: {
        marginTop: 12,
    },
    headerTitle: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 4,
        fontFamily: "ALSSiriusBold",
    },
    headerSubtitle: {
        fontSize: 15,
        color: "#656E78",
        fontFamily: "ALSSiriusRegular",
    },
    errorTitle: {
        fontSize: 15,
        color: "#c80909",
        fontFamily: "ALSSiriusRegular",
        textAlign: "center",
    },
    inputContainer: {
        marginTop: 24,
        gap: 16,
    },
    input: {
        height: 56,
        paddingHorizontal: 16,
        marginBottom: 4,
        fontSize: 15,
        color: "#292C30",
    },
    iconRight: {
        marginRight: 18,
    },
    searchContainer: {
        backgroundColor: "#f0f0f0",
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    searchInput: {
        color: "#656E78",
        fontSize: 15,
    },
    submitButtonContainer: {
        position: "absolute",
        left: 0,
        top: Dimensions.get("window").height - 160,
        width: Dimensions.get("window").width,
        height: 76,
        padding: 12,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#919DA63D",
    },
    submitButton: {
        backgroundColor: "#215ca0",
        width: "100%",
        height: 44,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: {
        color: "white",
        fontFamily: "ALSSiriusMedium",
        fontSize: 16,
    },
});

export default Company;
