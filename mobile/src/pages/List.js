import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { AsyncStorage, ScrollView, Image, Alert }
  from 'react-native';

import SpotList from '../components/SpotList';
import SafeAreaView from '../components/SafeAreaView';
import logo from '../assets/logo.png';
import styles from './styles/listStyles';

export default function List() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio('http://192.168.177.2:3333', {
        query: { user_id }
      })

      socket.on('booking_response', booking => {
        Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved
          ? 'APROVADA' : 'REJEITADA'}`);
      })
    })
  }, []);

    useEffect(() => {
      AsyncStorage.getItem('techs').then(storagedTechs => {
        const techsArray = storagedTechs.split(',').map(tech => tech.trim());

        setTechs(techsArray);
      })
    }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={ logo } />

      <ScrollView>
        { techs.map(tech => <SpotList key={ tech } tech={ tech } />) }
      </ScrollView>
    </SafeAreaView>
  );
};