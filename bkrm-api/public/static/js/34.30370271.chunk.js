(this.webpackJsonpbkrm_thesis=this.webpackJsonpbkrm_thesis||[]).push([[34],{1163:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var i=n(1),a=n(0),o=n(78),r=n(178);function c(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Object(o.a)(),c=Object(r.a)({theme:n,name:"MuiUseMediaQuery",props:{}});var s="function"===typeof t?t(n):t;s=s.replace(/^@media( ?)/m,"");var l="undefined"!==typeof window&&"undefined"!==typeof window.matchMedia,d=Object(i.a)({},c,e),h=d.defaultMatches,b=void 0!==h&&h,m=d.matchMedia,j=void 0===m?l?window.matchMedia:null:m,g=d.noSsr,u=void 0!==g&&g,p=d.ssrMatchMedia,x=void 0===p?null:p,f=a.useState((function(){return u&&l?j(s).matches:x?x(s).matches:b})),O=f[0],v=f[1];return a.useEffect((function(){var t=!0;if(l){var e=j(s),n=function(){t&&v(e.matches)};return n(),e.addListener(n),function(){t=!1,e.removeListener(n)}}}),[s,j,l]),O}},1165:function(t,e,n){"use strict";var i=n(1),a=n(4),o=n(0),r=(n(5),n(6)),c=n(13),s=n(15),l=o.forwardRef((function(t,e){var n=t.absolute,c=void 0!==n&&n,s=t.classes,l=t.className,d=t.component,h=void 0===d?"hr":d,b=t.flexItem,m=void 0!==b&&b,j=t.light,g=void 0!==j&&j,u=t.orientation,p=void 0===u?"horizontal":u,x=t.role,f=void 0===x?"hr"!==h?"separator":void 0:x,O=t.variant,v=void 0===O?"fullWidth":O,y=Object(a.a)(t,["absolute","classes","className","component","flexItem","light","orientation","role","variant"]);return o.createElement(h,Object(i.a)({className:Object(r.a)(s.root,l,"fullWidth"!==v&&s[v],c&&s.absolute,m&&s.flexItem,g&&s.light,"vertical"===p&&s.vertical),role:f,ref:e},y))}));e.a=Object(c.a)((function(t){return{root:{height:1,margin:0,border:"none",flexShrink:0,backgroundColor:t.palette.divider},absolute:{position:"absolute",bottom:0,left:0,width:"100%"},inset:{marginLeft:72},light:{backgroundColor:Object(s.a)(t.palette.divider,.08)},middle:{marginLeft:t.spacing(2),marginRight:t.spacing(2)},vertical:{height:"100%",width:1},flexItem:{alignSelf:"stretch",height:"auto"}}}),{name:"MuiDivider"})(l)},1302:function(t,e,n){"use strict";var i=n(1),a=n(4),o=n(0),r=(n(5),n(6)),c=n(13),s=n(21),l=n(200),d=o.forwardRef((function(t,e){var n=t.classes,c=t.className,d=t.color,h=void 0===d?"primary":d,b=t.position,m=void 0===b?"fixed":b,j=Object(a.a)(t,["classes","className","color","position"]);return o.createElement(l.a,Object(i.a)({square:!0,component:"header",elevation:4,className:Object(r.a)(n.root,n["position".concat(Object(s.a)(m))],n["color".concat(Object(s.a)(h))],c,"fixed"===m&&"mui-fixed"),ref:e},j))}));e.a=Object(c.a)((function(t){var e="light"===t.palette.type?t.palette.grey[100]:t.palette.grey[900];return{root:{display:"flex",flexDirection:"column",width:"100%",boxSizing:"border-box",zIndex:t.zIndex.appBar,flexShrink:0},positionFixed:{position:"fixed",top:0,left:"auto",right:0,"@media print":{position:"absolute"}},positionAbsolute:{position:"absolute",top:0,left:"auto",right:0},positionSticky:{position:"sticky",top:0,left:"auto",right:0},positionStatic:{position:"static"},positionRelative:{position:"relative"},colorDefault:{backgroundColor:e,color:t.palette.getContrastText(e)},colorPrimary:{backgroundColor:t.palette.primary.main,color:t.palette.primary.contrastText},colorSecondary:{backgroundColor:t.palette.secondary.main,color:t.palette.secondary.contrastText},colorInherit:{color:"inherit"},colorTransparent:{backgroundColor:"transparent",color:"inherit"}}}),{name:"MuiAppBar"})(d)},1303:function(t,e,n){"use strict";var i=n(1),a=n(4),o=n(14),r=n(0),c=(n(5),n(6)),s=n(13),l=r.forwardRef((function(t,e){var n=t.classes,o=t.className,s=t.component,l=void 0===s?"div":s,d=t.disableGutters,h=void 0!==d&&d,b=t.variant,m=void 0===b?"regular":b,j=Object(a.a)(t,["classes","className","component","disableGutters","variant"]);return r.createElement(l,Object(i.a)({className:Object(c.a)(n.root,n[m],o,!h&&n.gutters),ref:e},j))}));e.a=Object(s.a)((function(t){return{root:{position:"relative",display:"flex",alignItems:"center"},gutters:Object(o.a)({paddingLeft:t.spacing(2),paddingRight:t.spacing(2)},t.breakpoints.up("sm"),{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}),regular:t.mixins.toolbar,dense:{minHeight:48}}}),{name:"MuiToolbar"})(l)},1832:function(t,e,n){"use strict";n.r(e);var i=n(0),a=n(1739),o=n(113),r=n(83),c=n(1163),s=n(204),l=n(1302),d=n(1303),h=n(1731),b=n(1732),m=n(201),j=n(1165),g=n(1),u=n(4),p=n(14),x=(n(5),n(6)),f=n(13),O=n(21),v=i.forwardRef((function(t,e){var n=t.classes,a=t.className,o=t.component,r=void 0===o?"div":o,c=t.disableGutters,s=void 0!==c&&c,l=t.fixed,d=void 0!==l&&l,h=t.maxWidth,b=void 0===h?"lg":h,m=Object(u.a)(t,["classes","className","component","disableGutters","fixed","maxWidth"]);return i.createElement(r,Object(g.a)({className:Object(x.a)(n.root,a,d&&n.fixed,s&&n.disableGutters,!1!==b&&n["maxWidth".concat(Object(O.a)(String(b)))]),ref:e},m))})),y=Object(f.a)((function(t){return{root:Object(p.a)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",paddingLeft:t.spacing(2),paddingRight:t.spacing(2),display:"block"},t.breakpoints.up("sm"),{paddingLeft:t.spacing(3),paddingRight:t.spacing(3)}),disableGutters:{paddingLeft:0,paddingRight:0},fixed:Object.keys(t.breakpoints.values).reduce((function(e,n){var i=t.breakpoints.values[n];return 0!==i&&(e[t.breakpoints.up(n)]={maxWidth:i}),e}),{}),maxWidthXs:Object(p.a)({},t.breakpoints.up("xs"),{maxWidth:Math.max(t.breakpoints.values.xs,444)}),maxWidthSm:Object(p.a)({},t.breakpoints.up("sm"),{maxWidth:t.breakpoints.values.sm}),maxWidthMd:Object(p.a)({},t.breakpoints.up("md"),{maxWidth:t.breakpoints.values.md}),maxWidthLg:Object(p.a)({},t.breakpoints.up("lg"),{maxWidth:t.breakpoints.values.lg}),maxWidthXl:Object(p.a)({},t.breakpoints.up("xl"),{maxWidth:t.breakpoints.values.xl})}}),{name:"MuiContainer"})(v),k=n(1756),w=n.p+"static/media/video_thesis.4b888578.mov",C=n.p+"static/media/clickVid.139be669.mov",N=n.p+"static/media/Order - new.b6a35687.png",T=n.p+"static/media/Create new product.58e13285.png",R=(n.p,n.p,n.p+"static/media/web2.d795f88b.png"),B=n.p+"static/media/web3.4e643c64.png",W=n(749),S=n(55),I=n(57),L=n(751),z=n(748),M=n(750),G=n(3),Q=Object(a.a)((function(t){return{root:{display:"flex",background:t.palette.background.default},appBar:{background:t.palette.background.paper,padding:15,boxShadow:"none"},toolBar:{background:t.palette.background.paper,color:t.customization.themeGreyText},btnNav:{textTransform:"none",marginRight:10},videosm:{width:"50%"},videoupsm:{width:"95%"},color:{}}})),E=Object(o.a)(s.a)((function(t){t.theme;return{color:"#ffffff",backgroundColor:"#ff906d",width:100,"&:hover":{backgroundColor:"#fa6232"}}})),A=Object(o.a)(s.a)((function(t){t.theme;return{color:"#ff906d",borderColor:"#ff906d","&:hover":{backgroundColor:"#fff0eb"}}}));e.default=function(){var t=Object(r.a)(),e=Q(t),n=Object(c.a)(t.breakpoints.down("xs")),i=Object(c.a)(t.breakpoints.down("sm"));return Object(G.jsxs)("div",{className:e.root,children:[Object(G.jsx)(l.a,{position:"fixed",className:e.appBar,children:Object(G.jsx)(d.a,{className:e.toolBar,children:Object(G.jsxs)(h.a,{container:!0,direction:"row",alignItems:"center",justifyContent:"space-between",children:[Object(G.jsx)(h.a,{item:!0,sm:2,children:Object(G.jsx)(b.a,{variant:"h3",noWrap:!0,className:e.searchEngine,children:"BKRM"})}),Object(G.jsxs)(h.a,{container:!0,item:!0,sm:10,direction:"row",alignItems:"center",children:[Object(G.jsxs)(h.a,{container:!0,item:!0,sm:8,direction:"row",children:[Object(G.jsx)(s.a,{className:e.btnNav,component:I.b,to:"/main",children:"Trang ch\u1ee7"}),Object(G.jsx)(s.a,{className:e.btnNav,children:"Gi\u1edbi thi\u1ec7u"}),Object(G.jsx)(s.a,{className:e.btnNav,children:"H\u1ed7 tr\u1ee3"}),Object(G.jsx)(s.a,{className:e.btnNav,children:"Li\xean h\u1ec7"})]}),Object(G.jsxs)(h.a,{container:!0,item:!0,sm:4,direction:"row",justifyContent:"flex-end",children:[Object(G.jsx)(m.a,{component:I.b,to:"/login",children:Object(G.jsx)(A,{className:e.btnNav,variant:"outlined",style:{borderRadius:20,marginBottom:5},children:"\u0110\u0103ng nh\u1eadp"})}),Object(G.jsx)(m.a,{component:I.b,to:"/signup",children:Object(G.jsx)(E,{className:e.btnNav,variant:"contained",color:"secondary",style:{borderRadius:20,marginLeft:10,marginBottom:5},children:"\u0110\u0103ng k\xfd"})})]})]})]})})}),Object(G.jsxs)(m.a,{style:{marginTop:130},children:[Object(G.jsxs)(h.a,{container:!0,direction:"row",justifyContent:"space-between",alignItems:"center",children:[Object(G.jsxs)(h.a,{container:!0,item:!0,xs:12,sm:6,direction:"column",style:{paddingLeft:45,paddingRight:20},children:[n?null:Object(G.jsx)(h.a,{container:!0,direction:"row",justifyContent:"flex-end",children:Object(G.jsx)("video",{loop:!0,autoPlay:!0,muted:!0,style:{width:"12%"},children:Object(G.jsx)("source",{src:C,type:"video/mp4"})})}),Object(G.jsx)(b.a,{style:{fontSize:n?"10vw":"6vw",color:t.customization.themeText},children:"Ph\u1ea7n m\u1ec1m"}),Object(G.jsx)(b.a,{style:{fontSize:n?"10vw":"6vw",color:t.customization.themeText,marginBottom:20},children:"Qu\u1ea3n l\xfd b\xe1n l\u1ebb"}),Object(G.jsxs)(h.a,{container:!0,style:{marginBottom:40},direction:"row",children:[Object(G.jsx)(h.a,{container:!0,item:!0,xs:1,style:{marginRight:-10},children:Object(G.jsx)(j.a,{orientation:"vertical",flexItem:!0,style:{width:2,backgroundColor:"#ff906d"}})}),Object(G.jsx)(h.a,{container:!0,item:!0,xs:11,children:Object(G.jsx)(b.a,{style:{fontSize:14,color:t.customization.themeGreyText,paddingRight:50},children:"H\u1ed7 tr\u1ee3 b\u1ea1n t\u1ef1 \u0111\u1ed9ng h\xf3a quy tr\xecnh b\xe1n h\xe0ng t\u1eeb vi\u1ec7c qu\u1ea3n l\xfd t\u1ed3n kho, b\xe1n h\xe0ng, nh\xe2n s\u1ef1, nh\xe0 cung c\u1ea5p, kh\xe1ch h\xe0ng,... \u0110\u01a1n gi\u1ea3n, d\u1ec5 d\xf9ng, ti\u1ebft ki\u1ec7m chi ph\xed v\xe0 ph\xf9 h\u1ee3p v\u1edbi nhi\u1ec1u ng\xe0nh h\xe0ng kh\xe1c nhau. \u0110\u1ed3ng th\u1eddi, b\u1ea1n c\u0169ng c\xf3 th\u1ec3 t\u1ef1 t\u1ea1o trang web b\xe1n h\xe0ng online c\u1ee7a ri\xeang m\xecnh ch\u1ec9 v\u1edbi v\xe0i thao t\xe1c \u0111\u01a1n gi\u1ea3n."})})]}),Object(G.jsx)(m.a,{component:I.b,to:"/signup",children:Object(G.jsx)(E,{className:e.btnNav,variant:"contained",color:"secondary",style:{borderRadius:20,width:160},children:"D\xf9ng th\u1eed mi\u1ec5n ph\xed"})})]}),Object(G.jsx)(h.a,{container:!0,item:!0,xs:12,sm:6,justifyContent:"center",children:Object(G.jsx)("video",{loop:!0,autoPlay:!0,muted:!0,className:n?e.videosm:e.videoupsm,children:Object(G.jsx)("source",{src:w,type:"video/mp4"})})})]}),Object(G.jsx)(m.a,{style:{marginLeft:i?"15%":"10%",marginRight:i?"10%":"15%",marginTop:200},children:Object(G.jsxs)(h.a,{container:!0,justifyContent:"center",spacing:3,children:[Object(G.jsxs)(h.a,{xs:3,item:!0,container:!0,alignItems:"center",justifyContent:"center",children:[Object(G.jsx)(m.a,{component:"img",sx:{height:70,width:70,marginBottom:10},src:W.a}),Object(G.jsxs)(m.a,{style:{flexGrow:1,textAlign:"center"},children:[Object(G.jsx)(b.a,{variant:"h4",children:"Qu\u1ea3n l\xfd t\u1ed3n kho"}),Object(G.jsx)(b.a,{children:"Qu\u1ea3n l\xfd h\xe0ng theo thu\u1ed9c t\xednh (size, m\xe0u,...), qu\u1ea3n l\xfd theo l\xf4/ h\u1ea1n s\u1eed d\u1ee5ng"})]})]}),Object(G.jsxs)(h.a,{xs:3,item:!0,container:!0,alignItems:"center",justifyContent:"center",children:[Object(G.jsx)(m.a,{component:"img",sx:{height:70,width:70,marginBottom:10},src:z.a}),Object(G.jsxs)(m.a,{style:{flexGrow:1,textAlign:"center"},children:[Object(G.jsx)(b.a,{variant:"h4",children:"Qu\u1ea3n l\xfd b\xe1n h\xe0ng"}),Object(G.jsx)(b.a,{children:"B\xe1n h\xe0ng nhanh, theo d\xf5i c\xf4ng n\u1ee3, \xe1p d\u1ee5ng khuy\u1ebfn m\xe3i"})]})]}),Object(G.jsxs)(h.a,{xs:3,item:!0,container:!0,alignItems:"center",justifyContent:"center",children:[Object(G.jsx)(m.a,{component:"img",sx:{height:70,width:70,marginBottom:10},src:M.a}),Object(G.jsxs)(m.a,{style:{flexGrow:1,textAlign:"center"},children:[Object(G.jsx)(b.a,{variant:"h4",children:"Trang web b\xe1n h\xe0ng"}),Object(G.jsx)(b.a,{children:"H\u1ed7 tr\u1ee3 t\u1ea1o website b\xe1n h\xe0ng nhanh, ti\u1ebft ki\u1ec7m"})]})]}),Object(G.jsxs)(h.a,{xs:3,item:!0,container:!0,alignItems:"center",justifyContent:"center",children:[Object(G.jsx)(m.a,{component:"img",sx:{height:70,width:70,marginBottom:10},src:L.a}),Object(G.jsxs)(m.a,{style:{flexGrow:1,textAlign:"center"},children:[Object(G.jsx)(b.a,{variant:"h4",children:"T\u1ef1 \u0111\u1ed9ng ho\xe1"}),Object(G.jsx)(b.a,{children:"T\u1ef1 \u0111\u1ed9ng ho\xe1 c\u01a1 b\u1ea3n gi\xfap gi\u1ea3m thi\u1ec3u sai s\xf3t"})]})]})]})}),Object(G.jsxs)(h.a,{container:!0,justifyContent:"center",style:{backgroundColor:"#f3fdff",marginTop:150,justifyContent:"center",alignContent:"center"},children:[Object(G.jsx)(h.a,{item:!0,container:!0,xs:12,justifyContent:"center",children:Object(G.jsx)(b.a,{variant:"h2",style:{marginTop:40},children:"N\u1eafm b\u1eaft t\u1ed3n kho nhanh, b\u1ed5 sung h\xe0ng k\u1ecbp th\u1eddi."})}),Object(G.jsx)(h.a,{item:!0,container:!0,xs:12,justifyContent:"center",children:Object(G.jsx)(b.a,{style:{color:"#000",fontSize:16,marginTop:20,marginBottom:30,width:i?"90%":"70%"},children:"T\u1ed1i thi\u1ec3u th\u1ea5t tho\xe1t h\xe0ng h\xf3a nh\u1edd t\xednh n\u0103ng ki\u1ec3m kho ch\xednh x\xe1c. Qu\u1ea3n l\xfd s\u1ed1 l\u01b0\u1ee3ng xu\u1ea5t - nh\u1eadp - t\u1ed3n m\u1ed7i lo\u1ea1i h\xe0ng h\xf3a ch\xednh x\xe1c. C\u1ea3nh b\xe1o h\xe0ng s\u1eafp h\u1ebft, h\xe0ng t\u1ed3n nhi\u1ec1u... \u0111\u1ec3 b\u1ed5 sung ho\u1eb7c x\u1ea3 h\xe0ng k\u1ecbp th\u1eddi."})}),Object(G.jsx)(m.a,{component:"img",sx:{height:i?"90%":"70%",width:i?"90%":"70%",borderRadius:n?10:20},border:1,borderColor:S.a[400],src:R}),Object(G.jsx)(h.a,{item:!0,container:!0,xs:12,justifyContent:"center",children:Object(G.jsx)(b.a,{variant:"h2",style:{marginTop:40},children:"Thanh to\xe1n nhanh ch\xf3ng, in h\xf3a \u0111\u01a1n ti\u1ec7n l\u1ee3i"})}),Object(G.jsx)(h.a,{item:!0,container:!0,xs:12,justifyContent:"center",children:Object(G.jsx)(b.a,{style:{color:"#000",fontSize:16,marginTop:20,marginBottom:30,width:i?"90%":"70%"},children:"Qu\xe9t m\xe3 v\u1ea1ch t\xecm h\xe0ng nhanh, t\u1ef1 \u0111\u1ed9ng t\xednh ti\u1ec1n ch\xednh x\xe1c, k\u1ebft n\u1ed1i m\xe1y in h\xf3a \u0111\u01a1n ti\u1ec7n l\u1ee3i. T\u0103ng t\u1ed1c b\xe1n h\xe0ng, \u0111\u1ea3m b\u1ea3o ch\xednh x\xe1c, gi\u1ea3m thi\u1ec3u nh\u1ea7m l\u1eabn.              Qu\xe9t m\xe3 v\u1ea1ch t\xecm h\xe0ng nhanh, t\u1ef1 \u0111\u1ed9ng t\xednh ti\u1ec1n ch\xednh x\xe1c, k\u1ebft n\u1ed1i m\xe1y in h\xf3a \u0111\u01a1n ti\u1ec7n l\u1ee3i. T\u0103ng t\u1ed1c b\xe1n h\xe0ng, \u0111\u1ea3m b\u1ea3o ch\xednh x\xe1c, gi\u1ea3m thi\u1ec3u nh\u1ea7m l\u1eabn."})}),Object(G.jsx)(m.a,{component:"img",sx:{height:i?"90%":"70%",width:i?"90%":"70%",borderRadius:n?10:20},border:1,borderColor:S.a[400],src:B})]}),Object(G.jsx)(h.a,{children:Object(G.jsx)(y,{style:{backgroundColor:"#f3fdff",marginTop:150,justifyContent:"center"},children:Object(G.jsxs)(h.a,{container:!0,direction:"row",justifyContent:"center",alignItems:"center",children:[Object(G.jsx)(m.a,{component:"img",sx:{height:"22%",width:"22%",borderRadius:n?10:30,marginRight:15},border:1,borderColor:S.a[400],src:T}),Object(G.jsx)(m.a,{component:"img",sx:{height:"22%",width:"22%",borderRadius:n?10:30},border:1,borderColor:S.a[400],src:N})]})})}),Object(G.jsx)(h.a,{item:!0,container:!0,xs:12,justifyContent:"center",children:Object(G.jsx)(b.a,{variant:"h1",style:{marginTop:200,marginBottom:50},children:"Li\xean h\u1ec7"})}),Object(G.jsx)(m.a,{style:{marginLeft:n?10:150,marginRight:n?10:150},children:Object(G.jsxs)(h.a,{container:!0,justifyContent:"center",children:[Object(G.jsxs)(h.a,{item:!0,container:!0,style:{marginBottom:15},justifyContent:"space-between",children:[Object(G.jsxs)(h.a,{xs:8,children:[Object(G.jsx)(k.a,{label:"H\u1ecd v\xe0 t\xean",variant:"outlined",fullWidth:!0})," "]}),Object(G.jsxs)(h.a,{xs:4,children:[Object(G.jsx)(k.a,{label:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",variant:"outlined",fullWidth:!0})," "]})]}),Object(G.jsx)(k.a,{style:{marginBottom:15},label:"Email",variant:"outlined",fullWidth:!0}),Object(G.jsx)(k.a,{label:"N\u1ed9i dung",variant:"outlined",fullWidth:!0})]})}),Object(G.jsx)(h.a,{children:Object(G.jsx)(h.a,{direction:"row",children:Object(G.jsx)(m.a,{style:{backgroundColor:"#ff906d",marginTop:150},sx:{height:200}})})})]})]})}},748:function(t,e,n){"use strict";e.a=n.p+"static/media/invoice.95b01f1b.png"},749:function(t,e,n){"use strict";e.a=n.p+"static/media/inventory2.a79147b3.png"},750:function(t,e,n){"use strict";e.a=n.p+"static/media/inventoryOrder1.56a69882.png"},751:function(t,e,n){"use strict";e.a=n.p+"static/media/supplier4.a7432ad6.png"}}]);
//# sourceMappingURL=34.30370271.chunk.js.map