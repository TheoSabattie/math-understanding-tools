import { EventEmitter } from "eventEmitter3"
import { Graphics } from "pixi.js";
import { EventTypes } from "../../utils";

export abstract class OStyle extends EventEmitter<EventTypes>
{
    protected _color:number;
    protected _alpha:number;

    public constructor() {
        super();
        this._color = 0;
        this._alpha = 1;
    }
    
    /**
     * Set the color of this instance then return it
     * @param pColor
     * @returns the same instance to chain operations
     */
    public setColor(pColor:number):OStyle {
        this.color = pColor;
        return this;
    }
    
    /**
     * Set the alpha of this instance then return it
     * @param pAlpha
     * @returns the same instance to chain operations 
     */
    public setAlpha(pAlpha:number):OStyle {
        this.alpha = pAlpha;
        return this;
    }
    
    public get color():number
    {
        return this._color;
    }
    
    public set color(pValue:number) 
    {
        this._color = pValue;
        this._dispatchChangeEvent();
    }
    
    public get alpha():number
    {
        return this._alpha;
    }
    
    public set alpha(pValue:number) 
    {
        this._alpha = pValue;
        this._dispatchChangeEvent();
    }
    
    protected _dispatchChangeEvent():void {
        this.emit(EventTypes.CHANGE);
    }
    
    public abstract clone():OStyle;
    public abstract applyToGraphics(_:Graphics):void;
}