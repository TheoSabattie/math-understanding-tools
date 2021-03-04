import { Container } from "pixi.js";
import { GraphicRectangle } from "./GraphicRectangle";

/**
 * Graphic class to represent a Square
 * @author Théo Sabattié
 */
export class GraphicSquare extends GraphicRectangle 
{
	/**
	 * The constructor of the Graphic class representing a Square
	 * @param pParent parent
	 * @param pSize size
	 */
    public constructor(pParent:Container, pSize:number) 
    {
        super(pParent, pSize, pSize);
    }
    
	/**
	 * Determine the size of the square.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
     * @type {number}
	 */
    public get size() {
        return this._width;
    }
    
    public set size(pValue) {
        this._width  = pValue;
        this._height = pValue;
        this._onPropertyChanged();
    }
    
    public set width(pValue:number) {
        this.size = pValue;
    }
    
    public set height(pValue:number) {
        this.size = pValue;
    }
}