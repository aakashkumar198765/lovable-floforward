class ValidUtils {
    static isEmptyObj (obj : object) : boolean {
        if(!obj || Object.keys(obj).length === 0)return true;
        return false;
    }

    static isEmptyStr (str : string) : boolean {
        if(!str || str.length === 0)return true;
        return false;
    }

    static isEmptyArr (arr : Array<any>) : boolean {
        if(!arr || arr.length === 0)return true;
        return false;
    }
}

export default ValidUtils;