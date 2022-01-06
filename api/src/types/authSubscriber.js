import events from 'events';

const eventEmitter = new events.EventEmitter();

export default eventEmitter.on('signup', async ({ data }) => {
  return data;
});
