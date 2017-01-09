import {HistoricalElement} from "./HistoricalElement";
import {NumberNode} from "../internal/NumberNode";
import {HistoricalWrapperFactory} from "./HistoricalWrapperFactory";
import {
  ObservableNumber,
  ObservableNumberEvents,
  ObservableNumberEventConstants
} from "../observable/ObservableNumber";
import {HistoricalModel} from "./HistoricalModel";

export interface HistoricalNumberEvents extends ObservableNumberEvents {
}

export class HistoricalNumber extends HistoricalElement<number> implements ObservableNumber {
  public static readonly Events: HistoricalNumberEvents = ObservableNumberEventConstants;

  constructor(_delegate: NumberNode, _wrapperFactory: HistoricalWrapperFactory, model: HistoricalModel) {
    super(_delegate, _wrapperFactory, model);
  }
}
