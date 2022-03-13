#### 简述 CSS 盒子模型

------

从外到内依次是，外边距 margin，边框 border，内边距 padding，内容 content



#### 什么是高度塌陷？如何解决？

------

> 高度塌陷：当父元素没有设置高度，子元素写了浮动后，父元素就会发生高度塌陷，**造成父元素高度为0**（其实就是子元素的显示溢出到了父元素外面）

如何解决：

- 父元素定义 `overflow: hidden` 

  优点：代码少，简单

  缺点：不能和 `position` 定位配合使用，超出的尺寸会被隐藏

- 在浮动元素下方添加空标签，设置样式 `height: 0;overflow: hidden;clear: both;`

  优点：代码少，简单，兼容性高

  缺点：增加空标签不利于页面优化

- 万能清除法：给塌陷的元素添加伪元素

  ```javascript
  .fatherEle::after{
        content: "";
        clear: both;
        display: block;
        height: 0;
        overflow: hidden;
        visibility: hidden;
  }
  ```

  优点：写法固定，兼容性好

  缺点：代码多

- 给父元素添加浮动

  优点：代码简单

  缺点：可能产生新的浮动问题

- 给父元素定义高度

  优点：代码简单

  缺点：无法响应式布局



#### 定位的属性值有什么区别？

****

- relative：相对定位，不脱离文档流，相对于自身位置定位
- absolute：绝对定位，脱离文档流，相对于 最靠近当前元素的，首个非 static 定位的父级定位
- fixed：固定定位，脱离文档流，相对于浏览窗口定位
- static：默认值，元素出现在正常的文档流中
- inherit：从父元素继承 position 属性的值



#### border-box 和 content-box 的区别

------

box-sizing 的两个属性，代表两个盒模型尺寸

- content-box：表示样式中设置的 width 和 height 就只是 content 的 width 和 height，border、padding 不占用 width 和 height
- border-box：表示 border、padding 占用 样式中设置的 width 和 height，content 真正的 width 和 height 需要减去 border、padding



#### 标准模式和怪异模式的区别

****

- 标准盒模型 和 怪异盒模型

- 图片元素的垂直对齐方式

  对于inline元素和table-cell元素，标准模式下vertical-align属性默认取值为baseline，在怪异模式下，table单元格中的图片的vertical-align属性默认取值为bottom，因此在图片底部会有及像素的空间

- table 元素中的字体

  CSS中，对于font的属性都是可以继承的，怪异模式下，对于table元素，字体的某些元素将不会从body等其他封装元素中继承得到，特别是font-size属性

- 内联元素的尺寸

  标准模式下，non-replaced inline元素无法自定义大小，怪异模式下，定义这些元素的width，height属性可以影响这些元素显示的尺寸

- 元素的百分比高度

  CSS中对于元素的百分比高度规定如下：百分比为元素包含块的高度，不可为负值，如果包含块的高度没有显示给出，该值等同于auto，所以百分比的高度必须在父元素有高度声明的情况下使用。

  当一个元素使用百分比高度时，标准模式下，高度取决于内容变化，怪异模式下，百分比高度被正确应用

- 元素溢出

  标准模式下，overflow取默认值visible，在怪异模式下，该溢出会被当做扩展box来对待，即元素的大小由其内容决定，溢出不会裁减，元素框自动调整，包含溢出内容



#### Chrome 浏览器如何显示小于 12px 的文字

------

```javascript
-webkit-transform: scale()
```



#### CSS 选择器

------

##### 可继承属性和不可继承属性

- 可继承：字体系列的，文本系列的，visibility，一些表格布局属性，一些列表属性，**特殊的，a 标签的字体颜色不能被继承；h 标签字体的大小也不能**
- 不可继承：display；盒子模型的属性；背景属性；定位属性；内容生成属性；轮廓样式属性；页面样式属性

##### CSS 选择器种类

- id 选择器
- 类选择器
- 标签选择器
- 相邻选择器
  - 直接相邻元素选择器（h1+p， 选择和 h1 相邻的首个 p 元素）
  - 普通相邻元素选择器（h2~h2，选择前面有 h2 的每个 h2 元素）
- 子选择器（div > p，选择父元素是 div 的所有 p 元素）
- 后代选择器（div p，选择 div 内的所有 p 元素，不止是直接子元素，子元素内的子元素也包括）
- 通配符选择器（*，选择所有元素）
- 属性选择器（a[href^="https"]，选择 src 以 "https" 开头的所有 a 元素）
- 伪类选择器（input:checked，选择所有被选中的 input 元素）
- 伪元素选择器（p::after，在每个 p 的后面插入内容）
- 选择器分组（div, p，选择所有的 div 元素 和 p 元素）

##### 选择器优先级

- 优先级由高到低：!important > 内联样式 > id选择器 > 类选择器 > 标签选择器 > 通配符选择器 > 继承 > 默认

- 优先级权重

  ```html
  <ul>
      <li>
          <a>test</a>
      </li>
  </ul>
  
  
  <style>
   ul li a{   //权重等于0003
       color:red
   }
  
  li a{   //权重等于0002
      color:blue
  }
  </style>
  ```

  - 标签选择器、伪元素选择器：1
  - 类选择器、属性选择器、伪类选择器：10
  - id 选择器：100
  - 内联样式：1000

  权重最高的样式生效

  如果权重相同，就由定义的位置决定：

  1. 位于 head 标签里的 style 标签中定义的样式
  2. 位于 style 标签中的 @import 引入样式表定义的样式
  3. 由 link 标签引入的样式表定义的样式
  4. 由 link 标签引入的样式表内的 @import 导入样式表定义的样式
  5. 用户设定
  6. 浏览器默认

  权重相同，位置相同，选择最后出现的样式

#### CSS 引入

------

##### CSS 引入方式有哪些？link 和 @import 有什么区别？

- 内联样式

  直接写在 HTML 标签中

  ```html
  <p style="color: #00AFC7; font: arial;"></p>
  ```

- 内嵌样式

  写在 style 标签中

  ```html
  <style>
  	css样式
  </style>
  ```

- link 引入

  ```html
  <link rel="stylesheet" href="../css/123.css" />
  ```

- @import 引入

  ```html
  <style>   
  	@import url("CSS文件");   
  </style>  
  ```

link 和 @import 的区别

1. link 是 HTML 标签，除了引入 css 还可以引入其他类型的文件；@import 是 CSS 提供的，只能加载 CSS
2. link 引入的 CSS，是在页面加载时同时加载的；@import 需要等到页面加载完后再加载，可能出现无样式网页
3. link 是标签，没有兼容性问题；@import 是 CSS2.1 提出的，低版本浏览器不支持
4. link 支持使用 JS 改变样式；@import 不支持



##### style 标签写在 body 前 和 body 后有什么区别

- 一般情况下，页面加载是自上而下的，style 标签放在 body 之前是为了先加载样式
- 如果写在 body 后，由于浏览器逐行解析 HTML 文档，所以当解析到文档末尾的样式表的时候，会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在 IE 浏览器下可能会出现 FOUC 现象（页面闪烁）

##### 什么是 FOUC(Flash of Unstyled Content)？ 如何来避免 FOUC

在引用css的过程中，如果方法不当或者位置引用不对，会导致某些页面在windows下的ie出现一些奇怪的现象，以无样式显示页面内容的瞬间闪烁，这种现象称之为 **文档样式短暂失效**，简称FOCU

产生原因：

1. 把样式表放在页面底部
2. 使用 @import 导入样式表
3. 样式表放在 HTML 结构的不同位置

原理：当样式表晚于结构性 HTML 文档加载，当加载到该样式表时，页面就会停止之前的渲染。然后下载解析该样式表，重新渲染页面，就会造成页面内容的瞬间闪烁

解决办法：所有的样式表都在 head 标签内引入



#### px em rem 的区别

****

- px（像素），是一种固定尺寸，不会随着设备大小这些因素变化而变化
- em（相对单位长度），相对于**父级元素（不一定是父元素）**的属性变化而变化
- rem（相对单位长度），相对于根元素（HTML 元素）的字体大小变化而变化

px 可以做很多属性的单位；em 和 rem 是字体大小的单位

默认情况下，1em = 1rem = 16px



#### 怎么实现一个最大的正方形

****

```css
section{
    width: 100%;
    padding-bottom: 100%;
}
```



#### 实现 一行文字居中，多行文字，换行后左对齐

****

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div{
      text-align: center;
    }
    .multiLine span{
      display: inline-block;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="multiLine"><span>我是多行文字。我是多行文字。我是多行文字。我是多行文字。我是多行文字。我是多行文
  字。我是多行文字。我是多行文字。我是多行文字。我是多行文字。</span></div>
  <div><span>我是一行文字</span></div>    
</body>
</html>
```



#### 实现超出部分的文本用省略号显示

```css
/* 一行文本 */
.text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行文本 */
.texts{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
```



#### 居中方式

****

##### 水平居中

- 子元素 **行内元素**，**父元素设置 `text-align:center`**

- 子元素 **块级元素**，**父元素设置 `margin:0 auto`**

- **父元素设置 `width:fit-content`**（根据内容，宽度自适应）**结合，margin: 0 auto**，实现水平居中

  ```css
  .parent{
      width: fit-content;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      margin: 0 auto;
  }
  ```

- 弹性盒子 **父元素设置 `display:flex;justify-content:center`**

  ```css
  .parent{
      display: flex;
      justify-content: center;
  }
  ```

- transform 属性，平移

  ```css
  .son{
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0)
  }
  ```

- 绝对定位，**注意，使用绝对定位，父元素的定位最好使用 relative，用以在文档流中占位**

  - 绝对定位，位置固定和尺寸固定，自适应 margin

    ```css
    .son{
        width: 100px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
    ```

  - 绝对定位，位置和 margin 固定，尺寸自适应

    ```css
    .son{
        position: absolute;
        left: 0;
        right: 0;
        margin: 20px;
    }
    ```

##### 垂直居中

- 单行文本，**设置 `line-height` 等于 父元素高度**

- 子元素是 行内块级元素

  ```css
  .inner, .outer::after{
      display: inline-block;
      vertical-align: middle;
  }
  .outer::after{
      content: "";
      height: 100%;
  }
  ```

- `vertical-align`，**只有在父层是 td 或 th 时生效**

  ```css
  .parent{
      display: table;
  }
  .son{
      display: table-cell;
      vertical-align: middle;
  }
  ```

- 弹性盒子

  ```css
  .parent{
      display: flex;
      align-items: center;
  }
  ```

- 绝对定位，平移

  ```css
  .son{
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%)
  }
  ```

- 绝对定位，位置固定和尺寸固定，自适应 margin

  ```css
  .son{
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
  }
  ```

- 绝对定位，位置和 margin 固定，尺寸自适应

  ```css
  .son{
      width: 100px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: 20px;
  }
  ```



#### 两栏布局，左边固定，右边自适应，左右不重叠

****

- `float`

  ```css
  .container {
      height: 500px;
      width: 100%;
      overflow: hidden;  
  }
  .container > div {
      height: 100%;
  }
  .left{
      width: 300px;
      background-color: red;
      float: left;
      margin-right: 10px;
  }
  .right{
      background-color: yellow;
      overflow: hidden;
  }
  ```

- 弹性盒子

  ```css
  .container {
      height: 500px;
      width: 100%;
      display: flex;
      overflow: hidden;
  }
  .container > div {
      height: 100%;
  }
  .left{
      background-color: red;
      flex: 0 0 100px;
  }
  .right{
      background-color: yellow;
      flex: 1;
  }
  ```

- `table + table-cell`

  ```css
  .container {
      height: 500px;
      width: 100%;
      display: table;
      overflow: hidden;
  }
  .container > div {
      height: 100%;
      display: table-cell;
  }
  .left{
      background-color: red;
      width: 200px;
  }
  .right{
      background-color: yellow;
  
  }
  ```



#### 三栏布局

****

- 弹性盒子

  ```css
  .container {
      height: 500px;
      width: 100%;
      display: flex;
  }
  .container > div {
      height: 100%;
  }
  .left{
      background-color: red;
      width: 100px
  }
  .mid{
      background-color: yellow;
      flex: 1;
  }
  .right{
      background-color: green;
      width: 100px
  }
  ```

- `grid`

  ```css
  .container {
      height: 500px;
      width: 100%;
      display: grid;
      grid-template-rows: 200px;
      grid-template-columns: 300px auto 300px;
  }
  ```

  

#### BFC

****

> 页面上的一个隔离的独立容器，容器内外的元素不会相互影响

作用：

- 避免 `margin` 重叠（分属两个 BFC 即可）
- 避免某元素被浮动元素覆盖
- 清除浮动（BFC 计算高度的时候会算上浮动元素）
- 避免多列布局由于宽度计算四舍五入而自动换行

如何激活 BFC

- `float` 不是 `none`
- `position` 不是 `static` 和 `relative`
- `display` 是 `inline-block/table-cell/flex/table-caption/inline-flex`
- overflow 不是 `visible`



#### margin 重叠

相邻的块级元素，垂直方向上的 `margin` 会重叠

- 都是正数，结果是较大值
- 都是负数，结果是绝对值大的
- 一正一负，结果是二者相加的和



#### 让一个元素消失

- display：none，彻底消失，会造成 回流与重绘
- visibility：hidden，空间保存，会造成 重绘，适用于 **希望隐藏元素，又不影响页面布局**
- opacity： 0，只是肉眼看不到了



#### calc 属性

动态计算长度值，**运算符前后要保留空格**



#### display: table 和 table 元素 有什么区别

前者的 CSS 声明能让一个 HTML 元素及其子节点像 table 元素一样操作，而且不会产生使用 table 这样的制表标签产生的语义化问题

**table 系表格元素必须在页面完全加载后才能显示，div 逐行显示，table 的嵌套性太多，没有 div 简洁**



#### z-index 属性

设置元素的 堆叠顺序，高序列排在低序列前面，值可为负、`auto` 默认值 等于父元素、`number`、继承



background-color 填充哪些区域

content、padding、border



#### block、inline、inline-block 的区别

- `block` 块级元素，能设置宽高，margin 和 padding 水平垂直都能设置，前后有换行符
- `inline` 行内元素，不能设置宽高，margin 垂直无效，padding 都有效，前后无换行符
- `inline-block` 行内块元素，能设置宽高，margin 和 padding 都有效，前后无换行符



#### 为什么 img 是 行内元素还能设置宽高

可替换元素：CSS 只能影响可替换元素的位置，不能影响内容

- iframe
- video
- embed
- img
- image 类型的 input



#### 两个嵌套的 div，position 都是 absolute，子 div 设置 top 属性，那么这个 top 是相对于父元素的哪个位置定位的

border 的内边缘



#### flex

容器属性：

- `flex-flow`：以下两个属性的简写
  - `flex-direction`：主轴方向（默认值为 `row`）
    - `row`：与文本方向相同，起点和终点与内容方向相同
    - `row-reverse`：与文本方向相同，起点和终点与内容方向相反
    - `column`：与块轴方向相同，起点和终点与块轴方向相同
    - `column`：与块轴方向相同，起点和终点与块轴方向相反
  - `flex-wrap`：是否换行（默认值 `nowrap`）
    - `nowrap`：不换行，单行显示
    - `wrap`：自动换行，靠左靠右按照 `flex-direction` 决定
    - `wrap-reverse`：自动换行，靠左靠右和 `flex-direction` 相反
- `justify-content`：水平轴线方向的对齐方式
- `align-items`：竖直轴线方向的对齐方式
- `align-content`：效果和 `align-items` 类似，但是 `flex-wrap: nowrap` 的无效

容器内项目的属性：

- `flex`：以下三个属性的简写（默认值都是 0）
  - `flex-grow`：放大比例，0就是不放大（无单位）
  - `flex-shrink`：缩小比例，0就是不缩小（无单位）
  - `flex-basis`：默认尺寸（长度单位）
- `align-self`：设置单个项目的对齐方式
- `order`：项目的排列顺序
- `align-items`：竖直轴线方向的对齐方式