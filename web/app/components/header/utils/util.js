"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailToSupport = exports.generateMailToLink = void 0;
const generateMailToLink = (email, subject, body) => {
    let mailtoLink = `mailto:${email}`;
    if (subject)
        mailtoLink += `?subject=${encodeURIComponent(subject)}`;
    if (body)
        mailtoLink += `&body=${encodeURIComponent(body)}`;
    return mailtoLink;
};
exports.generateMailToLink = generateMailToLink;
const mailToSupport = (account, plan, version) => {
    const subject = `Technical Support Request ${plan} ${account}`;
    const body = `
    Please do not remove the following information:
    -----------------------------------------------
    Current Plan: ${plan}
    Account: ${account}
    Version: ${version}
    Platform:
    Problem Description:
  `;
    return (0, exports.generateMailToLink)('support@dify.ai', subject, body);
};
exports.mailToSupport = mailToSupport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQU8sTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQWEsRUFBRSxPQUFnQixFQUFFLElBQWEsRUFBVSxFQUFFO0lBQzNGLElBQUksVUFBVSxHQUFHLFVBQVUsS0FBSyxFQUFFLENBQUE7SUFFbEMsSUFBSSxPQUFPO1FBQ1QsVUFBVSxJQUFJLFlBQVksa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQTtJQUV6RCxJQUFJLElBQUk7UUFDTixVQUFVLElBQUksU0FBUyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBRW5ELE9BQU8sVUFBVSxDQUFBO0FBQ25CLENBQUMsQ0FBQTtBQVZZLFFBQUEsa0JBQWtCLHNCQVU5QjtBQUVNLE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBZSxFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsRUFBRTtJQUM5RSxNQUFNLE9BQU8sR0FBRyw2QkFBNkIsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFBO0lBQzlELE1BQU0sSUFBSSxHQUFHOzs7b0JBR0ssSUFBSTtlQUNULE9BQU87ZUFDUCxPQUFPOzs7R0FHbkIsQ0FBQTtJQUNELE9BQU8sSUFBQSwwQkFBa0IsRUFBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDN0QsQ0FBQyxDQUFBO0FBWlksUUFBQSxhQUFhLGlCQVl6QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBnZW5lcmF0ZU1haWxUb0xpbmsgPSAoZW1haWw6IHN0cmluZywgc3ViamVjdD86IHN0cmluZywgYm9keT86IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGxldCBtYWlsdG9MaW5rID0gYG1haWx0bzoke2VtYWlsfWBcblxuICBpZiAoc3ViamVjdClcbiAgICBtYWlsdG9MaW5rICs9IGA/c3ViamVjdD0ke2VuY29kZVVSSUNvbXBvbmVudChzdWJqZWN0KX1gXG5cbiAgaWYgKGJvZHkpXG4gICAgbWFpbHRvTGluayArPSBgJmJvZHk9JHtlbmNvZGVVUklDb21wb25lbnQoYm9keSl9YFxuXG4gIHJldHVybiBtYWlsdG9MaW5rXG59XG5cbmV4cG9ydCBjb25zdCBtYWlsVG9TdXBwb3J0ID0gKGFjY291bnQ6IHN0cmluZywgcGxhbjogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qgc3ViamVjdCA9IGBUZWNobmljYWwgU3VwcG9ydCBSZXF1ZXN0ICR7cGxhbn0gJHthY2NvdW50fWBcbiAgY29uc3QgYm9keSA9IGBcbiAgICBQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGUgZm9sbG93aW5nIGluZm9ybWF0aW9uOlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQ3VycmVudCBQbGFuOiAke3BsYW59XG4gICAgQWNjb3VudDogJHthY2NvdW50fVxuICAgIFZlcnNpb246ICR7dmVyc2lvbn1cbiAgICBQbGF0Zm9ybTpcbiAgICBQcm9ibGVtIERlc2NyaXB0aW9uOlxuICBgXG4gIHJldHVybiBnZW5lcmF0ZU1haWxUb0xpbmsoJ3N1cHBvcnRAZGlmeS5haScsIHN1YmplY3QsIGJvZHkpXG59XG4iXX0=