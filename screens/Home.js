import * as React from 'react';
import { useState } from 'react';
import { StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Event from '../components/Event';
import { FlatList } from 'react-native';


const HomeScreen = ({ navigation, route }) => {

  const [eventList, setEventList] = useState([]);
  
  const handleDelete = (created) => {
    setEventList((prevlist) => {
      const idx = prevlist.findIndex(e => e.created == created);
      const removed = prevlist.splice(idx, 1);
      return [...prevlist]
    })
  }
  
  const createNewEvent = (color, created, date, title) => {
    setEventList([...eventList, {handleDelete: handleDelete, color: color, created: created, date: date, title: title}]);
  }

  React.useEffect( () => {
    const focus = navigation.addListener('focus', () => {
      const {newEvent} = route.params;
      if (newEvent == 'edit') {
        let tmpIndex = eventList.findIndex(e => e.created == route.params.created);
        setEventList((prevlist) => {
          prevlist[tmpIndex] = {handleDelete: handleDelete, color: route.params.color, created: route.params.created, date: route.params.date, title: route.params.title}
          return [...(Array.from(prevlist))];
        });
      } else if (newEvent !== null) {
        const createdDate = new Date().getTime();
        createNewEvent(newEvent.color, createdDate, newEvent.date, newEvent.title);
      }
      route.params = {newEvent: null}
    });

    return focus;
    

  })


  return (
    <View style={styles.container}>

      <FlatList
        data={eventList}
        renderItem={({item}) => 
          
          <Event onDelete={item.handleDelete} key={item.created} created={item.created} color={item.color} title={item.title} date={item.date} />
          
        }
        keyExtractor={(item, index) => (index)}
        
        ItemSeparatorComponent={() => <View style={{height: 15}} />}
      />
      
      <TouchableOpacity style={{width: 50, height: 50, backgroundColor: 'white', elevation: 5, position: 'absolute', bottom: 20, right: 20, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}} 
        onPress={() => { 
          navigation.navigate('New Event', {newEvent: null});
          
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
