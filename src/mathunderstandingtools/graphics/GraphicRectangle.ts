import { Container, Point } from "pixi.js";
import { GraphicShape } from "./GraphicShape";

/**
 * Graphic class to represent a Rectangle
 * @author Théo Sabattié
 */
export class GraphicRectangle extends GraphicShape 
{
    protected _width:number;
    protected _height:number;

	/**
	 * The constructor of the Graphic class representing a Rectangle
	 * @param {Container} pParent parent
	 * @param pWidth width
	 * @param pHeight height
	 */
    public constructor(pParent:Container, pWidth:number, pHeight:number) 
    {
        super(pParent);
        this._width = pWidth;
        this._height = pHeight;
    }
    
    protected _draw():void 
    {
        super._draw();
        this._beginFill();
        
        let lOrigin:Point = new Point(this.position.x * this.cellSize, this.position.y * this.cellSize);
        let lSize:Point   = new Point(this._width * this.cellSize, this._height * this.cellSize);
        
        this.graphics.drawRect(lOrigin.x - lSize.x / 2, lOrigin.y - lSize.y / 2, lSize.x, lSize.y);
        this.graphics.endFill();
        
        this._drawOrigin();
    }
    
	/**
	 * Determine the width of the rectangle.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get width():number 
    {
        return this._width;
    }
    
    public set width(pValue:number) 
    {
        this._width = pValue;
        this.scheduleDraw();
    }
    
	/**
	 * Determine the height of the rectangle.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get height():number 
    {
        return this._height;
    }
    
    public set height(pValue:number) 
    {
        this._height = pValue;
        this.scheduleDraw();
    }
}