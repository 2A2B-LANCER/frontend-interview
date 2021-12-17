define(function(require, exports, module) {
	console.log('加载了 multiply 模块')

  module.exports = {
    multiply(x, y) {
      return x * y;
    }
  };
});