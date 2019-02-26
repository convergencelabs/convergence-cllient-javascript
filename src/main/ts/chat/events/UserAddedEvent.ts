import {ChatEvent} from "./ChatEvent";
import {DomainUser} from "../../identity";

export class UserAddedEvent extends ChatEvent {
  public static readonly NAME = "user_added";
  public readonly name: string = UserAddedEvent.NAME;

  /**
   * @hidden
   * @internal
   */
  constructor(chatId: string,
              eventNumber: number,
              timestamp: Date,
              user: DomainUser,
              public readonly addedUser: DomainUser) {
    super(chatId, eventNumber, timestamp, user);
    Object.freeze(this);
  }
}