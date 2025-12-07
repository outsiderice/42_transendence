//Prueba de como hacer llamadas a backend.

const gateway = import.meta.env.VITE_GATEWAY_URL;

console.log(gateway);

fetch(`${gateway}users`)
  .then((response) => response.json())
  .then((data) => console.log(data));
