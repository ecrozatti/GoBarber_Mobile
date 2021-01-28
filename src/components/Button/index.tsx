import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  // forca que todo button receba um texto.
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest}>
    {/* No React Native nao podemos imprinir texto direto, por isso o componente ButttonText */}
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
