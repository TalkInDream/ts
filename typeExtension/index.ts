/** //StringConstructor 内置接口
 * 导出时候 String是局部变量，所以需要变成全局的才能扩展。 
 * declare const String:StringConstructor;
    interface StringConstructor {
        new(value?: any): String;
        (value?: any): string;
        readonly prototype: String;
        fromCharCode(...codes: number[]): string;
    }

*/

export { };

declare global {
    interface String {
        double(): string
    }

    interface Window {
        maName: string
    }
}

String.prototype.double = function () {
    return this + this
}


let result = new String('hello').double();
console.log('result', result);
console.log('window', window.maName);

/**
 * 不导出 String是全局变量
*/
// interface String{
//     double():string
// }

// String.prototype.double = function(){
//     return this+this
// }


// let result = new String('hello').double();
// console.log('result',result);


/**
 * 声明一个类的时候
 * 得到2个类型 ， 一个构造函数 的类型  ， 一个 实例的类型
*/

class Person {
    name: string
}

let p: Person = { name: '22' };
let c: typeof Person = Person;


class Form {
    username: Form2.Item = { name: '' };
}

namespace Form2 {
    export class Item {
        name: string
    }
}


interface Action<T> {
    payload?: T,
    type: string
}

type asyncMethod<T,U> = (input:Promise<T>) => Promise<Action<U>>;
type syncMethod<T,U> = (action:Action<T>) => Action<U>;
type toAsyncMethod<T, U> = (input: T) => Action<U> 
type toSyncMethod<T, U> = (action: T) => Action<U>


class EffectModule {
    count = 1;
    message = 'hello!';

    delay(input: Promise<number>) {
        return input.then(i => ({
            payload: `hello ${i}`,
            type: 'delay'
        }))
    }

    setMessage(action: Action<Date>) {
        return {
            payload: action.payload!.getMilliseconds(),
            type: 'set-message'
        }
    }
}

/**
 * 思路：先将 EffectModule 转换成 EffectModuleType。可以对比  Connected 得出。
 * 1、先去掉 非函数属性  count  message ，得到  type EffectModuleMethods = "delay" | "setMessage"
 * 2、实现  Connect 时，需要先判断 delay setMessage 对应的是哪个函数type 。再返回对应要求的函数
*/
// type EffectModuleType = {
//     count:number;
//     message:string;
//     delay(input: Promise<number>):Promise<Action<string>>;
//     setMessage(action: Action<Date>):Action<number>;
// }

type EffectModuleAttr<T> = {[P in keyof T]?: T[P] extends Function ? P : never }[keyof T]
type EffectModuleMethods = NonNullable<EffectModuleAttr<EffectModule>>;

type EffectModuleMethodsConnet<T> = T extends asyncMethod<infer J, infer K> ? toAsyncMethod<J,K> : ( T extends syncMethod<infer J, infer K> ? toSyncMethod<J,K> :never );
type Connect = (module:EffectModule) => {
    [P in EffectModuleMethods]:EffectModuleMethodsConnet<EffectModule[P]>
};

const connect: Connect = m => ({
    delay: (input: number) => ({
        type: 'delay',
        payload: `hello 2`
    }),
    setMessage: (input: Date) => ({
        type: "set-message",
        payload: input.getMilliseconds()
    })
});

type Connected = {
    delay(input: number): Action<string>
    setMessage(action: Date): Action<number>
}
const effectModule:EffectModule = new EffectModule();
const connected: Connected = connect(effectModule);