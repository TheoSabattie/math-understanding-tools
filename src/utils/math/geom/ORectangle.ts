import { EventEmitter } from "eventEmitter3"
import { EventTypes } from "../../events/EventTypes";
import { Point } from "./OVector2";

export class ORectangle extends EventEmitter<EventTypes> {
    protected _x:number;
    protected _y:number;
    protected _width:number;
    protected _height:number;

    /**
     * 
     * @param pXMin 
     * @param pYMin 
     * @param pWidth 
     * @param pHeight 
     */
    public constructor(pXMin:number = 0, pYMin:number = 0, pWidth:number = 0, pHeight:number = 0){
        super();
        this._x      = pXMin;
        this._y      = pYMin;
        this._width  = pWidth;
        this._height = pHeight;
    }

    /**
	 * Set x and y coordinate then invoke EventTypes.CHANGE event
     * @param pWidth 
     * @param pHeight
	 * @returns the same instance to chain operations
     */
    public setSize(pWidth:number, pHeight:number):ORectangle {
        this._width = pWidth;
        this._height = pHeight;
        this._dispatchChangeEvent();
        return this;
    }

    /**
	 * Set xMin, yMax, width, height then invoke EventTypes.CHANGE event
     * @param pXMin 
     * @param pYMin 
     * @param pWidth 
     * @param pHeight 
	 * @returns the same instance to chain operations
     */
    public setMinAndSize(pXMin:number, pYMin:number, pWidth:number, pHeight:number):ORectangle {
        this._x = pXMin;
        this._y = pYMin;
        this._width = pWidth;
        this._height = pHeight;
        this._dispatchChangeEvent();
        return this;
    }

    protected _dispatchChangeEvent():void {
        this.emit(EventTypes.CHANGE);
    }

    /**
     * The min x of the rectangle. When this property is updated, the size of the rectangle is not modified.
     */
    public get x():number {
        return this._x;
    }

    public set x(pValue:number){
        this._x = pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The min y of the rectangle. When this property is updated, the size of the rectangle is not modified. 
     */
    public get y():number {
        return this._y;
    }

    public set y(pValue:number){
        this._y = pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The min x of the rectangle. When this property is updated, the size of the rectangle is modified to keep the same xMax.
     */
    public get xMin():number {
        return this._x;
    }

    public set xMin(pValue:number){
        let lXMax:number = this.xMax;
        this._x = pValue;
        this._width = lXMax - pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The min y of the rectangle. When this property is updated, the size of the rectangle is modified to keep the same yMax.
     */
    public get yMin():number {
        return this._y;
    }

    public set yMin(pValue:number){
        let lYMax:number = this.yMax;
        this._y = pValue;
        this._height = lYMax - pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The x center of the rectangle. When this property is updated, the size of the rectangle is not modified.
     */
    public get xCenter():number {
        return this._x + this._width/2;
    }

    public set xCenter(pValue:number) {
        this._x = pValue - this._width/2;
        this._dispatchChangeEvent();
    }

    /**
     * The y center of the rectangle. When this property is updated, the size of the rectangle is not modified.
     */
    public get yCenter():number {
        return this._y + this._height/2;
    }

    public set yCenter(pValue:number){
        this._y = pValue - this._height/2;
        this._dispatchChangeEvent();
    }

    /**
     * The width of the rectangle. When this property is updated, xMin keeps the same value. xMax is updated.
     */
    public get width():number {
        return this._width;
    }

    public set width(pValue:number){
        this._width = pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The height of the rectangle. When this property is updated, yMin keeps the same value. yMax is updated.
     */
    public get height():number {
        return this._height;
    }

    public set height(pValue:number){
        this._height = pValue;
        this._dispatchChangeEvent();
    }

    /**
     * The max x of the rectangle. When this property is updated, the size of the rectangle is modified to keep the same xMin.
     */
    public get xMax ():number {
        return this._x + this._width;
    }

    public set yMax(pValue:number) {
        this.height = pValue - this._y;
    }

    /**
     * The max y of the rectangle. When this property is updated, the size of the rectangle is modified to keep the same yMin.
     */
    public get yMax():number {
        return this._y + this._height;
    }

    public set xMax(pValue:number) {
        this.width = pValue - this._x;
    }

    public get center():Point {
        return {x:this.xCenter, y:this.yCenter};
    }

    public get min():Point {
        return {x : this.x, y:this.y};
    }

    public get max():Point {
        return {x:this.xMax, y:this.yMax};
    }

    /**
     * Does the point is contains by this Rectangle
     * @param {{x:number, y:number}} pPoint 
     * @returns {boolean}
     */
    public contains(pPoint:Point):boolean {
        return pPoint.x >= this.x && pPoint.x <= this.xMax && pPoint.y >= this.y && pPoint.y <= this.yMax; 
    }

    /**
     * Return a copy of this rectangle
     * @returns {ORectangle}
     */
    public clone():ORectangle {
        return new ORectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * 
     * @param {ORectangle} pRectangle
     * @returns {boolean} 
     */
    public equals(pRectangle:ORectangle):boolean {
        return this.x == pRectangle.x && this.y == pRectangle.y && this.width == pRectangle.width && this.height == pRectangle.height;
    }
}