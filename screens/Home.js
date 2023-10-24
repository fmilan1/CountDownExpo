import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Event from '../components/Event';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { fa0, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FlatList } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';


const HomeScreen = ({ navigation, route }) => {

  const [eventList, setEventList] = useState([]);
  const [events, setEvent] = useState(0);

  
  const handleDelete = (id) => {
    // setEventList();
    // console.log(id);
    // route.params.events = (route.params.events).filter((event) => event.props.id !== id);
  }
  
  
  useFocusEffect(() => {
    console.log(route.params.events.length);
    // if ((route.params.events).length == 0) return
    // console.log('hahaha     ', route.params.events[0].props);
    
  })


  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <ScrollView>
        {route.params.events}
      </ScrollView>
      
      <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'white', elevation: 5, position: 'absolute', bottom: 20, right: 20, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}} 
        onPress={() => { 
          navigation.navigate('New Event', {
            events: route.params.events,
            onDelete: handleDelete,
            newEventId: events
          });
          
      }}>
        <Text style={{fontSize: 30}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
