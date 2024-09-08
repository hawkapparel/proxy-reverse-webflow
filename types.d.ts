type Context = import('hono').Context
type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};
