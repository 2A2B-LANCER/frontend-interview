#### v-if 和 v-show 的区别

****

- `v-if`：原理是增删 vnode，会触发 虚拟 DOM 的更新，开销较大
- `v-show`：原理是控制 DOM 元素的 `display` 属性，开销相比 v-`if` 小

> 为什么 v-show 不用 visibility 属性？开销不更小吗？

因为 `visibility` 只是把元素隐藏起来，它还占据文档流中的位置



#### 双向绑定的原理

****

关键点就是数据劫持和发布-订阅模式

1. 数据劫持，通过 `Observer` 对象，递归遍历需要被监听的对象，都加上 `getter` 和 `setter`
2. `Dep` 对象就是发布者
3. `Watcher` 对象就是订阅者

> 数据变化 -> 视图更新（v-bind）
>
> 数据变化肯定会触发 `setter`，然后就会触发该 `Dep` 对象向 `Watcher` 们发布通知，更新该数据，`Watcher` 更新就会触发 VDOM 更新，然后触发视图更新

> 视图交互变化 -> 数据变化（v-on）
>
> 该过程是通过事件监听实现的，事件监听组件的数据变化，然后反馈到被劫持的数据上，触发 setter



#### Vue 的响应式系统

****

1. 所有的组件都有一个 Watcher 对象（订阅者）
2. 响应式对象的属性都会递归设置 `geter` 和 `setter` 进行数据劫持
3. 组件的 `render` 函数执行的时候，就会初始化 `Watcher` 对象，绑定的响应式对象都会递归调用 `getter` 方法，进行依赖收集，完成 发布者和订阅者之间的联系
4. 数据变化的时候，就会递归调用响应式对象的 `setter` 方法，`Dep` 对象就会通知所有订阅者进行更新



#### 既然 Vue 通过数据劫持可以精准探测数据变化,为什么还需要虚拟 DOM 进行 diff 检测差异

****

现代前端框架有两种方式侦测变化，一种是 `pull`，一种是 `push`

- `pull`：就是 **不知道哪里发生了变化，只知道变化了**，然后整个 VDOM 进行比较，查找变化的地方
- `push`：数据发生变化就会立即知道是哪里，Vue 因为所有的响应式对象都对使用它的组件的 `Watcher` 进行了依赖收集，这种发布-订阅模式使得数据变化可以侦听到具体组件，然后在通过 VDOM 的 Diff 算法检测具体差异，这部分就属于 `pull` 操作了



#### `Vue` 中 `key` 值的作用

****

`vnode` 的唯一标识，为了在 VDOM 更新的时候能够复用相同 key 值的元素，提高 VDOM 更新的效率



#### 组件间通信的方式？

****

1. `props`/`$emit`，**用于父子组件通信**
   - 子组件设置 `props` 属性，父组件在子组件实例上使用同名属性传值
   - 父组件在子组件实例上注册事件监听，在子组件内部用 `$emit` 调用该事件，传递值过去
2. `$emit` / `$on`，**用于轻量级项目的状态管理**
   - 和方法一的原理相同，做法不同，这个可以通信的组件包括父子、兄弟、跨级
   - 创建一个全局 `eventBus`，假设 A/B 组件通信
   - A 组件注册一个事件，B 组件调用同名事件，传递参数，完成通信
3. vuex，vue 官方的状态管理器，其中的响应式对象可以通过 `$store` 进行交互，无关是否跨组件，**常用于多级组件嵌套需要传递数据**
4. `$attrs` / `$listener`，**用于多级组件嵌套，但是数据不做中间处理**
   - `$attrs`：包含子组件实例上未声明为 `props` 的属性，可以通过 `v-bind=$attrs` 传入内部组件
   - `$listener`：包含子组件实例上使用 `v-on` 绑定的非原生事件
5. `provide` / `inject`，**多用于跨级组件间的通信，主要是子组件获取父级组件的状态**，可以使用 `Vue.observable` 优化响应式 `provide`
6. `$parent` / `$children` 与 `ref`，**无法在跨级或兄弟间通信，只能用于父子组件**



#### `watch` 和 `computed` 的区别

****

- 二者都是用 `watcher` 对象实现的
- 最主要的区别是，`computed` 有缓存，`watch` 没有
- 当 `computed` 依赖的响应式对象并没有发生改变的时候，使用 `computed` 的值就会直接返回缓存；发生改变后就会通过派发更新（setter）通知该 `computed` 属性需要更新，再次访问就会重新计算
- `watch` 监听的响应式对象发生改变的时候，派发更新（setter）就会通知这个 `watch` 的 `watcher`，然后执行 `watch` 的函数



#### vue 中怎么重置 data

****

```javascript
Object.assign(this.$data, this.$options.data.call(this))
```



#### `name` 的作用

****

- 便于调试
- 递归组件调用自身
- `keep-alive` 使用 `name` 缓存组件



#### `nextTick` 的原理

****

`Vue` 会收集所有的数据更新的 `watcher` 到一个队列（宏任务），然后添加到 `nextTick` 的执行队列中去；如果这之后设置一个 `nextTick`，那这个 回调函数也会添加到 执行队列中去（宏任务）。

因为这二者分属两个宏任务，所以中间会有一次 GUI 渲染，所以 DOM 会更新



#### 生命周期

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | Vue 实例刚初始化，data、methods还没初始化                    |
| created       | data、methods 这些已经初始化，还没有渲染 DOM，$el 不可用     |
| beforeMount   | Watcher 对象还未创建，即将执行 render 函数                   |
| mounted       | Vue 实例初始化完毕，DOM节点挂载到 vm.$el 上                  |
| beforeUpdate  | 发生在 patch 函数执行之前，即虚拟 DOM 更新之前，此时数据已更新（组件必须已经执行 mounted，未执行 destroyed） |
| update        | 组件数据更新之后（组件必须已经执行 mounted，未执行 destroyed） |
| activited     | keep-alive 组件激活时调用                                    |
| deactivated   | keep-alive 组件销毁时调用                                    |
| beforeDestory | 组件销毁前调用                                               |
| destoryed     | 组件销毁后调用                                               |

- 加载渲染过程

> 父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

- 子组件更新过程

> 父beforeUpdate->子beforeUpdate->子updated->父updated

- 父组件更新过程

> 父beforeUpdate->父updated

- 销毁过程

> 父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

#### `Proxy` 和 `Object.defineProperty` 对比

- `Proxy` 直接监听对象，不用循环所有的属性，一一监听
- `Proxy` 可以监听数组元素的变化
- 