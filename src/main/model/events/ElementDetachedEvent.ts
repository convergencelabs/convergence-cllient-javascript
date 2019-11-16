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

import {IConvergenceEvent} from "../../util";
import {ObservableElement} from "../observable/ObservableElement";

/**
 * Emitted when an element becomes detached.  This typically happens when the element
 * is removed from its parent.
 *
 * @module Real Time Data
 */
export class ElementDetachedEvent implements IConvergenceEvent {
  public static readonly NAME = "detached";

  /**
   * @inheritdoc
   */
  public readonly name: string = ElementDetachedEvent.NAME;

  /**
   * @param src
   *
   * @hidden
   * @internal
   */
  constructor(
    /**
     * The [[RealTimeElement]] or [[HistoricalElement]] that was detached.
     */
    public readonly src: ObservableElement<any>
  ) { }
}
