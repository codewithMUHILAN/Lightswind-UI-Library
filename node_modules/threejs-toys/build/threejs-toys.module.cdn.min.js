import{EventDispatcher as Tt,Vector3 as j,MOUSE as J,TOUCH as ee,Quaternion as Xe,Spherical as Ze,Vector2 as _,WebGLRenderer as bt,PerspectiveCamera as Qe,Scene as $e,PointLight as zt,DirectionalLight as Pt,AmbientLight as Ct,SplineCurve as Mt,Color as q,OrthographicCamera as ze,PlaneGeometry as ne,ShaderMaterial as Y,Mesh as fe,Camera as Et,WebGLRenderTarget as se,RGBAFormat as Ke,DataTexture as Dt,FloatType as Je,NearestFilter as ve,ClampToEdgeWrapping as et,HalfFloatType as he,BufferGeometry as pe,BufferAttribute as Pe,AdditiveBlending as tt,Points as _t,MathUtils as xe,CanvasTexture as Rt,InstancedBufferAttribute as le,DoubleSide as Ce,TextureLoader as ot,MeshBasicMaterial as Me,MeshPhongMaterial as it,MeshStandardMaterial as Ee,InstancedMesh as De,Float32BufferAttribute as te,UniformsUtils as _e,Clock as At,SphereGeometry as Nt,OctahedronGeometry as It,ConeGeometry as kt,CapsuleGeometry as Ot,BoxGeometry as Ut,FogExp2 as Lt}from"https://unpkg.com/three@0.140.0/build/three.module.js";const at={type:"change"},Re={type:"start"},rt={type:"end"};class Ft extends Tt{constructor(e,o){super();o===void 0&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),o===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.object=e,this.domElement=o,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new j,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:J.ROTATE,MIDDLE:J.DOLLY,RIGHT:J.PAN},this.touches={ONE:ee.ROTATE,TWO:ee.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return n.phi},this.getAzimuthalAngle=function(){return n.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(a){a.addEventListener("keydown",Be),this._domElementKeyEvents=a},this.saveState=function(){t.target0.copy(t.target),t.position0.copy(t.object.position),t.zoom0=t.object.zoom},this.reset=function(){t.target.copy(t.target0),t.object.position.copy(t.position0),t.object.zoom=t.zoom0,t.object.updateProjectionMatrix(),t.dispatchEvent(at),t.update(),r=i.NONE},this.update=function(){const a=new j,y=new Xe().setFromUnitVectors(e.up,new j(0,1,0)),B=y.clone().invert(),H=new j,G=new Xe,K=2*Math.PI;return function(){const Ye=t.object.position;a.copy(Ye).sub(t.target),a.applyQuaternion(y),n.setFromVector3(a),t.autoRotate&&r===i.NONE&&V(F()),t.enableDamping?(n.theta+=c.theta*t.dampingFactor,n.phi+=c.phi*t.dampingFactor):(n.theta+=c.theta,n.phi+=c.phi);let X=t.minAzimuthAngle,Z=t.maxAzimuthAngle;return isFinite(X)&&isFinite(Z)&&(X<-Math.PI?X+=K:X>Math.PI&&(X-=K),Z<-Math.PI?Z+=K:Z>Math.PI&&(Z-=K),X<=Z?n.theta=Math.max(X,Math.min(Z,n.theta)):n.theta=n.theta>(X+Z)/2?Math.max(X,n.theta):Math.min(Z,n.theta)),n.phi=Math.max(t.minPolarAngle,Math.min(t.maxPolarAngle,n.phi)),n.makeSafe(),n.radius*=p,n.radius=Math.max(t.minDistance,Math.min(t.maxDistance,n.radius)),t.enableDamping===!0?t.target.addScaledVector(u,t.dampingFactor):t.target.add(u),a.setFromSpherical(n),a.applyQuaternion(B),Ye.copy(t.target).add(a),t.object.lookAt(t.target),t.enableDamping===!0?(c.theta*=1-t.dampingFactor,c.phi*=1-t.dampingFactor,u.multiplyScalar(1-t.dampingFactor)):(c.set(0,0,0),u.set(0,0,0)),p=1,v||H.distanceToSquared(t.object.position)>d||8*(1-G.dot(t.object.quaternion))>d?(t.dispatchEvent(at),H.copy(t.object.position),G.copy(t.object.quaternion),v=!1,!0):!1}}(),this.dispose=function(){t.domElement.removeEventListener("contextmenu",He),t.domElement.removeEventListener("pointerdown",Ve),t.domElement.removeEventListener("pointercancel",We),t.domElement.removeEventListener("wheel",je),t.domElement.removeEventListener("pointermove",Se),t.domElement.removeEventListener("pointerup",Te),t._domElementKeyEvents!==null&&t._domElementKeyEvents.removeEventListener("keydown",Be)};const t=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const d=1e-6,n=new Ze,c=new Ze;let p=1;const u=new j;let v=!1;const w=new _,M=new _,l=new _,s=new _,S=new _,E=new _,g=new _,R=new _,N=new _,x=[],I={};function F(){return 2*Math.PI/60/60*t.autoRotateSpeed}function D(){return Math.pow(.95,t.zoomSpeed)}function V(a){c.theta-=a}function A(a){c.phi-=a}const O=function(){const a=new j;return function(B,H){a.setFromMatrixColumn(H,0),a.multiplyScalar(-B),u.add(a)}}(),L=function(){const a=new j;return function(B,H){t.screenSpacePanning===!0?a.setFromMatrixColumn(H,1):(a.setFromMatrixColumn(H,0),a.crossVectors(t.object.up,a)),a.multiplyScalar(B),u.add(a)}}(),k=function(){const a=new j;return function(B,H){const G=t.domElement;if(t.object.isPerspectiveCamera){const K=t.object.position;a.copy(K).sub(t.target);let me=a.length();me*=Math.tan(t.object.fov/2*Math.PI/180),O(2*B*me/G.clientHeight,t.object.matrix),L(2*H*me/G.clientHeight,t.object.matrix)}else t.object.isOrthographicCamera?(O(B*(t.object.right-t.object.left)/t.object.zoom/G.clientWidth,t.object.matrix),L(H*(t.object.top-t.object.bottom)/t.object.zoom/G.clientHeight,t.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),t.enablePan=!1)}}();function W(a){t.object.isPerspectiveCamera?p/=a:t.object.isOrthographicCamera?(t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom*a)),t.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function m(a){t.object.isPerspectiveCamera?p*=a:t.object.isOrthographicCamera?(t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/a)),t.object.updateProjectionMatrix(),v=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function C(a){w.set(a.clientX,a.clientY)}function b(a){g.set(a.clientX,a.clientY)}function z(a){s.set(a.clientX,a.clientY)}function T(a){M.set(a.clientX,a.clientY),l.subVectors(M,w).multiplyScalar(t.rotateSpeed);const y=t.domElement;V(2*Math.PI*l.x/y.clientHeight),A(2*Math.PI*l.y/y.clientHeight),w.copy(M),t.update()}function P(a){R.set(a.clientX,a.clientY),N.subVectors(R,g),N.y>0?W(D()):N.y<0&&m(D()),g.copy(R),t.update()}function f(a){S.set(a.clientX,a.clientY),E.subVectors(S,s).multiplyScalar(t.panSpeed),k(E.x,E.y),s.copy(S),t.update()}function U(a){a.deltaY<0?m(D()):a.deltaY>0&&W(D()),t.update()}function Q(a){let y=!1;switch(a.code){case t.keys.UP:k(0,t.keyPanSpeed),y=!0;break;case t.keys.BOTTOM:k(0,-t.keyPanSpeed),y=!0;break;case t.keys.LEFT:k(t.keyPanSpeed,0),y=!0;break;case t.keys.RIGHT:k(-t.keyPanSpeed,0),y=!0;break}y&&(a.preventDefault(),t.update())}function de(){if(x.length===1)w.set(x[0].pageX,x[0].pageY);else{const a=.5*(x[0].pageX+x[1].pageX),y=.5*(x[0].pageY+x[1].pageY);w.set(a,y)}}function ke(){if(x.length===1)s.set(x[0].pageX,x[0].pageY);else{const a=.5*(x[0].pageX+x[1].pageX),y=.5*(x[0].pageY+x[1].pageY);s.set(a,y)}}function Oe(){const a=x[0].pageX-x[1].pageX,y=x[0].pageY-x[1].pageY,B=Math.sqrt(a*a+y*y);g.set(0,B)}function ft(){t.enableZoom&&Oe(),t.enablePan&&ke()}function vt(){t.enableZoom&&Oe(),t.enableRotate&&de()}function Ue(a){if(x.length==1)M.set(a.pageX,a.pageY);else{const B=be(a),H=.5*(a.pageX+B.x),G=.5*(a.pageY+B.y);M.set(H,G)}l.subVectors(M,w).multiplyScalar(t.rotateSpeed);const y=t.domElement;V(2*Math.PI*l.x/y.clientHeight),A(2*Math.PI*l.y/y.clientHeight),w.copy(M)}function Le(a){if(x.length===1)S.set(a.pageX,a.pageY);else{const y=be(a),B=.5*(a.pageX+y.x),H=.5*(a.pageY+y.y);S.set(B,H)}E.subVectors(S,s).multiplyScalar(t.panSpeed),k(E.x,E.y),s.copy(S)}function Fe(a){const y=be(a),B=a.pageX-y.x,H=a.pageY-y.y,G=Math.sqrt(B*B+H*H);R.set(0,G),N.set(0,Math.pow(R.y/g.y,t.zoomSpeed)),W(N.y),g.copy(R)}function ht(a){t.enableZoom&&Fe(a),t.enablePan&&Le(a)}function pt(a){t.enableZoom&&Fe(a),t.enableRotate&&Ue(a)}function Ve(a){t.enabled!==!1&&(x.length===0&&(t.domElement.setPointerCapture(a.pointerId),t.domElement.addEventListener("pointermove",Se),t.domElement.addEventListener("pointerup",Te)),St(a),a.pointerType==="touch"?yt(a):xt(a))}function Se(a){t.enabled!==!1&&(a.pointerType==="touch"?wt(a):gt(a))}function Te(a){Ge(a),x.length===0&&(t.domElement.releasePointerCapture(a.pointerId),t.domElement.removeEventListener("pointermove",Se),t.domElement.removeEventListener("pointerup",Te)),t.dispatchEvent(rt),r=i.NONE}function We(a){Ge(a)}function xt(a){let y;switch(a.button){case 0:y=t.mouseButtons.LEFT;break;case 1:y=t.mouseButtons.MIDDLE;break;case 2:y=t.mouseButtons.RIGHT;break;default:y=-1}switch(y){case J.DOLLY:if(t.enableZoom===!1)return;b(a),r=i.DOLLY;break;case J.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(t.enablePan===!1)return;z(a),r=i.PAN}else{if(t.enableRotate===!1)return;C(a),r=i.ROTATE}break;case J.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(t.enableRotate===!1)return;C(a),r=i.ROTATE}else{if(t.enablePan===!1)return;z(a),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Re)}function gt(a){if(t.enabled!==!1)switch(r){case i.ROTATE:if(t.enableRotate===!1)return;T(a);break;case i.DOLLY:if(t.enableZoom===!1)return;P(a);break;case i.PAN:if(t.enablePan===!1)return;f(a);break}}function je(a){t.enabled===!1||t.enableZoom===!1||r!==i.NONE||(a.preventDefault(),t.dispatchEvent(Re),U(a),t.dispatchEvent(rt))}function Be(a){t.enabled===!1||t.enablePan===!1||Q(a)}function yt(a){switch(qe(a),x.length){case 1:switch(t.touches.ONE){case ee.ROTATE:if(t.enableRotate===!1)return;de(),r=i.TOUCH_ROTATE;break;case ee.PAN:if(t.enablePan===!1)return;ke(),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(t.touches.TWO){case ee.DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;ft(),r=i.TOUCH_DOLLY_PAN;break;case ee.DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;vt(),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&t.dispatchEvent(Re)}function wt(a){switch(qe(a),r){case i.TOUCH_ROTATE:if(t.enableRotate===!1)return;Ue(a),t.update();break;case i.TOUCH_PAN:if(t.enablePan===!1)return;Le(a),t.update();break;case i.TOUCH_DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;ht(a),t.update();break;case i.TOUCH_DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;pt(a),t.update();break;default:r=i.NONE}}function He(a){t.enabled!==!1&&a.preventDefault()}function St(a){x.push(a)}function Ge(a){delete I[a.pointerId];for(let y=0;y<x.length;y++)if(x[y].pointerId==a.pointerId){x.splice(y,1);return}}function qe(a){let y=I[a.pointerId];y===void 0&&(y=new _,I[a.pointerId]=y),y.set(a.pageX,a.pageY)}function be(a){const y=a.pointerId===x[0].pointerId?x[1]:x[0];return I[y.pointerId]}t.domElement.addEventListener("contextmenu",He),t.domElement.addEventListener("pointerdown",Ve),t.domElement.addEventListener("pointercancel",We),t.domElement.addEventListener("wheel",je,{passive:!1}),this.update()}}function Vt(h){const{domElement:e,onClick:o=()=>{},onEnter:t=()=>{},onMove:i=()=>{},onLeave:r=()=>{},onDragStart:d=()=>{},onDragMove:n=()=>{},onDragStop:c=()=>{}}=h,p=new _,u=new _,v=new _,w=new _,M=new _,l={position:p,nPosition:u,hover:!1,down:!1,removeListeners:F};return I(),l;function s(D){v.distanceTo(p)<20&&(x(D),o({position:p,nPosition:u}))}function S(D){l.hover=D.pointerType==="mouse",x(D),t({position:p,nPosition:u})}function E(D){l.down=!0,x(D),v.copy(p),w.copy(p),d({position:p,nPosition:u})}function g(D){x(D),M.copy(p).sub(w),l.down?n({position:p,nPosition:u,startPosition:v,lastPosition:w,delta:M}):l.hover||(l.hover=!0),i({position:p,nPosition:u,startPosition:v,lastPosition:w,delta:M}),w.copy(p)}function R(D){l.down=!1,c()}function N(D){l.down&&(l.down=!1,c()),l.hover=!1,r()}function x(D){const V=e.getBoundingClientRect();p.x=D.clientX-V.left,p.y=D.clientY-V.top,u.x=p.x/V.width*2-1,u.y=-(p.y/V.height)*2+1}function I(){e.addEventListener("click",s),e.addEventListener("pointerenter",S),e.addEventListener("pointerdown",E),e.addEventListener("pointermove",g),e.addEventListener("pointerup",R),e.addEventListener("pointerleave",N)}function F(){e.removeEventListener("click",s),e.removeEventListener("pointerenter",S),e.removeEventListener("pointerdown",E),e.removeEventListener("pointermove",g),e.removeEventListener("pointerup",R),e.removeEventListener("pointerleave",N)}}function oe(h){const e={el:null,canvas:null,eventsEl:null,width:null,height:null,resize:!0,alpha:!1,antialias:!1,orbitControls:!1,init(){},initCamera(){},initScene(){},afterResize(){},beforeRender(){},...h},o={renderer:null,camera:null,scene:null,pointer:null,width:0,height:0,wWidth:0,wHeight:0,clock:{startTime:0,time:0,elapsed:0},options:e};let t,i;return r(),o;function r(){var u,v,w,M,l;let s;if(e.el)s=document.createElement("canvas"),e.el.appendChild(s);else if(e.canvas)s=e.canvas;else throw new Error("Missing parameter : el or canvas is required");(u=e.init)==null||u.call(e,o),o.renderer=new bt({canvas:s,alpha:e.alpha,antialias:e.antialias}),(v=e.initRenderer)==null||v.call(e,o),o.camera=new Qe,o.camera.position.z=50,(w=e.initCamera)==null||w.call(e,o),e.orbitControls&&(i=new Ft(o.camera,(M=e.eventsEl)!=null?M:o.renderer.domElement),i.enableDamping=!0,i.dampingFactor=.1,typeof e.orbitControls=="object"&&Object.keys(e.orbitControls).forEach(S=>{i[S]=e.orbitControls[S]})),c(),e.resize&&!e.width&&!e.height&&window.addEventListener("resize",c),o.scene=new $e,(l=e.initScene)==null||l.call(e,o),d(),t=e.render?e.render:()=>{o.renderer.render(o.scene,o.camera)},requestAnimationFrame(S=>{o.clock.startTime=o.clock.time=S,requestAnimationFrame(n)})}function d(){var u,v;const w={};e.onPointerEnter&&(w.onEnter=e.onPointerEnter),e.onPointerMove&&(w.onMove=e.onPointerMove),e.onPointerMove&&(w.onLeave=e.onPointerLeave),Object.keys(w).length>0&&(o.pointer=Vt({domElement:(v=e.eventsEl)!=null?v:(u=e.el)!=null?u:e.canvas,...w}))}function n(u){const{clock:v}=o;v.elapsed=u-v.time,v.time=u,e.beforeRender(o),i&&i.update(),t(o),requestAnimationFrame(n)}function c(){var u;if(e.width&&e.height)o.width=e.width,o.height=e.height;else if(e.resize==="window")o.width=window.innerWidth,o.height=window.innerHeight;else{const v=o.renderer.domElement.parentElement;o.width=v.clientWidth,o.height=v.clientHeight}if(o.renderer.setSize(o.width,o.height),o.camera.aspect=o.width/o.height,o.camera.updateProjectionMatrix(),o.camera instanceof Qe){const v=p();o.wWidth=v[0],o.wHeight=v[1]}else o.wWidth=o.camera.top-o.camera.bottom,o.wHeight=o.camera.right-o.camera.left;(u=e.afterResize)==null||u.call(e,o)}function p(){const u=o.camera.fov*Math.PI/180,v=2*Math.tan(u/2)*Math.abs(o.camera.position.z);return[v*o.camera.aspect,v]}}function Ae(h){const e={};return["el","canvas","eventsEl","width","height","resize","orbitControls"].forEach(o=>{h[o]!==void 0&&(e[o]=h[o])}),e}function Ne(h,e){const o=[];if(Array.isArray(e)&&e.length>0){let t;e.forEach(i=>{switch(i.type){case"ambient":t=new Ct(...i.params);break;case"directional":t=new Pt(...i.params);break;case"point":t=new zt(...i.params);break;default:console.error(`Unknown light type ${i.type}`)}t&&(typeof i.props=="object"&&Object.keys(i.props).forEach(r=>{r==="position"?t.position.set(...i.props[r]):t[r]=i.props[r]}),h.add(t),o.push(t))})}return o}const Wt={shaderPoints:8,curvePoints:80,curveLerp:.75,radius1:3,radius2:5,velocityTreshold:10,sleepRadiusX:150,sleepRadiusY:150,sleepTimeCoefX:.0025,sleepTimeCoefY:.0025};function jt(h){const e={...Wt,...h},o=new Array(e.curvePoints).fill(0).map(()=>new _),t=new Mt(o),i=new j,r=new j,d={value:new _},n={value:new _},c={value:new Array(e.shaderPoints).fill(0).map(()=>new _)},p={value:new q(16711935)};let u,v,w=!1;const M={};return["el","canvas","width","height","resize"].forEach(l=>{h[l]!==void 0&&(M[l]=h[l])}),oe({...M,antialias:!1,initCamera(l){l.camera=new ze},initScene({scene:l}){const s=new ne(2,2);u=new Y({uniforms:{uRatio:d,uSize:n,uPoints:c,uColor:p},defines:{SHADER_POINTS:e.shaderPoints},vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,fragmentShader:`
          // https://www.shadertoy.com/view/wdy3DD
          // https://www.shadertoy.com/view/MlKcDD
          // Signed distance to a quadratic bezier
          float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
            vec2 a = B - A;
            vec2 b = A - 2.0*B + C;
            vec2 c = a * 2.0;
            vec2 d = A - pos;
            float kk = 1.0 / dot(b,b);
            float kx = kk * dot(a,b);
            float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
            float kz = kk * dot(d,a);
            float res = 0.0;
            float p = ky - kx*kx;
            float p3 = p*p*p;
            float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
            float h = q*q + 4.0*p3;
            if(h >= 0.0){
              h = sqrt(h);
              vec2 x = (vec2(h, -h) - q) / 2.0;
              vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
              float t = uv.x + uv.y - kx;
              t = clamp( t, 0.0, 1.0 );
              // 1 root
              vec2 qos = d + (c + b*t)*t;
              res = length(qos);
            } else {
              float z = sqrt(-p);
              float v = acos( q/(p*z*2.0) ) / 3.0;
              float m = cos(v);
              float n = sin(v)*1.732050808;
              vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
              t = clamp( t, 0.0, 1.0 );
              // 3 roots
              vec2 qos = d + (c + b*t.x)*t.x;
              float dis = dot(qos,qos);
              res = dis;
              qos = d + (c + b*t.y)*t.y;
              dis = dot(qos,qos);
              res = min(res,dis);
              qos = d + (c + b*t.z)*t.z;
              dis = dot(qos,qos);
              res = min(res,dis);
              res = sqrt( res );
            }
            return res;
          }

          uniform vec2 uRatio;
          uniform vec2 uSize;
          uniform vec2 uPoints[SHADER_POINTS];
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float intensity = 1.0;
            float radius = 0.015;

            vec2 pos = (vUv - 0.5) * uRatio;

            vec2 c = (uPoints[0] + uPoints[1]) / 2.0;
            vec2 c_prev;
            float dist = 10000.0;
            for(int i = 0; i < SHADER_POINTS - 1; i++){
              c_prev = c;
              c = (uPoints[i] + uPoints[i + 1]) / 2.0;
              dist = min(dist, sdBezier(pos, c_prev, uPoints[i], c));
            }
            dist = max(0.0, dist);

            float glow = pow(uSize.y / dist, intensity);
            vec3 col = vec3(0.0);
            col += 10.0 * vec3(smoothstep(uSize.x, 0.0, dist));
            col += glow * uColor;

            // Tone mapping
            col = 1.0 - exp(-col);
            col = pow(col, vec3(0.4545));
  
            gl_FragColor = vec4(col, 1.0);
          }
        `}),v=new fe(s,u),l.add(v)},afterResize({width:l,height:s}){n.value.set(e.radius1,e.radius2),l>=s?(d.value.set(1,s/l),n.value.multiplyScalar(1/l)):(d.value.set(l/s,1),n.value.multiplyScalar(1/s))},beforeRender({clock:l,width:s,height:S,wWidth:E}){for(let g=1;g<e.curvePoints;g++)o[g].lerp(o[g-1],e.curveLerp);for(let g=0;g<e.shaderPoints;g++)t.getPoint(g/(e.shaderPoints-1),c.value[g]);if(w)p.value.r=i.z,p.value.g=0,p.value.b=1-i.z,i.multiplyScalar(.95);else{const g=l.time*e.sleepTimeCoefX,R=l.time*e.sleepTimeCoefY,N=Math.cos(g),x=Math.sin(R),I=e.sleepRadiusX*E/s,F=e.sleepRadiusY*E/s,D=I*N,V=F*x;t.points[0].set(D,V),p.value.r=.5+.5*Math.cos(l.time*.0015),p.value.g=0,p.value.b=1-p.value.r}},onPointerMove({nPosition:l,delta:s}){w=!0;const S=.5*l.x*d.value.x,E=.5*l.y*d.value.y;t.points[0].set(S,E),r.x=Math.min(i.x+Math.abs(s.x)/e.velocityTreshold,1),r.y=Math.min(i.y+Math.abs(s.y)/e.velocityTreshold,1),r.z=Math.sqrt(r.x*r.x+r.y*r.y),i.lerp(r,.05)},onPointerLeave(){w=!1}}),{config:e}}class ge{constructor(e,o,t){this.variables=[],this.currentTextureIndex=0;let i=Je;const r=new $e,d=new Et;d.position.z=1;const n={passThruTexture:{value:null}},c=v(M(),n),p=new fe(new ne(2,2),c);r.add(p),this.setDataType=function(l){return i=l,this},this.addVariable=function(l,s,S){const E=this.createShaderMaterial(s),g={name:l,initialValueTexture:S,material:E,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:ve,magFilter:ve};return this.variables.push(g),g},this.setVariableDependencies=function(l,s){l.dependencies=s},this.init=function(){if(t.capabilities.isWebGL2===!1&&t.extensions.has("OES_texture_float")===!1)return"No OES_texture_float support for float textures.";if(t.capabilities.maxVertexTextures===0)return"No support for vertex shader textures.";for(let l=0;l<this.variables.length;l++){const s=this.variables[l];s.renderTargets[0]=this.createRenderTarget(e,o,s.wrapS,s.wrapT,s.minFilter,s.magFilter),s.renderTargets[1]=this.createRenderTarget(e,o,s.wrapS,s.wrapT,s.minFilter,s.magFilter),this.renderTexture(s.initialValueTexture,s.renderTargets[0]),this.renderTexture(s.initialValueTexture,s.renderTargets[1]);const S=s.material,E=S.uniforms;if(s.dependencies!==null)for(let g=0;g<s.dependencies.length;g++){const R=s.dependencies[g];if(R.name!==s.name){let N=!1;for(let x=0;x<this.variables.length;x++)if(R.name===this.variables[x].name){N=!0;break}if(!N)return"Variable dependency not found. Variable="+s.name+", dependency="+R.name}E[R.name]={value:null},S.fragmentShader=`
uniform sampler2D `+R.name+`;
`+S.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){const l=this.currentTextureIndex,s=this.currentTextureIndex===0?1:0;for(let S=0,E=this.variables.length;S<E;S++){const g=this.variables[S];if(g.dependencies!==null){const R=g.material.uniforms;for(let N=0,x=g.dependencies.length;N<x;N++){const I=g.dependencies[N];R[I.name].value=I.renderTargets[l].texture}}this.doRenderTarget(g.material,g.renderTargets[s])}this.currentTextureIndex=s},this.getCurrentRenderTarget=function(l){return l.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(l){return l.renderTargets[this.currentTextureIndex===0?1:0]};function u(l){l.defines.resolution="vec2( "+e.toFixed(1)+", "+o.toFixed(1)+" )"}this.addResolutionDefine=u;function v(l,s){s=s||{};const S=new Y({uniforms:s,vertexShader:w(),fragmentShader:l});return u(S),S}this.createShaderMaterial=v,this.createRenderTarget=function(l,s,S,E,g,R){return l=l||e,s=s||o,S=S||et,E=E||et,g=g||ve,R=R||ve,new se(l,s,{wrapS:S,wrapT:E,minFilter:g,magFilter:R,format:Ke,type:i,depthBuffer:!1})},this.createTexture=function(){const l=new Float32Array(e*o*4),s=new Dt(l,e,o,Ke,Je);return s.needsUpdate=!0,s},this.renderTexture=function(l,s){n.passThruTexture.value=l,this.doRenderTarget(c,s),n.passThruTexture.value=null},this.doRenderTarget=function(l,s){const S=t.getRenderTarget();p.material=l,t.setRenderTarget(s),t.render(r,d),p.material=c,t.setRenderTarget(S)};function w(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function M(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}}function ce(h){let e=[];t(h);const o=new q;return{setColors:t,getColorAt:i};function t(r){e=[],r.forEach(d=>{e.push(new q(d))})}function i(r){const d=Math.max(0,Math.min(1,r))*(h.length-1),n=Math.floor(d),c=e[n];if(n===h.length-1)return c.getHex();const p=d-n,u=e[n+1];return o.r=c.r+p*(u.r-c.r),o.g=c.g+p*(u.g-c.g),o.b=c.b+p*(u.b-c.b),o.clone()}}var $=`vec4 permute(vec4 x){vec4 xm=mod(x,289.0);return mod(((xm*34.0)+10.0)*xm,289.0);}float psrdnoise(vec3 x,vec3 period,float alpha,out vec3 gradient){
#ifndef PERLINGRID
const mat3 M=mat3(0.0,1.0,1.0,1.0,0.0,1.0,1.0,1.0,0.0);const mat3 Mi=mat3(-0.5,0.5,0.5,0.5,-0.5,0.5,0.5,0.5,-0.5);
#endif
vec3 uvw;
#ifndef PERLINGRID
uvw=M*x;
#else
uvw=x+dot(x,vec3(1.0/3.0));
#endif
vec3 i0=floor(uvw);vec3 f0=fract(uvw);vec3 g_=step(f0.xyx,f0.yzz);vec3 l_=1.0-g_;vec3 g=vec3(l_.z,g_.xy);vec3 l=vec3(l_.xy,g_.z);vec3 o1=min(g,l);vec3 o2=max(g,l);vec3 i1=i0+o1;vec3 i2=i0+o2;vec3 i3=i0+vec3(1.0);vec3 v0,v1,v2,v3;
#ifndef PERLINGRID
v0=Mi*i0;v1=Mi*i1;v2=Mi*i2;v3=Mi*i3;
#else
v0=i0-dot(i0,vec3(1.0/6.0));v1=i1-dot(i1,vec3(1.0/6.0));v2=i2-dot(i2,vec3(1.0/6.0));v3=i3-dot(i3,vec3(1.0/6.0));
#endif
vec3 x0=x-v0;vec3 x1=x-v1;vec3 x2=x-v2;vec3 x3=x-v3;if(any(greaterThan(period,vec3(0.0)))){vec4 vx=vec4(v0.x,v1.x,v2.x,v3.x);vec4 vy=vec4(v0.y,v1.y,v2.y,v3.y);vec4 vz=vec4(v0.z,v1.z,v2.z,v3.z);if(period.x>0.0)vx=mod(vx,period.x);if(period.y>0.0)vy=mod(vy,period.y);if(period.z>0.0)vz=mod(vz,period.z);
#ifndef PERLINGRID
i0=M*vec3(vx.x,vy.x,vz.x);i1=M*vec3(vx.y,vy.y,vz.y);i2=M*vec3(vx.z,vy.z,vz.z);i3=M*vec3(vx.w,vy.w,vz.w);
#else
v0=vec3(vx.x,vy.x,vz.x);v1=vec3(vx.y,vy.y,vz.y);v2=vec3(vx.z,vy.z,vz.z);v3=vec3(vx.w,vy.w,vz.w);i0=v0+dot(v0,vec3(1.0/3.0));i1=v1+dot(v1,vec3(1.0/3.0));i2=v2+dot(v2,vec3(1.0/3.0));i3=v3+dot(v3,vec3(1.0/3.0));
#endif
i0=floor(i0+0.5);i1=floor(i1+0.5);i2=floor(i2+0.5);i3=floor(i3+0.5);}vec4 hash=permute(permute(permute(vec4(i0.z,i1.z,i2.z,i3.z))+vec4(i0.y,i1.y,i2.y,i3.y))+vec4(i0.x,i1.x,i2.x,i3.x));vec4 theta=hash*3.883222077;vec4 sz=hash*-0.006920415+0.996539792;vec4 psi=hash*0.108705628;vec4 Ct=cos(theta);vec4 St=sin(theta);vec4 sz_prime=sqrt(1.0-sz*sz);vec4 gx,gy,gz;
#ifdef FASTROTATION
vec4 qx=St;vec4 qy=-Ct;vec4 qz=vec4(0.0);vec4 px=sz*qy;vec4 py=-sz*qx;vec4 pz=sz_prime;psi+=alpha;vec4 Sa=sin(psi);vec4 Ca=cos(psi);gx=Ca*px+Sa*qx;gy=Ca*py+Sa*qy;gz=Ca*pz+Sa*qz;
#else
if(alpha!=0.0){vec4 Sp=sin(psi);vec4 Cp=cos(psi);vec4 px=Ct*sz_prime;vec4 py=St*sz_prime;vec4 pz=sz;vec4 Ctp=St*Sp-Ct*Cp;vec4 qx=mix(Ctp*St,Sp,sz);vec4 qy=mix(-Ctp*Ct,Cp,sz);vec4 qz=-(py*Cp+px*Sp);vec4 Sa=vec4(sin(alpha));vec4 Ca=vec4(cos(alpha));gx=Ca*px+Sa*qx;gy=Ca*py+Sa*qy;gz=Ca*pz+Sa*qz;}else{gx=Ct*sz_prime;gy=St*sz_prime;gz=sz;}
#endif
vec3 g0=vec3(gx.x,gy.x,gz.x);vec3 g1=vec3(gx.y,gy.y,gz.y);vec3 g2=vec3(gx.z,gy.z,gz.z);vec3 g3=vec3(gx.w,gy.w,gz.w);vec4 w=0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3));w=max(w,0.0);vec4 w2=w*w;vec4 w3=w2*w;vec4 gdotx=vec4(dot(g0,x0),dot(g1,x1),dot(g2,x2),dot(g3,x3));float n=dot(w3,gdotx);vec4 dw=-6.0*w2*gdotx;vec3 dn0=w3.x*g0+dw.x*x0;vec3 dn1=w3.y*g1+dw.y*x1;vec3 dn2=w3.z*g2+dw.z*x2;vec3 dn3=w3.w*g3+dw.w*x3;gradient=39.5*(dn0+dn1+dn2+dn3);return 39.5*n;}`;const{randFloat:nt,randFloatSpread:st}=xe,Bt={gpgpuSize:256,colors:[65280,255],color:16711680,coordScale:1.5,noiseIntensity:.001,noiseTimeCoef:1e-4,pointSize:5,pointDecay:.005,sleepRadiusX:250,sleepRadiusY:250,sleepTimeCoefX:.001,sleepTimeCoefY:.002};function Ht(h){const e={...Bt,...h},o=e.gpgpuSize,t=o*o;let i,r,d,n,c;const p={value:0},u={value:e.coordScale},v={value:e.noiseIntensity},w={value:e.pointSize},M={value:e.pointDecay},l={value:new q(e.color)},s={value:new _},S={value:new _},E={uTime:p,uCoordScale:u,uNoiseIntensity:v,uPointSize:w,uPointDecay:M,uColor:l,uMouse:s,uMouseDirection:S};let g,R,N,x=!1;const I=new _;return oe({...Gt(h),antialias:!1,initRenderer({renderer:A}){F(A)},initScene({scene:A}){D(),A.add(N)},beforeRender({width:A,wWidth:O,wHeight:L,clock:k,pointer:W}){if(x)I.x=W.nPosition.x*.5*O,I.y=W.nPosition.y*.5*L;else{const m=k.time*e.sleepTimeCoefX,C=k.time*e.sleepTimeCoefY,b=Math.cos(m),z=Math.sin(C),T=e.sleepRadiusX*O/A,P=e.sleepRadiusY*O/A;I.x=T*b,I.y=P*z}s.value.lerp(I,.05),p.value=k.time*e.noiseTimeCoef,i.compute(),R.uniforms.texturePosition.value=i.getCurrentRenderTarget(c).texture,R.uniforms.textureVelocity.value=i.getCurrentRenderTarget(n).texture},onPointerMove({delta:A}){x=!0,S.value.copy(A)},onPointerLeave(){x=!1}}),{config:e,uniforms:E};function F(A){i=new ge(o,o,A),A.capabilities.isWebGL2||i.setDataType(he),r=i.createTexture(),d=i.createTexture(),V(r,d),n=i.addVariable("textureVelocity",`
      ${$}
      uniform float uTime;
      uniform float uCoordScale;
      uniform float uNoiseIntensity;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        if (pos.w < 0.0) {
          vel.x = 0.0;
          vel.y = 0.0;
          vel.z = 0.0;
        } else {
          vec3 grad;
          vec3 p = vec3(0.0);
          float n = psrdnoise(pos.xyz * uCoordScale, p, uTime, grad);
          vel.xyz += grad * uNoiseIntensity * pos.w;
        }
        gl_FragColor = vel;
      }
    `,d),c=i.addVariable("texturePosition",`
      uniform float uPointDecay;
      uniform vec2 uMouse;
      uniform vec2 uMouseDirection;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);
        if (pos.w < 0.0) { pos.w = vel.w; }
        pos.w -= uPointDecay;
        if (pos.w <= 0.0) {
          pos.xy = uMouse.xy;
          pos.z = 0.0;
        } else {
          pos.xyz += vel.xyz;
        }
        gl_FragColor = pos;
      }
    `,r),i.setVariableDependencies(n,[c,n]),i.setVariableDependencies(c,[c,n]),Object.keys(E).forEach(L=>{n.material.uniforms[L]=E[L],c.material.uniforms[L]=E[L]});const O=i.init();O!==null&&console.error(O)}function D(){g=new pe;const A=new Float32Array(t*3),O=new Float32Array(t*2),L=new Float32Array(t*3);for(let m=0;m<t*3;m+=3)A[m]=0,A[m+1]=0,A[m+2]=0;let k=0;for(let m=0;m<o;m++)for(let C=0;C<o;C++)O[k++]=C/(o-1),O[k++]=m/(o-1);const W=ce(e.colors);for(let m=0;m<t*3;m+=3){const C=W.getColorAt(Math.random());L[m]=C.r,L[m+1]=C.g,L[m+2]=C.b}g.setAttribute("position",new Pe(A,3)),g.setAttribute("uv",new Pe(O,2)),g.setAttribute("color",new Pe(L,3)),R=new Y({blending:tt,depthTest:!1,transparent:!0,vertexColors:!0,uniforms:{texturePosition:{value:null},textureVelocity:{value:null},uPointSize:w,uColor:l},vertexShader:`
        uniform sampler2D texturePosition;
        uniform sampler2D textureVelocity;
        uniform float uPointSize;
        varying vec4 vPos;
        varying vec4 vVel;
        varying vec3 vCol;
        void main() {
          vCol = color;
          vPos = texture2D(texturePosition, uv);
          vVel = texture2D(textureVelocity, uv);
          vec4 mvPosition = modelViewMatrix * vec4(vPos.xyz, 1.0);
          // gl_PointSize = smoothstep(0.0, 2.0, vPos.w) * uPointSize;
          gl_PointSize = vPos.w * (vVel.w + 0.5) * uPointSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        varying vec4 vPos;
        varying vec4 vVel;
        varying vec3 vCol;
        void main() {
          float dist = length(gl_PointCoord - 0.5);
          if (dist > 0.5) discard;
          // float a = smoothstep(0.0, 1.0, vPos.w);
          gl_FragColor = vec4(mix(vCol, uColor, vPos.w), vPos.w);
        }
      `}),N=new _t(g,R),N.matrixAutoUpdate=!1,N.updateMatrix()}function V(A,O){const L=A.image.data,k=O.image.data;for(let W=0,m=L.length;W<m;W+=4)L[W+0]=st(1),L[W+1]=st(1),L[W+2]=-1e5,L[W+3]=nt(.1,1),k[W+0]=0,k[W+1]=0,k[W+2]=0,k[W+3]=nt(.1,1)}}function Gt(h){const e={};return["el","canvas","width","height","resize"].forEach(o=>{h[o]!==void 0&&(e[o]=h[o])}),e}const qt={width:256,height:256};function Yt(h){const e={...qt,...h},o=document.createElement("canvas");o.width=e.width,o.height=e.height;const t=o.getContext("2d"),i=new Rt(t.canvas);return{canvas:o,ctx:t,texture:i}}var Xt="float psrdnoise(vec2 x,vec2 period,float alpha,out vec2 gradient){vec2 uv=vec2(x.x+x.y*0.5,x.y);vec2 i0=floor(uv);vec2 f0=fract(uv);float cmp=step(f0.y,f0.x);vec2 o1=vec2(cmp,1.0-cmp);vec2 i1=i0+o1;vec2 i2=i0+vec2(1.0,1.0);vec2 v0=vec2(i0.x-i0.y*0.5,i0.y);vec2 v1=vec2(v0.x+o1.x-o1.y*0.5,v0.y+o1.y);vec2 v2=vec2(v0.x+0.5,v0.y+1.0);vec2 x0=x-v0;vec2 x1=x-v1;vec2 x2=x-v2;vec3 iu,iv;vec3 xw,yw;if(any(greaterThan(period,vec2(0.0)))){xw=vec3(v0.x,v1.x,v2.x);yw=vec3(v0.y,v1.y,v2.y);if(period.x>0.0)xw=mod(vec3(v0.x,v1.x,v2.x),period.x);if(period.y>0.0)yw=mod(vec3(v0.y,v1.y,v2.y),period.y);iu=floor(xw+0.5*yw+0.5);iv=floor(yw+0.5);}else{iu=vec3(i0.x,i1.x,i2.x);iv=vec3(i0.y,i1.y,i2.y);}vec3 hash=mod(iu,289.0);hash=mod((hash*51.0+2.0)*hash+iv,289.0);hash=mod((hash*34.0+10.0)*hash,289.0);vec3 psi=hash*0.07482+alpha;vec3 gx=cos(psi);vec3 gy=sin(psi);vec2 g0=vec2(gx.x,gy.x);vec2 g1=vec2(gx.y,gy.y);vec2 g2=vec2(gx.z,gy.z);vec3 w=0.8-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2));w=max(w,0.0);vec3 w2=w*w;vec3 w4=w2*w2;vec3 gdotx=vec3(dot(g0,x0),dot(g1,x1),dot(g2,x2));float n=dot(w4,gdotx);vec3 w3=w2*w;vec3 dw=-8.0*w3*gdotx;vec2 dn0=w4.x*g0+dw.x*x0;vec2 dn1=w4.y*g1+dw.y*x1;vec2 dn2=w4.z*g2+dw.z*x2;gradient=10.9*(dn0+dn1+dn2);return 10.9*n;}";const Zt={colors:[16777215,0],minStroke:5,maxStroke:5,timeCoef:5e-4,coordScale:2,displacementScale:.002,mouseScale:.25,mouseLerp:.025};function Qt(h){const e={...Zt,...h},o=Yt({width:1,height:4096});p();const t={uMap:{value:o.texture},uTime:{value:0},uCoordScale:{value:e.coordScale},uDisplacementScale:{value:e.displacementScale},uMouse:{value:new _}},i=new ne,r=new Y({uniforms:t,vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D uMap;
      uniform float uTime;
      uniform float uCoordScale;
      uniform float uDisplacementScale;
      uniform vec2 uMouse;
      varying vec2 vUv;
      ${Xt}
      void main() {
        vec2 p = vec2(0.0);
        vec2 grad;
        float n = psrdnoise(vUv * uCoordScale + uMouse, p, uTime, grad);
        // grad *= uCoordScale;
        vec2 uv = vUv + uDisplacementScale * grad;
        gl_FragColor = texture2D(uMap, uv.yx);
      }
    `}),d=new fe(i,r),n=new _,c={};return["el","canvas","width","height","resize"].forEach(u=>{h[u]!==void 0&&(c[u]=h[u])}),oe({...c,antialias:!0,initScene({camera:u,scene:v,wWidth:w,wHeight:M}){d.scale.set(w*2,M*2,1),v.add(d),u.position.set(0,-30,7),u.lookAt(0,-19,0)},beforeRender({clock:u}){t.uTime.value=u.time*e.timeCoef,t.uMouse.value.lerp(n,e.mouseLerp)},onPointerMove({nPosition:u}){n.set(-u.x,u.y).multiplyScalar(e.mouseScale)},onPointerLeave(){n.set(0,0)}}),{config:e,uniforms:t,drawTexture:p};function p(){const u=o.ctx;u.lineWidth=0;const{width:v,height:w}=o.canvas,M=ce(e.colors);let l=0,s;for(;l<w;)s=e.minStroke+Math.random()*(e.maxStroke-e.minStroke),u.fillStyle=M.getColorAt(Math.random()).getStyle(),u.beginPath(),u.rect(0,l-1,v,s+1),u.fill(),u.closePath(),l+=s;o.texture.needsUpdate=!0}}const{randFloat:$t,randFloatSpread:ie}=xe,Kt={gpgpuSize:64,background:16777215,material:"basic",materialParams:{},texture:null,textureCount:1,colors:[16777215,16777215],lights:[{type:"ambient",params:[16777215,.5]},{type:"directional",params:[16777215,1],props:{position:[0,10,0]}}],wingsScale:[1,1,1],wingsWidthSegments:8,wingsHeightSegments:8,wingsSpeed:.75,wingsDisplacementScale:1.25,noiseCoordScale:.01,noiseTimeCoef:5e-4,noiseIntensity:.0025,attractionRadius1:100,attractionRadius2:150,maxVelocity:.1};function Jt(h){const e={...Kt,...h};if(!["basic","phong","standard"].includes(e.material))throw new Error(`Invalid material ${e.material}`);if(!Number.isInteger(e.wingsWidthSegments)||e.wingsWidthSegments%2!==0)throw new Error(`Invalid wingsWidthSegments ${e.wingsWidthSegments}`);const o=e.gpgpuSize,t=o*o;let i,r,d,n,c;const p={value:null},u={value:null},v={value:null},w={value:0},M={value:e.noiseCoordScale},l={value:e.noiseIntensity},s={value:e.maxVelocity},S={value:e.attractionRadius1},E={value:e.attractionRadius2},g={value:new j(...e.wingsScale)},R={value:e.wingsSpeed},N={value:e.wingsDisplacementScale},x={uTexturePosition:p,uOldTexturePosition:u,uTextureVelocity:v},I={uTime:w,uNoiseCoordScale:M,uNoiseIntensity:l,uMaxVelocity:s,uAttractionRadius1:S,uAttractionRadius2:E,uWingsScale:g,uWingsSpeed:R,uWingsDisplacementScale:N},F={...x,...I};let D,V,A;return{three:oe({...Ae(h),antialias:!0,orbitControls:!0,initRenderer({renderer:m}){O(m)},initCamera({camera:m}){m.position.set(0,50,70)},initScene({scene:m}){L(m)},beforeRender({clock:m}){w.value=m.time*e.noiseTimeCoef,i.compute(),p.value=c.renderTargets[i.currentTextureIndex].texture,u.value=c.renderTargets[i.currentTextureIndex===0?1:0].texture,v.value=n.renderTargets[i.currentTextureIndex].texture}}),config:e,uniforms:F,setColors:k};function O(m){i=new ge(o,o,m),m.capabilities.isWebGL2||i.setDataType(he),r=i.createTexture(),d=i.createTexture(),W(r,d),n=i.addVariable("textureVelocity",`
      ${$}
      uniform float uTime;
      uniform float uNoiseCoordScale;
      uniform float uNoiseIntensity;
      uniform float uMaxVelocity;
      uniform float uAttractionRadius1;
      uniform float uAttractionRadius2;
      uniform float uWingsSpeed;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        vec3 grad;
        float n = psrdnoise(pos.xyz * uNoiseCoordScale, vec3(0), uTime, grad);
        grad = grad * uNoiseIntensity;
        vel.xyz = vel.xyz + (pos.w * 0.75) * grad;

        vec3 dv = -pos.xyz;
        float coef = smoothstep(uAttractionRadius1, uAttractionRadius2, length(dv));
        vel.xyz = vel.xyz + pos.w * coef * normalize(dv);
        vel.xyz = clamp(vel.xyz, -uMaxVelocity, uMaxVelocity);

        vel.w = mod(vel.w + length(vel.xyz) * (0.5 + pos.w) * uWingsSpeed, 6.2831853071);
        gl_FragColor = vel;
      }
    `,d),c=i.addVariable("texturePosition",`
      ${$}
      uniform float uTime;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);
        pos.xyz += vel.xyz;
        gl_FragColor = pos;
      }
    `,r),i.setVariableDependencies(n,[c,n]),i.setVariableDependencies(c,[c,n]),Object.keys(I).forEach(b=>{n.material.uniforms[b]=F[b],c.material.uniforms[b]=F[b]});const C=i.init();if(C!==null)throw new Error(C)}function L(m){e.background!==void 0&&(m.background=new q(e.background)),Ne(m,e.lights),D=new ne(2,2,e.wingsWidthSegments,e.wingsHeightSegments).rotateX(Math.PI/2);const C=new Float32Array(t*2),b=new Float32Array(t);let z=0,T=0;for(let f=0;f<o;f++)for(let U=0;U<o;U++)C[z++]=U/(o-1),C[z++]=f/(o-1),b[T++]=Math.floor(Math.random()*e.textureCount);D.setAttribute("gpuUv",new le(C,2)),D.setAttribute("mapIndex",new le(b,1));const P={side:Ce,...e.materialParams};switch(e.texture&&(P.map=new ot().load(e.texture)),P.onBeforeCompile=f=>{f.defines={COMPUTE_NORMALS:e.material!=="basic",WINGS_WIDTH_SEGMENTS:e.wingsWidthSegments,WINGS_HEIGHT_SEGMENTS:e.wingsHeightSegments,WINGS_DX:(2/e.wingsWidthSegments).toFixed(10),WINGS_DZ:(2/e.wingsHeightSegments).toFixed(10),TEXTURE_COUNT:e.textureCount.toFixed(10)},Object.keys(F).forEach(U=>{f.uniforms[U]=F[U]}),f.vertexShader=`
        uniform sampler2D uTexturePosition;
        uniform sampler2D uOldTexturePosition;
        uniform sampler2D uTextureVelocity;
        uniform vec3 uWingsScale;
        uniform float uWingsDisplacementScale;
        attribute vec2 gpuUv;
        attribute float mapIndex;
        varying vec4 vPos;
        varying vec4 vVel;
        varying float vMapIndex;

        mat3 lookAt(vec3 origin, vec3 target, vec3 up) {
          vec3 z = target - origin;
          if (z.x * z.x + z.y * z.y + z.z * z.z == 0.0) { z.z = 1.0; }
          z = normalize(z);
          vec3 x = cross(up, z);
          if (x.x * x.x + x.y * x.y + x.z * x.z == 0.0) {
            if (abs(up.z) == 1.0) { z.x += 0.0001; }
            else { z.z += 0.0001; }
            x = cross(up, z);
          }
          x = normalize(x);
          vec3 y = cross(z, x);
          return mat3(x, y, z);
        }

        mat4 iMatrix(vec3 pos, mat3 rmat, vec3 scale) {
          return mat4(
            rmat[0][0] * scale.x, rmat[0][1] * scale.x, rmat[0][2] * scale.x, 0.0,
            rmat[1][0] * scale.y, rmat[1][1] * scale.y, rmat[1][2] * scale.y, 0.0,
            rmat[2][0] * scale.z, rmat[2][1] * scale.z, rmat[2][2] * scale.z, 0.0,
            pos.x, pos.y, pos.z, 1.0
          );
        }
      `+f.vertexShader,f.vertexShader=f.vertexShader.replace("#include <defaultnormal_vertex>",""),f.vertexShader=f.vertexShader.replace("#include <normal_vertex>",""),f.vertexShader=f.vertexShader.replace("#include <begin_vertex>",`
        vPos = texture2D(uTexturePosition, gpuUv);
        vec4 oldPos = texture2D(uOldTexturePosition, gpuUv);
        vVel = texture2D(uTextureVelocity, gpuUv);
        vMapIndex = float(mapIndex);

        mat3 rmat = lookAt(oldPos.xyz, vPos.xyz, vec3(0, 1, 0));
        mat4 im = iMatrix(vPos.xyz, rmat, (0.5 + vPos.w) * uWingsScale);

        vec3 transformed = vec3(position);

        #ifdef COMPUTE_NORMALS
          vec3 transformedNormal = objectNormal; 
        #endif

        float dx = abs(transformed.x);
        if (dx > 0.0) {
          float sdx = smoothstep(0.0, 1.0 + WINGS_DX, dx);
          #if WINGS_HEIGHT_SEGMENTS > 1
            float dz = transformed.z + 1.0;
            float sdz = smoothstep(0.0, 2.0 + WINGS_DZ, dz);
            transformed.y = sin(vVel.w - sdx + sdz) * sdx * uWingsDisplacementScale;
          #else
            transformed.y = sin(vVel.w - sdx) * sdx * uWingsDisplacementScale;
          #endif

          #ifdef COMPUTE_NORMALS
            #if WINGS_HEIGHT_SEGMENTS > 1
              float s = sign(transformed.x);
              float sdx1 = smoothstep(0.0, 1.0 + WINGS_DX, dx + WINGS_DX);
              float sdz1 = smoothstep(0.0, 2.0 + WINGS_DZ, dz + WINGS_DZ);
              float dvy1 = sin(vVel.w - sdx + sdz1) * sdx * uWingsDisplacementScale - transformed.y;
              float dvy2 = sin(vVel.w - sdx1 + sdz) * sdx1 * uWingsDisplacementScale - transformed.y;
              vec3 v1 = vec3(0.0, dvy1, s * WINGS_DZ);
              vec3 v2 = vec3(s * WINGS_DX, dvy2, 0.0);
              transformedNormal = -normalize(cross(v1, v2));
            #else
              float s = sign(transformed.x);
              float sdx1 = smoothstep(0.0, 1.0 + WINGS_DX, dx + WINGS_DX);
              float dvy1 = sin(vVel.w - sdx1) * sdx * uWingsDisplacementScale - transformed.y;
              vec3 v1 = vec3(0.0, 0.0, s);
              vec3 v2 = vec3(s * WINGS_DX, dvy1, 0.0);
              transformedNormal = -normalize(cross(v1, v2));
            #endif  
          #endif
        }

        #ifdef COMPUTE_NORMALS
          #ifdef USE_INSTANCING
            mat3 m = mat3( im );
            transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
            transformedNormal = m * transformedNormal;
          #endif
          transformedNormal = normalMatrix * transformedNormal;
          #ifdef FLIP_SIDED
            transformedNormal = - transformedNormal;
          #endif
          #ifdef USE_TANGENT
            vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
            #ifdef FLIP_SIDED
              transformedTangent = - transformedTangent;
            #endif
          #endif
          #ifndef FLAT_SHADED
            vNormal = normalize( transformedNormal );
            #ifdef USE_TANGENT
              vTangent = normalize( transformedTangent );
              vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
            #endif
          #endif
        #endif
      `),f.vertexShader=f.vertexShader.replace("#include <project_vertex>",`
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = im * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
      `),f.fragmentShader=`
        varying float vMapIndex;
      `+f.fragmentShader,f.fragmentShader=f.fragmentShader.replace("#include <map_fragment>",`
        #ifdef USE_MAP
          vec2 uv = vUv;
          uv.x = (vMapIndex + vUv.x) / TEXTURE_COUNT;
          vec4 sampledDiffuseColor = texture2D(map, uv);
          diffuseColor *= sampledDiffuseColor;
        #endif
      `)},e.material){case"standard":V=new Ee(P);break;case"phong":V=new it(P);break;default:V=new Me(P)}A=new De(D,V,t),k(e.colors),m.add(A)}function k(m){if(Array.isArray(m)&&m.length>1){const C=ce(m);for(let b=0;b<t;b++)A.setColorAt(b,C.getColorAt(b/t));A.instanceColor.needsUpdate=!0}}function W(m,C){const b=m.image.data,z=C.image.data;for(let T=0,P=b.length;T<P;T+=4)b[T+0]=ie(150),b[T+1]=ie(150),b[T+2]=ie(150),b[T+3]=$t(.1,1),z[T+0]=ie(.5),z[T+1]=ie(.5),z[T+2]=ie(.5),z[T+3]=0}}const ye={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );
			gl_FragColor.a *= opacity;


		}`};class ue{constructor(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}}const eo=new ze(-1,1,1,-1,0,1),Ie=new pe;Ie.setAttribute("position",new te([-1,3,0,-1,-1,0,3,-1,0],3)),Ie.setAttribute("uv",new te([0,2,0,0,2,0],2));class lt{constructor(e){this._mesh=new fe(Ie,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,eo)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ct extends ue{constructor(e,o){super();this.textureID=o!==void 0?o:"tDiffuse",e instanceof Y?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=_e.clone(e.uniforms),this.material=new Y({defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new lt(this.material)}render(e,o,t){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=t.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}}class ut extends ue{constructor(e,o){super();this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,t){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let d,n;this.inverse?(d=0,n=1):(d=1,n=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,d,4294967295),r.buffers.stencil.setClear(n),r.buffers.stencil.setLocked(!0),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class to extends ue{constructor(){super();this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class oo{constructor(e,o){if(this.renderer=e,o===void 0){const t=e.getSize(new _);this._pixelRatio=e.getPixelRatio(),this._width=t.width,this._height=t.height,o=new se(this._width*this._pixelRatio,this._height*this._pixelRatio),o.texture.name="EffectComposer.rt1"}else this._pixelRatio=1,this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],ye===void 0&&console.error("THREE.EffectComposer relies on CopyShader"),ct===void 0&&console.error("THREE.EffectComposer relies on ShaderPass"),this.copyPass=new ct(ye),this.clock=new At}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const o=this.renderer.getRenderTarget();let t=!1;for(let i=0,r=this.passes.length;i<r;i++){const d=this.passes[i];if(d.enabled!==!1){if(d.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),d.render(this.renderer,this.writeBuffer,this.readBuffer,e,t),d.needsSwap){if(t){const n=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}ut!==void 0&&(d instanceof ut?t=!0:d instanceof to&&(t=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new _);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const t=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(t,i),this.renderTarget2.setSize(t,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(t,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}}new ze(-1,1,1,-1,0,1);const dt=new pe;dt.setAttribute("position",new te([-1,3,0,-1,-1,0,3,-1,0],3)),dt.setAttribute("uv",new te([0,2,0,0,2,0],2));class io extends ue{constructor(e,o,t,i,r){super();this.scene=e,this.camera=o,this.overrideMaterial=t,this.clearColor=i,this.clearAlpha=r!==void 0?r:0,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new q}render(e,o,t){const i=e.autoClear;e.autoClear=!1;let r,d;this.overrideMaterial!==void 0&&(d=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor&&(e.getClearColor(this._oldClearColor),r=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor&&e.setClearColor(this._oldClearColor,r),this.overrideMaterial!==void 0&&(this.scene.overrideMaterial=d),e.autoClear=i}}const mt={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new q(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class re extends ue{constructor(e,o,t,i){super();this.strength=o!==void 0?o:1,this.radius=t,this.threshold=i,this.resolution=e!==void 0?new _(e.x,e.y):new _(256,256),this.clearColor=new q(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);this.renderTargetBright=new se(r,d),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let v=0;v<this.nMips;v++){const w=new se(r,d);w.texture.name="UnrealBloomPass.h"+v,w.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(w);const M=new se(r,d);M.texture.name="UnrealBloomPass.v"+v,M.texture.generateMipmaps=!1,this.renderTargetsVertical.push(M),r=Math.round(r/2),d=Math.round(d/2)}mt===void 0&&console.error("THREE.UnrealBloomPass relies on LuminosityHighPassShader");const n=mt;this.highPassUniforms=_e.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Y({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,defines:{}}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),d=Math.round(this.resolution.y/2);for(let v=0;v<this.nMips;v++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[v])),this.separableBlurMaterials[v].uniforms.texSize.value=new _(r,d),r=Math.round(r/2),d=Math.round(d/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0;const p=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=p,this.bloomTintColors=[new j(1,1,1),new j(1,1,1),new j(1,1,1),new j(1,1,1),new j(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,ye===void 0&&console.error("THREE.UnrealBloomPass relies on CopyShader");const u=ye;this.copyUniforms=_e.clone(u.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new Y({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:tt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new q,this.oldClearAlpha=1,this.basic=new Me,this.fsQuad=new lt(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose()}setSize(e,o){let t=Math.round(e/2),i=Math.round(o/2);this.renderTargetBright.setSize(t,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(t,i),this.renderTargetsVertical[r].setSize(t,i),this.separableBlurMaterials[r].uniforms.texSize.value=new _(t,i),t=Math.round(t/2),i=Math.round(i/2)}render(e,o,t,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const d=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=t.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=t.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let n=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[c].uniforms.direction.value=re.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=re.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),n=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=d}getSeperableBlurMaterial(e){return new Y({defines:{KERNEL_RADIUS:e,SIGMA:e},uniforms:{colorTexture:{value:null},texSize:{value:new _(.5,.5)},direction:{value:new _(.5,.5)}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Y({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}re.BlurDirectionX=new _(1,0),re.BlurDirectionY=new _(0,1);const{randFloat:ao,randFloatSpread:we}=xe,ro={gpgpuSize:256,bloomStrength:1.5,bloomRadius:.5,bloomThreshold:.25,colors:[Math.random()*16777215,Math.random()*16777215,Math.random()*16777215],geometry:"custom",geometryScale:[1,1,1],lights:[{type:"ambient",params:[16777215,.5]},{type:"point",params:[16777215,1],props:{position:[0,0,0]}},{type:"point",params:[16748640,.75],props:{position:[0,-100,-100]}},{type:"point",params:[6328575,.75],props:{position:[0,100,100]}}],materialParams:{},noiseCoordScale:.01,noiseIntensity:.0025,noiseTimeCoef:4e-4,attractionRadius1:150,attractionRadius2:250,maxVelocity:.25};function no(h){const e={...ro,...h},o=e.gpgpuSize,t=o*o;let i,r,d,n,c;const p={value:null},u={value:null},v={value:null},w={value:new j(...e.geometryScale)},M={value:0},l={value:e.noiseCoordScale},s={value:e.noiseIntensity},S={value:e.maxVelocity},E={value:e.attractionRadius1},g={value:e.attractionRadius2},R={value:new j},N={uTexturePosition:p,uOldTexturePosition:u,uTextureVelocity:v},x={uScale:w,uTime:M,uNoiseCoordScale:l,uNoiseIntensity:s,uMaxVelocity:S,uAttractionRadius1:E,uAttractionRadius2:g,uMouse:R},I={...N,...x};let F,D,V,A,O,L,k;return{three:oe({...Ae(h),antialias:!1,orbitControls:!0,initRenderer({renderer:z}){W(z)},initCamera(z){A=z.camera,A.position.z=70},initScene({renderer:z,width:T,height:P,camera:f,scene:U}){m(U),D=new io(U,f),V=new re(new _(T,P),e.bloomStrength,e.bloomRadius,e.bloomThreshold),F=new oo(z),F.addPass(D),F.addPass(V)},afterResize({width:z,height:T}){F&&F.setSize(z,T)},beforeRender({clock:z}){M.value=z.time*e.noiseTimeCoef,i.compute(),p.value=c.renderTargets[i.currentTextureIndex].texture,u.value=c.renderTargets[i.currentTextureIndex===0?1:0].texture,v.value=n.renderTargets[i.currentTextureIndex].texture},render(){F.render()}}),config:e,uniforms:I,setColors:C};function W(z){i=new ge(o,o,z),z.capabilities.isWebGL2||i.setDataType(he),r=i.createTexture(),d=i.createTexture(),b(r,d),n=i.addVariable("textureVelocity",`
      ${$}
      uniform float uTime;
      uniform vec3 uMouse;
      uniform float uNoiseCoordScale;
      uniform float uNoiseIntensity;
      uniform float uMaxVelocity;
      uniform float uAttractionRadius1;
      uniform float uAttractionRadius2;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        vec3 grad;
        float n = psrdnoise(pos.xyz * uNoiseCoordScale, vec3(0), uTime, grad);
        vel.xyz += (pos.w * 0.75) * grad * uNoiseIntensity;

        vec3 dv = -pos.xyz;
        float coef = smoothstep(uAttractionRadius1, uAttractionRadius2, length(dv));
        vel.xyz = vel.xyz + pos.w * coef * normalize(dv);
        vel.xyz = clamp(vel.xyz, -uMaxVelocity, uMaxVelocity);

        gl_FragColor = vel;
      }
    `,d),c=i.addVariable("texturePosition",`
      ${$}
      uniform float uTime;
      uniform vec3 uMouse;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);
        pos.xyz += vel.xyz;
        gl_FragColor = pos;
      }
    `,r),i.setVariableDependencies(n,[c,n]),i.setVariableDependencies(c,[c,n]),Object.keys(x).forEach(P=>{n.material.uniforms[P]=I[P],c.material.uniforms[P]=I[P]});const T=i.init();if(T!==null)throw new Error(T)}function m(z){switch(e.background!==void 0&&(z.background=new q(e.background)),Ne(z,e.lights),e.geometry){case"box":O=new Ut;break;case"capsule":O=new Ot(.2,1,4,8).rotateX(Math.PI/2);break;case"cone":O=new kt(.4,2,6).rotateX(Math.PI/2);break;case"octahedron":O=new It(1,0).rotateX(Math.PI/2);break;case"sphere":O=new Nt(.5,8,8);break;default:O=so(1)}const T=new Float32Array(t*2);let P=0;for(let f=0;f<o;f++)for(let U=0;U<o;U++)T[P++]=U/(o-1),T[P++]=f/(o-1);O.setAttribute("gpuUv",new le(T,2)),L=new Ee({metalness:.75,roughness:.25,side:Ce,...e.materialParams,onBeforeCompile:f=>{Object.keys(I).forEach(U=>{f.uniforms[U]=I[U]}),f.vertexShader=`
          uniform sampler2D uTexturePosition;
          uniform sampler2D uOldTexturePosition;
          uniform sampler2D uTextureVelocity;
          uniform vec3 uScale;
          attribute vec2 gpuUv;
          varying vec4 vPos;
          varying vec4 vVel;

          mat3 lookAt(vec3 origin, vec3 target, vec3 up) {
            vec3 z = target - origin;
            if (z.x * z.x + z.y * z.y + z.z * z.z == 0.0) { z.z = 1.0; }
            z = normalize(z);
            vec3 x = cross(up, z);
            if (x.x * x.x + x.y * x.y + x.z * x.z == 0.0) {
              if (abs(up.z) == 1.0) { z.x += 0.0001; }
              else { z.z += 0.0001; }
              x = cross(up, z);
            }
            x = normalize(x);
            vec3 y = cross(z, x);
            return mat3(x, y, z);
          }

          mat4 iMatrix(vec3 pos, mat3 rmat, vec3 scale) {
            return mat4(
              rmat[0][0] * scale.x, rmat[0][1] * scale.x, rmat[0][2] * scale.x, 0.0,
              rmat[1][0] * scale.y, rmat[1][1] * scale.y, rmat[1][2] * scale.y, 0.0,
              rmat[2][0] * scale.z, rmat[2][1] * scale.z, rmat[2][2] * scale.z, 0.0,
              pos.x, pos.y, pos.z, 1.0
            );
          }
        `+f.vertexShader,f.vertexShader=f.vertexShader.replace("#include <defaultnormal_vertex>",`
          vPos = texture2D(uTexturePosition, gpuUv);
          vec4 oldPos = texture2D(uOldTexturePosition, gpuUv);
          vVel = texture2D(uTextureVelocity, gpuUv);

          mat3 rmat = lookAt(oldPos.xyz, vPos.xyz, vec3(0, 1, 0));
          mat4 im = iMatrix(vPos.xyz, rmat, (0.5 + vPos.w) * uScale);

          vec3 transformedNormal = objectNormal;
          mat3 m = mat3(im);
          transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
          transformedNormal = m * transformedNormal;
          transformedNormal = normalMatrix * transformedNormal;
        `),f.vertexShader=f.vertexShader.replace("#include <project_vertex>",`
          vec4 mvPosition = modelViewMatrix * im * vec4(transformed, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        `)}}),k=new De(O,L,t),C(e.colors),z.add(k)}function C(z){if(Array.isArray(z)&&z.length>1){const T=ce(z);for(let P=0;P<t;P++)k.setColorAt(P,T.getColorAt(P/t));k.instanceColor.needsUpdate=!0}}function b(z,T){const P=new j,f=z.image.data,U=T.image.data;for(let Q=0,de=f.length;Q<de;Q+=4)P.set(we(1),we(1),we(1)).normalize().multiplyScalar(we(e.attractionRadius1*2)),P.toArray(f,Q),f[Q+3]=ao(.1,1),P.set(0,0,0),P.toArray(U,Q),U[Q+3]=0}}function so(h){const e=[{p:[h*.5,0,-h],n:[0,1,0]},{p:[-h*.5,0,-h],n:[0,1,0]},{p:[0,0,h],n:[0,1,0]},{p:[0,-h*.5,-h],n:[1,0,0]},{p:[0,h*.5,-h],n:[1,0,0]},{p:[0,0,h],n:[1,0,0]}],o=[0,1,2,3,4,5],t=[],i=[];for(const d of e)t.push(...d.p),i.push(...d.n);const r=new pe;return r.setAttribute("position",new te(t,3)),r.setAttribute("normal",new te(i,3)),r.setIndex(o),r}const{randFloat:lo,randFloatSpread:ae}=xe,co={gpgpuSize:64,background:16777215,material:"basic",materialParams:{},texture:null,textureCount:1,colors:[16777215,16777215],lights:[{type:"ambient",params:[16777215,.5]},{type:"directional",params:[16777215,.5],props:{position:[20,50,100]}}],fogDensity:.01,fishScale:[1,1,1],fishWidthSegments:8,fishSpeed:1.5,fishDisplacementScale:.2,noiseCoordScale:.02,noiseTimeCoef:5e-4,noiseIntensity:.0025,attractionRadius1:50,attractionRadius2:100,maxVelocity:.1};function uo(h){const e={...co,...h};if(!["basic","phong","standard"].includes(e.material))throw new Error(`Invalid material ${e.material}`);if(!Number.isInteger(e.fishWidthSegments)||e.fishWidthSegments%2!==0)throw new Error(`Invalid fishWidthSegments ${e.fishWidthSegments}`);const o=e.gpgpuSize,t=o*o;let i,r,d,n,c;const p={value:null},u={value:null},v={value:null},w={value:0},M={value:e.noiseCoordScale},l={value:e.noiseIntensity},s={value:e.maxVelocity},S={value:e.attractionRadius1},E={value:e.attractionRadius2},g={value:new j(...e.fishScale)},R={value:e.fishSpeed},N={value:e.fishDisplacementScale},x={uTexturePosition:p,uOldTexturePosition:u,uTextureVelocity:v},I={uTime:w,uNoiseCoordScale:M,uNoiseIntensity:l,uMaxVelocity:s,uAttractionRadius1:S,uAttractionRadius2:E,uFishScale:g,uFishSpeed:R,uFishDisplacementScale:N},F={...x,...I};let D,V,A;return{three:oe({...Ae(h),antialias:!0,orbitControls:!0,initRenderer({renderer:m}){O(m)},initCamera({camera:m}){m.position.set(0,20,70)},initScene({scene:m}){L(m)},beforeRender({clock:m}){w.value=m.time*e.noiseTimeCoef,i.compute(),p.value=c.renderTargets[i.currentTextureIndex].texture,u.value=c.renderTargets[i.currentTextureIndex===0?1:0].texture,v.value=n.renderTargets[i.currentTextureIndex].texture}}),config:e,uniforms:F,setColors:k};function O(m){i=new ge(o,o,m),m.capabilities.isWebGL2||i.setDataType(he),r=i.createTexture(),d=i.createTexture(),W(r,d),n=i.addVariable("textureVelocity",`
      ${$}
      uniform float uTime;
      uniform float uNoiseCoordScale;
      uniform float uNoiseIntensity;
      uniform float uMaxVelocity;
      uniform float uAttractionRadius1;
      uniform float uAttractionRadius2;
      uniform float uFishSpeed;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);

        vec3 grad;
        float n = psrdnoise(pos.xyz * uNoiseCoordScale, vec3(0), uTime, grad);
        grad = grad * uNoiseIntensity;
        vel.xyz = vel.xyz + (pos.w * 0.75) * grad;

        vec3 dv = -pos.xyz;
        float coef = smoothstep(uAttractionRadius1, uAttractionRadius2, length(dv));
        vel.xyz = vel.xyz + pos.w * coef * normalize(dv);
        vel.xyz = clamp(vel.xyz, -uMaxVelocity, uMaxVelocity);

        vel.w = mod(vel.w + length(vel.xyz) * (0.5 + pos.w) * uFishSpeed, 6.2831853071);
        gl_FragColor = vel;
      }
    `,d),c=i.addVariable("texturePosition",`
      ${$}
      uniform float uTime;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 vel = texture2D(textureVelocity, uv);
        pos.xyz += vel.xyz;
        gl_FragColor = pos;
      }
    `,r),i.setVariableDependencies(n,[c,n]),i.setVariableDependencies(c,[c,n]),Object.keys(I).forEach(b=>{n.material.uniforms[b]=F[b],c.material.uniforms[b]=F[b]});const C=i.init();if(C!==null)throw new Error(C)}function L(m){e.background!==void 0&&(m.background=new q(e.background),e.fogDensity&&(m.fog=new Lt(e.background,e.fogDensity))),Ne(m,e.lights),D=new ne(2,1,e.fishWidthSegments,1).rotateY(Math.PI/2);const C=new Float32Array(t*2),b=new Float32Array(t);let z=0,T=0;for(let f=0;f<o;f++)for(let U=0;U<o;U++)C[z++]=U/(o-1),C[z++]=f/(o-1),b[T++]=Math.floor(Math.random()*e.textureCount);D.setAttribute("gpuUv",new le(C,2)),D.setAttribute("mapIndex",new le(b,1));const P={side:Ce,...e.materialParams};switch(e.texture&&(P.map=new ot().load(e.texture)),P.onBeforeCompile=f=>{f.defines={COMPUTE_NORMALS:e.material!=="basic",FISH_DZ:(2/e.fishWidthSegments).toFixed(10),TEXTURE_COUNT:e.textureCount.toFixed(10)},Object.keys(F).forEach(U=>{f.uniforms[U]=F[U]}),f.vertexShader=`
        uniform sampler2D uTexturePosition;
        uniform sampler2D uOldTexturePosition;
        uniform sampler2D uTextureVelocity;
        uniform vec3 uFishScale;
        uniform float uFishDisplacementScale;
        attribute vec2 gpuUv;
        attribute float mapIndex;
        varying vec4 vPos;
        varying vec4 vVel;
        varying float vMapIndex;

        mat3 lookAt(vec3 origin, vec3 target, vec3 up) {
          vec3 z = target - origin;
          if (z.x * z.x + z.y * z.y + z.z * z.z == 0.0) { z.z = 1.0; }
          z = normalize(z);
          vec3 x = cross(up, z);
          if (x.x * x.x + x.y * x.y + x.z * x.z == 0.0) {
            if (abs(up.z) == 1.0) { z.x += 0.0001; }
            else { z.z += 0.0001; }
            x = cross(up, z);
          }
          x = normalize(x);
          vec3 y = cross(z, x);
          return mat3(x, y, z);
        }

        mat4 iMatrix(vec3 pos, mat3 rmat, vec3 scale) {
          return mat4(
            rmat[0][0] * scale.x, rmat[0][1] * scale.x, rmat[0][2] * scale.x, 0.0,
            rmat[1][0] * scale.y, rmat[1][1] * scale.y, rmat[1][2] * scale.y, 0.0,
            rmat[2][0] * scale.z, rmat[2][1] * scale.z, rmat[2][2] * scale.z, 0.0,
            pos.x, pos.y, pos.z, 1.0
          );
        }
      `+f.vertexShader,f.vertexShader=f.vertexShader.replace("#include <defaultnormal_vertex>",""),f.vertexShader=f.vertexShader.replace("#include <normal_vertex>",""),f.vertexShader=f.vertexShader.replace("#include <begin_vertex>",`
        vPos = texture2D(uTexturePosition, gpuUv);
        vec4 oldPos = texture2D(uOldTexturePosition, gpuUv);
        vVel = texture2D(uTextureVelocity, gpuUv);
        vMapIndex = float(mapIndex);

        mat3 rmat = lookAt(oldPos.xyz, vPos.xyz, vec3(0, 1, 0));
        mat4 im = iMatrix(vPos.xyz, rmat, (0.5 + vPos.w) * uFishScale);

        vec3 transformed = vec3(position);

        #ifdef COMPUTE_NORMALS
          vec3 transformedNormal = objectNormal; 
        #endif

        float dz = transformed.z + 1.0;
        float sdz = smoothstep(2.0, 0.0, dz);
        transformed.x += sin(vVel.w + dz * PI * 1.5) * sdz * uFishDisplacementScale;

        #ifdef COMPUTE_NORMALS
          float dz1 = dz - 0.2;
          float sdz1 = smoothstep(2.0, 0.0, dz1);
          float dx1 = sin(vVel.w + dz1 * PI * 1.5) * sdz1 * uFishDisplacementScale - transformed.x;
          vec3 v1 = vec3(dx1, 0.0, -FISH_DZ);
          vec3 v2 = vec3(0.0, 1.0, 0.0);
          transformedNormal = normalize(cross(v1, v2));
        #endif

        #ifdef COMPUTE_NORMALS
          #ifdef USE_INSTANCING
            mat3 m = mat3( im );
            transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
            transformedNormal = m * transformedNormal;
          #endif
          transformedNormal = normalMatrix * transformedNormal;
          #ifdef FLIP_SIDED
            transformedNormal = - transformedNormal;
          #endif
          #ifdef USE_TANGENT
            vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
            #ifdef FLIP_SIDED
              transformedTangent = - transformedTangent;
            #endif
          #endif
          #ifndef FLAT_SHADED
            vNormal = normalize( transformedNormal );
            #ifdef USE_TANGENT
              vTangent = normalize( transformedTangent );
              vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
            #endif
          #endif
        #endif
      `),f.vertexShader=f.vertexShader.replace("#include <project_vertex>",`
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = im * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
      `),f.fragmentShader=`
        varying float vMapIndex;
      `+f.fragmentShader,f.fragmentShader=f.fragmentShader.replace("#include <map_fragment>",`
        #ifdef USE_MAP
          vec2 uv = vUv;
          uv.x = (vMapIndex + vUv.x) / TEXTURE_COUNT;
          vec4 sampledDiffuseColor = texture2D(map, uv);
          diffuseColor *= sampledDiffuseColor;
        #endif
      `)},e.material){case"standard":V=new Ee(P);break;case"phong":V=new it(P);break;default:V=new Me(P)}A=new De(D,V,t),k(e.colors),m.add(A)}function k(m){if(Array.isArray(m)&&m.length>1){const C=ce(m);for(let b=0;b<t;b++)A.setColorAt(b,C.getColorAt(b/t));A.instanceColor.needsUpdate=!0}}function W(m,C){const b=m.image.data,z=C.image.data;for(let T=0,P=b.length;T<P;T+=4)b[T+0]=ae(100),b[T+1]=ae(100),b[T+2]=ae(100),b[T+3]=lo(.1,1),z[T+0]=ae(.5),z[T+1]=ae(.5),z[T+2]=ae(.5),z[T+3]=0}}export{Jt as butterfliesBackground,uo as fishesBackground,jt as neonCursor,Qt as noisyLinesBackground,Ht as particlesCursor,no as swarmBackground};
//# sourceMappingURL=threejs-toys.module.cdn.min.js.map
