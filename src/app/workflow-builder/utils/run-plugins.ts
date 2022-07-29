
export function runPlugins<A extends unknown[], D, R>(plugins: any[], method: string, defaultValue: D, ...args: A): R | null {
  return plugins.sort(plugin => plugin.priority - plugin.priority)
    .filter(plugin => plugin[method]).reduce((prevVal, plugin)=> {
      return plugin[method](...args, prevVal);
  }, defaultValue || null);
}
