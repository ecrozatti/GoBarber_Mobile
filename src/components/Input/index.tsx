import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: {};
}

interface InputValueReference {
  value: string;
}

interface inputRef {
  focus(): void;
}

// const Input: React.FC<InputProps> = ({ name, icon, ...rest }) => {
const Input: React.RefForwardingComponent<inputRef, InputProps> = ({ name, icon, containerStyle = {}, ...rest }, ref) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // retorna se o campo está preenchido ou não
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  // através da ref acessamos o componente pai
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    }
  }));

  // Assim que o elemento seja criado, registrar o elemnto no unform
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value: string) {
        inputValueRef.current.value = value;
        // muda visualmente o input
        inputElementRef.current.setNativeProps({ text: value });
      },
      // O que fazer quando limpar o campo
      clearValue() {
        inputValueRef.current.value = '';
        // muda visualmente o input
        inputElementRef.current.clear();
      }
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={  value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
