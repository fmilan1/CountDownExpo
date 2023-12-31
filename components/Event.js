import * as React from 'react';
import { useState, } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faPalette, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import Animated, { interpolate, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, PreviewText } from 'reanimated-color-picker';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

import CountDown from './CountDown';
import { useNavigation } from '@react-navigation/native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';


const SCREEN_WIDTH = Dimensions.get('window').width;
const OFFSET = SCREEN_WIDTH * 0.2;

export default Event = ({ drag, isActive, color, onDelete, title, created, date }) => {

    const navigation = useNavigation();

    const trashOpacity = useSharedValue(0);
    const penOpacity = useSharedValue(0);
    const swipeGesture = Gesture.Pan();
    const translateX = useSharedValue(0);
    const heightValue = useSharedValue(100);
    let startTranslationX = 0;
    const margin = useSharedValue(15);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        height: heightValue.value,
        backgroundColor: color,
    }))

    swipeGesture.minDistance(25)
    // swipeGesture.activeOffsetX([20, -20])
    // swipeGesture.ma

    swipeGesture.onBegin((e) => {
        startTranslationX = translateX.value;
    });

    swipeGesture.onUpdate((e) => {
        // if (isActive) return;
        translateX.value = startTranslationX + e.translationX;
        trashOpacity.value = interpolate(-translateX.value, [0, OFFSET], [0, 1])
        penOpacity.value = interpolate(translateX.value, [0, OFFSET], [0, 1])
    });

    swipeGesture.onEnd((e) => {
        if (translateX.value > OFFSET) translateX.value = withSpring(OFFSET);
        else if (-translateX.value < OFFSET) translateX.value = withSpring(0);
        else translateX.value = withSpring(-OFFSET);

        if (-translateX.value > OFFSET * 3)  handleDelete();
        else if (translateX.value > OFFSET * 3)  handleEdit();

    });

    const [canDelete, setCanDelete] = useState(false);


    const doDelete = () => {
        setCanDelete(true);
    }

    const handleDelete = () => {
        trashOpacity.value = 0;
        penOpacity.value = 0;
        heightValue.value = withTiming(0);
        margin.value = withTiming(0);
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 }, (finished) => {
            if (finished)
                runOnJS(doDelete)();
        });
    }

    const handleEdit = () => {
        navigation.navigate('New Event', { newEvent: 'edit', created: created, date: date, color: color, title: title });
        translateX.value = withSpring(0);
    }

    React.useEffect(() => {
        if (canDelete)
            onDelete(created);
    }, [canDelete])

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={swipeGesture}>
                <ScaleDecorator>

                    <TouchableOpacity
                        onLongPress={() => {
                            // swipeGesture.manualActivation(true)
                            drag();
                        }}
                        
                        disabled={isActive}
                        // disabled={true}
                        activeOpacity={1}
                        
                    >

                        <Animated.View style={{ position: 'absolute', left: 6, height: 100, opacity: penOpacity, justifyContent: 'center', alignItems: 'center', width: Math.abs(OFFSET), zIndex: -1 }}>
                            <TouchableOpacity
                                onPress={handleEdit} >
                                <FontAwesomeIcon icon={faPen} color='rgb(100, 255, 0)' size={40} />
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View style={[styles.eventContainer, animatedStyle]}>
                            <View style={{ width: 0, flex: 1, flexGrow: 1 }}>
                                <Text style={styles.text}>
                                    {title}
                                </Text>
                            </View>

                            <CountDown
                                until={date}
                                color={color}
                            />

                        </Animated.View>

                        <Animated.View style={{ position: 'absolute', right: 6, height: 100, opacity: trashOpacity, justifyContent: 'center', alignItems: 'center', width: Math.abs(OFFSET), zIndex: -1 }}>
                            <TouchableOpacity
                                onPress={handleDelete}
                            >
                                <FontAwesomeIcon icon={faTrashCan} color='red' size={40} />
                            </TouchableOpacity>
                        </Animated.View>
                    </TouchableOpacity>
                </ScaleDecorator>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    eventContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        height: 100,
        justifyContent: 'space-between',
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button: {
        width: 25,
        aspectRatio: '1/1',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        flexShrink: 1,
        marginRight: 15,
    }
});
