#### 简述 CSS 盒子模型

------

从外到内依次是，外边距 margin，边框 border，内边距 padding，内容 content



#### 什么是高度塌陷？如何解决？

------

> 高度塌陷：当父元素没有设置高度，子元素写了浮动后，父元素就会发生高度塌陷，**造成父元素高度为0**（其实就是子元素的显示溢出到了父元素外面）

如何解决：

- 父元素定义 `overflow: hidden` （zoom: 1 兼容 IE6）

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

- relative：相对定位，不脱离文档流，相对于自身位置定位
- absolute：绝对定位，脱离文档流，相对于 最靠近当前元素的，首个非 static 定位的父级定位
- fixed：固定定位，脱离文档流，相对于浏览窗口定位
- static：默认值，元素出现在正常的文档流中
- inherit：从父元素继承 position 属性的值



#### 子元素如何在父元素居中？

##### 水平居中

- 子父元素宽度固定，子元素设置 margin: auto，并且子元素不能设置浮动

  ```javascript
  // 1. 父子元素的宽度必须固定
  // 2. 子元素必须设置 margin: auto
  // 3. 子元素不能浮动
  .fatcher{
      height: 400px;
      width: 400px;
      background: #42B983;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
      margin: auto;
  }
  ```

- 子父元素宽度固定，父元素设置 text-align: center，子元素设置 display: inline-block，并且子元素不能设置浮动，否则居中失效

  ```javascript
  // 1. 父元素必须设置 text-align: center
  // 2. 子元素必须设置 display: inline-block
  // 3. 子元素不能浮动
  .fatcher{
      height: 400px;
      width: 400px;
      background: #42B983;
      text-align: center;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
      display: inline-block;
  }
  ```


##### 垂直居中

- 弹性盒子（**有兼容性问题**）

  ```javascript
  // 1. 父元素设置 display 为 flex
  // 2. 子元素设置 align-self 为 center
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      display: flex;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
      align-self: center;
  }
  // 或者
  // 1. 父元素设置 display 为 flex
  // 2. 父元素设置 align-items 为 center
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      display: flex;
      align-items: center;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

- 隐藏节点（**不利于页面优化**）

  ```javascript
  // 在要居中的子元素上面添加一个隐藏元素，height 为 (father - son) / 2
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  .hidden{
      height: 100px;
  }
  ```

- 模拟 table（**推荐使用**）

  ```javascript
  // 1. 父元素 display 设置为 table-cell
  // 2. 父元素 vertical-align 设置为 middle
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      display: table-cell;
      vertical-align: middle;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

- 子元素绝对定位（**有兼容性问题**）

  ```javascript
  // 1. 子元素设置 position 为 absolute
  // 2. 子元素 top 设置为 50%
  // 3. 子元素 transform 设置为 translateY(-50%)
  // 注意！父元素 position 不能是 默认值 static
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      position: absolute;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
      position: absolute;
      top: 50%;
      transform: translateY(-50%)
  }
  ```

- 子元素相对定位（**有兼容性问题**）

  ```javascript
  // 1. 子元素设置 position 为 relative
  // 2. 子元素 top 设置为 50%
  // 3. 子元素 transform 设置为 translateY(-50%)
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
      position: relative;
      top: 50%;
      transform: translateY(-50%)
  }
  ```

  

##### 水平垂直居中

- 子元素相对于父元素绝对定位，子元素 top，left 设置 50%，子元素 margin-top 和 margin-left 减去各自宽高的一半（**有局限性，必须得知道子元素本身的宽高**）

  ```javascript
  // 1. 子元素 top, left 设置为 50%
  // 2. 子元素的 margin-top 设置为 -(height / 2), margin-left 设置为 -(width / 2)
  // 3. 子元素设置 position: absolute
  // 4. 注意！父元素的 position 必须不能是默认值 static
  .fatcher{
      height: 400px;
      width: 400px;
      background: #42B983;
      position: absolute;
  }
  .son{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      margin-top: -100px;
      margin-left: -100px;
      background: #00FFFF;
  }
  ```

- 子元素相对父元素绝对定位，子元素上下左右全部设置为 0，然后设置子元素 margin: auto

  ```javascript
  // 1. 子元素的 top, bottom, left, right 都设置为 0
  // 2. 子元素的 margin 设置为 auto
  // 3. 子元素的 position 设置为 absolute
  // 4. 注意！父元素的 position 不能是默认值 static
  .fatcher{
      height: 400px;
      width: 400px;
      background: #42B983;
      position: absolute;
  }
  .son{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 200px;
      height: 200px;
      margin: auto;
      background: #00FFFF;
  }
  ```

- 父元素设置 display: table-cell vertical-align: middle，子元素设置 margin: auto

  ```javascript
  // 1. 父元素的 display 设置为 table-cell
  // 2. 父元素的 vertical-align 设置为 middle
  // 3. 子元素的 margin 设置为 auto
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      display: table-cell;
      vertical-align: middle;
  }
  .son{
      margin: auto;
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

- 子元素相对定位，子元素 top，left 值为 50%，transform: translate(-50%, -50%)（**有兼容性问题**）

  ```javascript
  // 1. 子元素 position 设置为 relative
  // 2. 子元素 top, left 设置为 50%
  // 3. 子元素 transform 设置为 translate(-50%, -50%)
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
  }
  .son{
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

- 子元素相对父元素绝对定位，子元素 top，left 值为 50%，transform: translate(-50%, -50%)（**有兼容性问题**）

  ```javascript
  // 1. 子元素 position 设置为 absolute
  // 注意！父元素的 position 不能是默认值 static
  // 2. 子元素 top, left 设置为 50%
  // 3. 子元素 transform 设置为 translate(-50%, -50%)
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      position: absolute;
  }
  .son{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

- 父元素设置弹性盒子（**有兼容性问题**）

  ```javascript
  // 1. 父元素设置 display 为 flex
  // 2. 父元素设置 justify-content 为 center
  // 3. 父元素设置 align-items 为 center
  .father{
      height: 400px;
      width: 400px;
      background: #42B983;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .son{
      width: 200px;
      height: 200px;
      background: #00FFFF;
  }
  ```

  

#### border-box 和 content-box 的区别

------

box-sizing 的两个属性，代表两个盒模型尺寸

- content-box：表示样式中设置的 width 和 height 就只是 content 的 width 和 height，border、padding 不占用 width 和 height
- border-box：表示 border、padding 占用 样式中设置的 width 和 height，content 真正的 width 和 height 需要减去 border、padding



#### 标准模式和怪异模式的区别

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

- 优先级由高到低：!important > 内联样式 > id选择器 > 类选择器 > 标签选择器 > 通配符选择器 > 继承

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

  - 标签选择器：1
  - 类选择器：10
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

- px（像素），是一种固定尺寸，不会随着设备大小这些因素变化而变化
- em（相对单位长度），相对于**父级元素（不一定是父元素）**的属性变化而变化
- rem（相对单位长度），相对于根元素（HTML 元素）的字体大小变化而变化

px 可以做很多属性的单位；em 和 rem 是字体大小的单位

默认情况下，1em = 1rem = 16px