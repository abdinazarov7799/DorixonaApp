import React, {useEffect, useState} from 'react';
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {DOC_TYPES, ENDPOINTS, KEYS} from "@/constants";
import {get, head, isEmpty, isEqual, filter} from "lodash";
import {useTranslation} from "react-i18next";

const Index = ({
                   id, fileType = DOC_TYPES.incoming}: any) => {
    const {t} = useTranslation()
    const [file, setFile] = useState(null)
    const {data: files} = useFetchRequest({
        queryKey: `${KEYS.docflowFile}-${id}`, endpoint: `${ENDPOINTS.docflowFile}`, params: {
            include: 'src,srcRelative',
            'per-page': 100,
            page: 0,
            sort: '-id',
            [`filter[fileable_type][LIKE]`]: fileType,
            [`filter[fileable_id]`]: id
        }
    })
    useEffect(() => {
        if (!isEmpty(get(files, 'data', []))) {
            // @ts-ignore
            setFile(head(filter(get(files, 'data', []), (_file) => isEqual(get(_file, 'extension'), 'pdf'))))
        }
    }, [files]);

    return (
        <>

            {/*<View>*/}
            {/*    <Flex style={{backgroundColor: '#FAFAFA'}} px={2.5} py={2} direction={'row'} alignItems={'center'}*/}
            {/*          justifyContent={'space-between'}>*/}
            {/*        <View style={{width: '60%'}}>*/}
            {/*            <Text>*/}
            {/*                {t("Title")}*/}
            {/*            </Text>*/}
            {/*        </View>*/}
            {/*        <Center width={'20%'}>{t("Extension")}</Center>*/}
            {/*        <Center width={'20%'}>{t("Download")}</Center>*/}
            {/*    </Flex>*/}
            {/*    {*/}
            {/*        get(files, 'data', []).map((_file: any) => <TouchableOpacity key={get(_file, 'id')} onPress={() => {*/}
            {/*            if (isEqual(get(_file, 'extension'), 'pdf')) {*/}
            {/*                setFile(_file);*/}
            {/*            } else {*/}
            {/*                Linking.openURL(get(_file, 'src'))*/}
            {/*            }*/}
            {/*        }}><Flex key={get(_file, 'id')}*/}
            {/*                 bg={isEqual(get(_file, 'id'), get(file, 'id')) ? '#ECF6FE' : 'transparent'} px={2.5} py={2}*/}
            {/*                 direction={'row'}*/}
            {/*                 justifyContent={'space-between'}>*/}
            {/*            <View style={{width: '60%'}}>*/}
            {/*                <Text numberOfLines={1}*/}
            {/*                      className={clsx('text-xs')}>{get(_file, 'title')}</Text>*/}
            {/*            </View>*/}
            {/*            <Center width={'20%'}>{get(_file, 'extension')}</Center>*/}
            {/*            <Center width={'20%'}>*/}
            {/*                <TouchableOpacity onPress={() => {*/}
            {/*                    Linking.openURL(get(_file, 'src'))*/}
            {/*                }}>*/}
            {/*                    <Icon color={''} size={5}*/}
            {/*                          as={FontAwesome} name="download"/>*/}
            {/*                </TouchableOpacity>*/}
            {/*            </Center>*/}
            {/*        </Flex>*/}
            {/*        </TouchableOpacity>)*/}
            {/*    }*/}
            {/*</View>*/}
            {/*<ScrollView*/}
            {/*    nestedScrollEnabled={true}*/}
            {/*    style={{height: Dimensions.get("screen").height * 0.8}}*/}
            {/*    paddingBottom={50}*/}
            {/*>*/}
            {/*    {get(file, 'src') && <PdfViewer url={get(file, 'src')}/>}*/}
            {/*</ScrollView>*/}
        </>
    );
};

export default Index;