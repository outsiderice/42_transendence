//Prueba de como hacer llamadas a backend.

const gateway = import.meta.env.GATEWAY_URL;

const fetchPromise = fetch(gateway + '/moco');

console.log('prueba');

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
