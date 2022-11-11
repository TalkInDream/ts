export {};
/**
 * T extends any  =  any的子类型
 * T extends keyof any = string | number | symbol
 * @ts
*/

namespace na{
    type O1 = {
        id:number,
        name:string
    }

    type O2 = {
        id:number,
        age:number
    }

    //{id:numner,name:string,age:number}
    type Compute<T extends any> = T extends Function ? T : { [K in keyof T]: T[K] };
    type SetDifference<T,U> = T extends U ? never : T;
    type Omit<T,U extends keyof any> = Pick<T,SetDifference<keyof T,U>>
    // type Merge<T extends object,K extends object> = O1 & Omit<O2,keyof O1>;
    type Merge<T extends object,K extends object> = Compute<O1 & Omit<O2,keyof O1>>;
    type R2 = Merge<O1,O2>;
    let a:R2 = {
        id:10,
        name:'string',
        age:5
    }


}