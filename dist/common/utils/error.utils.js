"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestExcepation = exports.ConflictExcepation = exports.UnAutorizedExcepation = exports.NotFoundExcepation = void 0;
class NotFoundExcepation extends Error {
    constructor(message) {
        super(message, { cause: 404 });
    }
}
exports.NotFoundExcepation = NotFoundExcepation;
class UnAutorizedExcepation extends Error {
    constructor(message) {
        super(message, { cause: 401 });
    }
}
exports.UnAutorizedExcepation = UnAutorizedExcepation;
class ConflictExcepation extends Error {
    constructor(message) {
        super(message, { cause: 409 });
    }
}
exports.ConflictExcepation = ConflictExcepation;
//  interface IDetails{
//     path:string,
//     message:string
//  }
class BadRequestExcepation extends Error {
    details;
    constructor(message, details) {
        super(message, { cause: 400 });
        this.details = details;
    }
}
exports.BadRequestExcepation = BadRequestExcepation;
