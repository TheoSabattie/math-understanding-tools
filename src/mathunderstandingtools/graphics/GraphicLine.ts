import { Container } from "pixi.js";
import { EventTypes } from "../../utils/events/EventTypes";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { Graphic } from "./Graphic";

/**
 * Graphic class to represent a Line
 */
export class GraphicLine extends Graphic 
{
    private _from:OVector2;
    private _to:OVector2;

	/**
	 * The constructor of the Graphic class representing a Line
	 * @param pParent parent
	 * @param pFrom where the line start
	 * @param pTo where the line end
	 */
    public constructor(pParent:Container, pFrom:OVector2, pTo:OVector2) 
    {
        super(pParent);
        this.from = pFrom == null ? new OVector2() : pFrom;
        this.to   = pTo;
    }
    
    protected _draw():void
    {
        super._draw();
        this.graphics.moveTo(this._from.x * this.cellSize, this._from.y * this.cellSize);
        this.graphics.lineTo(this._to.x * this.cellSize, this._to.y * this.cellSize);
    }
    
	/**
	 * Where the line start.
	 * <p>Modification of the property or the OVector2 will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get from():OVector2 {
        return this._from;
    }
    
    public set from(pValue:OVector2) 
    {
        if (this._from != null)
            this._from.removeListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        
        this._from = pValue;
        this._from.addListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        
        this.scheduleDraw();
    }
    
	/**
	 * Where the line end.
	 * <p>Modification of the property or the OVector2 will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get to():OVector2 {
        return this._to;
    }
    
    public set to(pValue:OVector2) 
    {
        if (this._to != null)
            this._to.removeListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        
        this._to = pValue;
        this._to.addListener(EventTypes.CHANGE, this._onPropertyChanged, this);
        this.scheduleDraw();
    }
    
	/**
	 * The line length
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get magnitude():number {
        return OVector2.distance(this._to, this._from);
    }
    
    public set magnitude(pValue:number) 
    {
        let lFromToVector:OVector2 = OVector2.substract(this._to, this._from);
        lFromToVector.normalize(pValue);
		let lTo:OVector2 = OVector2.add(this._from, lFromToVector);
        this._to.setTo(lTo.x, lTo.y);
    }
}