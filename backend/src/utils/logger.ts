const info = (...args: any[]) => console.log('[INFO]', ...args);
const warn = (...args: any[]) => console.warn('[WARN]', ...args);
const error = (...args: any[]) => console.error('[ERROR]', ...args);

export default { info, warn, error };
