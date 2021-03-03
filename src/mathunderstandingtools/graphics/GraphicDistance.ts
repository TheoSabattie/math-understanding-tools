import { Container, Text } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { MathTools } from "../../utils/math/MathTools";
import { GraphicTools } from "../utils/GraphicTools";
import { GraphicVector } from "./GraphicVector";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle>new OLineStyle().setWidth(3).setColor(0x999999);

/**
 * Graphic class to represent a Distance
 * @author Théo Sabattié
 */
export class GraphicDistance extends GraphicVector 
{
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }

    public get defaultLineStyle():OLineStyle{
        return GraphicDistance.defaultLineStyle;
    }

    private _distanceText:Text;
    private _nDigit:number;
    private _parallalDistance:number;
    private _delimiterOffset:number;
    private _delimiterStart:number;
    private _direction:OVector2;

	/**
	 * The constructor of the Graphic class representing a Distance
	 * @param pContainer parent
	 * @param pFrom
	 * @param pTo
	 */
    public constructor(pContainer:Container, pFrom:OVector2, pTo:OVector2) 
    {
        super(pContainer, pFrom, pTo);
        this.direction     = new OVector2( -1, -1);
        this._distanceText = new Text("");
		this._distanceText.style = {fontSize : 22 };
        this._nDigit = 2;
        this._parallalDistance = 30;
        this._delimiterOffset  = 10;
        this._delimiterStart   = 10;

        this.graphics.addChild(this._distanceText);
    }
    
    protected _draw():void 
    {
        this.graphics.clear();
        let lLineStyle:OLineStyle = this._getUsedLineStyle();
        lLineStyle.applyToGraphics(this.graphics)
        
        let lFromToTo:OVector2 = OVector2.substract(this.to, this.from);
        
        let lAngle:number = Math.atan2(lFromToTo.y, lFromToTo.x);
        lAngle += Math.PI / 2;
        
        let lPerpendicularDirection:OVector2 = new OVector2(Math.cos(lAngle), Math.sin(lAngle));
        
        if (OVector2.angleBetween(lPerpendicularDirection, this._direction) > Math.PI / 2){
            lAngle += Math.PI;
            lPerpendicularDirection.x = Math.cos(lAngle);
            lPerpendicularDirection.y = Math.sin(lAngle);
        }
        
        let lFrom:OVector2 = this.from.clone();
        lFrom.x *= this.cellSize;
        lFrom.y *= this.cellSize;
        
        let lTo:OVector2 = this.to.clone();
        lTo.x *= this.cellSize;
        lTo.y *= this.cellSize;
        
        let lDelimiterDistance:number = this._parallalDistance + this._delimiterOffset;
        
        // Delimiter
        this.graphics.moveTo(lFrom.x + lPerpendicularDirection.x * this._delimiterStart, lFrom.y + lPerpendicularDirection.y * this._delimiterStart);
        this.graphics.lineTo(lFrom.x + lPerpendicularDirection.x * lDelimiterDistance, lFrom.y + lPerpendicularDirection.y * lDelimiterDistance);
        this.graphics.moveTo(lTo.x + lPerpendicularDirection.x * this._delimiterStart, lTo.y + lPerpendicularDirection.y * this._delimiterStart);
        this.graphics.lineTo(lTo.x + lPerpendicularDirection.x * lDelimiterDistance, lTo.y + lPerpendicularDirection.y * lDelimiterDistance);
        
        // parallal
        let lFromParallal:OVector2 = new OVector2(lFrom.x + lPerpendicularDirection.x * this._parallalDistance, lFrom.y + lPerpendicularDirection.y * this._parallalDistance);
        let lToParallal:OVector2   = new OVector2(lTo.x + lPerpendicularDirection.x * this._parallalDistance, lTo.y + lPerpendicularDirection.y * this._parallalDistance);
        
        this.graphics.moveTo(lFromParallal.x, lFromParallal.y)
        this.graphics.lineTo(lToParallal.x, lToParallal.y)

        let lMiddle:OVector2 = OVector2.lerp(lFromParallal, lToParallal, .5);
        
        this._distanceText.style.fill = lLineStyle.color;
        this._distanceText.text = MathTools.roundTo(this.length, this._nDigit).toString();
        let distanceTextBounds = this._distanceText.getBounds();
        this._distanceText.x = lMiddle.x - distanceTextBounds.width/2  + lPerpendicularDirection.x * (distanceTextBounds.height/2 + 10);
        this._distanceText.y = lMiddle.y - distanceTextBounds.height/2 + lPerpendicularDirection.y * (distanceTextBounds.height/2 + 10);
        
        // arrow pointers
        if (this.length > 0){
            GraphicTools.arrowPointer(this.graphics, lToParallal, lFromToTo, this.arrowAngle, this.safeArrowLength, lLineStyle);
            lFromToTo.x *= -1;
            lFromToTo.y *= -1;
            GraphicTools.arrowPointer(this.graphics, lFromParallal, lFromToTo, this.arrowAngle, this.safeArrowLength, lLineStyle);
        }
    }
    
	/**
	 * Distance from determined line to draw distance arrow.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get parallalDistance():number 
    {
        return this._parallalDistance;
    }
    
    public set parallalDistance(pValue:number) 
    {
        this._parallalDistance = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Determine how many the arrow delimiters exceed the parallalDistance.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 * @see parallalDistance
	 */
    public get delimiterOffset():number
    {
        return this._delimiterOffset;
    }
    
    public set delimiterOffset(pValue:number) 
    {
        this._delimiterOffset = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Determine where the arrow delimiters start from determined line to parallalDistance.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 * @see parallalDistance
     * @type {number}
	 */
    public get delimiterStart():number 
    {
        return this._delimiterStart;
    }
    
    public set delimiterStart(pValue:number)
    {
        this._delimiterStart = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * The arrow will be drawn nearest the direction from the determined line line
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 * @see OVector2
	 */
    public get direction():OVector2 
    {
        return this._direction;
    }
    
    public set direction(pValue:OVector2) 
    {
        if (this._direction != null)
            this._direction.removeListener(EventTypes.CHANGE, this._onPropertyChanged);
        
        this._direction = pValue;
        this._direction.addListener(EventTypes.CHANGE, this._onPropertyChanged);
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
	 * Determine if the text is visible or not
	 */
    public get distanceTextVisible():boolean 
    {
        return this._distanceText.visible;
    }
    
    public set distanceTextVisible(pValue:boolean) 
    {
        this._distanceText.visible = pValue;
    }
}