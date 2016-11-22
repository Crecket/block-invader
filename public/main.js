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
	var BlockInvader = new _Game2.default(800, 500);

/***/ },
/* 2 */
/*!*************************!*\
  !*** ./src/app/Game.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _CurrentPlayer = __webpack_require__(/*! ./CurrentPlayer */ 3);
	
	var _CurrentPlayer2 = _interopRequireDefault(_CurrentPlayer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // import Grid from './Grid'
	
	
	module.exports = function Game(width, height) {
	    var _this = this;
	
	    _classCallCheck(this, Game);
	
	    this.checkKeyStroke = function (e) {
	        e = e || window.event;
	
	        if (e.keyCode === 38 || e.keyCode === 87) {
	            // up arrow or w
	            _this.player.move('up');
	        } else if (e.keyCode === 40 || e.keyCode === 83) {
	            // down arrow or s
	            _this.player.move('down');
	        } else if (e.keyCode === 37 || e.keyCode === 65) {
	            // left arrow or a
	            _this.player.move('left');
	        } else if (e.keyCode === 39 || e.keyCode === 68) {
	            // right arrow or d
	            _this.player.move('right');
	        } else {}
	    };
	
	    this.checkScaleAlt = function (event) {
	        var widthScale = _this.width / window.innerWidth;
	        var heigthScale = _this.height / window.innerHeight;
	        var usedScale = heigthScale > widthScale ? heigthScale : widthScale;
	
	        // change the canvas size
	        _this.canvas.setHeight(_this.height / usedScale);
	        _this.canvas.setWidth(_this.width / usedScale);
	    };
	
	    this.screenResizeEvent = function () {
	        // change the canvas size
	        _this.canvas.setHeight(window.innerHeight);
	        _this.canvas.setWidth(window.innerWidth);
	
	        // center the player
	        _this.currentPlayer.setCenter();
	    };
	
	    this.width = width;
	    this.height = height;
	
	    // Create a new canvas element
	    this.canvas = new fabric.Canvas('canvas', {
	        width: width,
	        height: height,
	        selection: false,
	        hoverCursor: 'default',
	        scale: this.scale
	    });
	
	    // Keystroke handler
	    document.onkeydown = this.checkKeyStroke;
	
	    // Resize screen handler
	    $(window).on('resize', this.screenResizeEvent);
	
	    // Generate a current player
	    this.currentPlayer = new _CurrentPlayer2.default(this.canvas);
	
	    // Initial screen size check
	    this.screenResizeEvent();
	};

/***/ },
/* 3 */
/*!**********************************!*\
  !*** ./src/app/CurrentPlayer.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Player = __webpack_require__(/*! ./Player */ 4);
	
	var _Player2 = _interopRequireDefault(_Player);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function CurrentPlayer(canvas) {
	    var _this = this;
	
	    _classCallCheck(this, CurrentPlayer);
	
	    this.setCenter = function () {
	        _this.player.setPosition(_this.canvas.width / 2 - _this.player.width / 2, _this.canvas.height / 2 - _this.player.width / 2);
	    };
	
	    this.canvas = canvas;
	
	    this.player = new _Player2.default(-100, -100, this.canvas);
	
	    this.setCenter();
	};

/***/ },
/* 4 */
/*!***************************!*\
  !*** ./src/app/Player.js ***!
  \***************************/
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function Player(startX, startY, canvas) {
	    var _this = this;
	
	    _classCallCheck(this, Player);
	
	    this.update = function () {
	        _this.player.set({
	            left: _this.x,
	            top: _this.y,
	            radius: _this.radius,
	            fill: _this.properties.color
	        });
	    };
	
	    this.setPosition = function (x, y) {
	        _this.x = x;
	        _this.y = y;
	        _this.update();
	    };
	
	    this.setValue = function (key, value) {
	        _this.properties[key] = value;
	        _this.update();
	    };
	
	    this.generatePlayer = function () {
	        _this.player = new fabric.Circle({
	            left: _this.x,
	            top: _this.y,
	            fill: _this.properties.color,
	
	            radius: _this.radius,
	            hasControls: false,
	            hasBorders: false,
	            hasRotatingPoint: false,
	            lockMovementX: true,
	            lockMovementY: true,
	            selectable: false,
	            hoverCursor: 'default'
	        });
	        _this.canvas.add(_this.player);
	    };
	
	    this.x = startX;
	    this.y = startY;
	    this.canvas = canvas;
	    this.width = 32;
	    this.radius = this.width / 2;
	
	    this.properties = {
	        color: 'grey'
	    };
	
	    this.generatePlayer();
	}
	
	/**
	 * Update any changed values for this player object on the canvas
	 */
	
	
	/**
	 * Sets the player position to a new value
	 *
	 * @param x
	 * @param y
	 */
	
	
	/**
	 * Sets a property value
	 *
	 * @param key
	 * @param value
	 */
	
	
	/**
	 * Generate the initial player object on the canvas
	 */
	;

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map