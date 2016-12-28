//  canvans涂鸦构造函数
    //  参数1-el          :  canvas-dom节点 (elment,必传)
    //  参数2-lineColor   :  涂鸦颜色 (color)
    //  参数3-strokeWidth :  涂鸦大小 (number)
    //  参数4-timelimit   :  涂鸦长度限制 (boolean)
    (function() {
        function Scrawl (opt) {
        noAssign();
        //  合并默认opt
        this.opt         =  Object.assign({
            lineColor    : 'red',
            lineWidth  : 5,
            timelimit  : false,
        }, opt) || {};

        //  选项
        this.el          =  this.opt.el;
        this.ctx         =  this.el.getContext('2d');
        this.l           =  0;
        this.limitlength =  100;
        this.drawflag    =  false;

        this.lineColor   =  this.opt.lineColor;
        this.lineWidth   =  this.opt.lineWidth;
        this.timelimit   =  this.opt.timelimit;
        this.endFn       =  this.opt.endFn;
        
        //  初始化涂鸦事件
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = this.lineWidth;
        this.start(this);
        this.move(this);
        this.end(this);
        }
        Scrawl.prototype.start = function (self) {
            self.el.ontouchstart = function (e) {
                self.drawflag = true;
                self.ctx.beginPath();
                self.ctx.moveTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        }
        Scrawl.prototype.move = function (self) {
            self.el.ontouchmove = function (e) {
                if (self.drawflag) {
                    self.ctx.lineTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    self.ctx.stroke();
                }
                self.timelimit && self.l ++;
                // e.preventDefault();
            }
        }
        Scrawl.prototype.end = function (self) {
            self.el.ontouchend = function () {
                self.drawflag = false;
                self.ctx.closePath();
                self.timelimit && self.l < self.limitlength && alert('太短')
                this.endFn && this.endFn();
            }
        }

        window.Scrawl = Scrawl;
    })();
    
    //  Object.assign兼容
    function noAssign() {
        if (!Object.assign) {
            Object.defineProperty(Object, "assign", {
                //  可枚举
                enumerable: false,
                //  可读写'删除
                configurable: true,
                //  可赋值
                writable: true,
                value: function(target, firstSource) {
                "use strict";
                //  为空返回
                if (target === undefined || target === null)
                    throw new TypeError("Cannot convert first argument to object");
                //  显式转换为object    
                var to = Object(target);
                //  循环拷贝对象
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    //  拷贝对象为空  返回
                    if (nextSource === undefined || nextSource === null) continue;
                    //  取出拷贝对象属性
                    var keysArray = Object.keys(Object(nextSource));
                    //  循环拷贝对象属性
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {  
                    var nextKey = keysArray[nextIndex];
                    //  取出拷贝对象可枚举属性
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    //  如果不为空而且可枚举，那么添加到目标对象
                    if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                    }
                }
                return to;
              }
            });
        }
    }