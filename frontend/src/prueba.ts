//Prueba de como hacer llamadas a backend.

const gateway = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000';

console.log(gateway);
console.log('hi');

fetch(`${gateway}/users`)
  .then((response) => response.json())
  .then((data) => console.log(data));
