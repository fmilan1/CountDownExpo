import * as React from 'react';
import { useState, } from 'react';
import { 
    Text, 
    View, 
    StyleSheet,
    TouchableOpacity,
    Modal,
    Button,
    Dimensions,
    SectionListComponent
} from 'react-native';


// import CountDown from 'react-native-countdown-component';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faPalette, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

import {AsyncStorage, useAsyncStorage} from '@react-native-async-storage/async-storage';

import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, PreviewText } from 'reanimated-color-picker';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';




const SCREEN_WIDTH = Dimensions.get('window').width;
const OFFSET = SCREEN_WIDTH * 0.2;

export default Event = (props) => {
    
    
    const [date, setDate] = useState(new Date(2024, 4, 5));
    const [showDatePicker, setDatePickerShow] = useState(false);
    const [showColorPicker, setColorPickerShow] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [title, setName] = useState(props.title);

    const [color, setColor] = useState(props.color);
    const [lastColor, setLastColor] = useState(props.color);

        
    const opacity = useSharedValue(0);
    const swipeGesture = Gesture.Pan();
    const translateX = useSharedValue(0);
    const heightValue = useSharedValue(100);
    let startTranslationX = 0;
    const margin = useSharedValue(15);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
        height: heightValue.value,
        backgroundColor: color,
        marginTop: margin.value,
    }))

    swipeGesture.onBegin((e) => {
        startTranslationX = translateX.value;
    });

    swipeGesture.onUpdate((e) => {
        if (expanded) return;
        translateX.value = startTranslationX + e.translationX;
        opacity.value = interpolate(-translateX.value, [0, OFFSET], [0, 1])
    });
    
    swipeGesture.onEnd((e) => {

        

        if (-translateX.value < OFFSET)
            translateX.value = withSpring(0);
        else
            translateX.value = withSpring(-OFFSET)

        if (-translateX.value > OFFSET * 3) {
            handleDelete();
        }
    });

    
    
    
    



    React.useEffect(() => {
        heightValue.value = withTiming(expanded ? 300 : 100);
    }, [expanded])

    
    onColorChange = (newColor) => {
        setColor(newColor.hex);
    }
    
    onColorChangeComplete = (newColor) => {
        setLastColor(newColor.hex);
    }


    const [canDelete, setCanDelete] = useState(false);
    

    const doDelete = () => {
        setCanDelete(true);
    }
    
    const handleDelete = () => {
        opacity.value = 0;
        heightValue.value = withTiming(0);
        margin.value = withTiming(0);
        translateX.value = withTiming(-SCREEN_WIDTH, {duration: 300 }, (finished) => {
            if (finished)
                runOnJS(doDelete)();
            
        });
        
    }

    React.useEffect(() => {
        if (canDelete)
            props.onDelete(props.created);
    }, [canDelete])
    
    
    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={swipeGesture}>
                <View>
                    <Animated.View style={[styles.eventContainer, animatedStyle]}>
                        <View style={styles.header}>

                            <Text>
                                {title}
                            </Text>
                            
                            {/* <CountDown 
                                until={calcTimeLeft(date)}
                                timeLabels={{}}
                                onPress={() =>  setDatePickerShow(true)  }
                                size={13}
                                digitStyle={{width: 50, height: 60, borderWidth: 3, borderRadius: 7}}
                            /> */}
                            <TouchableOpacity
                                onPress={() => { setExpanded(!expanded); }}
                                style={styles.button}
                            >
                                <FontAwesomeIcon icon={faAngleDown} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.settingsContainer}>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {setColorPickerShow(true)}}
                                >
                                    <FontAwesomeIcon icon={faPalette} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        
                            
                        

                        <Modal visible={showColorPicker} animationType='slide' statusBarTranslucent={true} >
                            <View style={{alignItems: 'center', backgroundColor: color, flex: 1, justifyContent: 'center'}}>
                                <View style={{backgroundColor: 'white', width: '70%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 5}}>

                                    <ColorPicker style={{width: '100%'}} value={lastColor} onChange={onColorChange} onComplete={onColorChangeComplete}>
                                        <Panel1 style={{borderRadius: 13, marginBottom: 20}} />
                                        <HueSlider style={{borderRadius: 20, marginBottom: 20}}  />
                                        <PreviewText style={{marginBottom: 20}} />
                                    </ColorPicker>
                            
                                    <TouchableOpacity 
                                        onPress={() => {setColorPickerShow(false)}} 
                                        style={{width: 70, height: 40, backgroundColor: '#1988ff', justifyContent: 'center', alignItems: 'center', borderRadius: 20, }}>
                                            <Text style={{color: 'white'}}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </Animated.View>

                    <Animated.View style={{marginTop: 15, position: 'absolute', right: 6, height: 100, opacity: opacity, justifyContent: 'center', alignItems: 'center', width: Math.abs(OFFSET), zIndex: -1}}>
                        <TouchableOpacity
                            onPress={handleDelete}
                        >
                            <FontAwesomeIcon icon={faTrashCan} color='red' size={40}/>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                
            </GestureDetector>
        </GestureHandlerRootView>
    );  
};

function calcTimeLeft(fromDate) {
    var timeleft = fromDate.getTime() - new Date().getTime(); // in milliseconds

    return timeleft / 1000;
}


const styles = StyleSheet.create({
    eventContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        height: 100,
        // borderWidth: 1
        marginHorizontal: 15,
    },
    button: {
        width: 25,
        aspectRatio: '1/1',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        marginHorizontal: 5,
    },
    settingsContainer: {
        marginHorizontal: 5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 195
    },
});
