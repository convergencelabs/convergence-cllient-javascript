import ModelChangeEvent from "./ModelChangeEvent";
import RealTimeArray from "../RealTimeArray";

export default class ArrayRemoveEvent extends ModelChangeEvent {
  /**
   * Constructs a new ArrayRemoveEvent.
   */
  constructor(sessionId: string,
              username: string,
              version: number,
              timestamp: number,
              target: RealTimeArray,
              public index: number) {
    super(sessionId, username, version, timestamp, target);
    Object.freeze(this);
  }
}
