/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/index.js":
/*!**********************!*\
  !*** ./app/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _iv_block_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./iv_block.js */ \"./app/iv_block.js\");\n//Main File\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvaW5kZXguanM/ZTkyNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvL01haW4gRmlsZVxuaW1wb3J0ICcuL2l2X2Jsb2NrLmpzJzsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./app/index.js\n");

/***/ }),

/***/ "./app/iv_block.js":
/*!*************************!*\
  !*** ./app/iv_block.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _iv_icons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./iv_icons.js */ \"./app/iv_icons.js\");\n\nvar registerBlockType = wp.blocks.registerBlockType;\nvar __ = wp.i18n.__;\nvar _wp$components = wp.components,\n    TextControl = _wp$components.TextControl,\n    ToggleControl = _wp$components.ToggleControl;\nvar _wp$blockEditor = wp.blockEditor,\n    RichText = _wp$blockEditor.RichText,\n    InspectorControls = _wp$blockEditor.InspectorControls;\n\nfunction YouTubeGetID(url) {\n  var ID = '';\n  url = url.replace(/(>|<)/gi, '').split(/(vi\\/|v=|\\/v\\/|youtu\\.be\\/|\\/embed\\/)/);\n\n  if (url[2] !== undefined) {\n    ID = url[2].split(/[^0-9a-z_\\-]/i);\n    ID = ID[0];\n  } else {\n    ID = url;\n  }\n\n  return ID;\n}\n\nregisterBlockType('iv/block', {\n  title: __('IV video', 'iv'),\n  description: __('Adds video with video comments.', 'iv'),\n  category: 'embed',\n  icon: _iv_icons_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].iv_black,\n  keywords: [__('Interactive Video', 'iv'), __('Video Comments', 'iv'), __('IV', 'iv')],\n  supports: {\n    html: false,\n    anchor: true\n  },\n  attributes: {\n    vidurl: {\n      type: 'string'\n    },\n    preloadc: {\n      type: 'boolean',\n      default: true\n    },\n    lazyloadv: {\n      type: 'boolean',\n      default: true\n    },\n    videoid: {\n      type: 'string'\n    },\n    anchor: {\n      type: 'string'\n    }\n  },\n  edit: function edit(_ref) {\n    var attributes = _ref.attributes,\n        setAttributes = _ref.setAttributes;\n    var vidurl = attributes.vidurl,\n        preloadc = attributes.preloadc,\n        lazyloadv = attributes.lazyloadv,\n        videoid = attributes.videoid,\n        anchor = attributes.anchor; // Define anchor if it doesn't exist\n\n    if (typeof anchor == 'undefined') setAttributes({\n      anchor: 'iv_' + Math.random().toString(36).substring(2, 6)\n    });\n    return wp.element.createElement(React.Fragment, null, wp.element.createElement(InspectorControls, null, wp.element.createElement(TextControl, {\n      label: \"Video URL\",\n      help: \"youtube.com/v=...\",\n      value: vidurl,\n      onChange: function onChange(val) {\n        setAttributes({\n          vidurl: val\n        });\n        setAttributes({\n          videoid: YouTubeGetID(val)\n        });\n      }\n    }), wp.element.createElement(ToggleControl, {\n      label: __('Preload comments', 'iv'),\n      checked: preloadc,\n      onChange: function onChange(val) {\n        setAttributes({\n          preloadc: val\n        });\n      }\n    }), wp.element.createElement(ToggleControl, {\n      label: __('Lazyload video', 'iv'),\n      checked: lazyloadv,\n      onChange: function onChange(val) {\n        setAttributes({\n          lazyloadv: val\n        });\n      }\n    })), wp.element.createElement(\"div\", null, wp.element.createElement(\"h2\", null, \"VC video\"), wp.element.createElement(\"ul\", null, wp.element.createElement(\"li\", null, \"Video URL: \", vidurl), wp.element.createElement(\"li\", null, \"Video ID: \", videoid), wp.element.createElement(\"li\", null, \"Anchor: \", anchor), wp.element.createElement(\"li\", null, \"Lazyloadc: \", String(preloadc)), wp.element.createElement(\"li\", null, \"Lazyloadv: \", String(lazyloadv)))));\n  },\n  save: function save(_ref2) {\n    var attributes = _ref2.attributes;\n    var videoid = attributes.videoid,\n        anchor = attributes.anchor,\n        preloadc = attributes.preloadc,\n        lazyloadv = attributes.lazyloadv;\n    var argstr = '';\n    if (anchor) argstr += ' embedid=\"' + anchor + '\"';\n    if (typeof lazyloadv !== 'undefined') argstr += ' lazyloadv=\"' + lazyloadv + '\"';\n    if (typeof preloadc !== 'undefined') argstr += ' preloadc=\"' + preloadc + '\"';\n    return '[ivvideo videoid=\"' + videoid + '\"' + argstr + ']' // \t\t\t<div>\n    // \t\t\t\t<h2>Inspector Control Fields</h2>\n    // \t\t\t\t<ul>\n    //                     <li>Video ID: { vidurl }</li>\n    //                     <li>Lazyloadc: { String(preloadc) }</li>\n    //                     <li>Lazyloadv: { String(preloadc) }</li>\n    //                 </ul>\n    // \t\t\t</div>\n    ;\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvaXZfYmxvY2suanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvaXZfYmxvY2suanM/NmU2OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXZfaWNvbnMgZnJvbSAnLi9pdl9pY29ucy5qcyc7XG52YXIgcmVnaXN0ZXJCbG9ja1R5cGUgPSB3cC5ibG9ja3MucmVnaXN0ZXJCbG9ja1R5cGU7XG52YXIgX18gPSB3cC5pMThuLl9fO1xudmFyIF93cCRjb21wb25lbnRzID0gd3AuY29tcG9uZW50cyxcbiAgICBUZXh0Q29udHJvbCA9IF93cCRjb21wb25lbnRzLlRleHRDb250cm9sLFxuICAgIFRvZ2dsZUNvbnRyb2wgPSBfd3AkY29tcG9uZW50cy5Ub2dnbGVDb250cm9sO1xudmFyIF93cCRibG9ja0VkaXRvciA9IHdwLmJsb2NrRWRpdG9yLFxuICAgIFJpY2hUZXh0ID0gX3dwJGJsb2NrRWRpdG9yLlJpY2hUZXh0LFxuICAgIEluc3BlY3RvckNvbnRyb2xzID0gX3dwJGJsb2NrRWRpdG9yLkluc3BlY3RvckNvbnRyb2xzO1xuXG5mdW5jdGlvbiBZb3VUdWJlR2V0SUQodXJsKSB7XG4gIHZhciBJRCA9ICcnO1xuICB1cmwgPSB1cmwucmVwbGFjZSgvKD58PCkvZ2ksICcnKS5zcGxpdCgvKHZpXFwvfHY9fFxcL3ZcXC98eW91dHVcXC5iZVxcL3xcXC9lbWJlZFxcLykvKTtcblxuICBpZiAodXJsWzJdICE9PSB1bmRlZmluZWQpIHtcbiAgICBJRCA9IHVybFsyXS5zcGxpdCgvW14wLTlhLXpfXFwtXS9pKTtcbiAgICBJRCA9IElEWzBdO1xuICB9IGVsc2Uge1xuICAgIElEID0gdXJsO1xuICB9XG5cbiAgcmV0dXJuIElEO1xufVxuXG5yZWdpc3RlckJsb2NrVHlwZSgnaXYvYmxvY2snLCB7XG4gIHRpdGxlOiBfXygnSVYgdmlkZW8nLCAnaXYnKSxcbiAgZGVzY3JpcHRpb246IF9fKCdBZGRzIHZpZGVvIHdpdGggdmlkZW8gY29tbWVudHMuJywgJ2l2JyksXG4gIGNhdGVnb3J5OiAnZW1iZWQnLFxuICBpY29uOiBpdl9pY29ucy5pdl9ibGFjayxcbiAga2V5d29yZHM6IFtfXygnSW50ZXJhY3RpdmUgVmlkZW8nLCAnaXYnKSwgX18oJ1ZpZGVvIENvbW1lbnRzJywgJ2l2JyksIF9fKCdJVicsICdpdicpXSxcbiAgc3VwcG9ydHM6IHtcbiAgICBodG1sOiBmYWxzZSxcbiAgICBhbmNob3I6IHRydWVcbiAgfSxcbiAgYXR0cmlidXRlczoge1xuICAgIHZpZHVybDoge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9LFxuICAgIHByZWxvYWRjOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBsYXp5bG9hZHY6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuICAgIHZpZGVvaWQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfSxcbiAgICBhbmNob3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgfVxuICB9LFxuICBlZGl0OiBmdW5jdGlvbiBlZGl0KF9yZWYpIHtcbiAgICB2YXIgYXR0cmlidXRlcyA9IF9yZWYuYXR0cmlidXRlcyxcbiAgICAgICAgc2V0QXR0cmlidXRlcyA9IF9yZWYuc2V0QXR0cmlidXRlcztcbiAgICB2YXIgdmlkdXJsID0gYXR0cmlidXRlcy52aWR1cmwsXG4gICAgICAgIHByZWxvYWRjID0gYXR0cmlidXRlcy5wcmVsb2FkYyxcbiAgICAgICAgbGF6eWxvYWR2ID0gYXR0cmlidXRlcy5sYXp5bG9hZHYsXG4gICAgICAgIHZpZGVvaWQgPSBhdHRyaWJ1dGVzLnZpZGVvaWQsXG4gICAgICAgIGFuY2hvciA9IGF0dHJpYnV0ZXMuYW5jaG9yOyAvLyBEZWZpbmUgYW5jaG9yIGlmIGl0IGRvZXNuJ3QgZXhpc3RcblxuICAgIGlmICh0eXBlb2YgYW5jaG9yID09ICd1bmRlZmluZWQnKSBzZXRBdHRyaWJ1dGVzKHtcbiAgICAgIGFuY2hvcjogJ2l2XycgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgNilcbiAgICB9KTtcbiAgICByZXR1cm4gd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoSW5zcGVjdG9yQ29udHJvbHMsIG51bGwsIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChUZXh0Q29udHJvbCwge1xuICAgICAgbGFiZWw6IFwiVmlkZW8gVVJMXCIsXG4gICAgICBoZWxwOiBcInlvdXR1YmUuY29tL3Y9Li4uXCIsXG4gICAgICB2YWx1ZTogdmlkdXJsLFxuICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHZhbCkge1xuICAgICAgICBzZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICB2aWR1cmw6IHZhbFxuICAgICAgICB9KTtcbiAgICAgICAgc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgdmlkZW9pZDogWW91VHViZUdldElEKHZhbClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSksIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChUb2dnbGVDb250cm9sLCB7XG4gICAgICBsYWJlbDogX18oJ1ByZWxvYWQgY29tbWVudHMnLCAnaXYnKSxcbiAgICAgIGNoZWNrZWQ6IHByZWxvYWRjLFxuICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHZhbCkge1xuICAgICAgICBzZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICBwcmVsb2FkYzogdmFsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoVG9nZ2xlQ29udHJvbCwge1xuICAgICAgbGFiZWw6IF9fKCdMYXp5bG9hZCB2aWRlbycsICdpdicpLFxuICAgICAgY2hlY2tlZDogbGF6eWxvYWR2LFxuICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIG9uQ2hhbmdlKHZhbCkge1xuICAgICAgICBzZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICBsYXp5bG9hZHY6IHZhbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSksIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiLCBudWxsLCBcIlZDIHZpZGVvXCIpLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIlZpZGVvIFVSTDogXCIsIHZpZHVybCksIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFwiVmlkZW8gSUQ6IFwiLCB2aWRlb2lkKSwgd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgXCJBbmNob3I6IFwiLCBhbmNob3IpLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkxhenlsb2FkYzogXCIsIFN0cmluZyhwcmVsb2FkYykpLCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBcIkxhenlsb2FkdjogXCIsIFN0cmluZyhsYXp5bG9hZHYpKSkpKTtcbiAgfSxcbiAgc2F2ZTogZnVuY3Rpb24gc2F2ZShfcmVmMikge1xuICAgIHZhciBhdHRyaWJ1dGVzID0gX3JlZjIuYXR0cmlidXRlcztcbiAgICB2YXIgdmlkZW9pZCA9IGF0dHJpYnV0ZXMudmlkZW9pZCxcbiAgICAgICAgYW5jaG9yID0gYXR0cmlidXRlcy5hbmNob3IsXG4gICAgICAgIHByZWxvYWRjID0gYXR0cmlidXRlcy5wcmVsb2FkYyxcbiAgICAgICAgbGF6eWxvYWR2ID0gYXR0cmlidXRlcy5sYXp5bG9hZHY7XG4gICAgdmFyIGFyZ3N0ciA9ICcnO1xuICAgIGlmIChhbmNob3IpIGFyZ3N0ciArPSAnIGVtYmVkaWQ9XCInICsgYW5jaG9yICsgJ1wiJztcbiAgICBpZiAodHlwZW9mIGxhenlsb2FkdiAhPT0gJ3VuZGVmaW5lZCcpIGFyZ3N0ciArPSAnIGxhenlsb2Fkdj1cIicgKyBsYXp5bG9hZHYgKyAnXCInO1xuICAgIGlmICh0eXBlb2YgcHJlbG9hZGMgIT09ICd1bmRlZmluZWQnKSBhcmdzdHIgKz0gJyBwcmVsb2FkYz1cIicgKyBwcmVsb2FkYyArICdcIic7XG4gICAgcmV0dXJuICdbaXZ2aWRlbyB2aWRlb2lkPVwiJyArIHZpZGVvaWQgKyAnXCInICsgYXJnc3RyICsgJ10nIC8vIFx0XHRcdDxkaXY+XG4gICAgLy8gXHRcdFx0XHQ8aDI+SW5zcGVjdG9yIENvbnRyb2wgRmllbGRzPC9oMj5cbiAgICAvLyBcdFx0XHRcdDx1bD5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIDxsaT5WaWRlbyBJRDogeyB2aWR1cmwgfTwvbGk+XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICA8bGk+TGF6eWxvYWRjOiB7IFN0cmluZyhwcmVsb2FkYykgfTwvbGk+XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICA8bGk+TGF6eWxvYWR2OiB7IFN0cmluZyhwcmVsb2FkYykgfTwvbGk+XG4gICAgLy8gICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgLy8gXHRcdFx0PC9kaXY+XG4gICAgO1xuICB9XG59KTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./app/iv_block.js\n");

/***/ }),

/***/ "./app/iv_icons.js":
/*!*************************!*\
  !*** ./app/iv_icons.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar iv_icons = {\n  iv_black: wp.element.createElement(\"svg\", {\n    xmlns: \"http://www.w3.org/2000/svg\",\n    width: \"20\",\n    height: \"20\",\n    version: \"1.1\",\n    viewBox: \"0 0 20 20\"\n  }, wp.element.createElement(\"g\", {\n    transform: \"matrix(.61022 0 0 .61022 -96.31 -233.17)\"\n  }, wp.element.createElement(\"g\", {\n    style: {\n      lineHeight: \"125%\"\n    },\n    fill: \"#000\",\n    fillOpacity: \"1\",\n    stroke: \"none\",\n    strokeLinecap: \"butt\",\n    strokeLinejoin: \"miter\",\n    strokeOpacity: \"1\",\n    strokeWidth: \"1\",\n    fontFamily: \"sans-serif\",\n    fontSize: \"40\",\n    fontStyle: \"normal\",\n    fontWeight: \"normal\",\n    letterSpacing: \"0\",\n    wordSpacing: \"0\"\n  }, wp.element.createElement(\"path\", {\n    d: \"M166.504 404.096h-.08l-3.6-20.04h-4.88l6.04 28.88h4.96l6.04-28.88h-4.88l-3.6 20.04z\"\n  }), wp.element.createElement(\"path\", {\n    d: \"M190.49 393.696v-2.12q0-1.6-.48-3.04-.44-1.44-1.36-2.52-.88-1.08-2.28-1.72-1.4-.64-3.24-.64-1.96 0-3.4.6-1.4.56-2.36 1.56-.92 1-1.4 2.36-.44 1.36-.44 2.88v14.88q0 1.52.44 2.88.48 1.36 1.4 2.36.96 1 2.36 1.6 1.44.56 3.4.56 1.84 0 3.24-.56 1.4-.6 2.28-1.6.92-1 1.36-2.36.48-1.36.48-2.88v-3.32h-4.96v3.48q0 1.4-.52 2.16-.52.76-1.88.76-1.52 0-2.08-.76-.56-.8-.56-2.44v-14.64q0-1.64.56-2.4.56-.8 2.08-.8.96 0 1.68.84.72.8.72 2.64v2.24h4.96z\"\n  }))))\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (iv_icons);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcHAvaXZfaWNvbnMuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hcHAvaXZfaWNvbnMuanM/MjZlOSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXZfaWNvbnMgPSB7XG4gIGl2X2JsYWNrOiB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdmdcIiwge1xuICAgIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgd2lkdGg6IFwiMjBcIixcbiAgICBoZWlnaHQ6IFwiMjBcIixcbiAgICB2ZXJzaW9uOiBcIjEuMVwiLFxuICAgIHZpZXdCb3g6IFwiMCAwIDIwIDIwXCJcbiAgfSwgd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFwiZ1wiLCB7XG4gICAgdHJhbnNmb3JtOiBcIm1hdHJpeCguNjEwMjIgMCAwIC42MTAyMiAtOTYuMzEgLTIzMy4xNylcIlxuICB9LCB3cC5lbGVtZW50LmNyZWF0ZUVsZW1lbnQoXCJnXCIsIHtcbiAgICBzdHlsZToge1xuICAgICAgbGluZUhlaWdodDogXCIxMjUlXCJcbiAgICB9LFxuICAgIGZpbGw6IFwiIzAwMFwiLFxuICAgIGZpbGxPcGFjaXR5OiBcIjFcIixcbiAgICBzdHJva2U6IFwibm9uZVwiLFxuICAgIHN0cm9rZUxpbmVjYXA6IFwiYnV0dFwiLFxuICAgIHN0cm9rZUxpbmVqb2luOiBcIm1pdGVyXCIsXG4gICAgc3Ryb2tlT3BhY2l0eTogXCIxXCIsXG4gICAgc3Ryb2tlV2lkdGg6IFwiMVwiLFxuICAgIGZvbnRGYW1pbHk6IFwic2Fucy1zZXJpZlwiLFxuICAgIGZvbnRTaXplOiBcIjQwXCIsXG4gICAgZm9udFN0eWxlOiBcIm5vcm1hbFwiLFxuICAgIGZvbnRXZWlnaHQ6IFwibm9ybWFsXCIsXG4gICAgbGV0dGVyU3BhY2luZzogXCIwXCIsXG4gICAgd29yZFNwYWNpbmc6IFwiMFwiXG4gIH0sIHdwLmVsZW1lbnQuY3JlYXRlRWxlbWVudChcInBhdGhcIiwge1xuICAgIGQ6IFwiTTE2Ni41MDQgNDA0LjA5NmgtLjA4bC0zLjYtMjAuMDRoLTQuODhsNi4wNCAyOC44OGg0Ljk2bDYuMDQtMjguODhoLTQuODhsLTMuNiAyMC4wNHpcIlxuICB9KSwgd3AuZWxlbWVudC5jcmVhdGVFbGVtZW50KFwicGF0aFwiLCB7XG4gICAgZDogXCJNMTkwLjQ5IDM5My42OTZ2LTIuMTJxMC0xLjYtLjQ4LTMuMDQtLjQ0LTEuNDQtMS4zNi0yLjUyLS44OC0xLjA4LTIuMjgtMS43Mi0xLjQtLjY0LTMuMjQtLjY0LTEuOTYgMC0zLjQuNi0xLjQuNTYtMi4zNiAxLjU2LS45MiAxLTEuNCAyLjM2LS40NCAxLjM2LS40NCAyLjg4djE0Ljg4cTAgMS41Mi40NCAyLjg4LjQ4IDEuMzYgMS40IDIuMzYuOTYgMSAyLjM2IDEuNiAxLjQ0LjU2IDMuNC41NiAxLjg0IDAgMy4yNC0uNTYgMS40LS42IDIuMjgtMS42LjkyLTEgMS4zNi0yLjM2LjQ4LTEuMzYuNDgtMi44OHYtMy4zMmgtNC45NnYzLjQ4cTAgMS40LS41MiAyLjE2LS41Mi43Ni0xLjg4Ljc2LTEuNTIgMC0yLjA4LS43Ni0uNTYtLjgtLjU2LTIuNDR2LTE0LjY0cTAtMS42NC41Ni0yLjQuNTYtLjggMi4wOC0uOC45NiAwIDEuNjguODQuNzIuOC43MiAyLjY0djIuMjRoNC45NnpcIlxuICB9KSkpKVxufTtcbmV4cG9ydCBkZWZhdWx0IGl2X2ljb25zOyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./app/iv_icons.js\n");

/***/ })

/******/ });