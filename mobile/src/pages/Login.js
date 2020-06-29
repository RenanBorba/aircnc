import React, { useState, useEffect } from 'react';
import
  {
    AsyncStorage,
    View,
    KeyboardAvoidingView,
    Platform,
    Image,
    Text,
    TextInput,
    TouchableOpacity
  } from 'react-native';

import api from '../services/api';
import logo from '../assets/logo.png';
import styles from './styles/loginStyles';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      // Verificar se usuário já efetuou login
      if(user) {
        navigation.navigate('List');
      }
    })
  }, []);

  async function handleSubmit() {
    // email, tehs
    const response = await api.post('/sessions', {
      email
    })

    const { _id } = response.data;

    // Acesso ao LocalStorage
    await AsyncStorage.setItem('user', _id);
    await AsyncStorage.setItem('techs', techs);

    // Navegação a partir das rotas
    navigation.navigate('List');
  }

  return (
    // Alinhar teclado abaixo aos campos
    <KeyboardAvoidingView  enabled={Platform.OS === 'android' || Platform.OS === 'ios'}
      behavior="padding" style={styles.container}>
    <Image source={ logo } />
      <View style={styles.form}>
        <Text style={styles.label}>SEU E-MAIL *</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#999"
          // Tipo teclado
          keyboardType="email-address"
          // Caixa alta teclado
          autoCapitalize="none"
          // Auto Correção
          autoCorrect={false}
          value={ email }
          onChangeText={ setEmail }
        />

        <Text style={styles.label}>TECNOLOGIAS *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tecnologias de interesse"
          placeholderTextColor="#999"
          // Caixa alta apenas nas palavras
          autoCapitalize="words"
          autoCorrect={false}
          value={ techs }
          onChangeText={ setTechs }
        />

        {/* TouchableOpacityButton reduz opacidade ao ser clicado */}
        <TouchableOpacity onPress={ handleSubmit } style={styles.button}>
          <Text style={styles.buttonText}>Encontrar spots</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};