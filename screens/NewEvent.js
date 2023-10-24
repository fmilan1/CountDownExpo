import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, Button } from 'react-native';
import Event from '../components/Event';

const NewEvent = ({ navigation, route }) => {

  const [data, setData] = useState({})
  
  return (
    <View>
      {/* {console.log(route.params)} */}
      <TouchableOpacity onPress={() => navigation.navigate('Home', { newEvent: { color: 'red' } } )}>
        <Text>New</Text>
      </TouchableOpacity>


      {/* <TouchableOpacity onPress={() => navigation.navigate('Home', {make: false})}>
        <Text>Back</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default NewEvent;

const styles = StyleSheet.create({
  container: {
  },
});
