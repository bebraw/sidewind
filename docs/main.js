!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){},function(t,e,r){},function(t,e,r){"use strict";r.r(e);var n=function(){return(n=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function o(t,e){try{return Function("state","return "+t)(e)}catch(r){console.error("Failed to evaluate",t,e,r)}}function u(t,e,r){t?e.classList.add(r):e.classList.remove(r)}var a=function(t,e){for(var r=t.querySelectorAll(":scope *"),n=function(t){var n=r[t],a=Array.from(n.attributes).filter((function(t){return t.name.startsWith("x-")&&!["x-bind","x-case","x-each","x-fetch","x-state","x-value"].includes(t.name)}));a.length>0&&a.forEach((function(t){var r=t.name,a=t.value;if("x-on"===r)return u(n.getAttribute("x-case")===e,n,a);if("x-not"===r)return u(n.getAttribute("x-case")!==e,n,a);var i=o(a,e);if(void 0!==i){var c=r.split("-").slice(1).join("-");u(i,n,c)}}))},a=r.length;a--;)n(a)};var i=function(t,e,r){for(var n=t.querySelectorAll(":scope ["+r+"]"),u=n.length;u--;){var a=n[u],i=a.getAttribute(r)||"",c=e[i]?e[i]:o(i,e)||e;"input"===a.localName?a.value=c:a.innerHTML=c}};var c=function(t){for(var e=function(e){var r=t[e],n=r.closest("[x-state]").state;if(n){var o=r.parentNode,u=(r.getAttribute("x-each")||"").split(",").map((function(t){return t.trim()}));if(!o)return{value:void 0};for(;o.firstChild;)o.firstChild.remove();n.forEach((function(t){var e,n,a=document.importNode(r.content,!0);i(a,(e=t,n={},u.forEach((function(t){n[t]=e[t]})),n),"x-bind"),o.appendChild(a)}))}},r=t.length;r--;){var n=e(r);if("object"==typeof n)return n.value}};var f=function(t){for(var e=function(e){var r=t[e],n=r.getAttribute("x-fetch");if(!n)return{value:void 0};fetch(n).then((function(t){return t.json()})).then((function(t){r.setAttribute("x-state",JSON.stringify(t)),r.state=t})).catch((function(t){console.error(t)}))},r=t.length;r--;){var n=e(r);if("object"==typeof n)return n.value}};function l(t){var e=t.getAttribute("x-state");if(e)try{return JSON.parse(e.replace(/'/g,'"'))}catch(t){return console.log("Failed to parse state: ",e),{}}}function s(t,e){return void 0===e&&(e=0),t.parentNode?s(t.parentNode,e+1):e}var v=function(t){Array.from(t).map((function(t,e){return{i:e,depth:s(t)}})).sort((function(t,e){return t.depth-e.depth})).map((function(t){return t.i})).forEach((function(e){var r=t[e],n=l(r);i(r,n,"x-value"),a(r,n)}))};function d(t,e){var r=t.closest("[x-state]");if(r){var o=l(r),u="object"==typeof o?n(n({},o),e):e;t.state=u,r.setAttribute("x-state",JSON.stringify(u)),i(r,u,"x-value"),a(r,u),v(r.querySelectorAll("[x-state]")),c(r.querySelectorAll("[x-each]"))}}var p;r(0),r(1);void 0===p&&(p=window),v(document.querySelectorAll("[x-state]")),f(document.querySelectorAll("[x-fetch]")),c(document.querySelectorAll("[x-each]")),p.setState=d}]);