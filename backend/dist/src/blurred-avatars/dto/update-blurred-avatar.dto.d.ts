import { CreateBlurredAvatarDto } from './create-blurred-avatar.dto';
declare const UpdateBlurredAvatarDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBlurredAvatarDto>>;
export declare class UpdateBlurredAvatarDto extends UpdateBlurredAvatarDto_base {
    blurLevel?: number;
    isActive?: boolean;
}
export {};
