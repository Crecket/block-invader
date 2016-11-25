"use strict";

import Game from './Game'

console.info("App is using ", PRODUCTION_MODE ? "Production Mode" : "Development Mode");

// Create a new game
let BlockInvader = new Game(800, 500);

