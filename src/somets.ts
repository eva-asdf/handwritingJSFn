//Partial<T> 的作用就是将某个类型里的属性全部变为可选项 ?。
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

//Required<T> 的作用就是将某个类型里的属性全部变为必选项
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

//Readonly<T> 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

//Record<K extends keyof any, T> 的作用是将 K 中所有的属性的值转化为 T 类型。
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

//Pick<T, K extends keyof T> 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

//Exclude<T, U> 的作用是将某个类型中属于另一个的类型移除掉。  返回T提出U后
// 如果 T 能赋值给 U 类型的话，那么就会返回 never 类型，否则返回 T 类型。最终实现的效果就是将 T 中某些属于 U 的类型移除掉。
type MyExclude<T, U> = T extends U ? T : never;

// Extract<T, U> 的作用是从 T 中提取出 U。
type MyExtract<T, U> = T extends U ? never : T;

//Omit<T, K extends keyof any> 的作用是使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型。
type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;

// NonNullable<T> 的作用是用来过滤类型中的 null 及 undefined 类型。
type MyNonNullable<T> = T extends undefined | null ? never : T;

//ReturnType<T> 的作用是用于获取函数 T 的返回类型。
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

// InstanceType 的作用是获取构造函数类型的实例类型。
type MyInstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any;

//ThisType<T> 的作用是用于指定上下文对象的类型。
//注意：使用 ThisType<T> 时，必须确保 --noImplicitThis 标志设置为 true。
interface MyThisType<T> {}

//定义一个工具类型 AppendArgument，为已有的函数类型增加指定类型的参数，新增的参数名是 x，将作为新函数类型的第一个参数
type AppendArgument<F, A> = F extends (...args: infer P) => infer R
  ? (x: A, ...args: P) => R
  : never;

//定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）
type NaiveFlat<T extends any[]> = T extends Array<infer K>
  ? K extends any[]
    ? NaiveFlat<K>
    : K
  : never;

// 定义 NonEmptyArray 工具类型，用于确保数据非空数组。
type NonEmptyArray<T> = {
  [P in number]: T;
} & {
  0: T;
};

//定义一个 JoinStrArray 工具类型，用于根据指定的 Separator 分隔符，对字符串数组类型进行拼接
type JoinStrArray<
  Arr extends string[],
  Separator extends string,
  Result extends string = ""
> = Arr extends [infer El, ...infer Res]
  ? `${Arr[0]}${Res extends string[]
      ? Res[0] extends string
        ? `${Separator}${JoinStrArray<Res, Separator>}`
        : ""
      : ""}`
  : "";
// 测试用例
type Names = ["Sem", "Lolo", "Kaquko"];
type NamesComma = JoinStrArray<Names, ",">; // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, " ">; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, "⭐️">; // "Sem⭐️Lolo⭐️Kaquko"
