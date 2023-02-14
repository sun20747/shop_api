import HttpStatus = require('http-status-codes');
import * as Sentry from "@sentry/node";

// ## สำหรับ ApiResponse Json
export class ApiResponse<T>{
    code: number;
    message: string;
    message_friendly: string;
    data: T;

    constructor();
    constructor(code: number);
    constructor(code: number, message: string);
    constructor(code: number, message: string, data?: T);
    constructor(code?: number, message?: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static Create<T>(code?: number, message?: string, data?: T) {
        return new ApiResponse<T>(code, message, data);
    }

    static Ok<T>(data?: T) {
        return new ApiResponse<T>(1, 'OK', data);
    }

    static PostOk<T>(data?: T) {
        return new ApiResponse<T>(1, 'OK', data);
    }

    static sendInternalError<T>(res, message?: string, data?: T) {
        Sentry.captureException(data)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.Create(0, message, data));
    }

    static sendBadRequest<T>(res, code?: number, errorMessage?: string) {
        return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.Create(0, errorMessage));
    }

    static sendNoContent<T>(res) {
        return res.status(HttpStatus.NO_CONTENT).json();
    }

    static sendUnauthorized<T>(res, message?: string) {
        return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.Create(0, message));
    }

    static sendOkCreated<T>(res, message?: string, data?: T) {
        if (!message) message = 'OK';
        return res.status(HttpStatus.CREATED).json(ApiResponse.Create(1, message, data));
    }

    static sendOk<T>(res, message?: string, data?: T) {
        if (!message) message = 'OK';
        return res.status(HttpStatus.OK).json(ApiResponse.Create(1, message, data));
    }

    static Created<T>(res, message?: string, data?: T) {
        if (!message) message = 'OK';
        return res.status(HttpStatus.CREATED).json(ApiResponse.Create(1, message, data));
    }
}

export class PagableData<T> {
    total_items: number;
    total_pages: number;
    page_size: number;
    data: T;
}
