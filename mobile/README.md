<div align="center">

## Rocketseat - Semana OmniStack 9.0
# Projeto Portfólio - Aplicação AirCnC Mobile React Native (AirCode n'Coffee)

</div>

<br>

<div align="center">
  
[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![Build Status](https://img.shields.io/github/forks/RenanBorba/aircnc.svg)](https://github.com/RenanBorba/aircnc) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![npm version](https://badge.fury.io/js/react-native.svg)](https://badge.fury.io/js/react-native) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

</div>

<br>

<div align="center">

![logo](https://user-images.githubusercontent.com/48495838/80022434-6f070e80-84b2-11ea-9125-7c281fad84e2.png)

</div>

<br>

Aplicação Front-end Mobile desenvolvida em React Native para clone do app AirBnB, voltada para locação de spots (locais) para devs, permitindo interação em tempo real (Web Socket) entre proprietário (web) e cliente (mobile).

<br><br>

<div align="center">

![000](https://user-images.githubusercontent.com/48495838/80156633-cc768a80-859a-11ea-8c0d-d621c7b9245b.jpg)

</div>

<br>

## :rocket: Tecnologias
<ul>
  <li>Expo</li>
  <li>Components</li>
  <li>Routes</li>
  <li>react-navigation</li>
  <li>Services API</li>
  <li>Axios</li>
  <li>AsyncStorage</li>
  <li>useState</li>
  <li>useEffect</li>
  <li>FlatList</li>
  <li>socket.io-client WebSocket</li>
  <li>Alert</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run start / npm start</li>
</ul>

<br><br><br>

## :mega: ⬇ Abaixo as principais estruturas e interfaces:

<br><br><br>

## src/routes.js
```js
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import List from './pages/List';
import Book from './pages/Book';

const Routes = createAppContainer (
  createSwitchNavigator({
    Login,
    List,
    Book
  })
);

export default Routes;
```


<br><br>


## src/services/api.js
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.177.2:3333'
});

export default api;
```


<br><br>


## src/components/SafeAreaView.js
```js
import React from 'react';
import
  {
    StyleSheet,
    StatusBar,
    Platform,
    SafeAreaView
  } from 'react-native';

export default props => (
  <SafeAreaView style={styles.AndroidSafeArea} { ...props } >
    { props.children }
  </SafeAreaView>
);

  const styles = StyleSheet.create({
    AndroidSafeArea: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  });
```


<br><br>


## src/components/SpotList.js
```js
import React, { useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import
  {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList
  } from 'react-native';

import api from '../services/api';
import styles from './styles/spotListStyles.js';

function SpotList({ tech, navigation }) {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    async function loadSpots() {
      const response = await api.get('/spots', {
        params: { tech }
      })
      setSpots(response.data);
    }

    loadSpots();
  }, []);

  function handleNavigate(id) {
    navigation.navigate('Book', { id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empresas que usam <Text style={styles.bold}>
        { tech }</Text></Text>

      <FlatList
        style={styles.list}
        data={ spots }
        keyExtractor={spot => spot._id}
        horizontal
        // Barra rolagem horizontal
        showsHorizontalScrollIndicator={false}
        // Como cada item vai ser renderizado na tela
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/* Uri Imagem */}
            <Image style={styles.thumbnail} source={{ uri: item.thumbnail_url }} />
            <Text style={styles.company}>{ item.company }</Text>
            <Text style={styles.price}>{ item.price ? `R$${item.price}/dia` : `GRATUITO` }</Text>
            <TouchableOpacity onPress={() => handleNavigate(item._id)} style={styles.button}>
              <Text style={styles.buttonText}>Solicitar reserva</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
};

export default withNavigation(SpotList);
```


<br><br>

## src/pages/Book.js
```js
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
```

<br><br>


## src/pages/List.js
```js
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
```


<br><br>


## src/pages/styles/listStyles.js
```js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 44
  }
});

export default styles;
```


<br><br><br><br>

## Login (Buscar por tecnologias)

![a](https://user-images.githubusercontent.com/48495838/77101439-0e3d6f80-69f6-11ea-88ed-752252a9b56b.jpg)
<br><br>


## Spot List (Locais disponíveis)

![b](https://user-images.githubusercontent.com/48495838/77101438-0da4d900-69f6-11ea-8fe5-d29567266531.jpg)
<br><br>


## Book (Reserva)

![c](https://user-images.githubusercontent.com/48495838/77101431-0c73ac00-69f6-11ea-84b4-d3a0e5d0a574.jpg)
<br><br>


## Solicitação de reserva

![00](https://user-images.githubusercontent.com/48495838/76796253-ce824800-67a9-11ea-905f-8a44cfda5819.jpg)
<br><br>


## Confirmação de reserva

![01](https://user-images.githubusercontent.com/48495838/76796250-cd511b00-67a9-11ea-8668-bd367bce6ee9.jpg)
