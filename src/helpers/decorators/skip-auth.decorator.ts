export function SkipAuth() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('skipAuth', true, target, key);
  };
}
