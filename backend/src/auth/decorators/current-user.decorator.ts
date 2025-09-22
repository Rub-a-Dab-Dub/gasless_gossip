import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

export interface CurrentUserData {
  id: string
  username: string
  email: string
  roles?: string[]
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext): CurrentUserData | any => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user?.[data] : user
  },
)
