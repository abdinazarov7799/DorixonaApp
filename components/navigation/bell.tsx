import {useRouter} from "expo-router";
import {Feather} from "@expo/vector-icons";
import React from "react";
import {Badge, VStack} from "native-base";
import useStore from "@/store";
import {get} from "lodash";

export const Bell = () => {
	const router = useRouter();
	const user = useStore(state => get(state,'user'))
	const handleNavigate = () => {
		router.push("/notification");
	};
	return (
		<VStack>
			<Badge
				colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
				fontSize: 12
			}}>
				{get(user,'notification')}
			</Badge>
			<Feather
				size={28}
				style={{ marginBottom: -3, marginRight: 15 }}
				name={"bell"}
				color={"#215ca0"}
				onPress={handleNavigate}
			/>
		</VStack>
	);
};
