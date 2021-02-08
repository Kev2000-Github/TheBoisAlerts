"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("./routes");
const router = express_1.Router();
router.use('/', routes_1.routes);
exports.default = router;
