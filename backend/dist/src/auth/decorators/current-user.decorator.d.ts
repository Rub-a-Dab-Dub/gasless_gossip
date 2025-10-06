export interface CurrentUserData {
    id: string;
    username: string;
    email: string;
    roles?: string[];
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof CurrentUserData | undefined)[]) => ParameterDecorator;
