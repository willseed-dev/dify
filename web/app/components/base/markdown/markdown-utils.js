"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customUrlTransform = exports.preprocessThinkTag = exports.preprocessLaTeX = void 0;
/**
 * @fileoverview Utility functions for preprocessing Markdown content.
 * These functions were extracted from the main markdown renderer for better separation of concerns.
 * Includes preprocessing for LaTeX and custom "think" tags.
 */
const compat_1 = require("es-toolkit/compat");
const config_1 = require("@/config");
const preprocessLaTeX = (content) => {
    if (typeof content !== 'string')
        return content;
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = content.match(codeBlockRegex) || [];
    const escapeReplacement = (str) => str.replace(/\$/g, '_TMP_REPLACE_DOLLAR_');
    let processedContent = content.replace(codeBlockRegex, 'CODE_BLOCK_PLACEHOLDER');
    processedContent = (0, compat_1.flow)([
        (str) => str.replace(/\\\[(.*?)\\\]/g, (_, equation) => `$$${equation}$$`),
        (str) => str.replace(/\\\[([\s\S]*?)\\\]/g, (_, equation) => `$$${equation}$$`),
        (str) => str.replace(/\\\((.*?)\\\)/g, (_, equation) => `$$${equation}$$`),
        (str) => str.replace(/(^|[^\\])\$(.+?)\$/g, (_, prefix, equation) => `${prefix}$${equation}$`),
    ])(processedContent);
    codeBlocks.forEach((block) => {
        processedContent = processedContent.replace('CODE_BLOCK_PLACEHOLDER', escapeReplacement(block));
    });
    processedContent = processedContent.replace(/_TMP_REPLACE_DOLLAR_/g, '$');
    return processedContent;
};
exports.preprocessLaTeX = preprocessLaTeX;
const preprocessThinkTag = (content) => {
    const thinkOpenTagRegex = /(<think>\s*)+/g;
    const thinkCloseTagRegex = /(\s*<\/think>)+/g;
    return (0, compat_1.flow)([
        (str) => str.replace(thinkOpenTagRegex, '<details data-think=true>\n'),
        (str) => str.replace(thinkCloseTagRegex, '\n[ENDTHINKFLAG]</details>'),
        (str) => str.replace(/(<\/details>)(?![^\S\r\n]*[\r\n])(?![^\S\r\n]*$)/g, '$1\n'),
    ])(content);
};
exports.preprocessThinkTag = preprocessThinkTag;
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
const customUrlTransform = (uri) => {
    const PERMITTED_SCHEME_REGEX = /^(https?|ircs?|mailto|xmpp|abbr):$/i;
    if (uri.startsWith('#'))
        return uri;
    if (uri.startsWith('//'))
        return uri;
    const colonIndex = uri.indexOf(':');
    if (colonIndex === -1)
        return uri;
    const slashIndex = uri.indexOf('/');
    const questionMarkIndex = uri.indexOf('?');
    const hashIndex = uri.indexOf('#');
    if ((slashIndex !== -1 && colonIndex > slashIndex)
        || (questionMarkIndex !== -1 && colonIndex > questionMarkIndex)
        || (hashIndex !== -1 && colonIndex > hashIndex)) {
        return uri;
    }
    const scheme = uri.substring(0, colonIndex + 1).toLowerCase();
    if (PERMITTED_SCHEME_REGEX.test(scheme))
        return uri;
    if (config_1.ALLOW_UNSAFE_DATA_SCHEME && scheme === 'data:')
        return uri;
    return undefined;
};
exports.customUrlTransform = customUrlTransform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYXJrZG93bi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsOENBQXdDO0FBQ3hDLHFDQUFtRDtBQUU1QyxNQUFNLGVBQWUsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFO0lBQ2pELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUTtRQUM3QixPQUFPLE9BQU8sQ0FBQTtJQUVoQixNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQTtJQUN4QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN0RCxNQUFNLGlCQUFpQixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO0lBQ3JGLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsd0JBQXdCLENBQUMsQ0FBQTtJQUVoRixnQkFBZ0IsR0FBRyxJQUFBLGFBQUksRUFBQztRQUN0QixDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUM7UUFDbEYsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDO1FBQ3ZGLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQztRQUNs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R0FBRyxDQUFBO0lBRVosT0FBTyxTQUFTLENBQUE7QUFDbEIsQ0FBQyxDQUFBO0FBbENZLFFBQUEsa0JBQWtCLHNCQWtDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbGl0eSBmdW5jdGlvbnMgZm9yIHByZXByb2Nlc3NpbmcgTWFya2Rvd24gY29udGVudC5cbiAqIFRoZXNlIGZ1bmN0aW9ucyB3ZXJlIGV4dHJhY3RlZCBmcm9tIHRoZSBtYWluIG1hcmtkb3duIHJlbmRlcmVyIGZvciBiZXR0ZXIgc2VwYXJhdGlvbiBvZiBjb25jZXJucy5cbiAqIEluY2x1ZGVzIHByZXByb2Nlc3NpbmcgZm9yIExhVGVYIGFuZCBjdXN0b20gXCJ0aGlua1wiIHRhZ3MuXG4gKi9cbmltcG9ydCB7IGZsb3cgfSBmcm9tICdlcy10b29sa2l0L2NvbXBhdCdcbmltcG9ydCB7IEFMTE9XX1VOU0FGRV9EQVRBX1NDSEVNRSB9IGZyb20gJ0AvY29uZmlnJ1xuXG5leHBvcnQgY29uc3QgcHJlcHJvY2Vzc0xhVGVYID0gKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xuICBpZiAodHlwZW9mIGNvbnRlbnQgIT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBjb250ZW50XG5cbiAgY29uc3QgY29kZUJsb2NrUmVnZXggPSAvYGBgW1xcc1xcU10qP2BgYC9nXG4gIGNvbnN0IGNvZGVCbG9ja3MgPSBjb250ZW50Lm1hdGNoKGNvZGVCbG9ja1JlZ2V4KSB8fCBbXVxuICBjb25zdCBlc2NhcGVSZXBsYWNlbWVudCA9IChzdHI6IHN0cmluZykgPT4gc3RyLnJlcGxhY2UoL1xcJC9nLCAnX1RNUF9SRVBMQUNFX0RPTExBUl8nKVxuICBsZXQgcHJvY2Vzc2VkQ29udGVudCA9IGNvbnRlbnQucmVwbGFjZShjb2RlQmxvY2tSZWdleCwgJ0NPREVfQkxPQ0tfUExBQ0VIT0xERVInKVxuXG4gIHByb2Nlc3NlZENvbnRlbnQgPSBmbG93KFtcbiAgICAoc3RyOiBzdHJpbmcpID0+IHN0ci5yZXBsYWNlKC9cXFxcXFxbKC4qPylcXFxcXFxdL2csIChfLCBlcXVhdGlvbikgPT4gYCQkJHtlcXVhdGlvbn0kJGApLFxuICAgIChzdHI6IHN0cmluZykgPT4gc3RyLnJlcGxhY2UoL1xcXFxcXFsoW1xcc1xcU10qPylcXFxcXFxdL2csIChfLCBlcXVhdGlvbikgPT4gYCQkJHtlcXVhdGlvbn0kJGApLFxuICAgIChzdHI6IHN0cmluZykgPT4gc3RyLnJlcGxhY2UoL1xcXFxcXCgoLio/KVxcXFxcXCkvZywgKF8sIGVxdWF0aW9uKSA9PiBgJCQke2VxdWF0aW9ufSQkYCksXG4gICAgKHN0cjogc3RyaW5nKSA9PiBzdHIucmVwbGFjZSgvKF58W15cXFxcXSlcXCQoLis/KVxcJC9nLCAoXywgcHJlZml4LCBlcXVhdGlvbikgPT4gYCR7cHJlZml4fSQke2VxdWF0aW9ufSRgKSxcbiAgXSkocHJvY2Vzc2VkQ29udGVudClcblxuICBjb2RlQmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgcHJvY2Vzc2VkQ29udGVudCA9IHByb2Nlc3NlZENvbnRlbnQucmVwbGFjZSgnQ09ERV9CTE9DS19QTEFDRUhPTERFUicsIGVzY2FwZVJlcGxhY2VtZW50KGJsb2NrKSlcbiAgfSlcblxuICBwcm9jZXNzZWRDb250ZW50ID0gcHJvY2Vzc2VkQ29udGVudC5yZXBsYWNlKC9fVE1QX1JFUExBQ0VfRE9MTEFSXy9nLCAnJCcpXG5cbiAgcmV0dXJuIHByb2Nlc3NlZENvbnRlbnRcbn1cblxuZXhwb3J0IGNvbnN0IHByZXByb2Nlc3NUaGlua1RhZyA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgdGhpbmtPcGVuVGFnUmVnZXggPSAvKDx0aGluaz5cXHMqKSsvZ1xuICBjb25zdCB0aGlua0Nsb3NlVGFnUmVnZXggPSAvKFxccyo8XFwvdGhpbms+KSsvZ1xuICByZXR1cm4gZmxvdyhbXG4gICAgKHN0cjogc3RyaW5nKSA9PiBzdHIucmVwbGFjZSh0aGlua09wZW5UYWdSZWdleCwgJzxkZXRhaWxzIGRhdGEtdGhpbms9dHJ1ZT5cXG4nKSxcbiAgICAoc3RyOiBzdHJpbmcpID0+IHN0ci5yZXBsYWNlKHRoaW5rQ2xvc2VUYWdSZWdleCwgJ1xcbltFTkRUSElOS0ZMQUddPC9kZXRhaWxzPicpLFxuICAgIChzdHI6IHN0cmluZykgPT4gc3RyLnJlcGxhY2UoLyg8XFwvZGV0YWlscz4pKD8hW15cXFNcXHJcXG5dKltcXHJcXG5dKSg/IVteXFxTXFxyXFxuXSokKS9nLCAnJDFcXG4nKSxcbiAgXSkoY29udGVudClcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgVVJJIGZvciB1c2UgaW4gcmVhY3QtbWFya2Rvd24sIGVuc3VyaW5nIHNlY3VyaXR5IGFuZCBjb21wYXRpYmlsaXR5LlxuICogVGhpcyBmdW5jdGlvbiBpcyBkZXNpZ25lZCB0byB3b3JrIHdpdGggcmVhY3QtbWFya2Rvd24gdjkrIHdoaWNoIGhhcyBzdHJpY3RlclxuICogZGVmYXVsdCBVUkwgaGFuZGxpbmcuXG4gKlxuICogQmVoYXZpb3I6XG4gKiAxLiBBbHdheXMgYWxsb3dzIHRoZSBjdXN0b20gJ2FiYnI6JyBwcm90b2NvbC5cbiAqIDIuIEFsd2F5cyBhbGxvd3MgcGFnZS1sb2NhbCBmcmFnbWVudHMgKGUuZy4sIFwiI3NvbWUtaWRcIikuXG4gKiAzLiBBbHdheXMgYWxsb3dzIHByb3RvY29sLXJlbGF0aXZlIFVSTHMgKGUuZy4sIFwiLy9leGFtcGxlLmNvbS9wYXRoXCIpLlxuICogNC4gQWx3YXlzIGFsbG93cyBwdXJlbHkgcmVsYXRpdmUgcGF0aHMgKGUuZy4sIFwicGF0aC90by9maWxlXCIsIFwiL2Ficy9wYXRoXCIpLlxuICogNS4gQWxsb3dzIGFic29sdXRlIFVSTHMgaWYgdGhlaXIgc2NoZW1lIGlzIGluIGEgcGVybWl0dGVkIGxpc3QgKGNhc2UtaW5zZW5zaXRpdmUpOlxuICogICAgJ2h0dHA6JywgJ2h0dHBzOicsICdtYWlsdG86JywgJ3htcHA6JywgJ2lyYzonLCAnaXJjczonLlxuICogNi4gSW50ZWxsaWdlbnRseSBkaXN0aW5ndWlzaGVzIGNvbG9ucyB1c2VkIGZvciBzY2hlbWVzIGZyb20gY29sb25zIHdpdGhpblxuICogICAgcGF0aHMsIHF1ZXJ5IHBhcmFtZXRlcnMsIG9yIGZyYWdtZW50cyBvZiByZWxhdGl2ZS1saWtlIFVSTHMuXG4gKiA3LiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBVUkkgaWYgYWxsb3dlZCwgb3RoZXJ3aXNlIHJldHVybnMgYHVuZGVmaW5lZGAgdG9cbiAqICAgIHNpZ25hbCB0aGF0IHRoZSBVUkkgc2hvdWxkIGJlIHJlbW92ZWQvZGlzYWxsb3dlZCBieSByZWFjdC1tYXJrZG93bi5cbiAqL1xuZXhwb3J0IGNvbnN0IGN1c3RvbVVybFRyYW5zZm9ybSA9ICh1cmk6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG4gIGNvbnN0IFBFUk1JVFRFRF9TQ0hFTUVfUkVHRVggPSAvXihodHRwcz98aXJjcz98bWFpbHRvfHhtcHB8YWJicik6JC9pXG5cbiAgaWYgKHVyaS5zdGFydHNXaXRoKCcjJykpXG4gICAgcmV0dXJuIHVyaVxuXG4gIGlmICh1cmkuc3RhcnRzV2l0aCgnLy8nKSlcbiAgICByZXR1cm4gdXJpXG5cbiAgY29uc3QgY29sb25JbmRleCA9IHVyaS5pbmRleE9mKCc6JylcblxuICBpZiAoY29sb25JbmRleCA9PT0gLTEpXG4gICAgcmV0dXJuIHVyaVxuXG4gIGNvbnN0IHNsYXNoSW5kZXggPSB1cmkuaW5kZXhPZignLycpXG4gIGNvbnN0IHF1ZXN0aW9uTWFya0luZGV4ID0gdXJpLmluZGV4T2YoJz8nKVxuICBjb25zdCBoYXNoSW5kZXggPSB1cmkuaW5kZXhPZignIycpXG5cbiAgaWYgKFxuICAgIChzbGFzaEluZGV4ICE9PSAtMSAmJiBjb2xvbkluZGV4ID4gc2xhc2hJbmRleClcbiAgICB8fCAocXVlc3Rpb25NYXJrSW5kZXggIT09IC0xICYmIGNvbG9uSW5kZXggPiBxdWVzdGlvbk1hcmtJbmRleClcbiAgICB8fCAoaGFzaEluZGV4ICE9PSAtMSAmJiBjb2xvbkluZGV4ID4gaGFzaEluZGV4KVxuICApIHtcbiAgICByZXR1cm4gdXJpXG4gIH1cblxuICBjb25zdCBzY2hlbWUgPSB1cmkuc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXggKyAxKS50b0xvd2VyQ2FzZSgpXG4gIGlmIChQRVJNSVRURURfU0NIRU1FX1JFR0VYLnRlc3Qoc2NoZW1lKSlcbiAgICByZXR1cm4gdXJpXG5cbiAgaWYgKEFMTE9XX1VOU0FGRV9EQVRBX1NDSEVNRSAmJiBzY2hlbWUgPT09ICdkYXRhOicpXG4gICAgcmV0dXJuIHVyaVxuXG4gIHJldHVybiB1bmRlZmluZWRcbn1cbiJdfQ==