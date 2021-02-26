export interface IUpdatable{
    update():void;
}

export default class UpdateService {
    private static _deltaTime:number;
    private static _allCallbacks:Array<()=>void> = []; 

    public static get deltaTime():number {
        return UpdateService._deltaTime;
    }

    /**
     * @param {number} pDeltaTime 
     */
    public static update(pDeltaTime:number):void {
        UpdateService._deltaTime = pDeltaTime;

        let copy:Array<()=>void> = UpdateService._allCallbacks.slice(0);
        let length:number        = UpdateService._allCallbacks.length;

        for (let i:number = 0; i < length; i++){
            copy[i]();
        }
    }

    /**
     * Add an updatable to the Update Service
     * @param pUpdatable 
     * @returns true if the updatable has been added
     */
    public static add(pUpdatable:IUpdatable | (()=>void)):boolean {
        let lUpdate:()=>void;

        if (pUpdatable instanceof Function)
            lUpdate = pUpdatable;
        else 
            lUpdate = pUpdatable.update;

        if (UpdateService._allCallbacks.indexOf(lUpdate) != -1)
            return false;
        
        UpdateService._allCallbacks.push(lUpdate);
        return true;
    }

    /**
     * Remove an updatable to the Update Service
     * @param pUpdatable
     * @returns true if has been removed
     */
    public static remove(pUpdatable:IUpdatable | (()=>void)){
        let lUpdate:()=>void;

        if (pUpdatable instanceof Function)
            lUpdate = pUpdatable;
        else 
            lUpdate = pUpdatable.update;
        
        let lIndex = UpdateService._allCallbacks.indexOf(lUpdate);

        if (lIndex == -1)
            return false;
        
        UpdateService._allCallbacks.splice(lIndex, 1);
        return true;
    }
}