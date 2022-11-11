//https://blog.csdn.net/to_the_Future/article/details/126920675
export {};
//Exclude : 差集  A - B (从A中提出B中有的值)
//如果A、B是联合类型，则 A extends B 满足分布条件，排除
//如果A、B是interface 则和class类似，即A extends B是指A中是否包含了B种所有的属性
type SetDifference<A,B> = A extends B ? never : A;

type A = string | number;
type B = number | boolean;
type AB = SetDifference<A,B>;

/**
 * Omit  忽略某些属性
 * {name: string;visible: boolean;}
*/

//keyof T = name | age | visible;
//K = age
//SetDifference<keyof T,K> = name | visible
//Pick = {name:string,visible:boolean}
type Omit<T,K extends keyof any> = Pick<T,SetDifference<keyof T,K>>;

type Props = {name:string,age:number,visible:boolean};
type OmitAgeProps = Omit<Props,'age'>;
type OmitAgeProps2 = Pick<Props,'name'|'visible'>;


namespace na{
    /**   对象中剔除对象属性
     * 需求： Props:{name:string,age:number,visible:boolean}  剔除  DefaultProps:{age:number}
     * 结果：获得 {name:string,visible:boolean}
     * 和上面的不同是 DefaultProps 是个对象
     */
    type Props = {name:string,age:number,visible:boolean};
    type DefaultProps = {age:number};
    type Omit<T,K extends object> = Pick<T,SetDifference<keyof T,keyof K>>;
    type OmitObjAgeProps = Omit<Props,DefaultProps>;
}

namespace nb{
    //InterSection 交集   对象中拿到对象交集属性
    type InterSection<T extends object,U extends object> = Pick<T,Extract<keyof T,keyof U>>;
    type Props = {name:string,age:number,visible:boolean};
    type DefaultProps = {age:number};
    type InterSectionAttr = InterSection<Props,DefaultProps>;
}

namespace nc{
    //OverWrite
    type Props = {name:string,age:number,visible:boolean};
    type DefaultProps = {age:string,other:string};

    type Omit<T,K extends object> = Pick<T,SetDifference<keyof T,keyof K>>;
    type OverWrite<T extends object,U extends object,I = Omit<T,U> & U> = Pick<I,keyof I>;
    type NewProps = OverWrite<Props,DefaultProps>; //{name:string,age:string,visible:boolean,other:string}
}

 
 