import {Graphics, LINE_CAP, LINE_JOIN} from 'pixi.js';
import { OStyle } from './OStyle';

export class OLineStyle extends OStyle 
{
    protected _width:number;
    protected _native:boolean;
    protected _cap:LINE_CAP|undefined;
    protected _join:LINE_JOIN|undefined;
    protected _miterLimit:number;
    protected _alignement:number;

    constructor() 
    {
        super();
        this._width      = 1;
        this._native     = false;
        this._cap        = undefined;
        this._join       = undefined;
        this._miterLimit = 10;
        this._alignement = 0.5;
    }
    
    /**
     * Set width of the instance then return it
     * @param pWidth 
     * @returns the same instance to chain operations
     */
    public setWidth(pWidth:number):OLineStyle {
        this.width = pWidth;
        return this;
    }
    
    /**
     * Set the native of the instance then return it
     * @param pNative 
     * @returns the same instance to chain operations
     */
    public setNative(pNative:boolean):OLineStyle {
        this.native = pNative;
        return this;
    }
    
    /**
     * Set the cap of the instance then return it
     * @param pCap 
     * @returns the same instance to chain operations
     */
    public setCap(pCap:LINE_CAP):OLineStyle {
        this.cap = pCap;
        return this;
    }
    
    /**
     * Set the join of the instance then return it
     * @param pJoin 
     * @returns the same instance to chain operations
     */
    public setJoin(pJoin:LINE_JOIN):OLineStyle {
        this.join = pJoin;
        return this;
    }
    
    /**
     * Set the miterLimit of the instance then return it
     * @param pMiterLimit 
     * @returns the same instance to chain operations
     */
    public setMiterLimit(pMiterLimit:number):OLineStyle {
        this.miterLimit = pMiterLimit;
        return this;
    }

    /**
     * Set the alignement of the instance then return it
     * @param pAlignement 
     * @returns the same instance to chain operations
     */
    public setAlignement(pAlignement:number):OLineStyle{
        this.alignement = pAlignement;
        return this;
    }
    
    /**
     * Alignement used for line
     */
    public get alignement():number{
        return this._alignement;
    } 

    public set alignement(pValue:number){
        this._alignement = pValue;
        this._dispatchChangeEvent();
    }

    /**
     * Width used for line
     */
    public get width():number 
    {
        return this._width;
    }
    
    public set width(pValue:number) 
    {
        this._width = pValue;
        this._dispatchChangeEvent();
    }
    
    /**
     * Pixel Hinting used for line
     */
    public get native():boolean 
    {
        return this._native;
    }
    
    public set native(pValue:boolean) 
    {
        this._native = pValue;
        this._dispatchChangeEvent();
    }
    
    /**
     * Cap used for line
     */
    public get cap():LINE_CAP|undefined
    {
        return this._cap;
    }
    
    public set cap(pValue:LINE_CAP|undefined) 
    {
        if (!this._isValidCap(pValue))
            throw new Error("pValue \"" + pValue + "\" is not a valid value for caps, use CapsStyle constants to prevent error. null is accepted.");
        
        this._cap = pValue;
        this._dispatchChangeEvent();
    }
    
    /**
     * Join used for line
     */
    public get join():LINE_JOIN|undefined
    {
        return this._join;
    }
    
    public set join(pValue:LINE_JOIN|undefined)
    {
        if (!this._isValidJoin(pValue))
            throw new Error("pValue \"" + pValue + "\" is not a valid value for joins, use JoinStyle constants to prevent error. null is accepted.");
        
        this._join = pValue;
        this._dispatchChangeEvent();
    }
    
    /**
     * MiterLimit used for line
     */
    public get miterLimit():number 
    {
        return this._miterLimit;
    }
    
    public set miterLimit(pValue:number) 
    {
        this._miterLimit = pValue;
        this._dispatchChangeEvent();
    }
    
    /**
     * Check the validity of pCap
     * @param pCap 
     * @returns true if the pCap is valid
     */
    protected _isValidCap(pCap:LINE_CAP|undefined):boolean
    {
        if (pCap == null)
            return true; 
        
        return Object.values(LINE_CAP).indexOf(pCap) != -1;
    }
    
    /**
     * Check the validity of pJoin
     * @param pJoin
     * @returns true if the pJoin is valid
     */
    protected _isValidJoin(pJoin:LINE_JOIN|undefined):boolean 
    {
        if (pJoin == null)
            return true;
        
        return Object.values(LINE_JOIN).indexOf(pJoin) != -1;
    }
    
    /**
     * Create a copy of this instance then return it
     * @returns 
     */
    public clone():OLineStyle {
        let lCopy         = new OLineStyle();
        lCopy._alpha      = this._alpha;
        lCopy._color      = this._color;
        lCopy._width      = this._width;
        lCopy._native     = this._native;
        lCopy._cap        = this._cap;
        lCopy._join       = this._join;
        lCopy._miterLimit = this._miterLimit;
        
        return lCopy;
    }
    
    /**
     * Apply style to a graphics
     */
    public applyToGraphics(pGraphics:Graphics):void {
        pGraphics.lineStyle({
            alignment  : this._alignement,
            alpha      : this._alpha,
            cap        : this._cap,
            color      : this._color,
            join       : this._join,
            miterLimit : this._miterLimit,
            native     : this._native,
            width      : this._width,
        });
    }
}