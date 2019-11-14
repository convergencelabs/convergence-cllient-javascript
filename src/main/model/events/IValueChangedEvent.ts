/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in the files
 * 'LICENSE' and 'COPYING.LESSER', which are part of this source code package.
 */

import {IConvergenceModelValueEvent} from "./IConvergenceModelValueEvent";
import {DomainUser} from "../../identity";

/**
 * The [[IValueChangedEvent]] is the parent interface to all events fired by
 * individual model elements when their data changes.
 *
 * @module Real Time Data
 */
export interface IValueChangedEvent extends IConvergenceModelValueEvent {
  /**
   * The user which performed the modification
   */
  readonly user: DomainUser;

  /**
   * The sessionId corresponding to the session that performed the modification
   */
  readonly sessionId: string;
}