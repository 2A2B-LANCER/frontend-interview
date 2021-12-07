/* 
* this 绑定相关面试题，解析在笔记中
*/
// 1. 
var x = 10;
var obj = {
    x: 20,
    f: function(){
        console.log(this.x);        // ?
        var foo = function(){ 
            console.log(this.x);    
            }
        foo();                      // ?
    }
};
obj.f();

// 2. 
function foo(arg){
  this.a = arg;
  return this
};

var a = foo(1);
var b = foo(10);

console.log(a.a);    // ?
console.log(b.a);    // ?

// 3. 
var x = 10;
var obj = {
    x: 20,
    f: function(){ console.log(this.x); }
};
var bar = obj.f;
var obj2 = {
    x: 30,
    f: obj.f
}
obj.f();
bar();
obj2.f();

// 4. 
function foo() {
  getName = function () { console.log (1); };
  return this;
}
foo.getName = function () { console.log(2);};
foo.prototype.getName = function () { console.log(3);};
var getName = function () { console.log(4);};
function getName () { console.log(5);}

foo.getName ();                // ?
getName ();                    // ?
foo().getName ();              // ?
getName ();                    // ?
new foo.getName ();            // ?
new foo().getName ();          // ?
new new foo().getName ();      // ?