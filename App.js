import { AppRegistry, Button, View } from 'react-native';

import React from 'react';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';


import HomeScreen from './screens/Home';
import NewEvent from './screens/NewEvent'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();
  
  return (
    // <View>
    //   {/* <Text>kecske</Text> */}
    //   <Event/>
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} initialParams={{newEvent: null}} />
        <Stack.Screen name='New Event' component={NewEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});

export default App;
