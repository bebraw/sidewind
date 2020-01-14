!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){},function(t,e,r){},function(t,e,r){"use strict";r.r(e);var n=function(){return(n=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function o(t,e){try{return Function("state","$","return "+t)(e,(function(t){return{_type:"query",_value:t}}))}catch(r){console.error("Failed to evaluate",t,e,r)}}function a(t,e){var r=e.split("."),n=t;return r.forEach((function(t){n=n[t]})),n}function i(t,e){return t.hasAttribute(e)?t:t.parentElement?t.parentElement.hasAttribute(e)?t.parentElement:i(t.parentElement,e):null}var u=function(t,e,r,n){var u=Array.from(t.querySelectorAll(":scope ["+r+"]"));t.hasAttribute(r)&&u.push(t);for(var l=u.length;l--;){var c=u[l];if((n?i(c,n):t)!==t)return;var f=c.getAttribute(r)||"",s=void 0;s=e.nodeType?a(e,f):e.hasOwnProperty(f)?e[f]:o(f,e)||e,"input"===c.localName?c.value=s:c.innerHTML="object"==typeof s?JSON.stringify(s,null,2):s}};var l=function(t,e,r){for(var n=t.querySelectorAll(":scope ["+e+"]"),i=function(t){var e=n[t],i=Array.from(e.attributes),u=e.closest("["+r+"]").state;i.forEach((function(t){var r=t.nodeName;if(r.startsWith("x:")){var n=t.value,i=r.split("x:").filter(Boolean)[0],l=void 0;l=u.nodeType?a(u,n):u.hasOwnProperty(n)?u[n]:o(n,u)||u,e.setAttribute(i,l)}}))},u=n.length;u--;)i(u)};function c(t,e,r){t?e.classList.add(r):e.classList.remove(r)}var f=function(t,e){for(var r=t.querySelectorAll(":scope *"),n=function(t){var n=r[t],o=Array.from(n.attributes).filter((function(t){return t.name.startsWith("x-")}));o.length>0&&o.forEach((function(t){var r=t.name,o=t.value,a=n.getAttribute("x-case");return"x-on"===r?c(a?a===e:"boolean"==typeof e&&e,n,o):"x-off"===r?c(a?a!==e:"boolean"==typeof e&&!e,n,o):void 0}))},o=r.length;o--;)n(o)};var s=function(t,e,r){for(var n=function(n){var o=t[n],a=o.closest("["+r+"]").state;if(a){var i=o.parentNode;if(!i)return{value:void 0};for(;i.firstChild;)i.firstChild.remove();i.appendChild(o),"object"==typeof a&&Object.values(function(t,e){var r;if(!e)return{};var n=t[e];return(r={})[e]="query"===n._type?[].slice.call(document.querySelectorAll(n._value)):n,r}(a,o.getAttribute(e))).forEach((function(t){return Array.isArray(t)&&t.forEach((function(t){var e=document.importNode(o.content,!0);e.firstElementChild.setAttribute(r,JSON.stringify(t)),e.firstElementChild.state=t,i.appendChild(e)}))}))}},o=t.length;o--;){var a=n(o);if("object"==typeof a)return a.value}};var v=function(t,e,r,a,i){for(var c=function(c){var v=t[c],y=v.getAttribute(e)||"",p=v.state||o(y,{}),d=[];Object.keys(p).forEach((function(t){var e=p[t];e.then&&d.push(e.then((function(e){return{key:t,values:e}})))})),d.length>0&&Promise.all(d).then((function(t){var o={};t.forEach((function(t){var e=t.key,r=t.values;o[e]=r}));var c=n(n({},v.state),o);v.setAttribute(e,JSON.stringify(c)),v.state=c,s(v.querySelectorAll("["+a+"]"),a,e),u(v,c,r,e),f(v,c),l(v,i,e)})),v.setAttribute(e,JSON.stringify(p)),v.state=p,u(v,p,r,e),f(v,p),l(v,i,e)},v=t.length;v--;)c(v)};function y(t){var e=window.event&&window.event.target;if(e){var r=e.closest("[x-state]");if(r){var o=r.state,a="object"==typeof o?n(n({},o),t):t;e.state=a,r.setAttribute("x-state",JSON.stringify(a)),r.state=a,s(r.querySelectorAll("[x-each]"),"x-each","x-state"),u(r,a,"x-bind","x-state"),f(r,a),v(r.querySelectorAll("[x-state]"),"x-state","x-bind","x-each","x-attr")}}}var p;r(0),r(1);void 0===p&&(p=window),p.onload=function(){s(document.querySelectorAll("[x-each]"),"x-each","x-state"),v(document.querySelectorAll("[x-state]"),"x-state","x-bind","x-each","x-attr")},p.setState=y}]);