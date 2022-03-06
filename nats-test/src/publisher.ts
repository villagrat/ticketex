import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// stan ~ client. stan is an instance of nats
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '666',
      title: 'asdasd',
      price: 333,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 100,
  // });

  // // .publish() expects [channelName, data, optionalCallback]
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
