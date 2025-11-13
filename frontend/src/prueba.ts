const gateway = Number(process.env.GATEWAY);

console.log(gateway);

const fetchPromise = fetch(gateway);

console.log('prueba');

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });