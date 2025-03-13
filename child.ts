process.on('message', (message) => {
  console.log('message from parent:', message);
  process.send("No that's not true, that's impossible!");
});
