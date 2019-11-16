/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence JavaScript Client, which is released
 * under the terms of the GNU Lesser General Public License version 3
 * (LGPLv3), which is a refinement of the GNU Lesser General Public License
 * version 3 (GPLv3).  A copy of the both the GPLv3 and the LGPLv3 should have
 * been provided along with this file, typically located in the "LICENSE" and
 * "COPYING.LESSER" files (respectively), which are part of this source code
 * package. Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> and
 * <https://www.gnu.org/licenses/lgpl-3.0.html> for the full text of the GPLv3
 * and LGPLv3 licenses, if they were not provided.
 */

import {IConvergenceEvent} from "../../../util";
import {ModelReference} from "../ModelReference";

/**
 * Emitted when a [[ModelReference]]'s value is explicitly cleared.
 *
 * @module Collaboration Awareness
 */
export class ReferenceClearedEvent<T> implements IConvergenceEvent {
  public static readonly NAME = "cleared";

  /**
   * @inheritdoc
   */
  public readonly name: string = ReferenceClearedEvent.NAME;

  /**
   * The first previous value (if there were multiple) of the reference.
   */
  public readonly oldValue: T;

  constructor(
    /**
     * The underlying reference that was cleared.
     */
    public readonly src: ModelReference<any>,

    /**
     * The previous values of the reference.
     */
    public readonly oldValues: T[]
  ) {
    if (oldValues.length > 0) {
      this.oldValue = oldValues[0];
    }

    Object.freeze(this);
  }
}
