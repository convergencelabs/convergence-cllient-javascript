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

import {OperationTransformationFunction} from "../OperationTransformationFunction";
import {OperationPair} from "../OperationPair";
import {ArrayRemoveOperation} from "../../ops/ArrayRemoveOperation";
import {ArrayReplaceOperation} from "../../ops/ArrayReplaceOperation";
import {ArrayInsertOperation} from "../../ops/ArrayInsertOperation";

/**
 * @hidden
 * @internal
 */
export const ArrayRemoveReplaceOTF: OperationTransformationFunction<ArrayRemoveOperation, ArrayReplaceOperation> =
  (s: ArrayRemoveOperation, c: ArrayReplaceOperation) => {
    if (s.index < c.index) {
      // A-RP-1
      return new OperationPair(s, c.copy({index: c.index - 1}));
    } else if (s.index === c.index) {
      // A-RP-2
      return new OperationPair(s.copy({noOp: true}), new ArrayInsertOperation(
        c.id, c.noOp, c.index, c.value));
    } else {
      // A-RP-3
      return new OperationPair(s, c);
    }
  };
