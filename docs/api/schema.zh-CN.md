# Schema

类型：`SchemaInterface`

## 属性

### `data`

所有规则约束集合

```ts
data: {
    blocks: Array<SchemaRule>;//块级节点
    inlines: Array<SchemaRule>;//行内节点
    marks: Array<SchemaRule>;//样式节点
    globals: { [key: string]: SchemaAttributes | SchemaStyle };//全局规则
};
```

## 方法

### `add`

增加规则约束

```ts
/**
* 增加规则，不允许设置div标签，div将用作card使用
* 只有 type 和 attributes 时，将作为此类型全局属性，与其它所有同类型标签属性将合并
* @param rules 规则
*/
add(
    rules: SchemaRule | SchemaGlobal | Array<SchemaRule | SchemaGlobal>,
): void;
```

### `find`

查找规则

```ts
/**
 * 查找规则
 * @param callback 查找条件
 */
find(callback: (rule: SchemaRule) => boolean): Array<SchemaRule>;
```

### `getType`

获取节点类型

```ts
/**
 * 获取节点类型
 * @param node 节点
 */
getType(node: NodeInterface): 'block' | 'mark' | 'inline' | undefined;
```

### `checkNode`

检测节点是否符合某一属性规则

```ts
/**
 * 检测节点是否符合某一属性规则
 * @param node 节点
 * @param attributes 属性规则
 */
checkNode(
    node: NodeInterface,
    attributes?: SchemaAttributes | SchemaStyle,
): boolean;
```

### `checkStyle`

检测样式值是否符合节点样式规则

```ts
/**
 * 检测样式值是否符合节点样式规则
 * @param name 节点名称
 * @param styleName 样式名称
 * @param styleValue 样式值
 */
checkStyle(name: string, styleName: string, styleValue: string): boolean;
```

### `checkAttributes`

检测值是否符合节点属性的规则

```ts
/**
 * 检测值是否符合节点属性的规则
 * @param name 节点名称
 * @param attributesName 属性名称
 * @param attributesValue 属性值
 */
checkAttributes(
    name: string,
    attributesName: string,
    attributesValue: string,
): boolean;
```

### `checkValue`

检测值是否符合规则

```ts
/**
 * 检测值是否符合规则
 * @param rule 规则
 * @param attributesName 属性名称
 * @param attributesValue 属性值
 */
checkValue(
    rule: SchemaAttributes | SchemaStyle,
    attributesName: string,
    attributesValue: string,
): boolean;
```

### `checkStyle`

检测样式值是否符合节点样式规则

```ts
/**
 * 检测样式值是否符合节点样式规则
 * @param name 节点名称
 * @param styleName 样式名称
 * @param styleValue 样式值
 * @param type 指定类型
 */
checkStyle(
    name: string,
    styleName: string,
    styleValue: string,
    type?: 'block' | 'mark' | 'inline',
): void;
```

### `checkAttributes`

检测值是否符合节点属性的规则

```ts
/**
 * 检测值是否符合节点属性的规则
 * @param name 节点名称
 * @param attributesName 属性名称
 * @param attributesValue 属性值
 * @param type 指定类型
 */
checkAttributes(
    name: string,
    attributesName: string,
    attributesValue: string,
    type?: 'block' | 'mark' | 'inline',
): void;
```

### `filterStyles`

过滤节点样式

```ts
/**
 * 过滤节点样式
 * @param name 节点名称
 * @param styles 样式
 * @param type 指定类型
 */
filterStyles(
    name: string,
    styles: { [k: string]: string },
    type?: 'block' | 'mark' | 'inline',
): void;
```

### `filterAttributes`

过滤节点属性

```ts
/**
 * 过滤节点属性
 * @param name 节点名称
 * @param attributes 属性
 * @param type 指定类型
 */
filterAttributes(
    name: string,
    attributes: { [k: string]: string },
    type?: 'block' | 'mark' | 'inline',
): void;
```

### `clone`

克隆当前 schema 对象

```ts
/**
 * 克隆当前schema对象
 */
clone(): SchemaInterface;
```

### `toAttributesMap`

将相同标签的属性和 gloals 属性合并转换为 map 格式

```ts
/**
 * 将相同标签的属性和gloals属性合并转换为map格式
 * @param type 指定转换的类别 "block" | "mark" | "inline"
 */
toAttributesMap(type?: 'block' | 'mark' | 'inline'): SchemaMap;
```

### `getMapCache`

获取合并后的 Map 格式

```ts
/**
 * 获取合并后的Map格式
 * @param 类型，默认为所有
 */
getMapCache(type?: 'block' | 'mark' | 'inline'): SchemaMap;
```

### `closest`

查找节点符合规则的最顶层的节点名称

```ts
/**
 * 查找节点符合规则的最顶层的节点名称
 * @param name 节点名称
 * @returns 最顶级的block节点名称
 */
closest(name: string): string;
```

### `isAllowIn`

判断子节点名称是否允许放入指定的父节点中

```ts
/**
 * 判断子节点名称是否允许放入指定的父节点中
 * @param source 父节点名称
 * @param target 子节点名称
 * @returns true | false
 */
isAllowIn(source: string, target: string): boolean;
```

### `getAllowInTags`

获取允许有子 block 节点的标签集合

```ts
/**
 * 获取允许有子block节点的标签集合
 * @returns
 */
getAllowInTags(): Array<string>;
```

### `getCanMergeTags`

获取能够合并的 block 节点的标签集合

```ts
/**
 * 获取能够合并的block节点的标签集合
 * @returns
 */
getCanMergeTags(): Array<string>;
```
