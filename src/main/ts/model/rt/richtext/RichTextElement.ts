import {RichTextDocument} from "./RichTextDocument";
import {RichTextNode} from "./RichTextNode";
import {RichTextPath} from "./RichTextLocation";
import {ConvergenceError} from "../../../util/ConvergenceError";

export class RichTextElement extends RichTextNode {
  private _name: string;
  private _children: RichTextNode[];

  constructor(parent: RichTextNode, document: RichTextDocument, name: string) {
    super(parent, document);
    this._name = name;
    this._children = [];
  }

  public getName(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
  }

  public getChildren(): RichTextNode[] {
    return this._children.slice(0);
  }

  public getChild(index: number): RichTextNode {
    return this._children[index];
  }

  public getChildByPath( path: RichTextPath ): RichTextNode {
    let node: RichTextNode = this;

    for ( const index of path ) {
      if (node instanceof RichTextElement) {
        node = node.getChild(index);
      } else {
        throw new ConvergenceError(`Invalid RichTextPath: ${path}`, "invalid-rich-text-path");
      }
    }

    return node;
  }

  public insertChild(index: number, child: RichTextNode): void {
    this._children.splice(index, 0, child);
  }

  public removeChild(index: number): void;
  public removeChild(child: RichTextNode): void;
  public removeChild(child: number | RichTextNode): void {
    let index: number;
    if (typeof child === "number") {
      index = child;
    } else {
      index = this._children.indexOf(child);
    }
    if (index >= 0) {
      this._children.splice(index, 1);
    }
  }

  public textContentLength(): number {
    let length = 0;
    this._children.forEach(c => length += c.textContentLength());
    return length;
  }
}
