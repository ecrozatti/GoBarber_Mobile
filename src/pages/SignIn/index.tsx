import React, { useCallback, useRef } from 'react';
// KeyboardAvoidingView -> evita que teclado fique por cima dos campos
// PLatform -> retorna a plaforma que está rodando o app
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

// FormHandles -> são os métodos disponíveis para manipular um formulário
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

// nao eh necessario informar 2x, 3x, ...
// para usar sem erro, eh necessario configurar como um modulo (src/@types/index.d.ts)
import logoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAcountButton, CreateAcountButtonText } from './styles';

interface SignInData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  // terá as propriedades de um TextInput, nesse exemplo, a função focus()
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const { signIn } = useAuth();

  // console.log(user);

  const handleSignIn = useCallback(async (data: SignInData) => {
    try {
      // zera os erros
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      // history.push('/dashboard');
    } catch (error) {
      // Se fizer parte dos erros de validacao do YUP
      if (error instanceof Yup.ValidationError) {
        // utiliza nossa funcao criada na pasta UTIL para montar os erros
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        return; // para nao continuar processando
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, verifique suas credenciais.'
      );
    }
  }, [signIn]);

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
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                // correção do texto
                autoCorrect={false}
                // primeira letra maiúscula
                autoCapitalize="none"
                // tipo do teclado
                keyboardType="email-address"
                // Tipo do botão return do teclado
                returnKeyType="next"
                // ação do botão return do teclado
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                // Define como campo senha
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
            </Form>
            <Button onPress={() => {
                // utiliza o useRef para dar submit no formulário
                // O formRef pode estar vazio, por isso a interrogação
                formRef.current?.submitForm();
              }}>Entrar</Button>

            <ForgotPassword onPress={() => {}}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAcountButton onPress={() => {
        navigation.navigate('SignUp');
      }}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAcountButtonText>Criar uma conta</CreateAcountButtonText>
      </CreateAcountButton>
    </>
  );
};

export default SignIn;
