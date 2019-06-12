"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
exports.uri = `mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.APP_NAME}`;
//# sourceMappingURL=config.js.map