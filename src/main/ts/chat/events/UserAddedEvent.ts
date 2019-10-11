import {ChatEvent} from "./ChatEvent";
import {DomainUser} from "../../identity";

/**
 * Emitted when a new user is added to a particular [[Chat]].
 *
 * @category Chat Subsytem
 */
export class UserAddedEvent extends ChatEvent {
  public static readonly NAME = "user_added";

  /**
   * @inheritdoc
   */
  public readonly name: string = UserAddedEvent.NAME;

  /**
   * @hidden
   * @internal
   */
  constructor(
    chatId: string,
    eventNumber: number,
    timestamp: Date,
    user: DomainUser,

    /**
     * The user that was added
     */
    public readonly addedUser: DomainUser
  ) {
    super(chatId, eventNumber, timestamp, user);
    Object.freeze(this);
  }
}
