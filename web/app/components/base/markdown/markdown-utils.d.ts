export declare const preprocessLaTeX: (content: string) => string;
export declare const preprocessThinkTag: (content: string) => any;
/**
 * Transforms a URI for use in react-markdown, ensuring security and compatibility.
 * This function is designed to work with react-markdown v9+ which has stricter
 * default URL handling.
 *
 * Behavior:
 * 1. Always allows the custom 'abbr:' protocol.
 * 2. Always allows page-local fragments (e.g., "#some-id").
 * 3. Always allows protocol-relative URLs (e.g., "//example.com/path").
 * 4. Always allows purely relative paths (e.g., "path/to/file", "/abs/path").
 * 5. Allows absolute URLs if their scheme is in a permitted list (case-insensitive):
 *    'http:', 'https:', 'mailto:', 'xmpp:', 'irc:', 'ircs:'.
 * 6. Intelligently distinguishes colons used for schemes from colons within
 *    paths, query parameters, or fragments of relative-like URLs.
 * 7. Returns the original URI if allowed, otherwise returns `undefined` to
 *    signal that the URI should be removed/disallowed by react-markdown.
 */
export declare const customUrlTransform: (uri: string) => string | undefined;
