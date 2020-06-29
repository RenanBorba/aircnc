import React, { useState } from 'react';
import { AsyncStorage, Text, TouchableOpacity, Alert }
  from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import api from '../services/api';
import SafeAreaView from '../components/SafeAreaView';
import styles from './styles/bookStyles';

export default function Book({ navigation }) {
  const id = navigation.getParam('id');
  const [date, setDate] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const user_id = await AsyncStorage.getItem('user');

    await api.post(`/spots/${id}/bookings`, {
      date
    }, {
      headers: { user_id }
    })

    Alert.alert('Solicitação de reserva enviada!');

    navigation.navigate('List');
  }

  async function handleCancel() {
    navigation.navigate('List');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>DATA DE INTERESSE *</Text>
        <TextInputMask
          placeholder="Qual data você quer reservar?"
          placeholderTextColor="#999"
          keyboardType={'numeric'}
          autoCorrect={false}
          type={'datetime'}
          options={{
            mask: "DD / MM / YYYY"
          }}
          value={ date }
          onChangeText={ setDate }
          style={styles.input}
        />

        <TouchableOpacity onPress={ handleSubmit } style={styles.button}>
          <Text style={styles.buttonText}>Solicitar reserva</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ handleCancel } style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};