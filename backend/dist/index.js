"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
(0, database_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port : ${PORT}`);
    });
})
    .catch((error) => {
    console.log("MongoDB connection failed!\n", error);
    process.exit(1);
});
