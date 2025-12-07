//Prueba de como hacer llamadas a backend.

const gateway = import.meta.env.VITE_GATEWAY_URL;

const fetchPromise = fetch(gateway + '/moco');

console.log(gateway);

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
