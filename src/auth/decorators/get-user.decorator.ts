import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If you pass a property name, return just that property
    if (data) {
      return user?.[data];
    }

    // Otherwise, return the whole user
    return user;
  },
);
