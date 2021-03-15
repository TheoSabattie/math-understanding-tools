import { MathTools } from ".";

describe("MathTools", () => {
    describe("randomRange(pMin, pMax)", () => {
        it("Returned value must be less than pMax", () => {
            expect(MathTools.randomRange(0, 1)).toBeLessThan(1);
        });

        it("Returned value must be greater than pMin", () => {
            expect(MathTools.randomRange(0, 1)).toBeGreaterThan(0);
        });
    });

    describe("clamp(pValue, pMin, pMax)", () => {
        it("If pValue is greater than pMax, return pMax", ()=>{
            expect(MathTools.clamp(5, 1, 2)).toBe(2);
        });

        it("If pValue is less than pMin, return pMin", () => {
            expect(MathTools.clamp(-5, 1, 2)).toBe(1);
        });

        it("If pValue does not exceed the range (pMin, pMax), return pValue", ()=> {
            expect(MathTools.clamp(1.2, 1, 2)).toBe(1.2);
        });
    });

    describe("RAD2DEG", ()=> {
        it("Multiply this factor with an angle in radian give its degree value", ()=>{
            expect(Math.PI * MathTools.RAD2DEG).toBe(180);
        });
    });

    describe ("DEG2RAD", ()=> {
        it("Multiply this factor with an angle in degree give its radian value", ()=>{
            expect(180 * MathTools.DEG2RAD).toBe(Math.PI);
        });
    });

    describe("roundTo(pNumber, pNDigit)", ()=>{
        describe("Return pNumber with pNDigit", ()=> {
            it.each([
                [1.123456789, 2, 2],
                [1.123456789, 4, 4],
                [1.123456789, 6, 6]
            ])("roundTo(%d, %i) must return %i digit", (pValue, pNDigit)=> {
                expect(MathTools.roundTo(pValue, pNDigit).toString().split(".")[1].length).toBe(pNDigit);
            })
        });

        describe("Returned digit are rounded", ()=>{
            it.each([
                [1.123, 2, 1.12],
                [1.125, 2, 1.13],
                [1.126, 2, 1.13],
                [-1.125, 2, -1.12],
                [-1.126, 2, -1.13],
                [-1.122, 2, -1.12],
                [1234, -2, 1200],
            ])("roundTo(%d, %d) must return %d", (pNumber, pNDigit, pExpected)=>{
                expect(MathTools.roundTo(pNumber, pNDigit)).toBe(pExpected);
            });
        });
    });

    describe ("moveTowards(pA, pB, pDistance)", ()=>{
        it("Do not exceed pB if pDistance is greater that the distance between pA and pB", ()=>{
            expect(MathTools.moveTowards(1, 10, 90)).toBe(10);
            expect(MathTools.moveTowards(-1, -10, -90)).toBe(-10);
        });

        it ("Move from pA towards pB with pDistance", ()=>{
            expect(MathTools.moveTowards(1, 10, 5)).toBe(6);
            expect(MathTools.moveTowards(180, 90, 40)).toBe(140);
            expect(MathTools.moveTowards(1, -10, 5)).toBe(-4);
        })
    });

    describe ("lerpUnclamped", ()=>{
        it ("lerpUnclamped(1, 2, .5) must return linear interpolation (1.5)", ()=>{
            expect(MathTools.lerpUnclamped(1,2,.5)).toBe(1.5);
        });

        it ("lerpUnclamped does not clamp pCoeff factor", ()=>{
            expect(MathTools.lerpUnclamped(1,2,2)).toBe(3);
            expect(MathTools.lerpUnclamped(1,2,-1)).toBe(0);
        });
    });

    describe ("lerp", ()=> {
        it ("lerp(1, 2, .5) must return linear interpolation (1.5)", ()=>{
            expect(MathTools.lerp(1,2,.5)).toBe(1.5);
        });

        it ("lerp clamps pCoeff factor (returned value cannot be less than pMin and greater than pMax)", ()=>{
            expect(MathTools.lerp(1,2,2)).toBe(2);
            expect(MathTools.lerp(1,2,-1)).toBe(1);
        })
    });

    describe ("isClose", ()=>{
        it("isClose returns true if pA is close to pB from pThreeshold", ()=>{
            expect(MathTools.isClose(4, 5, 1)).toBe(true);
        });

        it("isClose returns false if the distance between pA and pB exceed pThreeshold", ()=>{
            expect(MathTools.isClose(4, 5, .5)).toBe(false);
        });

        it("pThreeshold default value is 0.01", ()=>{
            expect(MathTools.isClose(4, 5)).toBe(false);
            expect(MathTools.isClose(4, 4.01)).toBe(true);
            expect(MathTools.isClose(4, 4.0101)).toBe(false);
        });
    });
});
