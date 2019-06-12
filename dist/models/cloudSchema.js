"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const CloudSchema = new Schema({
    cloudIp: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    files: [],
});
exports.default = mongoose_1.default.model("Cloud", CloudSchema);
//# sourceMappingURL=cloudSchema.js.map