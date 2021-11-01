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
	 * Linear interpolation between pFrom and pTo using pCoeff factor
     * pCoeff will be clamped between 0 and 1
     * @param {number} pFrom
     * @param {number} pTo
     * @param {number} pCoeff
     * @return {number}
     */
    public static lerp(pFrom:number, pTo:number, pCoeff:number):number {
		return MathTools.lerpUnclamped(pFrom, pTo, MathTools.clamp(pCoeff));
	}

	/**
	 * Linear interpolation between pFrom Color and pTo Color using pCoeff factor (lerpColor decomposes RGB channels to make smooth transition)
     * Note: pCoeff is not clamped between 0 and 1
	 * @param {number} pFrom 
	 * @param {number} pTo 
	 * @param {number} pCoeff 
	 * @returns {number} 
	 */
	public static lerpColor(pFrom:number, pTo:number, pCoeff:number):number {
		let lFromRed:number   = (pFrom & 0xFF0000) >> 16;
		let lFromGreen:number = (pFrom & 0x00FF00) >> 8;
		let lFromBlue:number  = (pFrom & 0x0000FF);

		let lToRed:number   = (pTo & 0xFF0000) >> 16;
		let lToGreen:number = (pTo & 0x00FF00) >> 8;
		let lToBlue:number  = (pTo & 0x0000FF);

		let lResultRed:number   = lFromRed   + pCoeff * (lToRed   - lFromRed);
		let lResultGreen:number = lFromGreen + pCoeff * (lToGreen - lFromGreen);
		let lResultBlue:number  = lFromBlue  + pCoeff * (lToBlue  - lFromBlue);

  		return (lResultRed << 16) + (lResultGreen << 8) + (lResultBlue | 0);
	}
	
    /**
	 * Linear interpolation between pFrom and pTo using pCoeff factor
     * @param {number} pFrom
     * @param {number} pTo
     * @param {number} pCoeff
     * @return {number}
     */
	public static lerpUnclamped(pFrom:number, pTo:number, pCoeff:number):number {
		return pCoeff * (pTo - pFrom) + pFrom;
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
	 * Linear interpolation between pFrom and pTo using distance pDistance
	 * @param {number} pFrom
	 * @param {number} pTo
	 * @param {number} pDistance
	 * @return {number}
	 */
    public static moveTowards(pFrom:number, pTo:number, pDistance:number):number {
        pDistance = Math.abs(pDistance);
        
        if (Math.abs(pTo - pFrom) < pDistance){
            return pTo;
        }
        
        if (pTo > pFrom){
            return pFrom + pDistance;
        } else
            return pFrom - pDistance;
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