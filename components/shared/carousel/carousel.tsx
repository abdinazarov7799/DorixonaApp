import React, { useRef } from "react";
import {
	View,
	Text,
	FlatList,
	Animated,
	Dimensions,
	Image,
	NativeSyntheticEvent,
	NativeScrollEvent,
	ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");

type Card = {
	id: number;
	name: string;
	number: string;
	imageUrl?: string;
};

type CardCarouselProps = {
	activeIndex: number;
	setActiveIndex: (index: number) => void;
	myCards: Card[];
};

const CardCarousel = ({ activeIndex, setActiveIndex, myCards }: CardCarouselProps) => {
	const scrollX = useRef(new Animated.Value(0)).current;

	const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const index = Math.floor(event.nativeEvent.contentOffset.x / (width - 57));
		setActiveIndex(index);
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Carousel */}
			<FlatList
				data={myCards}
				keyExtractor={(item) => item.id.toString()}
				horizontal
				pagingEnabled
				contentContainerStyle={{
					gap: 8,
					paddingHorizontal: 16,
					paddingVertical: 12,
				}}
				showsHorizontalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false }
				)}
				onMomentumScrollEnd={onMomentumScrollEnd}
				renderItem={({ item: { name, number, imageUrl } }) => (
					<View
						style={{
							width: width - 48,
							flexDirection: "row",
							alignItems: "center",
							borderRadius: 12,
							backgroundColor: "white",
							padding: 16,
							flex: 1,
						}}
					>
						<View>
							<Text style={{ fontSize: 13, color: "#656E78" }}>
								{name} ····{String(number).slice(-4)}
							</Text>
						</View>
						<View style={{ height: 32, width: 48, marginLeft: "auto" }}>
							<Image
								resizeMode="contain"
								style={{ height: "100%", width: "100%" }}
								source={
									imageUrl
										? { uri: imageUrl }
										: number?.substring(0, 4) === "8600"
											? require("@/assets/images/uzcard.png")
											: require("@/assets/images/humo.png")
								}
							/>
						</View>
					</View>
				)}
			/>

			{/* Dots Indicator */}
			<View style={{ flexDirection: "row", marginTop: 8, alignSelf: "center" }}>
				{myCards.map((_, i) => (
					<View
						key={i}
						style={[
							$dot,
							{
								backgroundColor: i === activeIndex ? "black" : "gray",
							},
						]}
					/>
				))}
			</View>
		</View>
	);
};

const $dot: ViewStyle = {
	height: 8,
	width: 8,
	marginHorizontal: 4,
	borderRadius: 4,
};

export default CardCarousel;
