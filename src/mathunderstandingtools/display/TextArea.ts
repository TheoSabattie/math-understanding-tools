import { Text, TextStyle } from "@pixi/text";
import { Area } from "./Area";
import { IArea } from "./IArea";

export class TextArea extends Area {
    private _text:Text;

    public constructor(pParent:IArea, pText:string){
        super(pParent);
        this._text = new Text(pText);
        this.container.addChild(this._text);
    }

    public get text():string{
        return this._text.text;
    }

    public set text(pValue:string){
        this._text.text = pValue;
    }

    public get style():TextStyle | Partial<TextStyle> {
        return this._text.style;
    }

    public set style(pValue:TextStyle | Partial<TextStyle>){
        this._text.style = pValue;
    }

    override _draw():void{
        super._draw();
        this._text.anchor.set(this.rectTransform.pivot.x, this.rectTransform.pivot.y);
    }
}