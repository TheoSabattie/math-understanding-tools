import EventTypes from "../../events/EventTypes";
import OVector2 from "./OVector2";
import { Point } from "./OVector2";

export default class ORectangle extends EventTarget {
    protected _xMin:number;
    protected _yMin:number;
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
        this._xMin   = pXMin;
        this._yMin   = pYMin;
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

    protected _dispatchChangeEvent():void {
        this.dispatchEvent(new Event(EventTypes.CHANGE));
    }

    get xMin():number {
        return this._xMin;
    }

    get yMin():number {
        return this._yMin;
    }

    get xCenter():number {
        return this._xMin + this._width/2;
    }

    get yCenter():number {
        return this._yMin + this._height/2;
    }

    set yMin(pValue:number){
        this._yMin = pValue;
        this._dispatchChangeEvent();
    }

    get width():number {
        return this._width;
    }

    get height():number {
        return this._height;
    }

    set width(pValue:number){
        this._width = pValue;
        this._dispatchChangeEvent();
    }

    set height(pValue:number){
        this._height = pValue;
        this._dispatchChangeEvent();
    }

    set xMin(pValue:number){
        this._xMin = pValue;
        this._dispatchChangeEvent();
    }

    get xMax ():number {
        return this._xMin + this._width;
    }

    get yMax():number {
        return this._yMin + this._height;
    }

    set yMax(pValue:number){
        this.height = pValue - this._yMin;
    }

    set xMax(pValue:number){
        this.width = pValue - this._xMin;
    }

    get center():OVector2{
        return new OVector2(this.xCenter, this.yCenter);
    }

    get min():OVector2{
        return new OVector2(this.xMin, this.yMin);
    }

    get max():OVector2{
        return new OVector2(this.xMax, this.yMax);
    }

    /**
     * Does the point is contains by this Rectangle
     * @param {{x:number, y:number}} pPoint 
     * @returns {boolean}
     */
    public contains(pPoint:Point):boolean {
        return pPoint.x >= this.xMin && pPoint.x <= this.xMax && pPoint.y >= this.yMin && pPoint.y <= this.yMax; 
    }

    /**
     * Return a copy of this rectangle
     * @returns {ORectangle}
     */
    public clone():ORectangle {
        return new ORectangle(this.xMin, this.yMin, this.width, this.height);
    }

    /**
     * 
     * @param {ORectangle} pRectangle
     * @returns {boolean} 
     */
    public equals(pRectangle:ORectangle):boolean {
        return this.xMin == pRectangle.xMin && this.yMin == pRectangle.yMin && this.width == pRectangle.width && this.height == pRectangle.height;
    }
}