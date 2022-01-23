import { Area } from "./Area";
import { Graphics } from "@pixi/graphics";
import { IArea } from "./IArea";
import { OFillStyle } from "../graphics/OFillStyle";
import { OLineStyle } from "../graphics/OLineStyle";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2, Point } from "../../utils/math/geom/OVector2";

const DEFAULT_FILL_STYLE:OFillStyle = new OFillStyle();
const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle>new OLineStyle().setWidth(5).setColor(0xFFFFFF);

export class FilledArea extends Area {
    public static get defaultFillStyle():OFillStyle {
        return DEFAULT_FILL_STYLE;
    }
    
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }

    private _lineStyle:OLineStyle|null = null;
    private _fillStyle:OFillStyle|null = null;
    private _usedLineStyle:OLineStyle|null = null;
    private _usedFillStyle:OFillStyle|null = null;
    private _graphics:Graphics = new Graphics();

    public constructor(pParent:IArea){
        super(pParent);
        this.container.addChild(this._graphics);
    }

    public get defaultFillStyle():OFillStyle 
    {
        return FilledArea.defaultFillStyle;
    }
    
    public get defaultLineStyle():OLineStyle
    {
        return FilledArea.defaultLineStyle;
    }

    public get fillStyle():OFillStyle {
        if (this._fillStyle == null){
            this._fillStyle = this.defaultFillStyle.clone();
            this._setUsedFillStyle(this._fillStyle);
        }
        
        return this._fillStyle;
    }

    public set fillStyle(pValue:OFillStyle|null) {
        if (pValue == this.defaultFillStyle)
            pValue = null;
        
        this._fillStyle = pValue;
        this._setUsedFillStyle(pValue);
    }
    
    public get lineStyle():OLineStyle {
        if (this._lineStyle == null){
            this._lineStyle = this.defaultLineStyle.clone();
            this._setUsedLineStyle(this._lineStyle);
        }
        
        return this._lineStyle;
    }
    
    public set lineStyle(pValue:OLineStyle|null) {
        if (pValue == this.defaultLineStyle)
            pValue = null;
        
        this._lineStyle = pValue;
        this._setUsedLineStyle(pValue);
    }
    
    protected _getUsedFillStyle():OFillStyle {
        if (this._usedFillStyle == null){
            this._setUsedFillStyle((this._fillStyle != null) ? this._fillStyle : this.defaultFillStyle);
        }
        
        return <OFillStyle>this._usedFillStyle;
    }
    
    protected _setUsedFillStyle(pValue:OFillStyle|null):void {
        if (this._usedFillStyle != null){
            this._usedFillStyle.removeListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        }
        
        pValue = (pValue == null) ? this.defaultFillStyle : pValue;
        this._usedFillStyle = pValue;
        this._usedFillStyle.addListener(EventTypes.CHANGE, this._onPropertyChanged, this);
    }
    
    protected _getUsedLineStyle():OLineStyle {
        if (this._usedLineStyle == null){
            this._setUsedLineStyle((this._lineStyle != null) ? this._lineStyle : this.defaultLineStyle);
        }
        
        return <OLineStyle>this._usedLineStyle;
    }
    
    protected _setUsedLineStyle(pValue:OLineStyle|null):void {
        if (this._usedLineStyle != null){
            this._usedLineStyle.removeListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        }
        
        pValue = (pValue == null) ? this.defaultLineStyle : pValue;
        this._usedLineStyle = pValue;
        this._usedLineStyle.addListener(EventTypes.CHANGE, this._onPropertyChanged, this);
    }

    override _draw():void {
        let lRect = this.rectTransform.rect;
        let lTopLeft:Point     = this.container.toLocal(lRect.min);
        let lBottomRight:Point = this.container.toLocal(lRect.max);
        let lSize              = OVector2.substract(lBottomRight, lTopLeft);
        
        this._graphics.clear();
        this._getUsedFillStyle().applyToGraphics(this._graphics);
        this._getUsedLineStyle().applyToGraphics(this._graphics);
        this._graphics.drawRect(lTopLeft.x, lTopLeft.y, lSize.x, lSize.y);
        this._graphics.endFill()
    }

    protected _onPropertyChanged(){
        this.scheduleDraw();
    }

    override destroy():void{
        this._graphics.destroy();
        super.destroy();
    }
}