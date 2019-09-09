import {ChatEvent} from "./ChatEvent";
import {DomainUser} from "../../identity";

/**
 * Emitted when a [[Chat]]'s name changes.
 */
export class ChatNameChangedEvent extends ChatEvent {
  public static readonly NAME = "name_changed";

  /**
   * The name of this event type.  This can be e.g. used to filter when using the
   * [[ConvergenceEventEmitter.events]] stream.
   */
  public readonly name: string = ChatNameChangedEvent.NAME;

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
     * The new name of the chat
     */
    public readonly chatName: string
  ) {
    super(chatId, eventNumber, timestamp, user);
    Object.freeze(this);
  }
}