(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{160:function(e,t,r){},161:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(20),s=r.n(o);r(95),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=r(14),c=r(21),l=r(23),u=r(22),d=r(24),h=(r(96),r(11)),m=r.n(h),g=r(25),p=r(47),f=function(e){function t(e){var r;return Object(i.a)(this,t),(r=Object(l.a)(this,Object(u.a)(t).call(this,e))).isDownloading=void 0,r.IMAGE_WIDTH=void 0,r.IMAGE_HEIGHT=void 0,r.COLUMN_WIDTH=void 0,r.GUTTER=0,r.resetChildState=function(){r.setState({items:new Map,lastId:0,pageNumber:1,columnCount:4}),r.isDownloading=!1,r.getNewPage()},r.calculateRowCount=function(){var e=Math.floor(r.state.items.size/r.state.columnCount);return console.log("Row count calcuated as: "+e),console.log("Number of items: "+r.state.items.size+"columnCount: "+r.state.columnCount),e},r.stateAddPageItems=function(){var e=Object(g.a)(m.a.mark(function e(t){var n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object.assign({},r.state),t.forEach(function(e){n.items.set(n.lastId,e),n.lastId++}),n.pageNumber++,e.next=5,r.setState(n);case 5:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),r.getNewPage=Object(g.a)(m.a.mark(function e(){var t;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r.isDownloading=!0,e.next=3,r.props.galleryAPI.getGalleryItems(r.state.pageNumber,r.props.sortOrder);case 3:return t=e.sent,e.next=6,r.stateAddPageItems(t);case 6:r.isDownloading=!1;case 7:case"end":return e.stop()}},e)})),r.onResize=function(e){var t=e.width;r.setColumnCount(r.calculateColumnCount(t))},r.cellRenderer=function(e){var t=e.rowIndex*r.state.columnCount+e.columnIndex;console.log("key: "+e.key+" index: "+t);var n=r.state.items,o=n.get(t);if("object"!==typeof o)throw console.log("Items: "),console.log(n),new Error("Missing item");return a.a.createElement("a",{href:o.itemURL},a.a.createElement("img",{key:e.key,style:e.style,width:r.IMAGE_WIDTH,height:r.IMAGE_HEIGHT,src:o.thumbnailImageURL}))},r.calculateColumnCount=function(e){var t=Math.floor((e+r.GUTTER)/(r.COLUMN_WIDTH+r.GUTTER));return t>0?t:1},r.generateItem=Object(g.a)(m.a.mark(function e(){var t;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=Object.assign({},r.state),console.log("Previous last id: "),console.log(t.lastId),t.lastId=t.lastId+1,e.next=6,r.setState(t);case 6:return console.log("Newlast id: "),console.log(t.lastId),e.abrupt("return",{id:t.lastId,thumbnailImageURL:"https://cdnb.artstation.com/p/assets/covers/images/017/685/915/micro_square/timo-peter-artstation-title-image.jpg?1556957002",itemURL:"https://www.artstation.com"});case 9:case"end":return e.stop()}},e)})),r.stateAddItem=function(){var e=Object(g.a)(m.a.mark(function e(t){var n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return(n=Object.assign({},r.state)).items.set(t.id,t),e.next=4,r.setState(n);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),r.onScroll=function(){var e=Object(g.a)(m.a.mark(function e(t){var n;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r.isDownloading){e.next=2;break}return e.abrupt("return");case 2:if(1,n=1*t.clientHeight,!(t.scrollTop+t.clientHeight>=t.scrollHeight-n)){e.next=8;break}return console.log("Getting new page"),e.next=8,r.getNewPage();case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),r.render=function(){return a.a.createElement(p.c,{scrollElement:window},function(e){var t=e.height,n=(e.isScrolling,e.onChildScroll,e.scrollTop);return a.a.createElement("div",null,a.a.createElement(p.a,{id:"autosizer",onResize:r.onResize,disableHeight:!0},function(e){var o=e.width;return a.a.createElement(p.b,{columnCount:r.state.columnCount,cellRenderer:r.cellRenderer,height:t,width:o,rowHeight:r.IMAGE_HEIGHT,rowCount:r.calculateRowCount(),columnWidth:r.IMAGE_WIDTH,onScroll:r.onScroll,autoHeight:!0,scrollTop:n})}))})},r.isDownloading=!1,r.state={items:new Map,lastId:0,pageNumber:1,columnCount:4},r.IMAGE_HEIGHT=t.calculatePixelValue(200),r.IMAGE_WIDTH=t.calculatePixelValue(200),r.COLUMN_WIDTH=t.calculatePixelValue(200),r}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(e,t){this.props.sortOrder!==e.sortOrder&&this.resetChildState()}},{key:"setColumnCount",value:function(e){var t=Object.assign([],this.state);t.columnCount=e,this.setState(t)}}]),t}(a.a.Component);f.calculatePixelValue=function(e){var t=window.devicePixelRatio||1;return t>1&&(t*=.6),Math.floor(e/t)};var v,w=function(e){function t(e){var r;return Object(i.a)(this,t),(r=Object(l.a)(this,Object(u.a)(t).call(this,e))).handleChange=function(e){r.setState({value:e.target.value}),r.props.changeSortOrder(e.target.value)},r.render=function(){return a.a.createElement("div",{id:"options-bar"},a.a.createElement("label",{htmlFor:"sortOrderSelector"},"Sort Order "),a.a.createElement("select",{id:"sortOrderSelector",value:r.state.value,onChange:r.handleChange},r.props.sortingOptions.map(function(e,t){return a.a.createElement("option",{key:t,value:e},e)})))},r.state={value:e.defaultSortOrder,selectedSorting:0},r}return Object(d.a)(t,e),t}(a.a.PureComponent),O=(r(160),function(e){function t(e){var r;return Object(i.a)(this,t),(r=Object(l.a)(this,Object(u.a)(t).call(this,e))).hide=function(){var e=Object.assign({},r.state);e.visible=!1,r.setState(e)},r.state={visible:!1,hasError:!1,lastError:""},r}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;window.addEventListener("error",function(t){return e.logError(t.error.message),!1}),window.addEventListener("unhandledrejection",function(t){e.logError(t.reason.message)})}},{key:"logError",value:function(e){return this.setState({visible:!0,hasError:!0,lastError:e}),console.log("React caught an error: "),console.log(e),!0}},{key:"render",value:function(){return this.state.hasError&&this.state.visible?a.a.createElement("div",{id:"error-message-container"},a.a.createElement("div",{id:"error-message"},a.a.createElement("a",{onClick:this.hide},"X"),a.a.createElement("h5",null,"An error has occurred:"),a.a.createElement("code",null,this.state.lastError))):""}}]),t}(a.a.Component));!function(e){e.TRENDING="trending",e.LATEST="latest",e.PICKS="picks",e.POPULARITY="popularity"}(v||(v={}));var E=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"https://cors-anywhere.herokuapp.com/https://www.artstation.com";Object(i.a)(this,e),this.AVAILABLE_SORT_ORDERS=[v.TRENDING,v.LATEST,v.PICKS,v.POPULARITY],this.baseURL=void 0,this.baseURL=t}return Object(c.a)(e,[{key:"isValidSortOrder",value:function(e){return void 0!==this.AVAILABLE_SORT_ORDERS.find(function(t){return t===e})}},{key:"getGalleryItems",value:function(){var e=Object(g.a)(m.a.mark(function e(t,r){var n,a,o,s,i,c;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(this.isValidSortOrder(r)){e.next=2;break}throw new Error("Invalid sort order: "+r);case 2:return n={mode:"cors"},a="".concat(this.baseURL,"/projects.json?page=").concat(t,"&sorting=").concat(r),e.next=6,fetch(a,n);case 6:return o=e.sent,e.next=9,o.json();case 9:return s=e.sent,i=s.data,c=i.map(function(e){return{id:e.id,itemURL:e.permalink,thumbnailImageURL:e.cover.micro_square_image_url}}),e.abrupt("return",c);case 13:case"end":return e.stop()}},e,this)}));return function(t,r){return e.apply(this,arguments)}}()}]),e}(),b=function(e){function t(e){var r;return Object(i.a)(this,t),(r=Object(l.a)(this,Object(u.a)(t).call(this,e))).galleryAPI=void 0,r.changeSortOrder=function(e){r.setState({sortOrder:e})},r.galleryAPI=new E,r.state={sortOrder:v.TRENDING},r}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return a.a.createElement("div",{className:"App"},a.a.createElement(w,{changeSortOrder:this.changeSortOrder,defaultSortOrder:this.state.sortOrder,sortingOptions:this.galleryAPI.AVAILABLE_SORT_ORDERS}),a.a.createElement(O,null),a.a.createElement(f,{galleryAPI:this.galleryAPI,sortOrder:this.state.sortOrder}))}}]),t}(a.a.PureComponent);s.a.render(a.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},90:function(e,t,r){e.exports=r(161)},95:function(e,t,r){},96:function(e,t,r){}},[[90,1,2]]]);
//# sourceMappingURL=main.868f5232.chunk.js.map