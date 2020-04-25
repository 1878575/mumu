+(function (w) {
	w.mumu = {}
	w.mumu.css = function (node, type, val){
			if(typeof node === "object" && typeof node["transfrom"] === "undefined"){
				node["transfrom"] = {}
			}
			if(arguments.length >= 3){
				var text = ""
				node["transfrom"][type] = val
				for(item in node["transfrom"]){
					if(node["transfrom"].hasOwnProperty(item)) {
						switch (item){
						case "translateX":
						case "translateY":
						case "translateZ":
							text += item + "("+node["transfrom"][item] +"px)"
							break;
					    case "scale":
					    	text += item + "("+node["transfrom"][item] +")"
						    break;
					    case "rotate":
					    	text += item + "("+node["transfrom"][item] +"deg)"
						    break;
						
						}
					}
					
				}
				node.style.transform = node.style.webkitTransform = text;
			}else if(arguments.length == 2){
				val = node["transfrom"][type];
				if(typeof val == "undefined"){
					switch (type){
						case "translateX":
						case "translateY":
						case "translateZ":
						case "rotate":
							val = 0;
							break;
						case "scale":
							val = 1;
							break;
						
					}
				}
				return val
			}
		}

	w.mumu.carousel = function (arr){
				var carouelWrap = document.querySelector(".carousel-wrap")
				if(carouelWrap){
					
					var pointsLength= arr.length
					
					//无缝
					var needCarousel = carouelWrap.getAttribute("needCarousel")
					needCarousel = needCarousel == null?false:true
					if(needCarousel) {
						arr = arr.concat(arr)
					}
					
					var ulNode = document.createElement("ul");
					var styleNode = document.createElement("style")
					ulNode.classList.add("list")
					for( var i=0;i<arr.length;i++){
						ulNode.innerHTML += '<li><a href="javascript:;"><img src="'+arr[i]+'"/></a></li>';
					}
					
				}
				styleNode.innerHTML = ".carousel-wrap > .list > li {width: "+(1/arr.length*100)+"%;}.carousel-wrap > .list{width: "+arr.length+"00%;}"
				carouelWrap.appendChild(ulNode)
				document.head.appendChild(styleNode)
				
				var imgNode = document.querySelector(".carousel-wrap > .list > li > a > img")
				
				setTimeout(function(){
					carouelWrap.style.height = imgNode.offsetHeight + "px";
				},200)
				
				//小圆点
				var pointsWrap = document.querySelector(".carousel-wrap > .points-wrap")
				if (pointsWrap) {
					for(var i = 0; i<pointsLength;i++){
						if( i == 0){
							pointsWrap.innerHTML += "<span class='active'></span>";
						}else {
							pointsWrap.innerHTML += "<span></span>";
						}
					}
					var pointsSpan = document.querySelectorAll(".carousel-wrap > .points-wrap > span")
					
					
				}
				/*滑屏
				 * 1.拿到元素一开始的位置
				 * 2.拿到手指一开始点击的位置
				 * 3.拿到手指move的实时位置
				 * 4.将食指移动的距离加给元素
				 */
				
				//手指的位置
				var startX = 0;
				var startY = 0;
				//元素移动的位置
				var elementX = 0;
				var elementY = 0;
//				var tanslateX = 0;
				var isX = true
				var isFirst = true
				carouelWrap.addEventListener("touchstart", function(ev) {
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					 
					
					//是否无缝判断
					if(needCarousel) {
						//无缝逻辑，点击第一组的第一张时 瞬间跳到第二组的第一张
						//			点击第一组的最后一张时 瞬间跳到第二组的最后一张
					var index = mumu.css(ulNode, "translateX")/document.documentElement.clientWidth;
					if(-index === 0){
						index = -pointsLength
					}else if(-index === (arr.length - 1)){
						index = -(pointsLength - 1)
					}
					mumu.css(ulNode, "translateX", index * document.documentElement.clientWidth)
					}
		
					startX = touchC.clientX;
					startY = touchC.clientY;
					//elementX = ulNode.offsetLeft;
//					elementX = tanslateX;
					elementX = mumu.css(ulNode,"translateX")
					elementY = mumu.css(ulNode,"translateY")
					//清除定时器
					clearInterval(timer)
					//更新
					isX = true
					isFirst = true
				})
				carouelWrap.addEventListener("touchmove", function(ev) {
					//二次以后防抖动
					if(!isX){
						return
					}
					ev = ev || event;
					var touchC = ev.changedTouches[0];
					var nowX = touchC.clientX;
					var nowY = touchC.clientY;
					var disX = nowX - startX;
					var disY = nowY - startY;
					//首次判断用户滑动方向
					if(isFirst){
						isFirst = false
						if(Math.abs(disY)>Math.abs(disX)){
							//防抖动
							//如果是X轴:以后不管用户怎么滑都会抖动
							//如果是Y轴，以后不管怎么划都不会抖动
							isX = false
							//首次防抖动
							return
						}
					}
					//tanslateX = elementX + disX;
					//ulNode.style.transform = 'translateX('+ tanslateX +' px) ';
					mumu.css(ulNode,"translateX", elementX + disX)
				})
				carouelWrap.addEventListener("touchend", function(ev) {
					ev = ev || event;
					//index抽象了ul的实时位置
					//var index = tanslateX/document.documentElement.clientWidth;
					var index = mumu.css(ulNode, "translateX")/document.documentElement.clientWidth;
					index = Math.round(index)
				    
				    if( index > 0){
				    	index = 0;
				    }else if(index < 1-arr.length){
				    	index = 1-arr.length;
				    }
				   //小圆点active显示
				   minipionts(index)
				    ulNode.style.transition = "1s transform";
//				    console.log(index)
				    //tanslateX = index*(document.documentElement.clientWidth);
					//ulNode.style.transform = 'translateX('+tanslateX+'px) ';
					mumu.css(ulNode, "translateX", index*(document.documentElement.clientWidth))
					//开启自动轮播
					if(needAuto) {
						autoFlag = -index;
						auto();
					}
				})
			
				//是否自动轮播
				var timer = 0;
				var autoFlag = 0;
				var needAuto = carouelWrap.getAttribute("needAuto")
				needAuto = needAuto == null?false:true
				if(needAuto) {
					auto();
				}
				function auto(){
					clearInterval(timer);
					timer = setInterval(function () {
						
						if(autoFlag === (arr.length - 1)){
							ulNode.style.transition = "none";
							autoFlag = arr.length/2 - 1
							mumu.css(ulNode, "translateX", -autoFlag * document.documentElement.clientWidth)
						} 
						setTimeout(function () {
							autoFlag++;
							ulNode.style.transition = "1s transform";
							minipionts(-autoFlag)
							mumu.css(ulNode, "translateX", -autoFlag * document.documentElement.clientWidth)
						},50)
						
					},2000)
			}
			function minipionts(index){
				if (!pointsWrap) {
					return
				}
				 for( var i= 0;i<pointsSpan.length;i++){
			    	pointsSpan[i].classList.remove("active")
			    }
			    pointsSpan[-index%pointsLength].classList.add("active")
			}
		}
	
	w.mumu.gregNav = function () {
		//滑屏区域
		var wrap = document.querySelector(".mumu-nav-wrapper")
		//滑屏元素
		var item = document.querySelector(".mumu-nav-wrapper .list")
		
		//元素一开始 手指一开始的位置
		var start = 0
		var elementX = 0
		//minx是list(ul)能滑动的最小距离（不超出，显白色)
		var minx = wrap.clientWidth - item.offsetWidth
		
		//快速滑屏的必要参数
		var lastTime=0
		var lastPoint = 0
		var nowTime = 0
		var nowPoint = 0
		var timeDis = 1
		var pointDis = 0
		wrap.addEventListener("touchstart", function (ev) {
			ev = ev || event
			var touchC = ev.changedTouches[0]
			start = touchC.clientX
			elementX = mumu.css(item,"translateX")
			item.style.transition = "none"
			
			lastTime = new Date().getTime()
			lastPoint = touchC.clientX
			//清除速度残留，干净速度 
			pointDis = 0
			item.handMove = false
		})
		wrap.addEventListener("touchmove", function (ev) {
			ev = ev || event
			var touchC = ev.changedTouches[0]
			var nowX = touchC.clientX
			var disX = nowX - start
			var translateX = disX + elementX
			
			//微观下移动的距离 和 时间，放在该位置，move的第一次触发不产生位移，因为mumu.css(item, "translateX")未执行
			nowTime = new Date().getTime()
			//nowPoint = mumu.css(item, "translateX")
			nowPoint = touchC.clientX
			timeDis = nowTime - lastTime
			pointDis = nowPoint - lastPoint
			
			lastTime = nowTime
			lastPoint = nowPoint
			
			
			/*
			 * 手动橡皮筋效果
			 * 在move的移动过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离还在在变大
			 * disX：整个move过程的实际距离
			 * pointDis：整个手指touchmove真正的有效距离
			 */
			//translateX设置不超出  
			if(translateX > 0){
				item.handMove = true
				//var scale = 1-translateX/do cument.documentElement.clientWidth
				//(0,1)
				var scale = document.documentElement.clientWidth/(1.5*(document.documentElement.clientWidth + translateX))
				//translateX = elementX + disX*scale
				//实时位置
				translateX = mumu.css(item, "translateX") + pointDis*scale  //改变
				//translateX = 0
			}else if(translateX < minx){
				item.handMove = true
				var over = minx - translateX
				var scale = document.documentElement.clientWidth/(1.5*(document.documentElement.clientWidth + over));
				translateX = mumu.css(item, "translateX") + pointDis*scale
				//translateX = minx
			}
			//移动
			mumu.css(item,"translateX",translateX)
			
			//原来的位置
			//nowTime = new Date().getTime()
			//nowPoint = mumu.css(item, "translateX")
			//timeDis = nowTime - lastTime
			//pointDis = nowPoint - lastPoint
			//lastTime = nowTime
			//lastPoint = nowPoint
			
			
		})
		//橡皮筋效果回缩 
		wrap.addEventListener("touchend", function (ev) {
			var translateX = mumu.css(item, "translateX")
			if(!item.handMove){
				//快速滑屏橡皮筋效果
				//滑屏速度  速度越大  位移越远
				var speed = pointDis/timeDis
				speed = Math.abs(speed)<0.5?0:speed;
				//快速滑屏的实现
				var targetX = translateX + speed*200
				var time = Math.abs(speed)*0.2
				time = time < 0.5?0.5:time; 
				time = time > 2?2:time; 
				//贝塞尔曲线，实现快速滑屏的橡皮筋效果
				var bsr = ""
				if(targetX > 0){
					targetX = 0
					bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					//mumu.css(item,"translateX",translateX)
				}else if(targetX < minx){
					targetX = minx
					bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					//mumu.css(item,"translateX",translateX)
				}
				item.style.transition = time +"s "+bsr+" transform"
				//item.style.transition = "10s transform"
				mumu.css(item,"translateX",targetX)
			}else {
				//手动橡皮筋效果
				if(translateX > 0){
					translateX = 0
					mumu.css(item,"translateX",translateX)
				}else if(translateX < minx){
					translateX = minx
					mumu.css(item,"translateX",translateX)
				}
				item.style.transition = "1s transform"
			}
		})
	}

	w.mumu.vMove = function (wrap,callBack) {
		/*
		 * transition 的问题
		 * 1.元素在没有渲染完成之时，无法触发过渡
		 * 2.在transition切换下，如果前后transform属性值变换函数的个数不一样 无法触发过渡
		 * 3.没法拿到transition中任何一帧的状态
		 *    --Tween运算
		 */
		
		//滑屏区域 wrap
		//滑屏元素
		var item = wrap.children[0];
		mumu.css(item,"translateZ",0.1)
		
		//元素一开始 手指一开始的位置
		var start = {}
		var element = {}
		//minY是list(ul)能滑动的最小距离（不超出，显白色)
		var minY = wrap.clientHeight - item.offsetHeight
		
		//快速滑屏的必要参数
		var lastTime=0
		var lastPoint = 0
		var nowTime = 0
		var nowPoint = 0
		var timeDis = 1
		var pointDis = 0
		//防抖动
		var isY = true
		var isFirst = true
		//即点即停
		var clear= 0
		var Tween = {
			Linear: function(t,b,c,d){ return c*t/d + b; },
			back: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        	}
		}
		wrap.addEventListener("touchstart", function (ev) {
			ev = ev || event
			var touchC = ev.changedTouches[0]
			
			minY = wrap.clientHeight - item.offsetHeight
			
			start = {clientX:touchC.clientX,clientY:touchC.clientY}
			//start = touchC.clientY
			element.y = mumu.css(item,"translateY")
			element.x = mumu.css(item,"translateX")
			
			item.style.transition = "none"
			
			lastTime = new Date().getTime()
			lastPoint = touchC.clientY
			//清除速度残留，干净速度 
			pointDis = 0
			item.handMove = false
			
			isY = true
			isFirst = true
			clearInterval(clear)
			
			if(callBack&&typeof callBack["start"] === "function"){
				callBack["start"].call(item);
			}
		})
		wrap.addEventListener("touchmove", function (ev) {
			if(!isY){
				return
			}
			ev = ev || event
			var touchC = ev.changedTouches[0]
			//var nowY = touchC.clientY
			//var disY = nowY - start
			//var translateY = disY + elementY
			var now = touchC
			var dis = {}
			dis.y = now.clientY - start.clientY
			dis.x = now.clientX - start.clientX
			var translateY = dis.y + element.y
			//微观下移动的距离 和 时间，放在该位置，move的第一次触发不产生位移，因为mumu.css(item, "translateY")未执行
			nowTime = new Date().getTime()
			//nowPoint = mumu.css(item, "translateY")
			nowPoint = touchC.clientY
			timeDis = nowTime - lastTime
			pointDis = nowPoint - lastPoint
			
			if(isFirst){
				isFirst = false
				if(Math.abs(dis.x) > Math.abs(dis.y)){
					isY = false
					return
				}
			} 
			
			lastTime = nowTime
			lastPoint = nowPoint
			
			
			/*
			 * 手动橡皮筋效果
			 * 在move的移动过程中，每一次touchmove真正的有效距离慢慢变小，元素的滑动距离还在在变大
			 * disY：整个move过程的实际距离
			 * pointDis：整个手指touchmove真正的有效距离
			 */
			//translateY设置不超出  
			if(translateY > 0){
				item.handMove = true
				//var scale = 1-translateY/do cument.documentElement.clientHeight
				//(0,1)
				var scale = document.documentElement.clientHeight/(1.5*(document.documentElement.clientHeight + translateY))
				//translateY = elementY + disY*scale
				//实时位置
				translateY = mumu.css(item, "translateY") + pointDis*scale  //改变
				//translateY = 0
			}else if(translateY < minY){
				item.handMove = true
				var over = minY - translateY
				var scale = document.documentElement.clientHeight/(1.5*(document.documentElement.clientHeight + over));
				translateY = mumu.css(item, "translateY") + pointDis*scale
				//translateY = minY
			}
			//移动
			mumu.css(item,"translateY",translateY)
			if(callBack&&typeof callBack["move"] === "function"){
				callBack["move"].call(item);
			}
			
			//原来的位置
			//nowTime = new Date().getTime()
			//nowPoint = mumu.css(item, "translateY")
			//timeDis = nowTime - lastTime
			//pointDis = nowPoint - lastPoint
			//lastTime = nowTime
			//lastPoint = nowPoint
			
			
		})
		//橡皮筋效果回缩 
		wrap.addEventListener("touchend", function (ev) {
			var translateY = mumu.css(item, "translateY")
			if(!item.handMove){
				//快速滑屏橡皮筋效果
				//滑屏速度  速度越大  位移越远
				var speed = pointDis/timeDis
				speed = Math.abs(speed)<0.5?0:speed;
				//快速滑屏的实现
				var targetY = translateY + speed*200
				var time = Math.abs(speed)*0.2
				time = time < 0.5?0.5:time; 
				time = time > 2?2:time; 
				
				var type = "Linear";
				
				//贝塞尔曲线，实现快速滑屏的橡皮筋效果
				//var bsr = ""
				if(targetY > 0){
					targetY = 0
					type = "back"
					//bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					//mumu.css(item,"translateY",translateY)
				}else if(targetY < minY){
					targetY = minY
					type = "back"
					//bsr = "cubic-bezier(.26,1.51,.68,1.54)"
					//mumu.css(item,"translateY",translateY)
				}
				//item.style.transition = time +"s "+bsr+" transform"
				///item.style.transition = "10s transform"
				//mumu.css(item,"translateY",targetY)
				
				bsr(type,targetY,time)
			}else {
				//手动橡皮筋效果
				if(translateY > 0){
					translateY = 0
					mumu.css(item,"translateY",translateY)
				}else if(translateY < minY){
					translateY = minY
					mumu.css(item,"translateY",translateY)
				}
				item.style.transition = "1s transform"
				if(callBack&&typeof callBack["end"] === "function"){
					callBack["end"].call(item);
				}
			}
		})
		function bsr(type,targetY,time){
			clearInterval(clear)
			var t = 0
			var b = mumu.css(item,"translateY")
			var c = targetY - b
			var d = time*1000 / (1000/60)
			clear = setInterval(function (){
				t++
				if(callBack&&typeof callBack["move"] === "function"){
					callBack["move"].call(item);
				}
				if(t > d){
					clearInterval(clear)
					if(callBack&&typeof callBack["end"] === "function"){
						callBack["end"].call(item);
					}
				}
				//console.log(Tween[type])
				//var s = 1
				var point = Tween[type](t,b,c,d)
				mumu.css(item,"translateY",point)
			},1000/60)
		}
	}
})(window)
