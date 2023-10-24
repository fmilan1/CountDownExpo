import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, PreviewText } from 'reanimated-color-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons';


const NewEvent = ({ navigation }) => {

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [colorPickerModalVisible, setColorPickerModalVisible] = useState(false);

  const now = new Date(Date.now());
  const [date, setDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1));
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('cadetblue');
  const [lastColor, setLastColor] = useState('cadetblue');

  const onChangeText = (text) => {
    setTitle(text);
  }

  const onColorChange = (newColor) => {
    setColor(newColor.hex);
  }

  const onColorChangeComplete = (newColor) => {
    setLastColor(newColor.hex);
  }

  return (

    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <View style={{ justifyContent: 'space-between', backgroundColor: 'white', width: '80%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 5 }}>

        <View
          style={[styles.row, { marginTop: 0 }]}
        >
          <TextInput
            style={styles.textinput}
            placeholder='Title of event'
            onChangeText={onChangeText}
          />
        </View>

        <View
          style={styles.row}
        >
          <Text>{date.toLocaleDateString()}</Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'transparent'}]}
            onPress={() => setDateModalVisible(true)}
          >
            <FontAwesomeIcon icon={faPen} />
          </TouchableOpacity>
        </View>

        <View
          style={styles.row}
        >
          <Text>{date.toLocaleTimeString()}</Text>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'transparent'}]}
            onPress={() => setTimeModalVisible(true)}
          >
            <FontAwesomeIcon icon={faPen} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.button, {backgroundColor: color, alignSelf: 'flex-end', marginTop: 5}]}
          onPress={() => setColorPickerModalVisible(true)}
        >
          <FontAwesomeIcon icon={faPen} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { newEvent: { color: color, date: date.getTime(), title: title } })}
          style={[styles.button, { width: 70 }]}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>



      <DateTimePickerModal
        isVisible={dateModalVisible}
        date={date}
        onConfirm={(selectedDate) => {
          const currentDate = selectedDate || date;
          setDate(currentDate);
          setDateModalVisible(false);
        }}
        onCancel={() => setDateModalVisible(false)}

      />

      <DateTimePickerModal
        mode='time'
        isVisible={timeModalVisible}
        date={date}
        onConfirm={(selectedDate) => {
          const currentDate = selectedDate || date;
          setDate(currentDate);
          setTimeModalVisible(false);
        }}
        onCancel={() => setTimeModalVisible(false)}

      />

      <Modal visible={colorPickerModalVisible} animationType='slide' statusBarTranslucent={true} >
        <View style={{ alignItems: 'center', backgroundColor: color, flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', width: '70%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 5 }}>

            <ColorPicker style={{ width: '100%' }} value={lastColor} onChange={onColorChange} onComplete={onColorChangeComplete} >
              <Panel1 style={{ borderRadius: 13, marginBottom: 20 }} />
              <HueSlider style={{ borderRadius: 20, marginBottom: 20 }} />
              <PreviewText style={{ marginBottom: 20 }} />
            </ColorPicker>

            <TouchableOpacity
              onPress={() => { setColorPickerModalVisible(false) }}
              style={{ width: 70, height: 40, backgroundColor: '#1988ff', justifyContent: 'center', alignItems: 'center', borderRadius: 20, }}>
              <Text style={{ color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

  );
};

export default NewEvent;

const styles = StyleSheet.create({
  container: {
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#1988ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    alignItems: 'center',
    marginTop: 5,
  },
  textinput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  }
});
