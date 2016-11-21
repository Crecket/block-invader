/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** multi main ***!
  \******************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! C:\Dropbox\UwAmp\www\block-invader\src/app.js */1);


/***/ },
/* 1 */
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Game = __webpack_require__(/*! ./app/Game */ 2);
	
	var _Game2 = _interopRequireDefault(_Game);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Create a new game
	var BlockInvader = new _Game2.default();

/***/ },
/* 2 */
/*!*************************!*\
  !*** ./src/app/Game.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Grid = __webpack_require__(/*! ./Grid.js */ 3);
	
	var _Grid2 = _interopRequireDefault(_Grid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function Game() {
	    var _this = this;
	
	    _classCallCheck(this, Game);
	
	    this.setEventListeners = function () {
	        _this.canvas.on('mouse:over', _this.objectOnMouseOver);
	        _this.canvas.on('mouse:out', _this.objectOnMouseOut);
	    };
	
	    this.objectOnMouseOver = function (e) {
	        if (e.target) {
	            e.target.animate('angle', 5, {
	                duration: 500,
	                onChange: _this.canvas.renderAll.bind(_this.canvas),
	                easing: fabric.util.ease.easeOutBounce
	            });
	            _this.canvas.renderAll();
	        }
	    };
	
	    this.objectOnMouseOut = function (e) {
	        if (e.target) {
	            e.target.animate('angle', 0, {
	                duration: 500,
	                onChange: _this.canvas.renderAll.bind(_this.canvas),
	                easing: fabric.util.ease.easeOutBounce
	            });
	            _this.canvas.renderAll();
	        }
	    };
	
	    // Create a new canvas element
	    this.canvas = new fabric.Canvas('canvas', {
	        width: 500,
	        height: 500,
	        selection: false,
	        hoverCursor: 'pointer'
	    });
	
	    // Generate a grid
	    this.grid = new _Grid2.default(10, 10, this.canvas);
	
	    // set the event listeners
	    this.setEventListeners();
	};

/***/ },
/* 3 */
/*!*************************!*\
  !*** ./src/app/Grid.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _GridSquare = __webpack_require__(/*! ./GridSquare.js */ 4);
	
	var _GridSquare2 = _interopRequireDefault(_GridSquare);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function Grid(xBlocks, yBlocks, canvas) {
	        var _this = this;
	
	        _classCallCheck(this, Grid);
	
	        this.generateGrid = function () {
	
	                // set the initial X coord
	                var currentX = _this.padding;
	
	                // Loop through all X colls
	                for (var x = 0; x < _this.xBlocks; x++) {
	
	                        // reset Y for this x row
	                        var currentY = _this.padding;
	
	                        // Loop through all Y rows
	                        for (var y = 0; y < _this.yBlocks; y++) {
	
	                                // create a new gridsquare
	                                var rect = new _GridSquare2.default(currentX, currentY, _this.blockWidth, _this.blockHeight, _this.canvas);
	
	                                // add to the list
	                                _this.gridSquares.push(rect);
	
	                                // update the Y coordinate
	                                currentY = currentY + (_this.blockPadding + _this.blockHeight);
	                        }
	
	                        // Reset Y again to go to next coll
	                        currentY = _this.padding;
	
	                        // Go to next coll
	                        currentX = currentX + (_this.blockPadding + _this.blockWidth);
	                }
	        };
	
	        this.xBlocks = xBlocks;
	        this.yBlocks = yBlocks;
	        this.canvas = canvas;
	
	        // some settings
	        this.padding = 5;
	        this.blockPadding = 5;
	
	        // contains all the squares as GridSquare object
	        this.gridSquares = [];
	
	        this.blockWidth = (this.canvas.width - this.padding * 2 - (this.xBlocks - 1) * this.blockPadding) / this.xBlocks;
	        this.blockHeight = (this.canvas.height - this.padding * 2 - (this.yBlocks - 1) * this.blockPadding) / this.yBlocks;
	
	        this.generateGrid();
	};

/***/ },
/* 4 */
/*!*******************************!*\
  !*** ./src/app/GridSquare.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function Grid(x, y, blockWidth, blockHeight, canvas) {
	    var _this = this;
	
	    _classCallCheck(this, Grid);
	
	    this.createRect = function () {
	        // create a new rect
	        _this.rect = new fabric.Rect({
	            left: _this.x,
	            top: _this.y,
	            width: _this.blockWidth,
	            height: _this.blockHeight,
	
	            hasControls: false,
	            hasBorders: false,
	            hasRotatingPoint: false,
	            lockMovementX: true,
	            lockMovementY: true,
	            fill: 'grey'
	        });
	
	        // add the rect to the canvas
	        _this.canvas.add(_this.rect);
	    };
	
	    this.x = x;
	    this.y = y;
	    this.blockWidth = blockWidth;
	    this.blockHeight = blockHeight;
	    this.canvas = canvas;
	    this.rect = false;
	
	    // create a new rect
	    this.createRect();
	
	    // return the rect
	    return this.rect;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map