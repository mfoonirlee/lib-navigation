!function(a,b){function c(a){a=a||"";var b=this,c={};if(a&&"string"==typeof a)for(var d=a.split("&"),e=0;e<d.length;e++){var f=d[e].split("=");c[decodeURIComponent(f[0])]=decodeURIComponent(f[1])}else if("object"==typeof a)for(var g in a)c[g]=a[g];for(var g in c)!function(a){Object.defineProperty(b,a,{get:function(){return c[a]},set:function(b){c[a]=b},enumerable:!0})}(g);this.toString=function(){return Object.keys(c).sort().map(function(a){return encodeURIComponent(a)+"="+encodeURIComponent(c[a])}).join("&")}}function d(){function b(a){var b=e.createElement("a");b.href=a;var c=e.createEvent("HTMLEvents");c.initEvent("click",!1,!0),b.dispatchEvent(c)}function d(a,b){var c=e.createEvent("HTMLEvents");if(c.initEvent(a,!1,!1),b)for(var d in b)c[d]=b[d];window.dispatchEvent(c)}function h(){this.exec=function(){d("navigation:push")}}function i(){this.exec=function(){d("navigation:pop")}}function j(){this.exec=function(){d("navigation:replace")}}function k(a,b){return a.name===b.name&&a.args.toString()===b.args.toString()}var l=this,m=[],n=!!g.state,o={},p="initial";m.exec=function(){m.length&&m.shift().exec()},this.push=function(a,e){var f={name:a,args:new c(e),id:o.state.id+1};if(!k(f,o.state)){p="push";var h=f.args.toString();if(n){var i="#"+f.name+(h?"?"+h:"");g.pushState({name:f.name,args:h,id:f.id},null,i),d("pushstate")}else{var i="#"+f.name+"["+f.id+"]"+(h?"?"+h:"");b(i)}}},this.pop=function(){o.state.id>1&&(p="pop",g.back())},this.replace=function(a,e){var f={name:a,args:new c(e),id:o.state.id};if(!k(f,o.state)){p="replace";var h=f.args.toString();if(n){var i="#"+f.name+(h?"?"+h:"");g.replaceState({name:f.name,args:h,id:f.id},null,i),d("replacestate")}else{var i="#"+f.name+"["+f.id+"]"+(h?"?"+h:"");b(i)}}};var q=!1;this.start=function(b){function d(){var a;if(n&&null!=g.state&&g.state!==!0)a={id:g.state.id,name:g.state.name,args:new c(g.state.args)};else{var b=f.hash,d=b.match(/#([^\[\]\?]+)(?:\[(\d+)\])?(?:\?(.*))?/)||["",k,1,r];a={name:d[1],id:parseInt(d[2]||1),args:new c(d[3]||"")}}return a}function e(){var a=d(),b=o.state;o.state=a,a.id<b.id?(p="pop",m.push(new i(a,a.id-b.id))):a.id===b.id?"replace"===l.action?m.push(new j(a)):console.error("请勿用location.hash或location.href来改变hash值"):(p="push",m.push(new h(a,a.id-b.id))),m.exec()}if(!q){q=!0;var k=b.defaultPath||"",r=b.defaultArgs||"";n&=!!b.useHistoryState,Object.defineProperty(this,"useHistoryState",{get:function(){return n}}),Object.defineProperty(this,"action",{get:function(){return p}}),Object.defineProperty(this,"state",{get:function(){return{id:o.state.id,name:o.state.name,args:o.state.args}}});var s=d();n?(a.addEventListener("pushstate",e,!1),a.addEventListener("popstate",e,!1),a.addEventListener("replacestate",e,!1)):a.addEventListener("hashchange",e,!1),o.state=s,m.push(new h(s)),m.exec()}}}var e=a.document,f=a.location,g=a.history;!g.state&&g.replaceState&&g.replaceState(!0);window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(a){setTimeout(a,1/60)};b.navigation=d}(window,window.lib||(window.lib={}));