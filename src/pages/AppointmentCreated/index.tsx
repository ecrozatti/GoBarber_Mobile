import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  // number pq no envio do parâmetro, foi transformado em numérico
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  // tipamos params como a interface RouteParams
  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    // reseta a navegação, não permitindo "voltar" na tela de confirmação.
    // ao clicar em OK, redireciona para a page Dashboard.
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    })
  },[reset]);

  const formattedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      {locale: ptBR})
  },[routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
}

export default AppointmentCreated;
