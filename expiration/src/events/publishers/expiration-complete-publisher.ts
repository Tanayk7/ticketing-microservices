import { ExpirationCompleteEvent, Publisher, Events } from "@tktickets1111/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    event: Events.EXPIRATION_COMPLETE = Events.EXPIRATION_COMPLETE;
}