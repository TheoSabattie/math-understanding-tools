import { EventEmitter } from "eventEmitter3"
import { EventTypes } from "../../events/EventTypes";
import { MathTools } from "../MathTools";

export type Point = {
	x:number,
	y:number
}

/**
 * Observable vector, same things that vector, but all changes will be marked by an event
 */
export class OVector2 extends EventEmitter<EventTypes>
{
	protected _x:number;
	protected _y:number;

	/**
	 * Creates a new vector. If you pass no parameters to this method, a vector is created at (0,0).
	 * @param pX The horizontal coordinate 
	 * @param pY The vertical coordinate 
	 */
	public constructor(pX:number = 0, pY:number = 0){
		super();
		this._x = pX;
		this._y = pY;
	}

    protected _dispatchChangeEvent():void {
        this.emit(EventTypes.CHANGE);
    }
    
	/**
	 * The magnitude (length) of this vector.
	 * @returns 
	 */
    public get magnitude ():number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }
    
	/**
	 * Returns the distance from this vector to pA
	 * @param pA 
	 * @returns 
	 */
	public distance(pA:Point):number {
		return OVector2.distance(this, pA);
	}

	/**
	 * Returns the distance between pA and pB.
	 * @param pA The first vector.
	 * @param pB The second vector.
	 * @return The distance between the first and second vectors.
	 */
    public static distance(pA:Point, pB:Point):number {
        return OVector2.substract(pA, pB).magnitude;
    }
    
	/**
	 * Subtracts the coordinates of pA from this vector 
	 * @param pA The vector to be subtracted.
	 * @returns the same instance to chain operations
	 */
    public subtract(pA:Point):OVector2 {
		this._x -= pA.x;
		this._y -= pA.y;
		this._dispatchChangeEvent();
		return this;
    }

	/**
	 * Subtracts the coordinates of pA to pB and return a new OVector2
	 * @param pA 
	 * @param pB
	 * @returns a new instance of OVector2 resulting from the operation
	 */
	public static substract(pA:Point, pB:Point):OVector2 {
		return new OVector2(pA.x - pB.x, pA.y - pB.y);
	}

	/**
	 * Adds the coordinates of pA vector with the coordinates of pB vector to create a new vector.
	 * @param pA 
	 * @param pB 
	 * @returns a new instance of OVector2 resulting from the operation
	 */
	public static add(pA:Point, pB:Point):OVector2 {
		return new OVector2(pA.x + pB.x, pA.y + pB.y);
	}
    
	/**
	 * Adds the coordinates of another vector to this vector.
	 * @param pA The vector to be added.
	 * @returns the same instance to chain operations
	 */
    public add(pA:Point):OVector2 {
		this._x += pA.x;
		this._y += pA.y;
		this._dispatchChangeEvent();
		return this;
    }
    
	/**
	 * Determines whether two vectors are equal. Two vectors are equal if they have the same x and
	 * y values.
	 * @param pToCompare The vector to be compared.
	 * @return A value of true if the object is equal to this vector object; false if it is not equal.
	 */
    public equals(pToCompare:Point):boolean {
        return this._x == pToCompare.x && this._y == pToCompare.y;
    }
    
	/**
	 * Determines a vector between two specified vectors. The parameter pFactor 
	 * determines where the new interpolated vector is located relative to the two end vectors 
	 * specified by parameters pA and pB. The closer the value of the parameter
	 * pFactor is to 1.0, the closer the interpolated vector is to the
	 * first vector (parameter pA). The closer the value of the parameter f is
	 * to 0, the closer the interpolated vector is to the second vector (parameter pB).
	 * @param pA The first vector.
	 * @param pB The second vector.
	 * @param pFactor The level of interpolation between the two vectors. Indicates where the new vector will be, along the line 
	 *   between pA and pB. If pFactor=1, pA is returned; if 
	 *   pFactor=0, pB is returned.
	 * @return The new, interpolated vector.
	 */
    public static lerp(pA:Point, pB:Point, pFactor:number):OVector2 {
        return OVector2.lerpUnclamped(pA, pB, MathTools.clamp(pFactor));
    }

	/**
	 * Linear interpolation between pMin and pMax using pCoeff factor
     * @param pMin
     * @param pMax
     * @param pFactor
	 * @returns a new instance of OVector2 resulting from the operation
     */
	public static lerpUnclamped(pA:Point, pB:Point, pFactor:number):OVector2 {
		return new OVector2(MathTools.lerpUnclamped(pA.x, pB.x, pFactor), MathTools.lerpUnclamped(pA.y, pB.y, pFactor));
	}
    
	/**
	 * Linear interpolation between pA and pB using distance pDistance
	 * @param pA
	 * @param pB
	 * @param pDistance
	 * @returns a new instance of OVector2 resulting from the operation
	 */
    public static moveTowards(pA:Point, pB:Point, pDistance:number):OVector2 {
        let lAToB = OVector2.substract(pB, pA);
        
        if (lAToB.magnitude <= pDistance)
            return new OVector2(pB.x, pB.y);
        
        lAToB.normalize(pDistance);
        return OVector2.add(pA, lAToB);
    }
    
	/**
	 * Reduce the magnitude (length) of the given pA OPoint to pMaxMagnitude if its magnitude exceed pMaxMagnitude
	 * @param pA
	 * @param pMaxMagnitude
	 * @returns a new instance of OVector2 resulting from the operation
	 */
    public static clampMagnitude(pA:Point, pMaxMagnitude:number):OVector2 {
		return new OVector2(pA.x, pA.y).clampMagnitude(pMaxMagnitude);
    }

	/**
	 * Reduce the magnitude (length) if its magnitude exceed pMaxMagnitude
	 * @param pMaxMagnitude
	 * @returns the same instance to chain operations
	 */
	public clampMagnitude(pMaxMagnitude:number):OVector2 {
		if (this.magnitude > pMaxMagnitude)
			this.normalize(pMaxMagnitude);
		
		return this;
	}

	/**
	 * Return the dot product of pA pB
	 * @param pA
	 * @param pB
	 * @return
	 */
	public static dotProduct(pA:Point, pB:Point):number {
		return pA.x * pB.x + pA.y * pB.y;
	}

	/**
	 * Return the angle (radian) between pA and pB
	 * @param pA
	 * @param pB
	 * @return The angle in radian
	 */
	public static angleBetween(pA:Point, pB:Point):number {
		return Math.acos(OVector2.dotProduct(OVector2.normalize(pA), OVector2.normalize(pB)));
	}

	/**
	 * Return the magnitude (length) of a vector
	 * @param pVector 
	 * @return
	 */
	public static getMagnitude(pVector:Point):number {
		return Math.sqrt(pVector.x * pVector.x + pVector.y * pVector.y);
	}

	/**
	 * @param pVector 
	 * @param pLength 
	 * @returns a new instance of OVector2 resulting from the operation
	 */
	public static normalize(pVector:Point, pLength:number = 1):OVector2 {
		return new OVector2(pVector.x, pVector.y).normalize(pLength);
	}

	/**
	 * Scales the line segment between (0,0) and the current vector to a set length. Then dispatch EventTypes.CHANGE event.
	 * @param pThickness The scaling value. For example, if the current vector is (0,5), 
	 *   and you normalize it to 1, the vector returned is at (0,1).
	 * @returns the same instance to chain operations
	 */
    public normalize(pThickness:number = 1):OVector2 {
        let lLength = this.magnitude;
        
        this._x /= lLength / pThickness;
        this._y /= lLength / pThickness;
        
        this._dispatchChangeEvent();
		return this;
    }
    
	/**
	 * Converts a pair of polar coordinates to a Cartesian vector coordinate.
	 * @param pLength	The length coordinate of the polar pair.
	 * @param pAngle	The angle, in radians, of the polar pair.
	 * @return The Cartesian vector.
	 */
    public static polar(pLength:number, pAngle:number):OVector2 {
        let lRadian = pAngle * MathTools.DEG2RAD;
        return new OVector2(Math.cos(lRadian) * pLength, Math.sin(lRadian) * pLength);
    }
    
	/**
	 * Set x and y coordinate then invoke EventTypes.CHANGE event
	 * @param pX The horizontal coordinate of the vector.
	 * @param pY The vertical coordinate of the vector.
	 * @returns the same instance to chain operations
	 */
    public setTo(pX:number, pY:number):OVector2 {
        this._x = pX;
        this._y = pY;
        
        this._dispatchChangeEvent();
		return this;
    }
    
	/**
	 * Copy coordinate of the given vector pA to this instance then dispatch EventTypes.CHANGE event.
	 * @param pA
	 * @returns the same instance to chain operations
	 */
    public copyFrom(pA:Point):OVector2 {
        this._x = pA.x;
        this._y = pA.y;
        
        this._dispatchChangeEvent();
		return this;
    }
    
	/**
	 * Copy the coordinate of the instance to the given vector pA
	 * @param pA 
	 * @returns the same instance to chain operations
	 */
	public copyTo(pA:Point):OVector2{
		pA.x = this._x;
		pA.y = this._y;
		return this;
	}

	/**
	 * Creates a copy of this vector object.
	 * @return The new vector object.
	 */
    public clone():OVector2 {
        return new OVector2(this._x, this._y);
    }
    
    public set x(pValue:number) {
        this._x = pValue;
        this._dispatchChangeEvent();
    }
    
    public set y(pValue:number) {
        this._y = pValue;
        this._dispatchChangeEvent();
    }
    
	/**
	 * The horizontal coordinate of the vector. The default value is 0.
	 * <p>Modification will invoke EventTypes.CHANGE event</p>
	 */
    public get x():number {
        return this._x;
    }
    
	/**
	 * The vertical coordinate of the vector. The default value is 0.
	 * <p>Modification will invoke EventTypes.CHANGE event</p>
	 */
    public get y():number {
        return this._y;
    }
    
	/**
	 * Returns a string that contains the values of the x and y coordinates.
	 * 
	 *   The string has the form "(x=x, y=y)", so calling the toString()
	 * method for a vector at 23,17 would return "(x=23, y=17)".
	 * @return The string representation of the coordinates.
	 */
    public toString():string {
        return "(x="+this._x+", y="+this._y+")";
    }
    
	/**
	 * Create a OVector2 from vector using same coordinates
	 * @param pPoint
	 * @return created OVector2
	 */
    public static from(pPoint:Point):OVector2 {
        return new OVector2(pPoint.x, pPoint.y);
    }
}