(this.webpackJsonpbkrm_thesis=this.webpackJsonpbkrm_thesis||[]).push([[37],{1659:function(e,t,n){"use strict";n.d(t,"b",(function(){return f})),n.d(t,"a",(function(){return d})),n.d(t,"d",(function(){return p})),n.d(t,"c",(function(){return y})),n.d(t,"e",(function(){return v}));var r=n(0),o=n(341),a=n(610),u=function(e){return e&&e.reactPage&&e.reactPage.focus},c=function(e){var t,n,r;return null!==(r=null===(n=null===(t=u(e))||void 0===t?void 0:t.nodeIds)||void 0===n?void 0:n.filter((function(t){var n;return null===(n=Object(a.b)(e,t))||void 0===n?void 0:n.node})))&&void 0!==r?r:[]},i=function(e){var t=c(e);return 1===(null===t||void 0===t?void 0:t.length)?t[0]:null},l=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),u=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)u.push(r.value)}catch(c){o={error:c}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return u},s=function(e,t,n){if(n||2===arguments.length)for(var r,o=0,a=t.length;o<a;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))},f=function(){return Object(o.c)(i)},d=function(){return Object(o.c)(c)},p=function(e){return Object(o.c)((function(t){return c(t).includes(e)}))},y=function(e){return Object(o.c)((function(t){return i(t)===e}))},v=function(e,t,n){var a=Object(o.c)((function(t){var n=u(t),r=i(t);return n&&r===e?n.scrollToCell:null}));Object(r.useEffect)((function(){if(a)return t()}),s([a],l(n),!1))}},1857:function(e,t,n){"use strict";n.r(t);var r=n(362),o=n(1659),a=n(725),u=n(0),c=n.n(u),i=n(269),l=n(512),s=n(511),f=n.n(s),d=n(430),p=n(340),y=n(359),v=n(724),b=Object(r.a)((function(){return Promise.all([n.e(4),n.e(8),n.e(36)]).then(n.bind(null,1861))})),m=c.a.memo((function(e){var t=e.plugins,n=e.defaultPluginType,r=e.readOnly,a=e.placeholder,u={useSelected:i.e,useFocused:i.d,readOnly:r},s=Object(v.a)({plugins:t,defaultPluginType:n,injections:u},[]),b=Object(v.b)({plugins:t,injections:u},[]),m=function(e,t){var n=e.plugins,r=Object(i.f)();return c.a.useCallback((function(e){return n.filter((function(e){return e.hotKey})).forEach((function(t){f()(t.hotKey,e)&&(e.preventDefault(),Object(p.b)(r,t)?Object(y.b)(r,t):Object(d.a)(r,t))})),f()(["mod+z","mod+y"],e)?(e.preventDefault(),!0):f()(["esc"],e)?(i.b.blur(r),!0):f()("shift+enter",e)?(e.preventDefault(),r.insertText("\n"),!0):void 0}),t)}({plugins:t},[]),h=Object(l.b)(),j=Object(o.a)().length>1;return c.a.createElement(i.a,{placeholder:r?void 0:a,readOnly:h||r||j,renderElement:s,renderLeaf:b,onKeyDown:r?void 0:m})}));t.default=c.a.memo((function(e){var t=e.plugins,n=e.focused,r=e.readOnly,o=Object(a.g)().t;return c.a.createElement(c.a.Fragment,null,!r&&n&&c.a.createElement(b,{plugins:e.plugins,translations:e.translations}),c.a.createElement(m,{placeholder:o(e.translations.placeholder),readOnly:r,plugins:t,defaultPluginType:e.defaultPluginType}))}))},340:function(e,t,n){"use strict";n.d(t,"b",(function(){return u}));var r=n(271),o=n(269),a=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),u=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)u.push(r.value)}catch(c){o={error:c}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return u},u=function(e,t){if("custom"===t.pluginType)return null;var n="component"===t.pluginType?"mark"===t.object?function(e){return Boolean(e[t.type])}:function(e){return e.type===t.type}:"data"===t.pluginType?function(e){var n=e.data;return t.dataMatches(n)}:null;try{return a(r.Editor.nodes(e,{match:n,mode:"lowest"}),1)[0]}catch(o){return null}};t.a=function(e){var t=Object(o.f)();return u(t,e)}},359:function(e,t,n){"use strict";n.d(t,"b",(function(){return i}));var r=n(0),o=n(271),a=n(269),u=n(429),c=function(){return c=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},c.apply(this,arguments)},i=function(e,t){if(t.customRemove)t.customRemove(e);else if("component"===t.pluginType)"mark"===t.object?e.removeMark(t.type):"inline"===t.object?t.isVoid?o.Transforms.removeNodes(e,{match:function(e){return e.type===t.type}}):o.Transforms.unwrapNodes(e,{match:function(e){return e.type===t.type}}):"block"===t.object&&(t.isVoid?o.Transforms.removeNodes(e,{match:function(e){return e.type===t.type}}):t.replaceWithDefaultOnRemove?o.Transforms.setNodes(e,{type:null}):o.Transforms.unwrapNodes(e,{match:function(e){return e.type===t.type},split:!0}));else if("data"===t.pluginType)if(t.properties){var n=Object(u.a)(e),r=Object.keys(n).reduce((function(e,r){var o;return t.properties.includes(r)?e:c(c({},e),((o={})[r]=n[r],o))}),{});o.Transforms.setNodes(e,{data:r})}else;};t.a=function(e){var t=Object(a.f)();return Object(r.useCallback)((function(){return i(t,e)}),[])}},429:function(e,t,n){"use strict";var r=n(271),o=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),u=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)u.push(r.value)}catch(c){o={error:c}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return u};t.a=function(e){var t,n=o(r.Editor.nodes(e,{mode:"all",match:function(e){return Boolean(e.data)}}),1)[0];return n?null===(t=n[0])||void 0===t?void 0:t.data:{}}},430:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var r=n(0),o=n(271),a=n(269),u=n(340),c=n(359),i=n(429),l=function(){return l=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},l.apply(this,arguments)},s=function(e,t,n){var r,a=n||{},s=a.data,f=a.text,d=Object(u.b)(e,t);if(f){var p="component"===t.pluginType&&"inline"===t.object&&t.addExtraSpace?f+" ":f;e.insertText(p),o.Transforms.select(e,{anchor:e.selection.anchor,focus:l(l({},e.selection.focus),{offset:e.selection.focus.offset-p.length})})}var y=s||(t.getInitialData?t.getInitialData():null);if(Boolean(d)&&(o.Transforms.select(e,d[1]),Object(c.b)(e,t)),t.customAdd)t.customAdd(e);else if("component"===t.pluginType){if("mark"===t.object)e.addMark(t.type,y||!0);else if(t.isVoid)o.Transforms.insertNodes(e,{type:t.type,data:y,children:[{text:""}]});else if("block"===t.object&&t.replaceWithDefaultOnRemove)o.Transforms.setNodes(e,{type:t.type,data:y});else if(o.Transforms.wrapNodes(e,{type:t.type,children:[],data:y},{split:!0}),"inline"===t.object&&t.addExtraSpace&&!f&&e.selection){var v=l({},e.selection.focus);o.Transforms.insertText(e," ",{at:e.selection.focus}),o.Transforms.select(e,v)}}else if("data"===t.pluginType){var b=null!==(r=Object(i.a)(e))&&void 0!==r?r:{};o.Transforms.setNodes(e,{data:l(l({},b),null!==y&&void 0!==y?y:{})})}};t.b=function(e){var t=Object(a.f)();return Object(r.useCallback)((function(n){return s(t,e,n)}),[])}}}]);
//# sourceMappingURL=37.b5a4e912.chunk.js.map