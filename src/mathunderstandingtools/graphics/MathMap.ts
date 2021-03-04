import { Container, MaskData } from "pixi.js";
import { OVector2 } from "../../utils/math/geom/OVector2";
import { GraphicAngle } from "./GraphicAngle";
import { GraphicCircle } from "./GraphicCircle";
import { GraphicCoords } from "./GraphicCoords";
import { GraphicDistance } from "./GraphicDistance";
import { GraphicGrid } from "./GraphicGrid";
import { GraphicRectangle } from "./GraphicRectangle";
import { GraphicShape } from "./GraphicShape";
import { GraphicSquare } from "./GraphicSquare";
import { GraphicText } from "./GraphicText";
import { GraphicVector } from "./GraphicVector";

/**
 * Container for grid, vector, and all graphic stuff.
 * @author Théo Sabattié
 */
export class MathMap 
{
    private _container:Container;   
    private _cellSize:number;
    private _originContainer:Container;
    private _gridContainer:Container;
    private _textsContainer:Container;
    private _vectorsContainer:Container;
    private _objectsContainer:Container;
    private _anglesContainer:Container;
    private _coordsContainer:Container;
    private _distancesContainer:Container;

    private _allTexts:GraphicText[];
    private _allDistances:GraphicDistance[];
    private _allAngles:GraphicAngle[];
    private _allVectors:GraphicVector[];
    private _allShapes:GraphicShape[];
    private _allCoords:GraphicCoords[];

    private _grid:GraphicGrid;
    private _originCircle:GraphicCircle;

    private _xAxis:GraphicVector;
    private _yAxis:GraphicVector;

	/**
	 * Constructor for MathMap
	 * @param pParent parent
	 * @param pCellSize cell size of grid, representing scale for graphics
	 */
    public constructor(pParent:Container, pCellSize:number) 
    {
        this._container = new Container();
        pParent.addChild(this._container);
        this._cellSize = pCellSize;
        
        this._originContainer    = new Container();
        this._gridContainer      = new Container();
        this._textsContainer     = new Container();
        this._vectorsContainer   = new Container();
        this._objectsContainer   = new Container();
        this._anglesContainer    = new Container();
        this._coordsContainer    = new Container();
        this._distancesContainer = new Container();

        this._allTexts     = [];
        this._allDistances = [];
        this._allAngles    = [];
        this._allVectors   = [];
        this._allShapes    = [];
        this._allCoords    = [];
        
        this._container.addChild(this._gridContainer);
        this._container.addChild(this._originContainer);
        this._container.addChild(this._objectsContainer);
        this._container.addChild(this._anglesContainer);
        this._container.addChild(this._coordsContainer);
        this._container.addChild(this._distancesContainer);
        this._container.addChild(this._vectorsContainer);
        this._container.addChild(this._textsContainer);
        
        this._init();
    }

    public get mask():Container | MaskData | null {
        return this._container.mask;
    }

    public set mask(pValue:Container | MaskData | null) {
        this._container.mask = pValue;
    }
    
    private _init():void 
    {
        this._grid = new GraphicGrid(this._gridContainer, this.cellSize);
        this._grid.lineStyle.color = 0xDDDDDD;
        
        this._originCircle = new GraphicCircle(this._originContainer, 5);
        this._originCircle.lineStyle.alpha = 0;
        this._originCircle.fillStyle.setColor(0xFFFFFF).setAlpha(1);
        this._originCircle.originLineStyle.alpha = 0;
        
        this._xAxis = new GraphicVector(this._originContainer, null, new OVector2(4));
        this._yAxis = new GraphicVector(this._originContainer, null, new OVector2(0, 4));
        
        this._xAxis.cellSize = this.cellSize;
        this._yAxis.cellSize = this.cellSize;
        
        this._yAxis.lineStyle.color = 0x00FF00;
        this._xAxis.lineStyle.color = 0xFF0000;
        
        this._yAxis.lineStyle.width = 3;
        this._xAxis.lineStyle.width = 3;
    }
    
	/**
	 * Add a GraphicAngle to the MathMap in the right container with the right scale
	 * @param pPosition : origin of the angle
	 * @param pStartAngle : Start angle in degree
	 * @param pEndAngle : End angle in degree
	 * @return the created GraphicAngle
	 */
    public addAngle(pPosition:OVector2, pStartAngle:number, pEndAngle:number):GraphicAngle {
        let lAngle:GraphicAngle = new GraphicAngle(this.anglesContainer, pStartAngle, pEndAngle, pPosition);
        lAngle.cellSize = this.cellSize;
        this._allAngles.push(lAngle);
        return lAngle;
    }
    
	/**
	 * Add GraphicVector to the MathMap in the right container with the right scale
	 * @param pFrom : position of the vector tail
	 * @param pTo : position of the vector head
	 * @return the created GraphicVector
	 */
    public addVector(pFrom:OVector2, pTo:OVector2):GraphicVector {
        let lVector:GraphicVector = new GraphicVector(this.vectorsContainer, pFrom, pTo);
        lVector.lineStyle.width   = 2;
        lVector.cellSize          = this.cellSize;
        
        this._allVectors.push(lVector);
        
        return lVector;
    }
    
	/**
	 * Add GraphicDistance to the MathMap in the right container with the right scale
	 * @param pFrom : first line extremity
	 * @param pTo : second line extremity
	 * @return the created GraphicDistance
	 */
    public addDistance(pFrom:OVector2, pTo:OVector2):GraphicDistance {
        let lDistance = new GraphicDistance(this._distancesContainer, pFrom, pTo);
        lDistance.cellSize = this.cellSize;
        
        this._allDistances.push(lDistance);
        
        return lDistance;
    }
    
	/**
	 * Add GraphicRectangle to the MathMap in the right container with the right scale
	 * @param pPosition the origin of the shape
	 * @param pWidth the width of the rectangle
	 * @param pHeight the height of the rectangle
	 * @return the created GraphicRectangle
	 */
    public addRectangle(pPosition:OVector2, pWidth:number, pHeight:number):GraphicRectangle {
        let lRectangle = new GraphicRectangle(this._objectsContainer, pWidth, pHeight);
        this._addShape(lRectangle, pPosition);
        return lRectangle;
    }
    
	/**
	 * Add GraphicSquare to the MathMap in the right container with the right scale
	 * @param pPosition the origin of the shape
	 * @param pSize the size of the square
	 * @return the created GraphicSquare
	 */
    public addSquare(pPosition:OVector2, pSize:number):GraphicSquare {
        let lSquare = new GraphicSquare(this._objectsContainer, pSize);
        this._addShape(lSquare, pPosition);
        return lSquare;
    }
    
	/**
	 * Add GraphicCircle to the MathMap in the right container with the right scale
	 * @param pPosition the origin of the shape
	 * @param pRadius the radius of the circle
	 * @return the created GraphicCircle
	 */
    public addCircle(pPosition:OVector2, pRadius:number):GraphicCircle {
        let lCircle = new GraphicCircle(this._objectsContainer, pRadius);
        this._addShape(lCircle, pPosition);
        return lCircle;
    }
	
	/**
	 * Add GraphicText to the MathMap in the right container with the right scale
	 * @param pPosition the origin of the shape
	 * @return the created GraphicText
	 */
    public addText(pPosition:OVector2 = null):GraphicText {
        let lText = new GraphicText(this._textsContainer);
		
		if (pPosition != null)
			lText.position = pPosition;
		
        lText.cellSize = this.cellSize;
		this._allTexts.push(lText);
        return lText;
    }
    
	/**
	 * Add GraphicCoords to the MathMap in the right container with the right scale
	 * @param pPosition the targeted coordinate
	 * @param pOrigin the origin
	 * @return the created GraphicCoords
	 */
    public addCoords(pPosition:OVector2, pOrigin:OVector2 = null):GraphicCoords 
    {
        let lCoords = new GraphicCoords(this._coordsContainer, pOrigin, pPosition);
        lCoords.cellSize = this.cellSize;
        lCoords.lineStyle.width = 2;
        lCoords.xColor = this._xAxis.lineStyle.color;
        lCoords.yColor = this._yAxis.lineStyle.color;
        this._allCoords.push(lCoords);
        return lCoords;
    }
    
    /**
     * @param pShape 
     * @param pPosition 
     */
    private _addShape(pShape:GraphicShape, pPosition:OVector2):void {
        pShape.position = pPosition;
        pShape.cellSize = this.cellSize;
        this._allShapes.push(pShape);
    }
	
	/**
	 * Determine if the given vector is in the MathMap
	 * @param pVector
	 * @return true if the given vector is in the MathMap
	 */
    public hasVector(pVector:GraphicVector):boolean {
        return this._allVectors.indexOf(pVector) != -1;
    }
    
    public get originContainer():Container 
    {
        return this._originContainer;
    }

    public get gridContainer():Container 
    {
        return this._gridContainer;
    }
    
    public get vectorsContainer():Container 
    {
        return this._vectorsContainer;
    }
    
    public get anglesContainer():Container
    {
        return this._anglesContainer;
    }
    
    public get objectsContainer():Container 
    {
        return this._objectsContainer;
    }
    
    public get coordsContainer():Container 
    {
        return this._coordsContainer;
    }
    
    public get distancesContainer():Container 
    {
        return this._distancesContainer;
    }
	
	public get textsContainer():Container 
    {
        return this._textsContainer;
    }
    
    public get grid():GraphicGrid
    {
        return this._grid;
    }
    
	/**
	 * Determine the cell size, impacting the graphic scale.
	 * <p>Modification will automatically be dispatch on all MathMap graphics</p>
	 * @see scheduleDraw
     * @type {number}
	 */
    public get cellSize():number {
        return this._cellSize;
    }
    
	/**
	 * The X axis
     * @type {GraphicVector}
	 */
    public get xAxis():GraphicVector 
    {
        return this._xAxis;
    }
    
	/**
	 * The Y axis
     * @type {GraphicVector}
	 */
    public get yAxis():GraphicVector 
    {
        return this._yAxis;
    }
    
	/**
	 * The circle representing the origin of the MathMap
     * @type {GraphicCircle}
	 */
    public get originCircle():GraphicCircle 
    {
        return this._originCircle;
    }
    
    public set cellSize(pValue:number) {
        pValue = Math.max(pValue, 1);
        
        this._cellSize       = pValue;
        this.grid.cellSize   = pValue;
        this._xAxis.cellSize = pValue;
        this._yAxis.cellSize = pValue;
        let i;

        for (i = this._allVectors.length - 1; i >-1; i--)
            this._allVectors[i].cellSize = pValue;
        
        for (i = this._allShapes.length - 1; i >-1; i--)
            this._allShapes[i].cellSize = pValue;
        
        for (i = this._allAngles.length - 1; i >-1; i--)
            this._allAngles[i].cellSize = pValue;
        
        for (i = this._allCoords.length - 1; i >-1; i--)
            this._allCoords[i].cellSize = pValue;
        
        for (i = this._allDistances.length - 1; i >-1; i--)
            this._allDistances[i].cellSize = pValue;
		
		for (i = this._allTexts.length - 1; i >-1; i--)
            this._allTexts[i].cellSize = pValue;
    }
}