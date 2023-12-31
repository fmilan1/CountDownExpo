import React, { useEffect, useState } from 'react';

import {
    Text, View, StyleSheet
} from 'react-native'

const CountDown = ({until, color}) => {

    const calculateTimeLeft = () => {
        const now = new Date(Date.now()).getTime();
        const targetTime = until;
        const timeRemaining = targetTime - now;
    
        if (timeRemaining <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
    
        const seconds = Math.floor((timeRemaining / 1000) % 60);
        const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
        const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    
        return { days, hours, minutes, seconds };
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearInterval(timer);
      });
      
    return (
        <View style={styles.cardcontainer}>
            <View
                style={styles.card}
            >
                <Text style={styles.text}>{timeLeft.days}</Text>
                <Text style={[styles.placeholder, {backgroundColor: color}]}>D</Text>
            </View>
            <View
                style={styles.card}
            >
                <Text style={styles.text}>{timeLeft.hours}</Text>
                <Text style={[styles.placeholder, {backgroundColor: color}]}>H</Text>
            </View>
            <View
                style={styles.card}
            >
                <Text style={styles.text}>{timeLeft.minutes}</Text>
                <Text style={[styles.placeholder, {backgroundColor: color}]}>M</Text>
            </View>
            <View
                style={styles.card}
            >
                <Text style={styles.text}>{timeLeft.seconds}</Text>
                <Text style={[styles.placeholder, {backgroundColor: color}]}>S</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardcontainer: {
        flexDirection: 'row',
        gap: 3,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: .35,
    },
    card: {
        width: 35,
        height: 50,
        elevation: 5,
        borderRadius: 7,
        overflow: 'hidden',
    },
    text: {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
        fontWeight: 'bold',
        lineHeight: 50*.6
    },
    placeholder: {
        height: '40%',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    }
})

export default CountDown;