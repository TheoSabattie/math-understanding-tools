import { Container } from "pixi.js";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { GraphicTools } from "../utils/GraphicTools";
import { GraphicLine } from "./GraphicLine";
import { OLineStyle } from "./OLineStyle";

/**
 * Graphic class to represent a Vector
 */
export class GraphicVector extends GraphicLine 
{
    private _arrowAngle:number;
    private _arrowLength:number;

	/**
	 * The constructor of the Graphic class representing a Line
	 * @param pParent parent
	 * @param pFrom the tail position of the vector
	 * @param pTo the head position of the vector
	 */
    constructor(pParent:Container, pFrom:OVector2|null, pTo:OVector2) 
    {
        super(pParent, pFrom, pTo);
        this._arrowAngle = 45;
        this._arrowLength = 15;
    }
    
    protected _draw():void 
    {
        this.graphics.clear();
        let lLineStyle:OLineStyle = this._getUsedLineStyle();
        lLineStyle.applyToGraphics(this.graphics);
        
        let toToFrom:OVector2 = OVector2.substract(this.from, this.to);
        
        if (toToFrom.magnitude == 0)
            return;
        
        let lFrom:OVector2 = new OVector2(this.from.x * this.cellSize, this.from.y * this.cellSize);
        let lTo:OVector2   = new OVector2(this.to.x * this.cellSize, this.to.y * this.cellSize);
        
        let lFromTo:OVector2 = OVector2.substract(lTo, lFrom);
        lFromTo.normalize(lFromTo.magnitude - this.arrowLength);
        lTo = OVector2.add(lFromTo, lFrom);
        
        this.graphics.moveTo(lFrom.x, lFrom.y);
        this.graphics.lineTo(lTo.x, lTo.y);
        
        if (this.magnitude > 0)
            GraphicTools.arrowPointer(this.graphics, new OVector2(this.to.x * this.cellSize, this.to.y * this.cellSize), OVector2.substract(this.to, this.from), this.arrowAngle, this.safeArrowLength, lLineStyle);
    }
    
	/**
	 * Determine the angle of the arrow triangle.
	 * <p>Modification of the property or the OVector2 will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get arrowAngle():number 
    {
        return this._arrowAngle;
    }
    
    public set arrowAngle(pValue:number) 
    {
        this._arrowAngle = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Determine the safe length of the arrow triangle.
	 * <p>if the vector length is shorter than the arrow length, return vector length, if not, return the arrow length</p>
	 */
    protected get safeArrowLength():number {
        return Math.min(this._arrowLength, this.magnitude * this.cellSize);
    }
    
	/**
	 * Determine the length of the arrow triangle.
	 * <p>Modification of the property or the OVector2 will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
     * @type {number}
	 */
    public get arrowLength():number 
    {
        return this._arrowLength;
    }
    
    public set arrowLength(pValue:number) 
    {
        this._arrowLength = pValue;
        this.scheduleDraw();
    }
}