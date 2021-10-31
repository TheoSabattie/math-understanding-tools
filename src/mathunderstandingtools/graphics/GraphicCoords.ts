import { Container, Rectangle, Text } from "pixi.js";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { GraphicLine } from "./GraphicLine";
import { GraphicTools } from "../utils/GraphicTools";
import { MathTools } from "../../utils/math/MathTools";
import { OLineStyle } from "./OLineStyle";

/**
 * Graphic class to represent a Coordinate
 * @author Théo Sabattié
 */
export class GraphicCoords extends GraphicLine
{
    private _xText:Text; 
    private _yText:Text; 
    private _nDigit:number;
    private _xAlpha:number;
    private _yAlpha:number;
    private _xColor:number;
    private _yColor:number;

	/**
	 * The constructor of the Graphic class representing a Coordinate
	 * @param pParent parent
	 * @param pFrom origin
	 * @param pTo targeted position
	 */
    public constructor(pParent:Container, pFrom:OVector2|null, pTo:OVector2) 
    {            
        super(pParent, pFrom, pTo);
        this._xText = new Text("");
        this._yText = new Text("");
        
		this._xText.style.fontSize = this._yText.style.fontSize = 22;
		this._nDigit = 2;
        this._xAlpha = 1;
        this._yAlpha = 1;
        this.xColor = 0xFF0000;
        this.yColor = 0x00FF00;

        this.graphics.addChild(this._xText);
		this.graphics.addChild(this._yText);
    }
    
    protected _draw():void 
    {
        this.graphics.clear();
        let lFromToTo:OVector2    = OVector2.substract(this.to, this.from);
        let lLineStyle:OLineStyle = this._getUsedLineStyle();

        this.graphics.lineStyle({
            alignment  : lLineStyle.alignement,
            alpha      : this._xAlpha,
            cap        : lLineStyle.cap,
            color      : this._xColor,
            join       : lLineStyle.join,
            miterLimit : lLineStyle.miterLimit,
            native     : lLineStyle.native,
            width      : lLineStyle.width,
        });

        GraphicTools.line(this.graphics, new OVector2((this.from.x + lFromToTo.x) * this.cellSize, this.from.y * this.cellSize), new OVector2((this.from.x + lFromToTo.x) * this.cellSize, (this.from.y + lFromToTo.y) * this.cellSize), 15, 5);
        
        this.graphics.lineStyle({
            alignment  : lLineStyle.alignement,
            alpha      : this._yAlpha,
            cap        : lLineStyle.cap,
            color      : this._yColor,
            join       : lLineStyle.join,
            miterLimit : lLineStyle.miterLimit,
            native     : lLineStyle.native,
            width      : lLineStyle.width,
        });

        GraphicTools.line(this.graphics, new OVector2(this.from.x * this.cellSize, (this.from.y + lFromToTo.y) * this.cellSize), new OVector2((this.from.x + lFromToTo.x) * this.cellSize, (this.from.y + lFromToTo.y) * this.cellSize), 15, 5);
        
        this._xText.alpha = this._xAlpha;
        this._xText.text = MathTools.roundTo(this.to.x, this._nDigit).toString();

        let xTextBounds:Rectangle = this._xText.getBounds();
        this._xText.x = this.to.x * this.cellSize - xTextBounds.width / 2;
        this._xText.y = this.from.y * this.cellSize;
        
        if (this.to.y < 0){
            this._xText.y += 10;
        } else {
            this._xText.y -= xTextBounds.height + 10;
        }
        
        this._yText.alpha = this._yAlpha;
        this._yText.text = MathTools.roundTo(this.to.y, this._nDigit).toString();
        this._yText.x = this.from.x * this.cellSize;

        let yTextBounds:Rectangle = this._yText.getBounds();
        this._yText.y = this.to.y * this.cellSize - yTextBounds.height / 2;

        if (this.to.x < 0){
            this._yText.x += 10
        } else {
            this._yText.x -= yTextBounds.width + 10
        }
    }
    
	/**
	 * Color used for x axis.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get xColor():number 
    {
        return this._xColor;
    }
    
    public set xColor(pValue:number) 
    {
        this._xColor = pValue;
		this._xText.style.fill = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Color used for y axis.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get yColor():number 
    {
        return this._yColor;
    }
    
    public set yColor(pValue:number) 
    {
        this._yColor = pValue;
		this._yText.style.fill = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * NDigit shown on text.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get nDigit():number 
    {
        return this._nDigit;
    }
    
    public set nDigit(pValue:number) 
    {
        this._nDigit = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Alpha used for x axis.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get xAlpha():number
    {
        return this._xAlpha;
    }
    
    public set xAlpha(pValue:number) 
    {
        this._xAlpha = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Alpha used for y axis.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
     * @type {number}
	 */
    public get yAlpha():number 
    {
        return this._yAlpha;
    }
    
    public set yAlpha(pValue:number) 
    {
        this._yAlpha = pValue;
        this.scheduleDraw();
    }
}