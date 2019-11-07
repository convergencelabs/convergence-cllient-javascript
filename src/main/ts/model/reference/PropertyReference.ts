import {RealTimeElement} from "../rt/";
import {ModelReference} from "./ModelReference";
import {ReferenceManager} from "./ReferenceManager";
import {DomainUser} from "../../identity";

/**
 * Represents one or more properties in a [[RealTimeObject]] that must be adjusted while
 * the data is changing.  See the
 * [developer guide](https://docs.convergence.io/guide/models/references/realtimeobject.html)
 * for some examples.
 *
 * @module Collaboration Awareness
 */
export class PropertyReference extends ModelReference<string> {

  /**
   * @param referenceManager
   * @param key
   * @param source
   * @param user
   * @param sessionId
   * @param local
   *
   * @hidden
   * @internal
   */
  constructor(referenceManager: ReferenceManager,
              key: string,
              source: RealTimeElement<any>,
              user: DomainUser,
              sessionId: string,
              local: boolean) {
    super(referenceManager, ModelReference.Types.PROPERTY, key, source, user, sessionId, local);
  }

  /**
   * @private
   * @hidden
   * @internal
   */
  public _handlePropertyRemoved(property: string): void {
    const index: number = this._values.indexOf(property, 0);
    if (index > -1) {
      const newElements: string[] = this._values.slice(0);
      newElements.splice(index, 1);
      this._set(newElements, true);
    }
  }
}
