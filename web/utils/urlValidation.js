"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRedirectUrl = validateRedirectUrl;
exports.isPrivateOrLocalAddress = isPrivateOrLocalAddress;
/**
 * Validates that a URL is safe for redirection.
 * Only allows HTTP and HTTPS protocols to prevent XSS attacks.
 *
 * @param url - The URL string to validate
 * @throws Error if the URL has an unsafe protocol
 */
function validateRedirectUrl(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:')
            throw new Error('Authorization URL must be HTTP or HTTPS');
    }
    catch (error) {
        if (error instanceof Error
            && error.message === 'Authorization URL must be HTTP or HTTPS') {
            throw error;
        }
        // If URL parsing fails, it's also invalid
        throw new Error(`Invalid URL: ${url}`);
    }
}
/**
 * Check if URL is a private/local network address or cloud debug URL
 * @param url - The URL string to check
 * @returns true if the URL is a private/local address or cloud debug URL
 */
function isPrivateOrLocalAddress(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        // Check for localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1')
            return true;
        // Check for private IP ranges
        const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        const ipv4Match = hostname.match(ipv4Regex);
        if (ipv4Match) {
            const [, a, b] = ipv4Match.map(Number);
            // 10.0.0.0/8
            if (a === 10)
                return true;
            // 172.16.0.0/12
            if (a === 172 && b >= 16 && b <= 31)
                return true;
            // 192.168.0.0/16
            if (a === 192 && b === 168)
                return true;
            // 169.254.0.0/16 (link-local)
            if (a === 169 && b === 254)
                return true;
        }
        // Check for .local domains
        return hostname.endsWith('.local');
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsVmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVybFZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxrREFnQkM7QUFPRCwwREFrQ0M7QUFoRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsR0FBVztJQUM3QyxJQUFJLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM5QixJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssUUFBUTtZQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUE7SUFDOUQsQ0FBQztJQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixJQUNFLEtBQUssWUFBWSxLQUFLO2VBQ25CLEtBQUssQ0FBQyxPQUFPLEtBQUsseUNBQXlDLEVBQzlELENBQUM7WUFDRCxNQUFNLEtBQUssQ0FBQTtRQUNiLENBQUM7UUFDRCwwQ0FBMEM7UUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQix1QkFBdUIsQ0FBQyxHQUFXO0lBQ2pELElBQUksQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzNCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7UUFFOUMsc0JBQXNCO1FBQ3RCLElBQUksUUFBUSxLQUFLLFdBQVcsSUFBSSxRQUFRLEtBQUssV0FBVyxJQUFJLFFBQVEsS0FBSyxLQUFLO1lBQzVFLE9BQU8sSUFBSSxDQUFBO1FBRWIsOEJBQThCO1FBQzlCLE1BQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFBO1FBQ2hELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDM0MsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNkLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3RDLGFBQWE7WUFDYixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFBO1lBQ2IsZ0JBQWdCO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNqQyxPQUFPLElBQUksQ0FBQTtZQUNiLGlCQUFpQjtZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUc7Z0JBQ3hCLE9BQU8sSUFBSSxDQUFBO1lBQ2IsOEJBQThCO1lBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRztnQkFDeEIsT0FBTyxJQUFJLENBQUE7UUFDZixDQUFDO1FBRUQsMkJBQTJCO1FBQzNCLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBQ0QsTUFBTSxDQUFDO1FBQ0wsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVmFsaWRhdGVzIHRoYXQgYSBVUkwgaXMgc2FmZSBmb3IgcmVkaXJlY3Rpb24uXG4gKiBPbmx5IGFsbG93cyBIVFRQIGFuZCBIVFRQUyBwcm90b2NvbHMgdG8gcHJldmVudCBYU1MgYXR0YWNrcy5cbiAqXG4gKiBAcGFyYW0gdXJsIC0gVGhlIFVSTCBzdHJpbmcgdG8gdmFsaWRhdGVcbiAqIEB0aHJvd3MgRXJyb3IgaWYgdGhlIFVSTCBoYXMgYW4gdW5zYWZlIHByb3RvY29sXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVJlZGlyZWN0VXJsKHVybDogc3RyaW5nKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpXG4gICAgaWYgKHBhcnNlZFVybC5wcm90b2NvbCAhPT0gJ2h0dHA6JyAmJiBwYXJzZWRVcmwucHJvdG9jb2wgIT09ICdodHRwczonKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdXRob3JpemF0aW9uIFVSTCBtdXN0IGJlIEhUVFAgb3IgSFRUUFMnKVxuICB9XG4gIGNhdGNoIChlcnJvcikge1xuICAgIGlmIChcbiAgICAgIGVycm9yIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICYmIGVycm9yLm1lc3NhZ2UgPT09ICdBdXRob3JpemF0aW9uIFVSTCBtdXN0IGJlIEhUVFAgb3IgSFRUUFMnXG4gICAgKSB7XG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cbiAgICAvLyBJZiBVUkwgcGFyc2luZyBmYWlscywgaXQncyBhbHNvIGludmFsaWRcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgVVJMOiAke3VybH1gKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgVVJMIGlzIGEgcHJpdmF0ZS9sb2NhbCBuZXR3b3JrIGFkZHJlc3Mgb3IgY2xvdWQgZGVidWcgVVJMXG4gKiBAcGFyYW0gdXJsIC0gVGhlIFVSTCBzdHJpbmcgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIFVSTCBpcyBhIHByaXZhdGUvbG9jYWwgYWRkcmVzcyBvciBjbG91ZCBkZWJ1ZyBVUkxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpdmF0ZU9yTG9jYWxBZGRyZXNzKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXJsT2JqID0gbmV3IFVSTCh1cmwpXG4gICAgY29uc3QgaG9zdG5hbWUgPSB1cmxPYmouaG9zdG5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxvY2FsaG9zdFxuICAgIGlmIChob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgfHwgaG9zdG5hbWUgPT09ICcxMjcuMC4wLjEnIHx8IGhvc3RuYW1lID09PSAnOjoxJylcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgICAvLyBDaGVjayBmb3IgcHJpdmF0ZSBJUCByYW5nZXNcbiAgICBjb25zdCBpcHY0UmVnZXggPSAvXihcXGQrKVxcLihcXGQrKVxcLihcXGQrKVxcLihcXGQrKSQvXG4gICAgY29uc3QgaXB2NE1hdGNoID0gaG9zdG5hbWUubWF0Y2goaXB2NFJlZ2V4KVxuICAgIGlmIChpcHY0TWF0Y2gpIHtcbiAgICAgIGNvbnN0IFssIGEsIGJdID0gaXB2NE1hdGNoLm1hcChOdW1iZXIpXG4gICAgICAvLyAxMC4wLjAuMC84XG4gICAgICBpZiAoYSA9PT0gMTApXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICAvLyAxNzIuMTYuMC4wLzEyXG4gICAgICBpZiAoYSA9PT0gMTcyICYmIGIgPj0gMTYgJiYgYiA8PSAzMSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIC8vIDE5Mi4xNjguMC4wLzE2XG4gICAgICBpZiAoYSA9PT0gMTkyICYmIGIgPT09IDE2OClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIC8vIDE2OS4yNTQuMC4wLzE2IChsaW5rLWxvY2FsKVxuICAgICAgaWYgKGEgPT09IDE2OSAmJiBiID09PSAyNTQpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIC5sb2NhbCBkb21haW5zXG4gICAgcmV0dXJuIGhvc3RuYW1lLmVuZHNXaXRoKCcubG9jYWwnKVxuICB9XG4gIGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuIl19