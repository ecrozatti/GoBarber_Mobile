import React, { useRef, useCallback } from 'react';
// KeyboardAvoidingView -> evita que teclado fique por cima dos campos
// PLatform -> retorna a plaforma que está rodando o app
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

// nao eh necessario informar 2x, 3x, ...
// para usar sem erro, eh necessario configurar como um modulo (src/@types/index.d.ts)
import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignInButton, BackToSignInButtonText } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwrodInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      // zera os erros
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(4, 'No mínimo 4 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com sucesso',
        'Você já pode fazer login na aplicação.'
      );

      navigation.goBack();
    } catch (error) {
      // Se fizer parte dos erros de validacao do YUP
      if (error instanceof Yup.ValidationError) {
        // utiliza nossa funcao criada na pasta UTIL para montar os erros
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        return; // para nao continuar processando
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao cadastrar, tente novamente.'
      );
    }
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        enabled
      >
        {/* Scroll para telas pequenas, principalmente qdo o telcado está aberto */}
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            {/* Para a animação do teclado funcionar, cercar todo Text por uma View. */}
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                // Primeira letra maiúscula em cada palavra
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwrodInputRef.current?.focus()}
              />
              <Input
                ref={passwrodInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                // determina que o campo é para crição de senha
                // e não sugere um senha (padrão do ios)
                // oneTimeCode -> usando esse valor, caso a senha chegue via SMS, ele utiliza automaticamente
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>
            <Button onPress={() => formRef.current?.submitForm()}>
              Cadastrar
            </Button>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton onPress={() => {
        navigation.goBack()
      }}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
