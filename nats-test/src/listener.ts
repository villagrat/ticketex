import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// [topic/channelListName, clientId]
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // graceful client shutdown
  stan.on('close', () => {
    console.log('NATS connection closed...');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => {
  stan.close();
});
process.on('SIGTERM', () => {
  stan.close();
});
