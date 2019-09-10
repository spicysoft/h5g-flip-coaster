function rand(){return globalRandom.v()}function randF(t,e){return globalRandom.f(t,e)}function randI(t,e){return globalRandom.i(t,e)}function randBool(t){return void 0===t&&(t=.5),globalRandom.bool(t)}var __reflect=this&&this.__reflect||function(t,e,i){t.__class__=e,i?i.push(e):i=[e],t.__types__=t.__types__?i.concat(t.__types__):i},__extends=this&&this.__extends||function(t,e){function i(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);i.prototype=e.prototype,t.prototype=new i},GameObject=function(){function t(){this.display=null,t.objects.push(this)}return t.prototype.destroy=function(){this.deleteFlag=!0},t.prototype.onDestroy=function(){},t.initial=function(e){t.baseDisplay=e,t.gameDisplay=new egret.DisplayObjectContainer,t.baseDisplay.addChild(t.gameDisplay)},t.process=function(){t.objects.forEach(function(t){return t.update()}),t.objects=t.objects.filter(function(t){return t.deleteFlag&&t._delete(),!t.deleteFlag}),t.transit&&(t.dispose(),t.transit(),t.transit=null)},t.dispose=function(){t.objects=t.objects.filter(function(t){return t.destroy(),t._delete(),!1})},t.prototype._delete=function(){this.onDestroy(),this.display&&(this.display.parent.removeChild(this.display),this.display=null)},t.objects=[],t}();__reflect(GameObject.prototype,"GameObject");var PIXEL_PER_METER=1,PHYSICS_GRAVITY_PER_H=.05,PHYSICS_GROUP_PLAYER=2,PHYSICS_GROUP_OBSTACLE=4,PhysicsObject=function(t){function e(){return t.call(this)||this}return __extends(e,t),e.prototype.update=function(){if(this.display){var t=this.body,e=this.display;e.x=this.px,e.y=this.py,e.rotation=180*t.angle/Math.PI}this.fixedUpdate()},e.prepare=function(t){e.pixelPerMeter=t,e.meterPerPixel=1/t,e.width=e.pixelToMeter(Util.width),e.height=e.pixelToMeter(Util.height),e.world=new p2.World,e.world.gravity=[0,e.height*PHYSICS_GRAVITY_PER_H],e.world.defaultContactMaterial.friction=0,e.lastTime=Date.now(),e.deltaScale=1},e.progress=function(){var t=Date.now(),i=(t-this.lastTime)*this.deltaScale;this.lastTime=t,i>0&&e.world.step(1/60*this.deltaScale,i,4)},e.prototype._delete=function(){this.onDestroy(),this.body&&(e.world.removeBody(this.body),this.body.displays=[],this.body=null),this.display&&(this.display.parent.removeChild(this.display),this.display=null)},e.pixelToMeter=function(t){return t*e.meterPerPixel},e.meterToPixel=function(t){return t*e.pixelPerMeter},e.prototype.m2p=function(t){return e.meterToPixel(t)},e.prototype.p2m=function(t){return e.pixelToMeter(t)},Object.defineProperty(e.prototype,"px",{get:function(){return e.meterToPixel(this.mx)},set:function(t){this.mx=e.pixelToMeter(t)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"py",{get:function(){return e.meterToPixel(this.my)},set:function(t){this.my=e.pixelToMeter(t)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"mx",{get:function(){return this.body.position[0]},set:function(t){this.body.position[0]=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"my",{get:function(){return this.body.position[1]},set:function(t){this.body.position[1]=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"vx",{get:function(){return this.body.velocity[0]},set:function(t){this.body.velocity[0]=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"vy",{get:function(){return this.body.velocity[1]},set:function(t){this.body.velocity[1]=t},enumerable:!0,configurable:!0}),e.deltaScale=1,e}(GameObject);__reflect(PhysicsObject.prototype,"PhysicsObject");var GAME_AREA_H_PER_W=1.2,PLAYER_WIDE_PER_W=1/16,PLAYER_HIGH_PER_W=1/32,PLAYER_SPEED_PER_W=1/16,JUMP_POWER_PER_W=.25,FLOATING_POWER_PER_W=1/300,FLIP_ANGULAR=-1.4,MAX_VY_PER_W=1/80,CAMERA_POSITION_X=.2,COIN_RADIUS_PER_W=1/96,ITEM_RADIUS_PER_W=1/48,ITEM_LIMIT_FRAME=600,LAND_L_PW=.5,BAR_RADIUS_PER_W=.02,SAVE_KEY_BESTSCORE="flip-bestScore",BACK_COLOR=13684736,FONT_COLOR=1052688,SCORE_COLOR=1052688,PLAYER_COLOR=1052688,BAR_COLOR=1052688,Game=function(){function t(){}return t.loadSceneGamePlay=function(){new Player(Util.w(.25),Util.h(.5)),new Wave,new StartMessage,new Score},t}();__reflect(Game.prototype,"Game");var Player=function(t){function e(i,o){var s=t.call(this)||this;return s.landing=!1,s.floating=!1,s.lastLandY=0,s.magnet=0,s.big=0,s.button=null,s.state=s.stateNone,e.I=s,s.w=Util.w(PLAYER_WIDE_PER_W),s.h=Util.w(PLAYER_HIGH_PER_W),s.color=PLAYER_COLOR,s.setDisplay(i,o),s.setBody(i,o),Camera2D.x=0,s.scrollCamera(!0,1,1),s.button=new Button(null,0,0,.5,.5,1,1,0,0,null),s}return __extends(e,t),Object.defineProperty(e.prototype,"x",{get:function(){return this.display.x},set:function(t){this.display.x=t},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"y",{get:function(){return this.display.y},set:function(t){this.display.y=t},enumerable:!0,configurable:!0}),e.prototype.onDestroy=function(){this.button.destroy(),e.I=null},e.prototype.setDisplay=function(t,e){var i=this.display;null==this.display?(this.display=i=new egret.Shape,GameObject.gameDisplay.addChild(this.display)):i.graphics.clear(),i.x=t,i.y=e,i.graphics.beginFill(this.color),i.graphics.drawCircle(0,-1*this.h,.25*this.w),i.graphics.endFill(),i.graphics.lineStyle(this.h,this.color),i.graphics.moveTo(-.5*this.w,0),i.graphics.lineTo(.5*this.w,0)},e.prototype.setBody=function(t,e){this.body=new p2.Body({gravityScale:0,mass:.1,position:[this.p2m(t),this.p2m(e)]}),this.body.addShape(new p2.Capsule({length:this.w,radius:this.p2m(this.h/2),collisionGroup:PHYSICS_GROUP_PLAYER,collisionMask:PHYSICS_GROUP_OBSTACLE}),[0,0],0*Math.PI),this.body.displays=[this.display],PhysicsObject.world.addBody(this.body),PhysicsObject.world.on("beginContact",this.beginContact,this),PhysicsObject.world.on("endContact",this.endContact,this)},e.prototype.beginContact=function(t){var e=t.bodyA,i=t.bodyB;(e==this.body||i==this.body)&&(this.landing=!0)},e.prototype.endContact=function(t){var e=t.bodyA,i=t.bodyB;(e==this.body||i==this.body)&&(this.landing=!1)},e.prototype.fixedUpdate=function(){var t=Util.deltaAngle(this.body.angle);this.body.angle*t<0&&Score.I.addPoint(),this.body.angle=t,this.state()},e.prototype.scrollCamera=function(t,e,i){void 0===e&&(e=1/32),void 0===i&&(i=1),Camera2D.x=this.x-Util.w(CAMERA_POSITION_X),(t||this.y>Camera2D.y+Util.h(.5))&&(Camera2D.y+=(this.y-Util.h(.4)-Camera2D.y)*e),Camera2D.scale+=(i-Camera2D.scale)*e},e.prototype.IsStanding=function(){return this.landing&&Math.pow(this.body.angle,2)<=Math.pow(.375*Math.PI,2)?!0:!1},e.prototype.IsUpsideDown=function(){return Math.pow(this.body.angle,2)>Math.pow(.75*Math.PI,2)},e.prototype.setStateNone=function(){this.state=this.stateNone},e.prototype.stateNone=function(){},e.prototype.setStateRun=function(){this.state=this.stateRun,this.body.gravityScale=1},e.prototype.stateRun=function(){if(this.IsStanding()){if(this.lastLandY=this.y,this.drivingForce(),this.button.press){var t=Util.w(JUMP_POWER_PER_W),e=this.body.angle+.15*Math.PI;this.vx=+Math.sin(e)*t,this.vy=-Math.cos(e)*t,this.floating=!0,this.state=this.stateJump}}else this.floating=!1,this.state=this.stateJump;this.scrollCamera(this.landing)},e.prototype.stateJump=function(){0==this.landing?(this.drivingForce(),this.vy<0?this.floating&&(this.button.touch?this.vy-=Util.w(FLOATING_POWER_PER_W):this.floating=!1):this.floating&&(this.floating=!1),this.body.angularVelocity*=.9,this.button.touch&&(this.body.angularVelocity=FLIP_ANGULAR)):this.IsStanding()?(this.state=this.stateRun,this.floating=!1):this.IsUpsideDown()&&this.setStateMiss(),this.scrollCamera(this.landing),this.checkFall()},e.prototype.drivingForce=function(){this.vx<Util.w(PLAYER_SPEED_PER_W)&&(this.vx+=.5*(Util.w(PLAYER_SPEED_PER_W)-this.vx))},e.prototype.checkFall=function(){return this.y-this.lastLandY>=Util.h(.5)+Util.w(GAME_AREA_H_PER_W/2)?(this.setStateMiss(),!0):!1},e.prototype.setStateMiss=function(){this.state!=this.stateMiss&&(new GameOver,this.state=this.stateMiss)},e.prototype.stateMiss=function(){this.checkFall()},e.I=null,e}(PhysicsObject);__reflect(Player.prototype,"Player");var Wave=function(t){function e(){var i=t.call(this)||this;return i.waveX=0,i.lastPx=0,i.lastPy=0,i.step=4,e.hardRate=0,i.lastPy=Util.h(.6),i.newStair(),i.newStair(),i.newStair(),i}return __extends(e,t),e.prototype.update=function(){var t=Camera2D.x+Util.w(1.1);t>=this.waveX&&(this.newStair(),Score.I.addPoint(),this.step--,this.step<=0&&(this.step=randI(5,10),this.waveX+=Util.w(LAND_L_PW)*Util.lerp(.5,1,e.hardRate)),e.hardRate=Util.clamp(this.waveX/Util.width/20,0,1))},e.prototype.newStair=function(){var t=this.waveX,i=this.lastPy,o=t+Util.w(LAND_L_PW)*randF(Util.lerp(1.2,.7,e.hardRate),1.5),s=i+Util.w(.125);new Bar(t,i,o,s),t=o,i=s,o=o,s+=Util.w(randF(.1,Util.lerp(.1,.4,e.hardRate))),new Bar(t,i,o,s),this.waveX=o,this.lastPx=o,this.lastPy=s},e}(GameObject);__reflect(Wave.prototype,"Wave");var Button=function(t){function e(e,i,o,s,n,a,r,l,h,c){var p=t.call(this)||this;p.text=null,p.onTap=null,p.press=!1,p.touch=!1,p.x=0,p.y=0;var d=new egret.Shape;GameObject.baseDisplay.addChild(d),d.graphics.beginFill(l,h);var y=a*Util.width,u=r*Util.height;return d.graphics.drawRoundRect(-.5*y,-.5*u,y,u,.2*y),d.graphics.endFill(),d.touchEnabled=!0,d.x=s*Util.width,d.y=n*Util.height,p.display=d,e&&(p.text=Util.newTextField(e,i,o,s,n,!0,!1),GameObject.baseDisplay.addChild(p.text)),p.onTap=c,p.onTap&&p.display.addEventListener(egret.TouchEvent.TOUCH_TAP,p.onTap,p),p.display.addEventListener(egret.TouchEvent.TOUCH_BEGIN,p.touchBegin,p),p.display.addEventListener(egret.TouchEvent.TOUCH_MOVE,p.touchMove,p),p.display.addEventListener(egret.TouchEvent.TOUCH_END,p.touchEnd,p),p}return __extends(e,t),e.prototype.onDestroy=function(){this.onTap&&this.display.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this),GameObject.baseDisplay.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this),GameObject.baseDisplay.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove,this),GameObject.baseDisplay.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this),this.text&&GameObject.baseDisplay.removeChild(this.text)},e.prototype.update=function(){var t=this.touch?1.1:1;this.display.scaleX=this.display.scaleY=this.display.scaleX+.25*(t-this.display.scaleX),this.press=!1},e.prototype.touchBegin=function(t){this.x=t.stageX,this.y=t.stageY,this.press=!0,this.touch=!0},e.prototype.touchMove=function(t){this.x=t.stageX,this.y=t.stageY,this.touch=!0},e.prototype.touchEnd=function(t){this.touch=!1},e}(GameObject);__reflect(Button.prototype,"Button");var Camera2D=function(){function t(){}return t.initial=function(){t.x=0,t.y=0,t.localX=0,t.localY=0,t.scale=1,t.rotation=0},t.process=function(){GameObject.gameDisplay.anchorOffsetX=t.x,GameObject.gameDisplay.anchorOffsetY=t.y,GameObject.gameDisplay.x=this.localX,GameObject.gameDisplay.y=this.localY,GameObject.gameDisplay.scaleX=GameObject.gameDisplay.scaleY=t.scale,GameObject.gameDisplay.rotation=t.rotation},t}();__reflect(Camera2D.prototype,"Camera2D");var Bar=function(t){function e(i,o,s,n){var a=t.call(this)||this;e.bars.push(a),a.px0=i,a.py0=o,a.px1=s,a.py1=n,a.uvx=s-i,a.uvy=n-o,a.length=Math.sqrt(Math.pow(a.uvx,2)+Math.pow(a.uvy,2));var r=1/a.length;return a.uvx*=r,a.uvy*=r,a.cx=.5*(i+s),a.cy=.5*(o+n),a.w=a.length,a.h=2*Util.w(BAR_RADIUS_PER_W),a.angle=Math.atan2(a.uvy,a.uvx),a.setDisplay(),a.setBody(),a}return __extends(e,t),e.prototype.onDestroy=function(){var t=this;e.bars=e.bars.filter(function(e){return e!=t})},e.prototype.setDisplay=function(){this.display&&GameObject.gameDisplay.removeChild(this.display);var t=new egret.Shape;this.display=t,GameObject.gameDisplay.addChildAt(this.display,1),t.graphics.lineStyle(this.h,BAR_COLOR),t.graphics.moveTo(-.5*this.w,0),t.graphics.lineTo(.5*this.w,0)},e.prototype.setBody=function(){this.body=new p2.Body({gravityScale:0,mass:1,position:[this.p2m(this.cx),this.p2m(this.cy)],type:p2.Body.STATIC}),this.body.addShape(new p2.Box({width:this.p2m(this.w),height:this.p2m(this.h),collisionGroup:PHYSICS_GROUP_OBSTACLE,collisionMask:PHYSICS_GROUP_PLAYER}),[0,0],0),this.body.displays=[this.display],this.body.angle=this.angle,PhysicsObject.world.addBody(this.body)},e.prototype.fixedUpdate=function(){Camera2D.x-Util.w(.5)>this.px1&&this.destroy()},e.bars=[],e}(PhysicsObject);__reflect(Bar.prototype,"Bar");var Main=function(t){function e(){var e=t.call(this)||this;return e.once(egret.Event.ADDED_TO_STAGE,e.addToStage,e),e}return __extends(e,t),e.prototype.addToStage=function(){Util.init(this),GameObject.initial(this.stage),PhysicsObject.prepare(PIXEL_PER_METER),Camera2D.initial(),Game.loadSceneGamePlay(),egret.startTick(this.tickLoop,this)},e.prototype.tickLoop=function(t){return PhysicsObject.progress(),GameObject.process(),Camera2D.process(),!1},e}(eui.UILayer);__reflect(Main.prototype,"Main");var Random=function(){function t(e){void 0===e&&(e=Math.floor(Math.random()*t.max)),this.x=123456789,this.y=362436069,this.z=521288629,this.w=e}return t.prototype.v=function(){return(this.next()&t.max)/(t.max+1)},t.prototype.f=function(t,e){return t+this.v()*(e-t)},t.prototype.i=function(t,e){return Math.floor(this.f(t,e))},t.prototype.bool=function(t){return void 0===t&&(t=.5),this.v()<t},t.prototype.next=function(){var t;return t=this.x^this.x<<11,this.x=this.y,this.y=this.z,this.z=this.w,this.w=this.w^this.w>>>19^(t^t>>>8)},t.max=1073741823,t}();__reflect(Random.prototype,"Random");var globalRandom=new Random,Rect=function(t){function e(e,i,o,s,n,a,r){void 0===a&&(a=!1),void 0===r&&(r=!1);var l=t.call(this)||this,h=new egret.Shape;l.display=h;var c=a?GameObject.gameDisplay:GameObject.baseDisplay;return r?c.addChild(l.display):c.addChildAt(l.display,1),h.graphics.beginFill(n,1),h.graphics.drawRect(e,i,o,s),h.graphics.endFill(),l}return __extends(e,t),e.prototype.update=function(){},e}(GameObject);__reflect(Rect.prototype,"Rect");var Util=function(){function t(){}return t.w=function(e){return e*t.width},t.h=function(e){return e*t.height},t.init=function(t){this.width=t.stage.stageWidth,this.height=t.stage.stageHeight},t.clamp=function(t,e,i){return e>t&&(t=e),t>i&&(t=i),t},t.lerp=function(t,e,i){return t+(e-t)*i},t.deltaAngle=function(t){var e=(t+Math.PI)/(2*Math.PI);return e=65536*e&65535,e=e/65536*Math.PI*2-Math.PI},t.color=function(t,e,i){return 65536*Math.floor(255*t)+256*Math.floor(255*e)+Math.floor(255*i)},t.colorLerp=function(t,e,i){var o=1-i,s=((16711680&t)*o+(16711680&e)*i&16711680)+((65280&t)*o+(65280&e)*i&65280)+((255&t)*o+(255&e)*i&255);return s},t.newTextField=function(e,i,o,s,n,a,r){var l=new egret.TextField;return l.text=e,l.bold=a,l.size=i,l.textColor=o,r?(l.x=(t.width-l.width)*s,l.y=(t.height-l.height)*n):(l.x=t.width*s-.5*l.width,l.y=t.height*n-.5*l.height),l},t}();__reflect(Util.prototype,"Util");var GameOver=function(t){function e(){var e=t.call(this)||this;return e.texts=[],e.retryButton=null,e.step=0,e.fadeInFrame=64,e.texts[0]=Util.newTextField("SCORE : "+Score.I.point.toFixed(),Util.width/12,FONT_COLOR,.5,.35,!0,!1),egret.Tween.get(e.texts[0],{loop:!1}).to({alpha:0},0).to({alpha:1},1e3),GameObject.baseDisplay.addChild(e.texts[0]),e}return __extends(e,t),e.prototype.onDestroy=function(){this.texts.forEach(function(t){GameObject.baseDisplay.removeChild(t)}),this.texts=null},e.prototype.update=function(){this.step++,this.step==this.fadeInFrame&&(this.retryButton=new Button("リトライ",Util.width/16,BACK_COLOR,.5,.75,.4,.1,FONT_COLOR,1,this.onTapRetry),Score.I.point>Score.I.bestScore&&(egret.localStorage.setItem(SAVE_KEY_BESTSCORE,Score.I.point.toFixed()),this.texts[1]=Util.newTextField("NEW RECORD!",Util.width/13,FONT_COLOR,.5,.45,!0,!1),egret.Tween.get(this.texts[1],{loop:!0}).to({alpha:0},500).to({alpha:1},500),GameObject.baseDisplay.addChild(this.texts[1])))},e.prototype.onTapRetry=function(){GameObject.transit=Game.loadSceneGamePlay,this.destroy()},e}(GameObject);__reflect(GameOver.prototype,"GameOver");var Score=function(t){function e(){var i=t.call(this)||this;i.point=0,i.bestScore=0,i.text=null,i.textBest=null,e.I=i,i.point=0,i.text=Util.newTextField("0",Util.width/22,SCORE_COLOR,.5,0,!0,!0),GameObject.baseDisplay.addChild(i.text);var o=egret.localStorage.getItem(SAVE_KEY_BESTSCORE);return null==o&&(o="10",egret.localStorage.setItem(SAVE_KEY_BESTSCORE,o)),i.bestScore=parseInt(o),i.textBest=Util.newTextField("BEST:"+o,Util.width/22,SCORE_COLOR,0,0,!0,!0),GameObject.baseDisplay.addChild(i.textBest),i}return __extends(e,t),e.prototype.onDestroy=function(){GameObject.baseDisplay.removeChild(this.text),this.text=null,GameObject.baseDisplay.removeChild(this.textBest),this.textBest=null,e.I=null},e.prototype.update=function(){},e.prototype.addPoint=function(t){void 0===t&&(t=1),this.point+=t,this.text.text=""+this.point.toFixed(),this.bestScore<this.point&&(this.textBest.text="BEST:"+this.point.toFixed())},e.I=null,e}(GameObject);__reflect(Score.prototype,"Score");var StartMessage=function(t){function e(){var e=t.call(this)||this;return e.texts=[],e.texts[0]=Util.newTextField("フリップコースター",Util.width/12,FONT_COLOR,.5,.2,!0,!1),e.texts[1]=Util.newTextField("タッチでジャンプ＆宙返り",Util.width/19,FONT_COLOR,.5,.3,!0,!1),e.texts[2]=Util.newTextField("逆さまにならないように進む",Util.width/19,FONT_COLOR,.5,.35,!0,!1),e.texts.forEach(function(t){GameObject.baseDisplay.addChild(t)}),GameObject.baseDisplay.once(egret.TouchEvent.TOUCH_TAP,e.tap,e),e}return __extends(e,t),e.prototype.onDestroy=function(){this.texts.forEach(function(t){t.parent.removeChild(t)}),this.texts=null},e.prototype.update=function(){},e.prototype.tap=function(t){Player.I.setStateRun(),this.destroy()},e}(GameObject);__reflect(StartMessage.prototype,"StartMessage");