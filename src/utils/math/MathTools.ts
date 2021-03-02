const DEG2RAD:number = Math.PI / 180;
const RAD2DEG:number = 180 / Math.PI;

export class MathTools
{
	/**
	 * Factor to multiply with to get radian from degree
	 */
	public static get DEG2RAD():number {
		return DEG2RAD;
	}

	/**
     * Factor to multiply with to get degree from radian
     */
	public static get RAD2DEG():number {
		return RAD2DEG; 
	}
		
	/**
	 * Return a random value between pMin and pMax
	 * @param {number} pMin
	 * @param {number} pMax
	 * @return {number}
	 */
	public static randomRange(pMin:number, pMax:number):number
	{
		return MathTools.lerpUnclamped(pMin, pMax, Math.random());
	}
    
    /**
	 * Return pValue without exceeding pMin and pMax
     * @param {number} pValue
     * @param {number} pMin
     * @param {number} pMax
     * @return {number}
     */
	public static clamp(pValue:number, pMin:number = 0, pMax:number = 1):number {
		if (pValue > pMax) return pMax;
		if (pValue < pMin) return pMin;
		return pValue;
	}
    
    /**
	 * Linear interpolation between pMin and pMax using pCoeff factor
     * pCoeff will be clamped between 0 and 1
     * @param {number} pMin
     * @param {number} pMax
     * @param {number} pCoeff
     * @return {number}
     */
    public static lerp(pMin:number, pMax:number, pCoeff:number):number {
		return MathTools.lerpUnclamped(pMin, pMax, MathTools.clamp(pCoeff));
	}
	
    /**
	 * Linear interpolation between pMin and pMax using pCoeff factor
     * @param {number} pMin
     * @param {number} pMax
     * @param {number} pCoeff
     * @return {number}
     */
	public static lerpUnclamped(pMin:number, pMax:number, pCoeff:number):number {
		return pCoeff * (pMax - pMin) + pMin;
	}
    
    /**
	 * Determine if pA is near pB (max distance determining if that is near : pThreshold)
     * @param {number} pA
     * @param {number} pB
     * @param {number} pThreshold
     * @return {boolean} true if near
     */
    public static isClose(pA:number, pB:number, pThreshold:number = 0.01):boolean {
		return Math.abs(pA - pB) <= pThreshold;
	}
    
	/**
	 * Linear interpolation between pA and pB using distance pDistance
	 * @param {number} pA
	 * @param {number} pB
	 * @param {number} pDistance
	 * @return {number}
	 */
    public static moveTowards(pA:number, pB:number, pDistance:number):number {
        pDistance = Math.abs(pDistance);
        
        if (Math.abs(pB - pA) < pDistance){
            return pB;
        }
        
        if (pB > pA){
            return pA + pDistance;
        } else if (pB < pA){
            return pA - pDistance;
        }
        
        return pB;
    }
    
	/**
	 * Return given pNumber with pNDigit
	 * @param {number} pNumber
	 * @param {number} pNDigit (if pNDigit = 0, return int, if pNDigit = 1 -> return 0.5, 2 -> 0.54, etc...)
	 * @return {number}
	 */
    public static roundTo(pNumber:number, pNDigit:number):number 
    {
        let lPower = Math.pow(10, pNDigit);
        return Math.round(pNumber * lPower) / lPower;
    }
}