import { AppRegistry, Button, View } from 'react-native';

import React from 'react';
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Text
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


import HomeScreen from './screens/Home';
import NewEvent from './screens/NewEvent'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';



function App() {

  
  const isDarkMode = useColorScheme() === 'dark';
  
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          initialParams={{newEvent: null}}
          options={({navigation}) => ({
            headerRight: () => (
              <TouchableOpacity style={{height: 35, aspectRatio: 1.5, backgroundColor: 'white', elevation: 5, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowOpacity: .15, shadowOffset: {height: 1}}} 
                onPress={() => { 
                  navigation.navigate('New Event', {newEvent: null});
              
                }}
              >
                <Text style={{fontSize: 25}}>+</Text>
              </TouchableOpacity>)
          })} 
        />
        <Stack.Screen name='New Event' component={NewEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});

export default App;
