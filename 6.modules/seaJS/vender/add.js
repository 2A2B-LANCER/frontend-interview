define(function(require, exports, module) {
	  console.log('加载了 add 模块')
    module.exports = {
      add(x, y) {
        return x + y;
      }
    };
});