import {HistoricalElement} from "./HistoricalElement";
import {HistoricalContainerElement} from "./HistoricalContainerElement";
import {ArrayNode} from "../internal/ArrayNode";
import {HistoricalWrapperFactory} from "./HistoricalWrapperFactory";
import {ObservableArray, ObservableArrayEvents, ObservableArrayEventConstants} from "../observable/ObservableArray";
import {HistoricalModel} from "./HistoricalModel";

export interface HistoricalArrayEvents extends ObservableArrayEvents {
}

export class HistoricalArray
  extends HistoricalElement<any[]>
  implements ObservableArray, HistoricalContainerElement<any[]> {

  public static readonly Events: HistoricalArrayEvents = ObservableArrayEventConstants;

  constructor(protected _delegate: ArrayNode, wrapperFactory: HistoricalWrapperFactory, model: HistoricalModel) {
    super(_delegate, wrapperFactory, model);
  }

  public get(index: number): HistoricalElement<any> {
    return this._wrapperFactory.wrap(this._delegate.get(index));
  }

  public length(): number {
    return this._delegate.length();
  }

  public forEach(callback: (value: HistoricalElement<any>, index?: number) => void): void {
    this._delegate.forEach((modelNode, index) => {
      callback(this._wrapperFactory.wrap(modelNode), index);
    });
  }

  public elementAt(pathArgs: any): HistoricalElement<any> {
    return this._wrapperFactory.wrap(this._delegate.valueAt(pathArgs));
  }
}
