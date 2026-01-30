"use strict";
/**
 * Test suite for verifying upload feature translations across all locales
 * Specifically tests for issue #23062: Missing Upload feature translations (esp. audioUpload) across most locales
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
// Get all supported locales from the i18n directory
const I18N_DIR = node_path_1.default.join(__dirname, '../i18n');
const getSupportedLocales = () => {
    return node_fs_1.default.readdirSync(I18N_DIR)
        .filter(item => node_fs_1.default.statSync(node_path_1.default.join(I18N_DIR, item)).isDirectory())
        .sort();
};
// Helper function to load translation file content
const loadTranslationContent = (locale) => {
    const filePath = node_path_1.default.join(I18N_DIR, locale, 'app-debug.json');
    if (!node_fs_1.default.existsSync(filePath))
        throw new Error(`Translation file not found: ${filePath}`);
    return node_fs_1.default.readFileSync(filePath, 'utf-8');
};
// Helper function to check if upload features exist (supports flattened JSON)
const hasUploadFeatures = (content) => {
    return {
        fileUpload: /"feature\.fileUpload\.title"/.test(content),
        imageUpload: /"feature\.imageUpload\.title"/.test(content),
        documentUpload: /"feature\.documentUpload\.title"/.test(content),
        audioUpload: /"feature\.audioUpload\.title"/.test(content),
        featureBar: /"feature\.bar\.empty"/.test(content),
    };
};
describe('Upload Features i18n Translations - Issue #23062', () => {
    let supportedLocales;
    beforeAll(() => {
        supportedLocales = getSupportedLocales();
        console.log(`Testing ${supportedLocales.length} locales for upload features`);
    });
    it('all locales should have translation files', () => {
        supportedLocales.forEach((locale) => {
            const filePath = node_path_1.default.join(I18N_DIR, locale, 'app-debug.json');
            expect(node_fs_1.default.existsSync(filePath)).toBe(true);
        });
    });
    it('all locales should have required upload features', () => {
        const results = {};
        supportedLocales.forEach((locale) => {
            const content = loadTranslationContent(locale);
            const features = hasUploadFeatures(content);
            results[locale] = features;
            // Check that all upload features exist
            expect(features.fileUpload).toBe(true);
            expect(features.imageUpload).toBe(true);
            expect(features.documentUpload).toBe(true);
            expect(features.audioUpload).toBe(true);
            expect(features.featureBar).toBe(true);
        });
        console.log('✅ All locales have complete upload features');
    });
    it('previously missing locales should now have audioUpload - Issue #23062', () => {
        // These locales were specifically missing audioUpload
        const previouslyMissingLocales = ['fa-IR', 'hi-IN', 'ro-RO', 'sl-SI', 'th-TH', 'uk-UA', 'vi-VN'];
        previouslyMissingLocales.forEach((locale) => {
            const content = loadTranslationContent(locale);
            // Verify audioUpload exists with title and description (flattened JSON format)
            expect(/"feature\.audioUpload\.title"/.test(content)).toBe(true);
            expect(/"feature\.audioUpload\.description"/.test(content)).toBe(true);
            console.log(`✅ ${locale} - Issue #23062 resolved: audioUpload feature present`);
        });
    });
    it('upload features should have required properties', () => {
        supportedLocales.forEach((locale) => {
            const content = loadTranslationContent(locale);
            // Check fileUpload has required properties (flattened JSON format)
            if (/"feature\.fileUpload\.title"/.test(content)) {
                expect(/"feature\.fileUpload\.title"/.test(content)).toBe(true);
                expect(/"feature\.fileUpload\.description"/.test(content)).toBe(true);
            }
            // Check imageUpload has required properties
            if (/"feature\.imageUpload\.title"/.test(content)) {
                expect(/"feature\.imageUpload\.title"/.test(content)).toBe(true);
                expect(/"feature\.imageUpload\.description"/.test(content)).toBe(true);
            }
            // Check documentUpload has required properties
            if (/"feature\.documentUpload\.title"/.test(content)) {
                expect(/"feature\.documentUpload\.title"/.test(content)).toBe(true);
                expect(/"feature\.documentUpload\.description"/.test(content)).toBe(true);
            }
            // Check audioUpload has required properties
            if (/"feature\.audioUpload\.title"/.test(content)) {
                expect(/"feature\.audioUpload\.title"/.test(content)).toBe(true);
                expect(/"feature\.audioUpload\.description"/.test(content)).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi11cGxvYWQtZmVhdHVyZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImkxOG4tdXBsb2FkLWZlYXR1cmVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7QUFFSCxxQ0FBd0I7QUFDeEIseUNBQTRCO0FBRTVCLG9EQUFvRDtBQUNwRCxNQUFNLFFBQVEsR0FBRyxtQkFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDaEQsTUFBTSxtQkFBbUIsR0FBRyxHQUFhLEVBQUU7SUFDekMsT0FBTyxpQkFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7U0FDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQUUsQ0FBQyxRQUFRLENBQUMsbUJBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEUsSUFBSSxFQUFFLENBQUE7QUFDWCxDQUFDLENBQUE7QUFFRCxtREFBbUQ7QUFDbkQsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLE1BQWMsRUFBVSxFQUFFO0lBQ3hELE1BQU0sUUFBUSxHQUFHLG1CQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtJQUU5RCxJQUFJLENBQUMsaUJBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFFNUQsT0FBTyxpQkFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0MsQ0FBQyxDQUFBO0FBRUQsOEVBQThFO0FBQzlFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFlLEVBQThCLEVBQUU7SUFDeEUsT0FBTztRQUNMLFVBQVUsRUFBRSw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsT0FB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QUFNLENBQUMsd0NBQXdDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzNFLENBQUM7WUFFRCw0Q0FBNEM7WUFDNUMsSUFBSSwrQkFBK0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLCtCQUErQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDaEUsTUFBTSxDQUFDLHFDQUFxQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN4RSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0IHN1aXRlIGZvciB2ZXJpZnlpbmcgdXBsb2FkIGZlYXR1cmUgdHJhbnNsYXRpb25zIGFjcm9zcyBhbGwgbG9jYWxlc1xuICogU3BlY2lmaWNhbGx5IHRlc3RzIGZvciBpc3N1ZSAjMjMwNjI6IE1pc3NpbmcgVXBsb2FkIGZlYXR1cmUgdHJhbnNsYXRpb25zIChlc3AuIGF1ZGlvVXBsb2FkKSBhY3Jvc3MgbW9zdCBsb2NhbGVzXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5cbi8vIEdldCBhbGwgc3VwcG9ydGVkIGxvY2FsZXMgZnJvbSB0aGUgaTE4biBkaXJlY3RvcnlcbmNvbnN0IEkxOE5fRElSID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2kxOG4nKVxuY29uc3QgZ2V0U3VwcG9ydGVkTG9jYWxlcyA9ICgpOiBzdHJpbmdbXSA9PiB7XG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhJMThOX0RJUilcbiAgICAuZmlsdGVyKGl0ZW0gPT4gZnMuc3RhdFN5bmMocGF0aC5qb2luKEkxOE5fRElSLCBpdGVtKSkuaXNEaXJlY3RvcnkoKSlcbiAgICAuc29ydCgpXG59XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBsb2FkIHRyYW5zbGF0aW9uIGZpbGUgY29udGVudFxuY29uc3QgbG9hZFRyYW5zbGF0aW9uQ29udGVudCA9IChsb2NhbGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKEkxOE5fRElSLCBsb2NhbGUsICdhcHAtZGVidWcuanNvbicpXG5cbiAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRyYW5zbGF0aW9uIGZpbGUgbm90IGZvdW5kOiAke2ZpbGVQYXRofWApXG5cbiAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgJ3V0Zi04Jylcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIHVwbG9hZCBmZWF0dXJlcyBleGlzdCAoc3VwcG9ydHMgZmxhdHRlbmVkIEpTT04pXG5jb25zdCBoYXNVcGxvYWRGZWF0dXJlcyA9IChjb250ZW50OiBzdHJpbmcpOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9PiB7XG4gIHJldHVybiB7XG4gICAgZmlsZVVwbG9hZDogL1wiZmVhdHVyZVxcLmZpbGVVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpLFxuICAgIGltYWdlVXBsb2FkOiAvXCJmZWF0dXJlXFwuaW1hZ2VVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpLFxuICAgIGRvY3VtZW50VXBsb2FkOiAvXCJmZWF0dXJlXFwuZG9jdW1lbnRVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpLFxuICAgIGF1ZGlvVXBsb2FkOiAvXCJmZWF0dXJlXFwuYXVkaW9VcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpLFxuICAgIGZlYXR1cmVCYXI6IC9cImZlYXR1cmVcXC5iYXJcXC5lbXB0eVwiLy50ZXN0KGNvbnRlbnQpLFxuICB9XG59XG5cbmRlc2NyaWJlKCdVcGxvYWQgRmVhdHVyZXMgaTE4biBUcmFuc2xhdGlvbnMgLSBJc3N1ZSAjMjMwNjInLCAoKSA9PiB7XG4gIGxldCBzdXBwb3J0ZWRMb2NhbGVzOiBzdHJpbmdbXVxuXG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgc3VwcG9ydGVkTG9jYWxlcyA9IGdldFN1cHBvcnRlZExvY2FsZXMoKVxuICAgIGNvbnNvbGUubG9nKGBUZXN0aW5nICR7c3VwcG9ydGVkTG9jYWxlcy5sZW5ndGh9IGxvY2FsZXMgZm9yIHVwbG9hZCBmZWF0dXJlc2ApXG4gIH0pXG5cbiAgaXQoJ2FsbCBsb2NhbGVzIHNob3VsZCBoYXZlIHRyYW5zbGF0aW9uIGZpbGVzJywgKCkgPT4ge1xuICAgIHN1cHBvcnRlZExvY2FsZXMuZm9yRWFjaCgobG9jYWxlKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihJMThOX0RJUiwgbG9jYWxlLCAnYXBwLWRlYnVnLmpzb24nKVxuICAgICAgZXhwZWN0KGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnYWxsIGxvY2FsZXMgc2hvdWxkIGhhdmUgcmVxdWlyZWQgdXBsb2FkIGZlYXR1cmVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHM6IHsgW2xvY2FsZTogc3RyaW5nXTogeyBbZmVhdHVyZTogc3RyaW5nXTogYm9vbGVhbiB9IH0gPSB7fVxuXG4gICAgc3VwcG9ydGVkTG9jYWxlcy5mb3JFYWNoKChsb2NhbGUpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBsb2FkVHJhbnNsYXRpb25Db250ZW50KGxvY2FsZSlcbiAgICAgIGNvbnN0IGZlYXR1cmVzID0gaGFzVXBsb2FkRmVhdHVyZXMoY29udGVudClcbiAgICAgIHJlc3VsdHNbbG9jYWxlXSA9IGZlYXR1cmVzXG5cbiAgICAgIC8vIENoZWNrIHRoYXQgYWxsIHVwbG9hZCBmZWF0dXJlcyBleGlzdFxuICAgICAgZXhwZWN0KGZlYXR1cmVzLmZpbGVVcGxvYWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmZWF0dXJlcy5pbWFnZVVwbG9hZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGZlYXR1cmVzLmRvY3VtZW50VXBsb2FkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZmVhdHVyZXMuYXVkaW9VcGxvYWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmZWF0dXJlcy5mZWF0dXJlQmFyKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGNvbnNvbGUubG9nKCfinIUgQWxsIGxvY2FsZXMgaGF2ZSBjb21wbGV0ZSB1cGxvYWQgZmVhdHVyZXMnKVxuICB9KVxuXG4gIGl0KCdwcmV2aW91c2x5IG1pc3NpbmcgbG9jYWxlcyBzaG91bGQgbm93IGhhdmUgYXVkaW9VcGxvYWQgLSBJc3N1ZSAjMjMwNjInLCAoKSA9PiB7XG4gICAgLy8gVGhlc2UgbG9jYWxlcyB3ZXJlIHNwZWNpZmljYWxseSBtaXNzaW5nIGF1ZGlvVXBsb2FkXG4gICAgY29uc3QgcHJldmlvdXNseU1pc3NpbmdMb2NhbGVzID0gWydmYS1JUicsICdoaS1JTicsICdyby1STycsICdzbC1TSScsICd0aC1USCcsICd1ay1VQScsICd2aS1WTiddXG5cbiAgICBwcmV2aW91c2x5TWlzc2luZ0xvY2FsZXMuZm9yRWFjaCgobG9jYWxlKSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gbG9hZFRyYW5zbGF0aW9uQ29udGVudChsb2NhbGUpXG5cbiAgICAgIC8vIFZlcmlmeSBhdWRpb1VwbG9hZCBleGlzdHMgd2l0aCB0aXRsZSBhbmQgZGVzY3JpcHRpb24gKGZsYXR0ZW5lZCBKU09OIGZvcm1hdClcbiAgICAgIGV4cGVjdCgvXCJmZWF0dXJlXFwuYXVkaW9VcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoL1wiZmVhdHVyZVxcLmF1ZGlvVXBsb2FkXFwuZGVzY3JpcHRpb25cIi8udGVzdChjb250ZW50KSkudG9CZSh0cnVlKVxuXG4gICAgICBjb25zb2xlLmxvZyhg4pyFICR7bG9jYWxlfSAtIElzc3VlICMyMzA2MiByZXNvbHZlZDogYXVkaW9VcGxvYWQgZmVhdHVyZSBwcmVzZW50YClcbiAgICB9KVxuICB9KVxuXG4gIGl0KCd1cGxvYWQgZmVhdHVyZXMgc2hvdWxkIGhhdmUgcmVxdWlyZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBzdXBwb3J0ZWRMb2NhbGVzLmZvckVhY2goKGxvY2FsZSkgPT4ge1xuICAgICAgY29uc3QgY29udGVudCA9IGxvYWRUcmFuc2xhdGlvbkNvbnRlbnQobG9jYWxlKVxuXG4gICAgICAvLyBDaGVjayBmaWxlVXBsb2FkIGhhcyByZXF1aXJlZCBwcm9wZXJ0aWVzIChmbGF0dGVuZWQgSlNPTiBmb3JtYXQpXG4gICAgICBpZiAoL1wiZmVhdHVyZVxcLmZpbGVVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgICAgIGV4cGVjdCgvXCJmZWF0dXJlXFwuZmlsZVVwbG9hZFxcLnRpdGxlXCIvLnRlc3QoY29udGVudCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KC9cImZlYXR1cmVcXC5maWxlVXBsb2FkXFwuZGVzY3JpcHRpb25cIi8udGVzdChjb250ZW50KSkudG9CZSh0cnVlKVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpbWFnZVVwbG9hZCBoYXMgcmVxdWlyZWQgcHJvcGVydGllc1xuICAgICAgaWYgKC9cImZlYXR1cmVcXC5pbWFnZVVwbG9hZFxcLnRpdGxlXCIvLnRlc3QoY29udGVudCkpIHtcbiAgICAgICAgZXhwZWN0KC9cImZlYXR1cmVcXC5pbWFnZVVwbG9hZFxcLnRpdGxlXCIvLnRlc3QoY29udGVudCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KC9cImZlYXR1cmVcXC5pbWFnZVVwbG9hZFxcLmRlc2NyaXB0aW9uXCIvLnRlc3QoY29udGVudCkpLnRvQmUodHJ1ZSlcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZG9jdW1lbnRVcGxvYWQgaGFzIHJlcXVpcmVkIHByb3BlcnRpZXNcbiAgICAgIGlmICgvXCJmZWF0dXJlXFwuZG9jdW1lbnRVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgICAgIGV4cGVjdCgvXCJmZWF0dXJlXFwuZG9jdW1lbnRVcGxvYWRcXC50aXRsZVwiLy50ZXN0KGNvbnRlbnQpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdCgvXCJmZWF0dXJlXFwuZG9jdW1lbnRVcGxvYWRcXC5kZXNjcmlwdGlvblwiLy50ZXN0KGNvbnRlbnQpKS50b0JlKHRydWUpXG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGF1ZGlvVXBsb2FkIGhhcyByZXF1aXJlZCBwcm9wZXJ0aWVzXG4gICAgICBpZiAoL1wiZmVhdHVyZVxcLmF1ZGlvVXBsb2FkXFwudGl0bGVcIi8udGVzdChjb250ZW50KSkge1xuICAgICAgICBleHBlY3QoL1wiZmVhdHVyZVxcLmF1ZGlvVXBsb2FkXFwudGl0bGVcIi8udGVzdChjb250ZW50KSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QoL1wiZmVhdHVyZVxcLmF1ZGlvVXBsb2FkXFwuZGVzY3JpcHRpb25cIi8udGVzdChjb250ZW50KSkudG9CZSh0cnVlKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59KVxuIl19