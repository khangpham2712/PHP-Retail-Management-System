(this.webpackJsonpbkrm_thesis=this.webpackJsonpbkrm_thesis||[]).push([[35],{1811:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(271),l=n(269),i=n(621),c=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),l=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)l.push(r.value)}catch(i){o={error:i}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return l};t.default=function(e){var t=e.plugin,n=e.element,u=e.children,s=e.component,f=c(Object(r.useState)(!1),2),d=f[0],v=f[1],p=Object(l.g)(),m=Object(r.useCallback)((function(e){e.stopPropagation();var t=l.b.findPath(p,n);v(!0),a.Transforms.select(p,t)}),[p,n]),b=Object(r.useCallback)((function(){return v(!1)}),[]),y="inline"===t.object?"span":"div",h=Object(l.e)();return o.a.createElement(o.a.Fragment,null,d?o.a.createElement(i.a,{open:d,close:b,plugin:t}):null,o.a.createElement(y,{onClick:m,style:{cursor:"pointer",outline:h?"1px dotted grey":void 0}},o.a.createElement(y,{style:{pointerEvents:"none"}},u,s)))}},340:function(e,t,n){"use strict";n.d(t,"b",(function(){return l}));var r=n(271),o=n(269),a=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),l=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)l.push(r.value)}catch(i){o={error:i}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return l},l=function(e,t){if("custom"===t.pluginType)return null;var n="component"===t.pluginType?"mark"===t.object?function(e){return Boolean(e[t.type])}:function(e){return e.type===t.type}:"data"===t.pluginType?function(e){var n=e.data;return t.dataMatches(n)}:null;try{return a(r.Editor.nodes(e,{match:n,mode:"lowest"}),1)[0]}catch(o){return null}};t.a=function(e){var t=Object(o.f)();return l(t,e)}},359:function(e,t,n){"use strict";n.d(t,"b",(function(){return c}));var r=n(0),o=n(271),a=n(269),l=n(429),i=function(){return i=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},i.apply(this,arguments)},c=function(e,t){if(t.customRemove)t.customRemove(e);else if("component"===t.pluginType)"mark"===t.object?e.removeMark(t.type):"inline"===t.object?t.isVoid?o.Transforms.removeNodes(e,{match:function(e){return e.type===t.type}}):o.Transforms.unwrapNodes(e,{match:function(e){return e.type===t.type}}):"block"===t.object&&(t.isVoid?o.Transforms.removeNodes(e,{match:function(e){return e.type===t.type}}):t.replaceWithDefaultOnRemove?o.Transforms.setNodes(e,{type:null}):o.Transforms.unwrapNodes(e,{match:function(e){return e.type===t.type},split:!0}));else if("data"===t.pluginType)if(t.properties){var n=Object(l.a)(e),r=Object.keys(n).reduce((function(e,r){var o;return t.properties.includes(r)?e:i(i({},e),((o={})[r]=n[r],o))}),{});o.Transforms.setNodes(e,{data:r})}else;};t.a=function(e){var t=Object(a.f)();return Object(r.useCallback)((function(){return c(t,e)}),[])}},429:function(e,t,n){"use strict";var r=n(271),o=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),l=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)l.push(r.value)}catch(i){o={error:i}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return l};t.a=function(e){var t,n=o(r.Editor.nodes(e,{mode:"all",match:function(e){return Boolean(e.data)}}),1)[0];return n?null===(t=n[0])||void 0===t?void 0:t.data:{}}},430:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var r=n(0),o=n(271),a=n(269),l=n(340),i=n(359),c=n(429),u=function(){return u=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},u.apply(this,arguments)},s=function(e,t,n){var r,a=n||{},s=a.data,f=a.text,d=Object(l.b)(e,t);if(f){var v="component"===t.pluginType&&"inline"===t.object&&t.addExtraSpace?f+" ":f;e.insertText(v),o.Transforms.select(e,{anchor:e.selection.anchor,focus:u(u({},e.selection.focus),{offset:e.selection.focus.offset-v.length})})}var p=s||(t.getInitialData?t.getInitialData():null);if(Boolean(d)&&(o.Transforms.select(e,d[1]),Object(i.b)(e,t)),t.customAdd)t.customAdd(e);else if("component"===t.pluginType){if("mark"===t.object)e.addMark(t.type,p||!0);else if(t.isVoid)o.Transforms.insertNodes(e,{type:t.type,data:p,children:[{text:""}]});else if("block"===t.object&&t.replaceWithDefaultOnRemove)o.Transforms.setNodes(e,{type:t.type,data:p});else if(o.Transforms.wrapNodes(e,{type:t.type,children:[],data:p},{split:!0}),"inline"===t.object&&t.addExtraSpace&&!f&&e.selection){var m=u({},e.selection.focus);o.Transforms.insertText(e," ",{at:e.selection.focus}),o.Transforms.select(e,m)}}else if("data"===t.pluginType){var b=null!==(r=Object(c.a)(e))&&void 0!==r?r:{};o.Transforms.setNodes(e,{data:u(u({},b),null!==p&&void 0!==p?p:{})})}};t.b=function(e){var t=Object(a.f)();return Object(r.useCallback)((function(n){return s(t,e,n)}),[])}},461:function(e,t,n){"use strict";var r=n(340);t.a=function(e){var t=Object(r.a)(e);return Boolean(t)}},615:function(e,t,n){"use strict";var r=n(212),o=n(213);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=o(n(0)),l=(0,r(n(214)).default)(a.createElement("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),"Done");t.default=l},621:function(e,t,n){"use strict";var r=n(0),o=n.n(r),a=n(271),l=n(269),i=n(430),c=n(340),u=function(e,t){var n=Object(c.b)(e,t);if(n){var r=n[0];return"component"===t.pluginType&&"mark"===t.object?r[t.type]:r.data}return t.getInitialData?t.getInitialData():{}},s=n(461),f=n(359),d=n(1764),v=n(1766),p=n(789),m=n(204),b=n(1756),y=n(360),h=n.n(y),j=n(615),O=n.n(j),g=n(618),T=n(1789),k=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),l=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)l.push(r.value)}catch(i){o={error:i}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return l};var E=function(e){var t=e.schema?Object(g.a)(e.schema):null,n=Boolean(e.schema),a=Object(r.useRef)(),l=k(Object(r.useState)(null),2),i=l[0],c=l[1],u=Object(r.useCallback)((function(t){e.close(),e.shouldInsertWithText?e.add({text:i,data:t}):e.add({data:t})}),[e.shouldInsertWithText,i]),s=Object(r.useCallback)((function(){a.current&&a.current.submit()}),[a.current]),f=Object(r.useCallback)((function(){t?s():u({})}),[s,u,n]);return o.a.createElement(d.a,{disableEnforceFocus:!0,PaperProps:{style:{minWidth:300}},open:e.open},o.a.createElement(v.a,null,e.shouldInsertWithText?o.a.createElement("div",null,o.a.createElement(b.a,{autoFocus:!0,placeholder:"Text",onChange:function(e){return c(e.target.value)},value:i})):null,n?o.a.createElement(T.b,{ref:a,model:e.data,schema:t,onSubmit:u},o.a.createElement(T.a,null)):null),o.a.createElement(p.a,null,o.a.createElement(m.a,{variant:"text",onClick:function(){e.close()},style:{marginRight:"auto"}},e.cancelLabel||"Cancel"),e.isActive?o.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:function(){e.remove(),e.close()}},e.removeLabel||"Remove",o.a.createElement(h.a,{style:{marginLeft:10}})):null,o.a.createElement(m.a,{variant:"contained",color:"primary",onClick:f},e.submitLabel||"Ok",o.a.createElement(O.a,{style:{marginLeft:10}}))))},x=n(512),C=function(){return C=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},C.apply(this,arguments)},S=function(e,t){var n="function"===typeof Symbol&&e[Symbol.iterator];if(!n)return e;var r,o,a=n.call(e),l=[];try{for(;(void 0===t||t-- >0)&&!(r=a.next()).done;)l.push(r.value)}catch(i){o={error:i}}finally{try{r&&!r.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}return l};t.a=o.a.memo((function(e){var t,n,c,d,v,p=e.plugin,m=Object(r.useRef)(),b=!("component"===p.pluginType&&("inline"===p.object||"block"===p.object)&&p.isVoid)&&(!(null===(t=null===m||void 0===m?void 0:m.current)||void 0===t?void 0:t.selection)||a.Range.isCollapsed(null===(n=null===m||void 0===m?void 0:m.current)||void 0===n?void 0:n.selection))&&!(null===(c=null===m||void 0===m?void 0:m.current)||void 0===c?void 0:c.isActive),y=Object(i.b)(p),h=Object(f.a)(p),j=Object(l.f)(),O=Object(x.c)(),g=S(Object(r.useState)(!1),2),T=(g[0],g[1]),k=Object(s.a)(p);Object(r.useEffect)((function(){return O(e.open),T(e.open),e.open&&(m.current={selection:j.selection,isActive:k,data:u(j,p)}),function(){O(!1)}}),[e.open,O,T]);var w=p.controls,N=w?"autoform"===w.type?function(e){return o.a.createElement(E,C({},e,{schema:null===w||void 0===w?void 0:w.schema}))}:w.Component:E,R=Object(r.useCallback)((function(e){var t,n;(null===(t=null===m||void 0===m?void 0:m.current)||void 0===t?void 0:t.selection)&&a.Transforms.select(j,null===(n=null===m||void 0===m?void 0:m.current)||void 0===n?void 0:n.selection),y(e)}),[y]),I=Object(r.useCallback)((function(){setTimeout((function(){var e,t;(null===(e=null===m||void 0===m?void 0:m.current)||void 0===e?void 0:e.selection)&&a.Transforms.select(j,null===(t=null===m||void 0===m?void 0:m.current)||void 0===t?void 0:t.selection),h()}),100)}),[h]);return e.open?o.a.createElement(N,C({pluginConfig:p,close:close,open:!0,add:R,remove:I,isActive:null===(d=null===m||void 0===m?void 0:m.current)||void 0===d?void 0:d.isActive,shouldInsertWithText:b,data:null===(v=null===m||void 0===m?void 0:m.current)||void 0===v?void 0:v.data},e)):null}))},789:function(e,t,n){"use strict";var r=n(1),o=n(4),a=n(0),l=(n(5),n(6)),i=n(13),c=a.forwardRef((function(e,t){var n=e.disableSpacing,i=void 0!==n&&n,c=e.classes,u=e.className,s=Object(o.a)(e,["disableSpacing","classes","className"]);return a.createElement("div",Object(r.a)({className:Object(l.a)(c.root,u,!i&&c.spacing),ref:t},s))}));t.a=Object(i.a)({root:{display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},spacing:{"& > :not(:first-child)":{marginLeft:8}}},{name:"MuiDialogActions"})(c)}}]);
//# sourceMappingURL=35.b2b56600.chunk.js.map