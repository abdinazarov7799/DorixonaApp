import {useRouter} from "expo-router";
import {Feather} from "@expo/vector-icons";

export const Bell = () => {
	const router = useRouter();
	const handleNavigate = () => {
		router.push("/notification");
	};
	return (
		<Feather
			size={28}
			style={{ marginBottom: -3, marginRight: 15 }}
			name={"bell"}
			color={"#215ca0"}
			onPress={handleNavigate}
		/>
	);
};
