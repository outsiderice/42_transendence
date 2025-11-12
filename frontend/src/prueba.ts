const GATEWAY = 'https://gloomy-werewolf-r56p66rw5pqcgpg-3000.app.github.dev/';

const fetchPromise = fetch(GATEWAY);

console.log('prueba');

fetchPromise
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });