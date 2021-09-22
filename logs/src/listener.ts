import { connect } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './ticket-created-listener';

console.clear();

let client_id = randomBytes(4).toString('hex');

const stan = connect('ticketing', client_id, {
    url: "http://nats-srv:4222"
});

stan.on('connect', () => {
    console.log("Listener connected to NATS");

    stan.on('close', () => {
        console.log("NATS connection closed!");
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});


process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());