const gateway = import.meta.env.GATEWAY_URL;

const fetchPromise = fetch(gateway);

console.log('prueba');

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
