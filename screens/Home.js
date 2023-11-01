import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Event from '../components/Event';
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist"
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';


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


  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7]);

  const renderItem = ({ drag, item, isActive, asd, kascasd, a }) => {
    return (
      <TouchableOpacity
        onLongPress={drag}
        style={{ height: 50, aspectRatio: 5, backgroundColor: 'tomato', marginBottom: 2 }}
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  return (

    <View style={[styles.container, eventList.length === 0 ? { alignItems: 'center', justifyContent: 'center' } : {}]}>
      {
        eventList.length === 0 &&
        <Text
          style={{ textAlign: 'center', width: '60%', fontSize: 20 }}
        >You don't have any event! Tap the + button to create one!</Text>
      }
      {
        eventList.length > 0 &&
        <GestureHandlerRootView>
          <DraggableFlatList
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            renderPlaceholder={() => <View style={{ backgroundColor: 'tomato' }} />}
            data={eventList}
            keyExtractor={(item) => item.created}
            renderItem={({ item, drag, isActive }) =>
              <Event onDelete={handleDelete} drag={drag} key={item.created} isActive={isActive} created={item.created} color={item.color} title={item.title} date={item.date} />
            }
            onDragEnd={({ data }) => setEventList(data)}
            activationDistance={10}
          />
        </GestureHandlerRootView>
      }
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
