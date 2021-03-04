import { Container, Point } from "pixi.js";
import { GraphicShape } from "./GraphicShape";

/**
 * Graphic class to represent a Circle
 * @author Théo Sabattié
 */
export class GraphicCircle extends GraphicShape 
{
    private _radius:number;

	/**
	 * The constructor of the Graphic class representing a Circle
	 * @param pParent parent
	 * @param pRadius radius of the circle
	 */
    public constructor(pParent:Container, pRadius:number) 
    {
        super(pParent);
        this._radius = pRadius;
    }
    
    protected _draw():void 
    {
        super._draw();
        this._beginFill();
        
        let lOrigin:Point = new Point(this.position.x * this.cellSize, this.position.y * this.cellSize);
        
        this.graphics.drawCircle(lOrigin.x, lOrigin.y, this.radius * this.cellSize);
        this.graphics.endFill();
        this._drawOrigin();
    }
    
	/**
	 * Radius used to draw the circle.
	 * <p>Modification will automatically invoke scheduleDraw method</p>
	 * @see scheduleDraw
	 */
    public get radius():number 
    {
        return this._radius;
    }
    
    public set radius(pValue:number) 
    {
        this._radius = pValue;
        this.scheduleDraw();
    }
    
}