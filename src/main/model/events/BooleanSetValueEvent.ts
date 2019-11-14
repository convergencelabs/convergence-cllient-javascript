/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in the files
 * 'LICENSE' and 'COPYING.LESSER', which are part of this source code package.
 */

import {IValueChangedEvent} from "./IValueChangedEvent";
import {ObservableBoolean} from "../observable/ObservableBoolean";
import {DomainUser} from "../../identity";

/**
 * Emitted when the [[RealTimeBoolean.value]] of a [[RealTimeBoolean]] is set.
 *
 * @module Real Time Data
 */
export class BooleanSetValueEvent implements IValueChangedEvent {
  public static readonly NAME = "value";

  /**
   * @inheritdoc
   */
  public readonly name: string = BooleanSetValueEvent.NAME;

  /**
   * @param element
   * @param sessionId
   * @param user
   * @param local
   *
   * @hidden
   * @internal
   */
  constructor(
    /**
     * The [[RealTimeBoolean]] or [[HistoricalBoolean]] which was modified
     */
    public readonly element: ObservableBoolean,

    /**
     * @inheritdoc
     */
    public readonly user: DomainUser,

    /**
     * @inheritdoc
     */
    public readonly sessionId: string,

    /**
     * True if the change occurred locally (within the current session)
     */
    public readonly local: boolean
  ) {
    Object.freeze(this);
  }
}