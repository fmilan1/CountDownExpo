import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Event from '../components/Event';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({ navigation, route }) => {

  const [eventList, setEventList] = useState([]);

  const handleDelete = async (created) => {
    setEventList((prevlist) => {
      const idx = prevlist.findIndex(e => e.created == created);
      const removed = prevlist.splice(idx, 1);
      return [...prevlist]
    });
  }

  const logEventList = () => {
    console.log(eventList);

  }

  const createNewEvent = (color, created, date, title) => {
    setEventList([...eventList, { color: color, created: created, date: date, title: title }]);
  }

  const loadFromAsyncStorage = async () => {
    const val = await AsyncStorage.getItem('eventList');
    if (val === null) return;
    setEventList(JSON.parse(val));
  }

  React.useEffect(() => {
    loadFromAsyncStorage();
  }, [])


  const saveEventList = async () => {
    await AsyncStorage.setItem('eventList', JSON.stringify(eventList));
  }

  React.useEffect(() => {
    saveEventList();
  }, [eventList]);

  React.useEffect(() => {

    const { newEvent } = route.params;
    if (newEvent == 'edit') {
      let tmpIndex = eventList.findIndex(e => e.created == route.params.created);
      setEventList((prevlist) => {
        prevlist[tmpIndex] = { color: route.params.color, created: route.params.created, date: route.params.date, title: route.params.title }
        return [...(Array.from(prevlist))];
      });
    } else if (newEvent !== null) {
      const createdDate = new Date().getTime();
      createNewEvent(newEvent.color, createdDate, newEvent.date, newEvent.title);
    }
    route.params = { newEvent: null }
  })





  return (
    <View style={[styles.container, {alignItems: eventList.length === 0 ? 'center' : ''}]}>
      {
        eventList.length === 0 &&
        <Text
          style={{ textAlign: 'center', width: '60%', fontSize: 20 }}
        >You don't have any event! Tap the + button to create one!</Text>
      }
      {
        eventList.length > 0 &&
        <FlatList
          data={eventList}
          renderItem={({ item }) =>

            <Event onDelete={handleDelete} key={item.created} created={item.created} color={item.color} title={item.title} date={item.date} />

          }
          keyExtractor={(item, index) => (index)}

          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          style={{
            paddingTop: 15,
          }}
        />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
