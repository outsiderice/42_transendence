require('dotenv').config();

const gateway = process.env.GATEWAY;

console.log(gateway);

const fetchPromise = fetch(gateway);
//const fetchPromise = fetch('localhost:3000');

console.log('prueba');

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
