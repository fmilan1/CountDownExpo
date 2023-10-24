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

  
  const handleDelete = (created) => {
    setEventList((prevlist) => prevlist.filter((event) => event.props.created !== created));
  }
  

  React.useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      const {newEvent} = route.params;
      if (newEvent !== null) {
        const createdDate = Date.now();
        setEventList([...eventList, <Event onDelete={handleDelete} color={newEvent.color} key={createdDate} created={createdDate} />])
        route.params = {newEvent: null}
      }
    })
    return focus;
  })
  
  useFocusEffect(() => {
    
  })


  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <ScrollView>
        {eventList}
      </ScrollView>
      
      <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'white', elevation: 5, position: 'absolute', bottom: 20, right: 20, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}} 
        onPress={() => { 
          navigation.navigate('New Event');
          
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
