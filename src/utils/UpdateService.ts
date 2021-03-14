export interface IUpdatable {
    update():void;
}

const idSymbol = Symbol("id");
const symbolsToBindedUpdates:any = {};
const allCallbacks:Array<()=>void> = []; 
var deltaTime:number;

function getIdSymbol(pObject:any) {
    if (pObject[idSymbol] == undefined)
        return pObject[idSymbol] = Symbol(pObject);
    
    return pObject[idSymbol];
}

export class UpdateService {
    public static get deltaTime():number {
        return deltaTime;
    }

    /**
     * @param {number} pDeltaTime 
     */
    public static update(pDeltaTime:number):void {
        deltaTime = pDeltaTime;

        let copy:Array<()=>void> = allCallbacks.slice(0);
        let length:number        = allCallbacks.length;

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
        else {
            if (symbolsToBindedUpdates[getIdSymbol(pUpdatable)] != null)
                return false;
            
            lUpdate = pUpdatable.update.bind(pUpdatable);
            symbolsToBindedUpdates[getIdSymbol(pUpdatable)] = lUpdate;
        }

        if (allCallbacks.indexOf(lUpdate) != -1 || lUpdate == null)
            return false;
        
        allCallbacks.push(lUpdate);
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
        else{
            lUpdate = symbolsToBindedUpdates[getIdSymbol(pUpdatable)];
            delete symbolsToBindedUpdates[getIdSymbol(pUpdatable)];
        }
        
        let lIndex = allCallbacks.indexOf(lUpdate);

        if (lIndex == -1)
            return false;
        
        allCallbacks.splice(lIndex, 1);
        return true;
    }
}