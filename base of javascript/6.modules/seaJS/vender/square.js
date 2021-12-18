define(function(require, exports, module) {
	console.log('加载了 square 模块')
	var multiplyModule = require('./multiply');
  module.exports = {
    square(num) {
      return multiplyModule.multiply(num, num)
    }
  };
});