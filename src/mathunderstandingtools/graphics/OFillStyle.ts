import { Graphics } from "pixi.js";
import { OStyle } from "./OStyle";

export class OFillStyle extends OStyle 
{    
    public constructor() {
        super();
    }
    
    public applyToGraphics(pGraphics:Graphics):void 
    {
        pGraphics.beginFill(this.color, this.alpha);
    }
    
    public clone():OFillStyle {
        let lFillStyle:OFillStyle = new OFillStyle();
        lFillStyle._alpha = this._alpha;
        lFillStyle._color = this._color;
        return lFillStyle;
    }
}