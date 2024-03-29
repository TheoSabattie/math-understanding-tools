import { Container, Graphics } from "pixi.js";
import { EventTypes, UpdateService } from "../../utils";
import { OFillStyle } from "./OFillStyle";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle>new OLineStyle().setWidth(3).setColor(0xFFFFFF);
const DEFAULT_FILL_STYLE:OFillStyle = new OFillStyle().setColor(0xFFFFFF);

/**
 * Base class for drawing
 */
export abstract class Graphic 
{
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }
    
    public static get defaultFillStyle():OFillStyle {
        return DEFAULT_FILL_STYLE;
    }
    
    private _graphics:Graphics;
    private _lineStyle:OLineStyle|null = null;
    private _fillStyle:OFillStyle|null = null;
    private _isListeningNextFrame:boolean;
    private _usedLineStyle:OLineStyle|null = null;
    private _usedFillStyle:OFillStyle|null = null;
    private _cellSize:number;

	/**
	 * Instanciate by giving container (parent).
	 * <p>The objet will automatically add itself as child</p>
	 * @param pParent
	 */
    public constructor(pParent:Container) 
    {
        this._graphics = new Graphics();
        this.parent    = pParent;

        this._isListeningNextFrame = false;
        this._cellSize = 1;
        this.scheduleDraw();
    }
    
    public get parent():Container{
        return this._graphics.parent;
    }

    public set parent(pContainer:Container){
        pContainer.addChild(this._graphics);
    }

    protected get graphics():Graphics{
        return this._graphics;
    }

    public get defaultLineStyle():OLineStyle {
        return Graphic.defaultLineStyle;
    }
    
    public get defaultFillStyle():OFillStyle {
        return Graphic.defaultFillStyle;
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
    
    protected _onPropertyChanged():void
    {
        this.scheduleDraw();
    }
    
	/**
	 * Shedule draw for next frame.
	 */
    public scheduleDraw():void {
        if (!this._isListeningNextFrame){
            this._isListeningNextFrame = true;
            UpdateService.add(this._nextFrame);
        }
    }
    
    protected _nextFrame = ():void=> 
    {
        this._isListeningNextFrame = false;
        UpdateService.remove(this._nextFrame);
        this._draw();
    }
    
	/**
	 * Draw immediately.
	 */
    protected _draw():void
    {
        this._graphics.clear();
        this._getUsedLineStyle().applyToGraphics(this._graphics);
    }
    
	/**
	 * Begin fill using fillColor and fillAlpha.
	 * @see fillColor
	 * @see fillAlpha
	 */
    protected _beginFill():void {
        this._getUsedFillStyle().applyToGraphics(this._graphics);
    }
    
	/**
	 * Determine the cell size, impacting the graphic scale.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get cellSize():number
    {
        return this._cellSize;
    }
    
    public set cellSize(pValue:number) 
    {
        this._cellSize = pValue;
        this.scheduleDraw();
    }
}