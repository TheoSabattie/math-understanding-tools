import { Container } from "pixi.js";
import { MathMap } from "./MathMap";
import { Window } from "./Window";

/**
 * Window with a MathMap
 * @author Théo Sabattié
 */
export class MathMapWindow extends Window 
{
    private _map:MathMap;

	/**
	 * Constructor of a Window containing a MathMap
	 * @param pParent parent
	 * @param pCellSize determine the cell size, impacting the graphic scale.
	 */
    public constructor(pParent:Container, pCellSize:number) 
    {
        super(pParent);
        this._map = new MathMap(this.container, pCellSize);
        this._map.mask = this.masker;
    }
    
    protected _draw():void 
    {
        super._draw();
        this._map.grid.scheduleDraw();
    }
    
	/**
	 * MathMap of the Window
	 */
    public get map():MathMap {
        return this._map;
    }
}