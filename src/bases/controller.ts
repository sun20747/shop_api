import { validateSync, Length, validate, validateOrReject, ValidationError, ValidatorOptions } from 'class-validator';

export abstract class ApiControllerBase {
    constructor() { }

    /**
     * ### === HOW TO USE ===
     * ```
     *   this.mapBody(SeachUsersRequest, req.body);
     * ```
     * @param type Class Model
     * @param reqBody Express.Request.Body
     */
    mapBody = <T>(type: (new () => T), reqBody: any): T => {
        return Object.assign(new type(), reqBody);
    }

    checkBodyAsync = async (body: any, validatorOptions?: ValidatorOptions): Promise<{ validated: boolean, errorMessage?: string }> => {
        try {
            await validateOrReject(body, validatorOptions);
            return { validated: true }
        }
        catch (err) {
            let msg = Object.values(err[0].constraints)[0] as string;
            return { validated: false, errorMessage: msg };
        }
    }
}
