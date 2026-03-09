const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s';
const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
const match = url.match(regExp);
console.log(match ? match[1] : null);
