import axios from 'axios';

const api = axios.create({
  // para dispositivo físico, usar o ip da máquina
  // para emulador android, utilizar um ip específico, procurar documentação
  // para ios, utilizar localhost
  baseURL: 'http://localhost:3333',
});

export default api;
