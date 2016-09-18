function addloadEvent(fnc) {
	var old = window.onload;
	//如果执行函数没有绑定函数 则把fnc 直接绑定到window.onloda中
	if (typeof window.onload != "function") {
		window.onload = fnc;
	} else {
		//有函数 则绑定到现有指令的末尾
		window.onload = function() {
			old();
			fnc();
		};
	}
}
//封装getclassName函数
function getClass(cls, pre) {
	var ele = pre ? document.getElementById(pre) : document,
		//定义数组
		eles = [],
		get_ele = ele.getElementsByTagName("*");
	for (var i = 0; i < get_ele.length; i++) {
		if (get_ele[i].className == cls) {
			//把有相同的className的添加元素到eles数组中
			eles.push(get_ele[i]);
		}
	}
	return eles;
}
//设置瀑布流
function waterfall() {
	var get_cls = getClass("box", "content");
	var osz = getClass("sz", "content");
	for (var i = 0; i < osz.length; i++) {
		osz[i].style.bottom = "-100px";
	}
	//获取一个div className为box的宽度
	var oBoxW = get_cls[0].offsetWidth,
		//获取页面的宽度
		oParentW = document.documentElement.clientWidth || document.body.clientWidth,
		colums = Math.floor(oParentW / oBoxW),
		oPa = document.getElementById("content");
	//用cssText方法设置css样式 跟写css一样写  但是要注意";" 要在引号里面
	oPa.style.cssText = 'width:' + colums * oBoxW + 'px;margin:0 auto';
	var els = []; //定义一个数组用来存储第一行的元素
	for (i = 0; i < get_cls.length; i++) {
		if (i < colums) {
			//把第一行的元素高度存储到els数组中		
			els.push(get_cls[i].offsetHeight);
		} else {
			//用apply方法获取在数组中最小的值 apply 能改变函数和方法this的指向
			var minH = Math.min.apply(null, els);
			var minIndex = getIndex(minH, els);
			//设置第二行div的样式
			get_cls[i].style.position = "absolute";
			//使第二行的图片 分配到 第一行中最小高度图片的下面 
			get_cls[i].style.top = minH + 'px';
			get_cls[i].style.left = get_cls[minIndex].offsetLeft + 'px';
			// get_cls[i].style.left=minIndex*oBoxW+'px';
			//改变数组的高度 （原来的最小高度加上在它下面的图片高度） 
			els[minIndex] += get_cls[i].offsetHeight;
		}
	}
	anima();
}
//封装了获得最小高度的索引值
function getIndex(value, array) {
	for (var key in array) {
		if (array[key] == value) {
			return key;
		}
	}
}
//获取滚动条
window.onscroll = function() {
	if (checkScroll) {
		var data = {
			"arr": [{
				"src": "./img/1.jpg"
			}, {
				"src": "./img/2.jpg"
			}, {
				"src": "./img/3.jpg"
			}, {
				"src": "./img/7.jpg"
			}, {
				"src": "./img/15.jpg"
			}, {
				"src": "./img/12.jpg"
			}, {
				"src": "./img/11.jpg"
			}],
			"p": "这个美女很好看我很喜欢这个美女很好看"
		};
		for (var i = 0; i < data.arr.length; i++) {
			//创建节点
			var oBox = document.createElement("div");
			oBox.className = "box";
			var oPic = document.createElement("div");
			oPic.className = "pic";
			oBox.appendChild(oPic);
			var oimg = document.createElement("img");
			oimg.src = data.arr[i].src;
			var op = document.createElement("p");
			op.className = "sz";
			var textNode = document.createTextNode(data.p);
			op.appendChild(textNode);
			oPic.appendChild(oimg);
			oPic.appendChild(op);
			var oPa = document.getElementById("content");
			oPa.appendChild(oBox);
		}
		//重新调用waterfall函数排版
		waterfall();
	}
};
//检查滚动条滚动到哪个位置触发的事件
function checkScroll() {
	var get_cls = getClass("box", "content");
	//获取最后一个图片的一半的高度
	var hei = get_cls[get_cls.length - 1].offsetHeight / 2;
	//获取屏幕可见区域的高度
	var oHei = document.body.clientHeight || document.documentElement.clientHeight;
	//获取鼠标滚动的距离
	var oScr = document.body.scrollTop || document.documentElement.scrollTop;
	//得到图片一半高度加上距离父元素的高度
	var lastBoxH = get_cls[get_cls.length - 1].offsetTop + Math.floor(hei);
	//如果滚动条滚动到最后一张图片一半的高度时 返回boolean值
	return (lastBoxH < oHei + oScr) ? true : false;
}
//设置动画效果
function anima() {
	var oPic = getClass("pic", "content");
	for (var i = 0; i < oPic.length; i++) {
		oPic[i].index = i;
		oPic[i].onmouseover = function() {
			this.style.cssText = 'box-shadow: 1px 2px 10px';
			startMove(this.index, 14);
		};
		oPic[i].onmouseout = function() {
			this.style.cssText = 'box-shadow: 0 0 0';
			startMove(this.index, -100);
		};
	}
}
//设置p数据块向上移动
function startMove(ind, iTarget) {
	var osz = getClass("sz", "content");
	var state = osz[ind]; //把pic当前的索引值传给p元素索引并保存给state变量
	//很重要 给每个p元素设置一个定时器 避免各p元素互相争timer使元素不能有效的运动（针对多物体运动很有效）
	clearInterval(state.timer);
	state.timer = setInterval(function() {
		var speed = (iTarget - parseInt(state.style.bottom)) / 5;
		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		if (parseInt(state.style.bottom) == iTarget) {
			clearInterval(state.timer);
		} else {
			state.style.bottom = parseInt(state.style.bottom) + speed + 'px';
		}
	}, 30);
}
/*合二为一 只用一个函数*/

//设置p数据块向下移动
// function startOut(ind, speed) {
// 	var osz = getClass("sz", "content");
// 	var state=osz[ind];
// 	clearInterval(state.timer);
// 	state.timer = setInterval(function() {
// 		if (parseInt(state.style.bottom) == -100) {
// 			clearInterval(state.timer);
// 		} else {
// 			state.style.bottom = parseInt(state.style.bottom) - speed + 'px';
// 		}
// 	}, 30);

// }
addloadEvent(waterfall);