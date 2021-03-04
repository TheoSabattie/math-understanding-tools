import { Container, Point } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { Graphic } from "./Graphic";
import { OFillStyle } from "./OFillStyle";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_ORIGIN_LINE_STYLE:OLineStyle = <OLineStyle>new OLineStyle().setWidth(2).setMiterLimit(3).setColor(0xFFFFFF);
const DEFAULT_FILL_STYLE:OFillStyle = new OFillStyle().setColor(0xFFFFFF).setAlpha(0.5);

/**
 * Abstract graphic class to represent a Shape
 * GraphicShape class draw the origin of the shape
 * @author Théo Sabattié
 */
export abstract class GraphicShape extends Graphic 
{
    public static get defaultOriginLineStyle():OLineStyle {
        return DEFAULT_ORIGIN_LINE_STYLE;
    }

    public static get defaultFillStyle():OFillStyle {
        return DEFAULT_FILL_STYLE;
    }

    public get defaultFillStyle():OFillStyle {
        return GraphicShape.defaultFillStyle;
    }
    
    private _originLength:number;
    private _position:OVector2;
    private _usedOriginLineStyle:OLineStyle;
    private _originLineStyle:OLineStyle;

	/**
	 * The constructor of the Graphic class representing a GraphicShape
	 * @param pParent parent
	 */
    public constructor(pParent:Container) 
    {
        super(pParent);
        this.position = new OVector2();
        this._originLength = 10;
    }
    
    protected _drawOrigin():void {
        let lOrigin     = new Point(this._position.x * this.cellSize, this._position.y * this.cellSize);
        let lHalfLength = this._originLength / 2;
        
        this._getUsedOriginLineStyle().applyToGraphics(this.graphics);
        this.graphics.moveTo(lOrigin.x, lOrigin.y - lHalfLength);
        this.graphics.lineTo(lOrigin.x, lOrigin.y + lHalfLength);
        this.graphics.moveTo(lOrigin.x - lHalfLength, lOrigin.y);
        this.graphics.lineTo(lOrigin.x + lHalfLength, lOrigin.y);
    }
    
	/**
	 * Determine the position of the shape origin
	 * <p>Modification of the property or the OPoint will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get position():OVector2 {
        return this._position; 
    }
    
    public set position(pValue:OVector2) {
        if (this._position != null)
            this._position.removeListener(EventTypes.CHANGE, this._onPropertyChanged);
        
        this._position = pValue;
        
        pValue.addListener(EventTypes.CHANGE, this._onPropertyChanged);
    }
    
	/**
	 * Detemine the length of the cross representing the origin
	 * <p>Modification of the property or the OPoint will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get originLength():number 
    {
        return this._originLength;
    }
    
    public set originLength(pValue:number) 
    {
        this._originLength = pValue;
        this.scheduleDraw();
    }
    
    private _getUsedOriginLineStyle():OLineStyle {
        if (this._usedOriginLineStyle == null){
            this._setUsedOriginLineStyle(this.defaultOriginLineStyle);
        }
        
        return this._usedOriginLineStyle;
    }
    
    /**
     * @param pUsedOriginLineStyle 
     */
    private _setUsedOriginLineStyle(pUsedOriginLineStyle:OLineStyle):void {
        if (this._usedOriginLineStyle != null)
            this._usedOriginLineStyle.removeListener(EventTypes.CHANGE, this._onPropertyChanged);
        
        if (pUsedOriginLineStyle == null)
            pUsedOriginLineStyle = this.defaultOriginLineStyle;
            
        this._usedOriginLineStyle = pUsedOriginLineStyle;
        this._usedOriginLineStyle.addListener(EventTypes.CHANGE, this._onPropertyChanged);
    }
    
    public get originLineStyle():OLineStyle 
    {
        if (this._originLineStyle == null){
            this._originLineStyle = this.defaultOriginLineStyle.clone();
            this._setUsedOriginLineStyle(this._originLineStyle);
        }
        
        return this._originLineStyle;
    }
    
    public set originLineStyle(pValue:OLineStyle) 
    {
        if (pValue == this.defaultOriginLineStyle)
            pValue = null;
        
        this._originLineStyle = pValue;
        this._setUsedOriginLineStyle(pValue);
    }
    
    public get defaultOriginLineStyle():OLineStyle {
        return GraphicShape.defaultOriginLineStyle;
    }
}