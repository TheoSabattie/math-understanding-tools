import { Container, Point, Rectangle } from "pixi.js";
import { Graphic } from "./Graphic";
import { OLineStyle } from "./OLineStyle";

const DEFAULT_LINE_STYLE:OLineStyle = <OLineStyle>new OLineStyle().setWidth(1.5).setColor(0xFFFFFF).setAlpha(.5);

/**
 * Graphic class to represent a Grid
 * @author Théo Sabattié
 */
export class GraphicGrid extends Graphic
{
    public static get defaultLineStyle():OLineStyle {
        return DEFAULT_LINE_STYLE;
    }
    
	/**
	 * The constructor of the Graphic class representing a Grid
	 * @param {Container} pContainer parent
	 * @param {number} pCellSize size of cells
	 */
    public constructor(pContainer:Container, pCellSize:number) 
    {
        super(pContainer);
        this.cellSize = pCellSize;
    }
    
    public get defaultLineStyle():OLineStyle
    {
        return GraphicGrid.defaultLineStyle;
    }
    
    protected _draw():void 
    {
        super._draw();
        
        let lGlobalOrigin = this.graphics.toGlobal(new Point(0,0));
        let lGlobalStart  = new Point(lGlobalOrigin.x % this.cellSize, lGlobalOrigin.y % this.cellSize);
        
        if (lGlobalStart.x < 0)
            lGlobalStart.x += this.cellSize;
            
        if (lGlobalStart.y < 0)
            lGlobalStart.y += this.cellSize;
        
        let lLocalStart  = this.graphics.toLocal(lGlobalStart);
        let lTopLeft     = this.graphics.toLocal(new Point());
        let lBottomRight = this.graphics.toLocal(new Point(window.innerWidth, window.innerHeight));
        let lScreenLimit = new Rectangle(lTopLeft.x, lTopLeft.y, lBottomRight.x - lTopLeft.x, lBottomRight.y - lTopLeft.y);
        
        this._drawColumns(lLocalStart, lScreenLimit);
        this._drawLines(lLocalStart, lScreenLimit);
    }
    
    private _drawLines(pLocalStart:Point, pScreenLimit:Rectangle):void
    {
        let lNLines:number = Math.ceil(pScreenLimit.height / this.cellSize);
        
        for (let y:number = 0; y < lNLines; y++){
            this.graphics.moveTo(pScreenLimit.left, pLocalStart.y + y * this.cellSize);
            this.graphics.lineTo(pScreenLimit.right, pLocalStart.y + y * this.cellSize);
        }
    }
    
    private _drawColumns(pLocalStart:Point, pScreenLimit:Rectangle):void
    {
        let lNColumns = Math.ceil(pScreenLimit.width / this.cellSize);
        
        for (let x = 0; x < lNColumns; x++){
            this.graphics.moveTo(pLocalStart.x + x * this.cellSize, pScreenLimit.top);
            this.graphics.lineTo(pLocalStart.x + x * this.cellSize, pScreenLimit.bottom);
        }
    }
    
	/**
	 * Return the position snapped on the nearest line column intersection
	 * @param pPosition
	 * @return 
	 */
    public snapToCellPosition(pPosition:Point):Point {
        return new Point(Math.round(pPosition.x / this.cellSize) * this.cellSize, Math.round(pPosition.y / this.cellSize) * this.cellSize);
    }
}