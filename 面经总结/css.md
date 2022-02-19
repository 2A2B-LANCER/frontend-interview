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

水平居中：

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

  

水平垂直居中：

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

box-sizing 的两个属性，代表两个盒模型尺寸

- content-box：表示样式中设置的 width 和 height 就只是 content 的 width 和 height，border、padding 不占用 width 和 height
- border-box：表示 border、padding 占用 样式中设置的 width 和 height，content 真正的 width 和 height 需要减去 border、padding

