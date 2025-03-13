const child = Bun.spawn(['bun', 'child.ts'], {
  ipc(message, childProc) {
    /**
     * The message received from the sub process
     **/
    console.log('message from child:', message);
  },
});

child.send('No, I am your father');
