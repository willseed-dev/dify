"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime_1 = require("mime");
const types_1 = require("@/app/components/workflow/types");
const base_1 = require("@/service/base");
const app_1 = require("@/types/app");
const constants_1 = require("../prompt-editor/constants");
const types_2 = require("./types");
const utils_1 = require("./utils");
vi.mock('mime', () => ({
    default: {
        getAllExtensions: vi.fn(),
    },
}));
vi.mock('@/service/base', () => ({
    upload: vi.fn(),
}));
describe('file-uploader utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('fileUpload', () => {
        it('should handle successful file upload', () => {
            const mockFile = new File(['test'], 'test.txt');
            const mockCallbacks = {
                onProgressCallback: vi.fn(),
                onSuccessCallback: vi.fn(),
                onErrorCallback: vi.fn(),
            };
            vi.mocked(base_1.upload).mockResolvedValue({ id: '123' });
            (0, utils_1.fileUpload)({
                file: mockFile,
                ...mockCallbacks,
            });
            expect(base_1.upload).toHaveBeenCalled();
        });
    });
    describe('getFileExtension', () => {
        it('should get extension from mimetype', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['pdf']));
            expect((0, utils_1.getFileExtension)('file', 'application/pdf')).toBe('pdf');
        });
        it('should get extension from mimetype and file name 1', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['pdf']));
            expect((0, utils_1.getFileExtension)('file.pdf', 'application/pdf')).toBe('pdf');
        });
        it('should get extension from mimetype with multiple ext candidates with filename hint', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['der', 'crt', 'pem']));
            expect((0, utils_1.getFileExtension)('file.pem', 'application/x-x509-ca-cert')).toBe('pem');
        });
        it('should get extension from mimetype with multiple ext candidates without filename hint', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['der', 'crt', 'pem']));
            expect((0, utils_1.getFileExtension)('file', 'application/x-x509-ca-cert')).toBe('der');
        });
        it('should get extension from filename if mimetype fails', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(null);
            expect((0, utils_1.getFileExtension)('file.txt', '')).toBe('txt');
            expect((0, utils_1.getFileExtension)('file.txt.docx', '')).toBe('docx');
            expect((0, utils_1.getFileExtension)('file', '')).toBe('');
        });
        it('should return empty string for remote files', () => {
            expect((0, utils_1.getFileExtension)('file.txt', '', true)).toBe('');
        });
    });
    describe('getFileAppearanceType', () => {
        it('should identify gif files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['gif']));
            expect((0, utils_1.getFileAppearanceType)('image.gif', 'image/gif'))
                .toBe(types_2.FileAppearanceTypeEnum.gif);
        });
        it('should identify image files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['jpg']));
            expect((0, utils_1.getFileAppearanceType)('image.jpg', 'image/jpeg'))
                .toBe(types_2.FileAppearanceTypeEnum.image);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['jpeg']));
            expect((0, utils_1.getFileAppearanceType)('image.jpeg', 'image/jpeg'))
                .toBe(types_2.FileAppearanceTypeEnum.image);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['png']));
            expect((0, utils_1.getFileAppearanceType)('image.png', 'image/png'))
                .toBe(types_2.FileAppearanceTypeEnum.image);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['webp']));
            expect((0, utils_1.getFileAppearanceType)('image.webp', 'image/webp'))
                .toBe(types_2.FileAppearanceTypeEnum.image);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['svg']));
            expect((0, utils_1.getFileAppearanceType)('image.svg', 'image/svgxml'))
                .toBe(types_2.FileAppearanceTypeEnum.image);
        });
        it('should identify video files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mp4']));
            expect((0, utils_1.getFileAppearanceType)('video.mp4', 'video/mp4'))
                .toBe(types_2.FileAppearanceTypeEnum.video);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mov']));
            expect((0, utils_1.getFileAppearanceType)('video.mov', 'video/quicktime'))
                .toBe(types_2.FileAppearanceTypeEnum.video);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mpeg']));
            expect((0, utils_1.getFileAppearanceType)('video.mpeg', 'video/mpeg'))
                .toBe(types_2.FileAppearanceTypeEnum.video);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['webm']));
            expect((0, utils_1.getFileAppearanceType)('video.web', 'video/webm'))
                .toBe(types_2.FileAppearanceTypeEnum.video);
        });
        it('should identify audio files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mp3']));
            expect((0, utils_1.getFileAppearanceType)('audio.mp3', 'audio/mpeg'))
                .toBe(types_2.FileAppearanceTypeEnum.audio);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['m4a']));
            expect((0, utils_1.getFileAppearanceType)('audio.m4a', 'audio/mp4'))
                .toBe(types_2.FileAppearanceTypeEnum.audio);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['wav']));
            expect((0, utils_1.getFileAppearanceType)('audio.wav', 'audio/vnd.wav'))
                .toBe(types_2.FileAppearanceTypeEnum.audio);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['amr']));
            expect((0, utils_1.getFileAppearanceType)('audio.amr', 'audio/AMR'))
                .toBe(types_2.FileAppearanceTypeEnum.audio);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mpga']));
            expect((0, utils_1.getFileAppearanceType)('audio.mpga', 'audio/mpeg'))
                .toBe(types_2.FileAppearanceTypeEnum.audio);
        });
        it('should identify code files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['html']));
            expect((0, utils_1.getFileAppearanceType)('index.html', 'text/html'))
                .toBe(types_2.FileAppearanceTypeEnum.code);
        });
        it('should identify PDF files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['pdf']));
            expect((0, utils_1.getFileAppearanceType)('doc.pdf', 'application/pdf'))
                .toBe(types_2.FileAppearanceTypeEnum.pdf);
        });
        it('should identify markdown files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['md']));
            expect((0, utils_1.getFileAppearanceType)('file.md', 'text/markdown'))
                .toBe(types_2.FileAppearanceTypeEnum.markdown);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['markdown']));
            expect((0, utils_1.getFileAppearanceType)('file.markdown', 'text/markdown'))
                .toBe(types_2.FileAppearanceTypeEnum.markdown);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['mdx']));
            expect((0, utils_1.getFileAppearanceType)('file.mdx', 'text/mdx'))
                .toBe(types_2.FileAppearanceTypeEnum.markdown);
        });
        it('should identify excel files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['xlsx']));
            expect((0, utils_1.getFileAppearanceType)('doc.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
                .toBe(types_2.FileAppearanceTypeEnum.excel);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['xls']));
            expect((0, utils_1.getFileAppearanceType)('doc.xls', 'application/vnd.ms-excel'))
                .toBe(types_2.FileAppearanceTypeEnum.excel);
        });
        it('should identify word files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['doc']));
            expect((0, utils_1.getFileAppearanceType)('doc.doc', 'application/msword'))
                .toBe(types_2.FileAppearanceTypeEnum.word);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['docx']));
            expect((0, utils_1.getFileAppearanceType)('doc.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
                .toBe(types_2.FileAppearanceTypeEnum.word);
        });
        it('should identify word files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['ppt']));
            expect((0, utils_1.getFileAppearanceType)('doc.ppt', 'application/vnd.ms-powerpoint'))
                .toBe(types_2.FileAppearanceTypeEnum.ppt);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['pptx']));
            expect((0, utils_1.getFileAppearanceType)('doc.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'))
                .toBe(types_2.FileAppearanceTypeEnum.ppt);
        });
        it('should identify document files', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['txt']));
            expect((0, utils_1.getFileAppearanceType)('file.txt', 'text/plain'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['csv']));
            expect((0, utils_1.getFileAppearanceType)('file.csv', 'text/csv'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['msg']));
            expect((0, utils_1.getFileAppearanceType)('file.msg', 'application/vnd.ms-outlook'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['eml']));
            expect((0, utils_1.getFileAppearanceType)('file.eml', 'message/rfc822'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['xml']));
            expect((0, utils_1.getFileAppearanceType)('file.xml', 'application/rssxml'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['epub']));
            expect((0, utils_1.getFileAppearanceType)('file.epub', 'application/epubzip'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
        });
        it('should handle null mime extension', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(null);
            expect((0, utils_1.getFileAppearanceType)('file.txt', 'text/plain'))
                .toBe(types_2.FileAppearanceTypeEnum.document);
        });
    });
    describe('getSupportFileType', () => {
        it('should return custom type when isCustom is true', () => {
            expect((0, utils_1.getSupportFileType)('file.txt', '', true))
                .toBe(types_1.SupportUploadFileTypes.custom);
        });
        it('should return file type when isCustom is false', () => {
            expect((0, utils_1.getSupportFileType)('file.txt', 'text/plain'))
                .toBe(types_1.SupportUploadFileTypes.document);
        });
    });
    describe('getProcessedFiles', () => {
        it('should process files correctly', () => {
            const files = [{
                    id: '123',
                    name: 'test.txt',
                    size: 1024,
                    type: 'text/plain',
                    progress: 100,
                    supportFileType: 'document',
                    transferMethod: app_1.TransferMethod.remote_url,
                    url: 'http://example.com',
                    uploadedId: '123',
                }];
            const result = (0, utils_1.getProcessedFiles)(files);
            expect(result[0]).toEqual({
                type: 'document',
                transfer_method: app_1.TransferMethod.remote_url,
                url: 'http://example.com',
                upload_file_id: '123',
            });
        });
    });
    describe('getProcessedFilesFromResponse', () => {
        beforeEach(() => {
            vi.mocked(mime_1.default.getAllExtensions).mockImplementation((mimeType) => {
                const mimeMap = {
                    'image/jpeg': new Set(['jpg', 'jpeg']),
                    'image/png': new Set(['png']),
                    'image/gif': new Set(['gif']),
                    'video/mp4': new Set(['mp4']),
                    'audio/mp3': new Set(['mp3']),
                    'application/pdf': new Set(['pdf']),
                    'text/plain': new Set(['txt']),
                    'application/json': new Set(['json']),
                };
                return mimeMap[mimeType] || new Set();
            });
        });
        it('should process files correctly without type correction', () => {
            const files = [{
                    related_id: '2a38e2ca-1295-415d-a51d-65d4ff9912d9',
                    extension: '.jpeg',
                    filename: 'test.jpeg',
                    size: 2881761,
                    mime_type: 'image/jpeg',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'image',
                    url: 'https://upload.dify.dev/files/xxx/file-preview',
                    upload_file_id: '2a38e2ca-1295-415d-a51d-65d4ff9912d9',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0]).toEqual({
                id: '2a38e2ca-1295-415d-a51d-65d4ff9912d9',
                name: 'test.jpeg',
                size: 2881761,
                type: 'image/jpeg',
                progress: 100,
                transferMethod: app_1.TransferMethod.local_file,
                supportFileType: 'image',
                uploadedId: '2a38e2ca-1295-415d-a51d-65d4ff9912d9',
                url: 'https://upload.dify.dev/files/xxx/file-preview',
            });
        });
        it('should correct image file misclassified as document', () => {
            const files = [{
                    related_id: '123',
                    extension: '.jpg',
                    filename: 'image.jpg',
                    size: 1024,
                    mime_type: 'image/jpeg',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/image.jpg',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('image');
        });
        it('should correct video file misclassified as document', () => {
            const files = [{
                    related_id: '123',
                    extension: '.mp4',
                    filename: 'video.mp4',
                    size: 1024,
                    mime_type: 'video/mp4',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/video.mp4',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('video');
        });
        it('should correct audio file misclassified as document', () => {
            const files = [{
                    related_id: '123',
                    extension: '.mp3',
                    filename: 'audio.mp3',
                    size: 1024,
                    mime_type: 'audio/mp3',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/audio.mp3',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('audio');
        });
        it('should correct document file misclassified as image', () => {
            const files = [{
                    related_id: '123',
                    extension: '.pdf',
                    filename: 'document.pdf',
                    size: 1024,
                    mime_type: 'application/pdf',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'image',
                    url: 'https://example.com/document.pdf',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('document');
        });
        it('should NOT correct when filename and MIME type conflict', () => {
            const files = [{
                    related_id: '123',
                    extension: '.pdf',
                    filename: 'document.pdf',
                    size: 1024,
                    mime_type: 'image/jpeg',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/document.pdf',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('document');
        });
        it('should NOT correct when filename and MIME type both point to wrong type', () => {
            const files = [{
                    related_id: '123',
                    extension: '.jpg',
                    filename: 'image.jpg',
                    size: 1024,
                    mime_type: 'image/jpeg',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'image',
                    url: 'https://example.com/image.jpg',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('image');
        });
        it('should handle files with missing filename', () => {
            const files = [{
                    related_id: '123',
                    extension: '',
                    filename: '',
                    size: 1024,
                    mime_type: 'image/jpeg',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/file',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('document');
        });
        it('should handle files with missing MIME type', () => {
            const files = [{
                    related_id: '123',
                    extension: '.jpg',
                    filename: 'image.jpg',
                    size: 1024,
                    mime_type: '',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/image.jpg',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('document');
        });
        it('should handle files with unknown extensions', () => {
            const files = [{
                    related_id: '123',
                    extension: '.unknown',
                    filename: 'file.unknown',
                    size: 1024,
                    mime_type: 'application/unknown',
                    transfer_method: app_1.TransferMethod.local_file,
                    type: 'document',
                    url: 'https://example.com/file.unknown',
                    upload_file_id: '123',
                    remote_url: '',
                }];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('document');
        });
        it('should handle multiple different file types correctly', () => {
            const files = [
                {
                    related_id: '1',
                    extension: '.jpg',
                    filename: 'correct-image.jpg',
                    mime_type: 'image/jpeg',
                    type: 'image',
                    size: 1024,
                    transfer_method: app_1.TransferMethod.local_file,
                    url: 'https://example.com/correct-image.jpg',
                    upload_file_id: '1',
                    remote_url: '',
                },
                {
                    related_id: '2',
                    extension: '.png',
                    filename: 'misclassified-image.png',
                    mime_type: 'image/png',
                    type: 'document',
                    size: 2048,
                    transfer_method: app_1.TransferMethod.local_file,
                    url: 'https://example.com/misclassified-image.png',
                    upload_file_id: '2',
                    remote_url: '',
                },
                {
                    related_id: '3',
                    extension: '.pdf',
                    filename: 'conflicted.pdf',
                    mime_type: 'image/jpeg',
                    type: 'document',
                    size: 3072,
                    transfer_method: app_1.TransferMethod.local_file,
                    url: 'https://example.com/conflicted.pdf',
                    upload_file_id: '3',
                    remote_url: '',
                },
            ];
            const result = (0, utils_1.getProcessedFilesFromResponse)(files);
            expect(result[0].supportFileType).toBe('image'); // correct, no change
            expect(result[1].supportFileType).toBe('image'); // corrected from document to image
            expect(result[2].supportFileType).toBe('document'); // conflict, no change
        });
    });
    describe('getFileNameFromUrl', () => {
        it('should extract filename from URL', () => {
            expect((0, utils_1.getFileNameFromUrl)('http://example.com/path/file.txt'))
                .toBe('file.txt');
        });
    });
    describe('getSupportFileExtensionList', () => {
        it('should handle custom file types', () => {
            const result = (0, utils_1.getSupportFileExtensionList)([types_1.SupportUploadFileTypes.custom], ['.pdf', '.txt', '.doc']);
            expect(result).toEqual(['PDF', 'TXT', 'DOC']);
        });
        it('should handle standard file types', () => {
            const mockFileExts = {
                image: ['JPG', 'PNG'],
                document: ['PDF', 'TXT'],
                video: ['MP4', 'MOV'],
            };
            // Temporarily mock FILE_EXTS
            const originalFileExts = { ...constants_1.FILE_EXTS };
            Object.assign(constants_1.FILE_EXTS, mockFileExts);
            const result = (0, utils_1.getSupportFileExtensionList)(['image', 'document'], []);
            expect(result).toEqual(['JPG', 'PNG', 'PDF', 'TXT']);
            // Restore original FILE_EXTS
            Object.assign(constants_1.FILE_EXTS, originalFileExts);
        });
        it('should return empty array for empty inputs', () => {
            const result = (0, utils_1.getSupportFileExtensionList)([], []);
            expect(result).toEqual([]);
        });
        it('should prioritize custom types over standard types', () => {
            const mockFileExts = {
                image: ['JPG', 'PNG'],
            };
            // Temporarily mock FILE_EXTS
            const originalFileExts = { ...constants_1.FILE_EXTS };
            Object.assign(constants_1.FILE_EXTS, mockFileExts);
            const result = (0, utils_1.getSupportFileExtensionList)([types_1.SupportUploadFileTypes.custom, 'image'], ['.csv', '.xml']);
            expect(result).toEqual(['CSV', 'XML']);
            // Restore original FILE_EXTS
            Object.assign(constants_1.FILE_EXTS, originalFileExts);
        });
    });
    describe('isAllowedFileExtension', () => {
        it('should validate allowed file extensions', () => {
            vi.mocked(mime_1.default.getAllExtensions).mockReturnValue(new Set(['pdf']));
            expect((0, utils_1.isAllowedFileExtension)('test.pdf', 'application/pdf', ['document'], ['.pdf'])).toBe(true);
        });
    });
    describe('getFilesInLogs', () => {
        const mockFileData = {
            dify_model_identity: '__dify__file__',
            related_id: '123',
            filename: 'test.pdf',
            size: 1024,
            mime_type: 'application/pdf',
            transfer_method: 'local_file',
            type: 'document',
            url: 'http://example.com/test.pdf',
        };
        it('should handle empty or null input', () => {
            expect((0, utils_1.getFilesInLogs)(null)).toEqual([]);
            expect((0, utils_1.getFilesInLogs)({})).toEqual([]);
            expect((0, utils_1.getFilesInLogs)(undefined)).toEqual([]);
        });
        it('should process single file object', () => {
            const input = {
                file1: mockFileData,
            };
            const expected = [{
                    varName: 'file1',
                    list: [{
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        }],
                }];
            expect((0, utils_1.getFilesInLogs)(input)).toEqual(expected);
        });
        it('should process array of files', () => {
            const input = {
                files: [mockFileData, mockFileData],
            };
            const expected = [{
                    varName: 'files',
                    list: [
                        {
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        },
                        {
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        },
                    ],
                }];
            expect((0, utils_1.getFilesInLogs)(input)).toEqual(expected);
        });
        it('should ignore non-file objects and arrays', () => {
            const input = {
                regularString: 'not a file',
                regularNumber: 123,
                regularArray: [1, 2, 3],
                regularObject: { key: 'value' },
                file: mockFileData,
            };
            const expected = [{
                    varName: 'file',
                    list: [{
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        }],
                }];
            expect((0, utils_1.getFilesInLogs)(input)).toEqual(expected);
        });
        it('should handle mixed file types in array', () => {
            const input = {
                mixedFiles: [
                    mockFileData,
                    { notAFile: true },
                    mockFileData,
                ],
            };
            const expected = [{
                    varName: 'mixedFiles',
                    list: [
                        {
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        },
                        {
                            id: undefined,
                            name: undefined,
                            progress: 100,
                            size: 0,
                            supportFileType: undefined,
                            transferMethod: undefined,
                            type: undefined,
                            uploadedId: undefined,
                            url: undefined,
                        },
                        {
                            id: '123',
                            name: 'test.pdf',
                            size: 1024,
                            type: 'application/pdf',
                            progress: 100,
                            transferMethod: 'local_file',
                            supportFileType: 'document',
                            uploadedId: '123',
                            url: 'http://example.com/test.pdf',
                        },
                    ],
                }];
            expect((0, utils_1.getFilesInLogs)(input)).toEqual(expected);
        });
    });
    describe('fileIsUploaded', () => {
        it('should identify uploaded files', () => {
            expect((0, utils_1.fileIsUploaded)({
                uploadedId: '123',
                progress: 100,
            })).toBe(true);
        });
        it('should identify remote files as uploaded', () => {
            expect((0, utils_1.fileIsUploaded)({
                transferMethod: app_1.TransferMethod.remote_url,
                progress: 100,
            })).toBe(true);
        });
    });
    describe('downloadFile', () => {
        let mockAnchor;
        let createElementMock;
        let appendChildMock;
        let removeChildMock;
        beforeEach(() => {
            // Mock createElement and appendChild
            mockAnchor = {
                href: '',
                download: '',
                style: { display: '' },
                target: '',
                title: '',
                click: vi.fn(),
            };
            createElementMock = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
            appendChildMock = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
                return node;
            });
            removeChildMock = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => {
                return node;
            });
        });
        afterEach(() => {
            vi.resetAllMocks();
        });
        it('should create and trigger download with correct attributes', () => {
            const url = 'https://example.com/test.pdf';
            const filename = 'test.pdf';
            (0, utils_1.downloadFile)(url, filename);
            // Verify anchor element was created with correct properties
            expect(createElementMock).toHaveBeenCalledWith('a');
            expect(mockAnchor.href).toBe(url);
            expect(mockAnchor.download).toBe(filename);
            expect(mockAnchor.style.display).toBe('none');
            expect(mockAnchor.target).toBe('_blank');
            expect(mockAnchor.title).toBe(filename);
            // Verify DOM operations
            expect(appendChildMock).toHaveBeenCalledWith(mockAnchor);
            expect(mockAnchor.click).toHaveBeenCalled();
            expect(removeChildMock).toHaveBeenCalledWith(mockAnchor);
        });
        it('should handle empty filename', () => {
            const url = 'https://example.com/test.pdf';
            const filename = '';
            (0, utils_1.downloadFile)(url, filename);
            expect(mockAnchor.download).toBe('');
            expect(mockAnchor.title).toBe('');
        });
        it('should handle empty url', () => {
            const url = '';
            const filename = 'test.pdf';
            (0, utils_1.downloadFile)(url, filename);
            expect(mockAnchor.href).toBe('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBdUI7QUFDdkIsMkRBQXdFO0FBQ3hFLHlDQUF1QztBQUN2QyxxQ0FBNEM7QUFDNUMsMERBQXNEO0FBQ3RELG1DQUFnRDtBQUNoRCxtQ0FhZ0I7QUFFaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNyQixPQUFPLEVBQUU7UUFDUCxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQzFCO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDaEIsQ0FBQyxDQUFDLENBQUE7QUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7WUFDL0MsTUFBTSxhQUFhLEdBQUc7Z0JBQ3BCLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFCLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO2FBQ3pCLENBQUE7WUFFRCxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQU0sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7WUFFbEQsSUFBQSxrQkFBVSxFQUFDO2dCQUNULElBQUksRUFBRSxRQUFRO2dCQUNkLEdBQUcsYUFBYTthQUNqQixDQUFDLENBQUE7WUFFRixNQUFNLENBQUMsYUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUNuQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxFQUFFLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzVDLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxJQUFBLHdCQUFnQixFQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRSxNQUFNLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNyRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvRkFBb0YsRUFBRSxHQUFHLEVBQUU7WUFDNUYsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoRixNQUFNLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxVQUFVLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx1RkFBdUYsRUFBRSxHQUFHLEVBQUU7WUFDL0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoRixNQUFNLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxNQUFNLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM1RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdEQsTUFBTSxDQUFDLElBQUEsd0JBQWdCLEVBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BELE1BQU0sQ0FBQyxJQUFBLHdCQUFnQixFQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUMxRCxNQUFNLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDL0MsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE1BQU0sQ0FBQyxJQUFBLHdCQUFnQixFQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFD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QUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2tJbnN0YW5jZSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCBtaW1lIGZyb20gJ21pbWUnXG5pbXBvcnQgeyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVwbG9hZCB9IGZyb20gJ0Avc2VydmljZS9iYXNlJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IEZJTEVfRVhUUyB9IGZyb20gJy4uL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IHsgRmlsZUFwcGVhcmFuY2VUeXBlRW51bSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQge1xuICBkb3dubG9hZEZpbGUsXG4gIGZpbGVJc1VwbG9hZGVkLFxuICBmaWxlVXBsb2FkLFxuICBnZXRGaWxlQXBwZWFyYW5jZVR5cGUsXG4gIGdldEZpbGVFeHRlbnNpb24sXG4gIGdldEZpbGVOYW1lRnJvbVVybCxcbiAgZ2V0RmlsZXNJbkxvZ3MsXG4gIGdldFByb2Nlc3NlZEZpbGVzLFxuICBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZSxcbiAgZ2V0U3VwcG9ydEZpbGVFeHRlbnNpb25MaXN0LFxuICBnZXRTdXBwb3J0RmlsZVR5cGUsXG4gIGlzQWxsb3dlZEZpbGVFeHRlbnNpb24sXG59IGZyb20gJy4vdXRpbHMnXG5cbnZpLm1vY2soJ21pbWUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgZ2V0QWxsRXh0ZW5zaW9uczogdmkuZm4oKSxcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvYmFzZScsICgpID0+ICh7XG4gIHVwbG9hZDogdmkuZm4oKSxcbn0pKVxuXG5kZXNjcmliZSgnZmlsZS11cGxvYWRlciB1dGlscycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2ZpbGVVcGxvYWQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3VjY2Vzc2Z1bCBmaWxlIHVwbG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tGaWxlID0gbmV3IEZpbGUoWyd0ZXN0J10sICd0ZXN0LnR4dCcpXG4gICAgICBjb25zdCBtb2NrQ2FsbGJhY2tzID0ge1xuICAgICAgICBvblByb2dyZXNzQ2FsbGJhY2s6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2Vzc0NhbGxiYWNrOiB2aS5mbigpLFxuICAgICAgICBvbkVycm9yQ2FsbGJhY2s6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHZpLm1vY2tlZCh1cGxvYWQpLm1vY2tSZXNvbHZlZFZhbHVlKHsgaWQ6ICcxMjMnIH0pXG5cbiAgICAgIGZpbGVVcGxvYWQoe1xuICAgICAgICBmaWxlOiBtb2NrRmlsZSxcbiAgICAgICAgLi4ubW9ja0NhbGxiYWNrcyxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdCh1cGxvYWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldEZpbGVFeHRlbnNpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBnZXQgZXh0ZW5zaW9uIGZyb20gbWltZXR5cGUnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3BkZiddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdmaWxlJywgJ2FwcGxpY2F0aW9uL3BkZicpKS50b0JlKCdwZGYnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGdldCBleHRlbnNpb24gZnJvbSBtaW1ldHlwZSBhbmQgZmlsZSBuYW1lIDEnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3BkZiddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdmaWxlLnBkZicsICdhcHBsaWNhdGlvbi9wZGYnKSkudG9CZSgncGRmJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBnZXQgZXh0ZW5zaW9uIGZyb20gbWltZXR5cGUgd2l0aCBtdWx0aXBsZSBleHQgY2FuZGlkYXRlcyB3aXRoIGZpbGVuYW1lIGhpbnQnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ2RlcicsICdjcnQnLCAncGVtJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2ZpbGUucGVtJywgJ2FwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0JykpLnRvQmUoJ3BlbScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZ2V0IGV4dGVuc2lvbiBmcm9tIG1pbWV0eXBlIHdpdGggbXVsdGlwbGUgZXh0IGNhbmRpZGF0ZXMgd2l0aG91dCBmaWxlbmFtZSBoaW50JywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydkZXInLCAnY3J0JywgJ3BlbSddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdmaWxlJywgJ2FwcGxpY2F0aW9uL3gteDUwOS1jYS1jZXJ0JykpLnRvQmUoJ2RlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZ2V0IGV4dGVuc2lvbiBmcm9tIGZpbGVuYW1lIGlmIG1pbWV0eXBlIGZhaWxzJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG51bGwpXG4gICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS50eHQnLCAnJykpLnRvQmUoJ3R4dCcpXG4gICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS50eHQuZG9jeCcsICcnKSkudG9CZSgnZG9jeCcpXG4gICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZScsICcnKSkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgc3RyaW5nIGZvciByZW1vdGUgZmlsZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS50eHQnLCAnJywgdHJ1ZSkpLnRvQmUoJycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RmlsZUFwcGVhcmFuY2VUeXBlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaWRlbnRpZnkgZ2lmIGZpbGVzJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydnaWYnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdpbWFnZS5naWYnLCAnaW1hZ2UvZ2lmJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uZ2lmKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IGltYWdlIGZpbGVzJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydqcGcnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdpbWFnZS5qcGcnLCAnaW1hZ2UvanBlZycpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmltYWdlKVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ2pwZWcnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdpbWFnZS5qcGVnJywgJ2ltYWdlL2pwZWcnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5pbWFnZSlcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydwbmcnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdpbWFnZS5wbmcnLCAnaW1hZ2UvcG5nJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uaW1hZ2UpXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnd2VicCddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2ltYWdlLndlYnAnLCAnaW1hZ2Uvd2VicCcpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmltYWdlKVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3N2ZyddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2ltYWdlLnN2ZycsICdpbWFnZS9zdmd4bWwnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5pbWFnZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpZGVudGlmeSB2aWRlbyBmaWxlcycsICgpID0+IHtcbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnbXA0J10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgndmlkZW8ubXA0JywgJ3ZpZGVvL21wNCcpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLnZpZGVvKVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ21vdiddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ3ZpZGVvLm1vdicsICd2aWRlby9xdWlja3RpbWUnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS52aWRlbylcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydtcGVnJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgndmlkZW8ubXBlZycsICd2aWRlby9tcGVnJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0udmlkZW8pXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnd2VibSddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ3ZpZGVvLndlYicsICd2aWRlby93ZWJtJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0udmlkZW8pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaWRlbnRpZnkgYXVkaW8gZmlsZXMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ21wMyddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2F1ZGlvLm1wMycsICdhdWRpby9tcGVnJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uYXVkaW8pXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnbTRhJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnYXVkaW8ubTRhJywgJ2F1ZGlvL21wNCcpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmF1ZGlvKVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3dhdiddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2F1ZGlvLndhdicsICdhdWRpby92bmQud2F2JykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uYXVkaW8pXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnYW1yJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnYXVkaW8uYW1yJywgJ2F1ZGlvL0FNUicpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmF1ZGlvKVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ21wZ2EnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdhdWRpby5tcGdhJywgJ2F1ZGlvL21wZWcnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5hdWRpbylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpZGVudGlmeSBjb2RlIGZpbGVzJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydodG1sJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnaW5kZXguaHRtbCcsICd0ZXh0L2h0bWwnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5jb2RlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IFBERiBmaWxlcycsICgpID0+IHtcbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsncGRmJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZG9jLnBkZicsICdhcHBsaWNhdGlvbi9wZGYnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wZGYpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaWRlbnRpZnkgbWFya2Rvd24gZmlsZXMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ21kJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZmlsZS5tZCcsICd0ZXh0L21hcmtkb3duJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ubWFya2Rvd24pXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnbWFya2Rvd24nXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdmaWxlLm1hcmtkb3duJywgJ3RleHQvbWFya2Rvd24nKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5tYXJrZG93bilcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydtZHgnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdmaWxlLm1keCcsICd0ZXh0L21keCcpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLm1hcmtkb3duKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IGV4Y2VsIGZpbGVzJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWyd4bHN4J10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZG9jLnhsc3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5leGNlbClcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWyd4bHMnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdkb2MueGxzJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmV4Y2VsKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IHdvcmQgZmlsZXMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ2RvYyddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2RvYy5kb2MnLCAnYXBwbGljYXRpb24vbXN3b3JkJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ud29yZClcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydkb2N4J10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZG9jLmRvY3gnLCAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS53b3JkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IHdvcmQgZmlsZXMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3BwdCddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2RvYy5wcHQnLCAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wcHQpXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsncHB0eCddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2RvYy5wcHR4JywgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wcHQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaWRlbnRpZnkgZG9jdW1lbnQgZmlsZXMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3R4dCddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2ZpbGUudHh0JywgJ3RleHQvcGxhaW4nKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudClcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydjc3YnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdmaWxlLmNzdicsICd0ZXh0L2NzdicpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmRvY3VtZW50KVxuXG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ21zZyddKSlcbiAgICAgIGV4cGVjdChnZXRGaWxlQXBwZWFyYW5jZVR5cGUoJ2ZpbGUubXNnJywgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1vdXRsb29rJykpXG4gICAgICAgIC50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uZG9jdW1lbnQpXG5cbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShuZXcgU2V0KFsnZW1sJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZmlsZS5lbWwnLCAnbWVzc2FnZS9yZmM4MjInKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudClcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWyd4bWwnXSkpXG4gICAgICBleHBlY3QoZ2V0RmlsZUFwcGVhcmFuY2VUeXBlKCdmaWxlLnhtbCcsICdhcHBsaWNhdGlvbi9yc3N4bWwnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudClcblxuICAgICAgdmkubW9ja2VkKG1pbWUuZ2V0QWxsRXh0ZW5zaW9ucykubW9ja1JldHVyblZhbHVlKG5ldyBTZXQoWydlcHViJ10pKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZmlsZS5lcHViJywgJ2FwcGxpY2F0aW9uL2VwdWJ6aXAnKSlcbiAgICAgICAgLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBtaW1lIGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgZXhwZWN0KGdldEZpbGVBcHBlYXJhbmNlVHlwZSgnZmlsZS50eHQnLCAndGV4dC9wbGFpbicpKVxuICAgICAgICAudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmRvY3VtZW50KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldFN1cHBvcnRGaWxlVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjdXN0b20gdHlwZSB3aGVuIGlzQ3VzdG9tIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0U3VwcG9ydEZpbGVUeXBlKCdmaWxlLnR4dCcsICcnLCB0cnVlKSlcbiAgICAgICAgLnRvQmUoU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5jdXN0b20pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpbGUgdHlwZSB3aGVuIGlzQ3VzdG9tIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldFN1cHBvcnRGaWxlVHlwZSgnZmlsZS50eHQnLCAndGV4dC9wbGFpbicpKVxuICAgICAgICAudG9CZShTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmRvY3VtZW50KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldFByb2Nlc3NlZEZpbGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvY2VzcyBmaWxlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IFt7XG4gICAgICAgIGlkOiAnMTIzJyxcbiAgICAgICAgbmFtZTogJ3Rlc3QudHh0JyxcbiAgICAgICAgc2l6ZTogMTAyNCxcbiAgICAgICAgdHlwZTogJ3RleHQvcGxhaW4nLFxuICAgICAgICBwcm9ncmVzczogMTAwLFxuICAgICAgICBzdXBwb3J0RmlsZVR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgIHRyYW5zZmVyTWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5yZW1vdGVfdXJsLFxuICAgICAgICB1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICB1cGxvYWRlZElkOiAnMTIzJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIHR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QucmVtb3RlX3VybCxcbiAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcxMjMnLFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHZpLm1vY2tlZChtaW1lLmdldEFsbEV4dGVuc2lvbnMpLm1vY2tJbXBsZW1lbnRhdGlvbigobWltZVR5cGU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBtaW1lTWFwOiBSZWNvcmQ8c3RyaW5nLCBTZXQ8c3RyaW5nPj4gPSB7XG4gICAgICAgICAgJ2ltYWdlL2pwZWcnOiBuZXcgU2V0KFsnanBnJywgJ2pwZWcnXSksXG4gICAgICAgICAgJ2ltYWdlL3BuZyc6IG5ldyBTZXQoWydwbmcnXSksXG4gICAgICAgICAgJ2ltYWdlL2dpZic6IG5ldyBTZXQoWydnaWYnXSksXG4gICAgICAgICAgJ3ZpZGVvL21wNCc6IG5ldyBTZXQoWydtcDQnXSksXG4gICAgICAgICAgJ2F1ZGlvL21wMyc6IG5ldyBTZXQoWydtcDMnXSksXG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL3BkZic6IG5ldyBTZXQoWydwZGYnXSksXG4gICAgICAgICAgJ3RleHQvcGxhaW4nOiBuZXcgU2V0KFsndHh0J10pLFxuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogbmV3IFNldChbJ2pzb24nXSksXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbWVNYXBbbWltZVR5cGVdIHx8IG5ldyBTZXQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm9jZXNzIGZpbGVzIGNvcnJlY3RseSB3aXRob3V0IHR5cGUgY29ycmVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gW3tcbiAgICAgICAgcmVsYXRlZF9pZDogJzJhMzhlMmNhLTEyOTUtNDE1ZC1hNTFkLTY1ZDRmZjk5MTJkOScsXG4gICAgICAgIGV4dGVuc2lvbjogJy5qcGVnJyxcbiAgICAgICAgZmlsZW5hbWU6ICd0ZXN0LmpwZWcnLFxuICAgICAgICBzaXplOiAyODgxNzYxLFxuICAgICAgICBtaW1lX3R5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICB1cmw6ICdodHRwczovL3VwbG9hZC5kaWZ5LmRldi9maWxlcy94eHgvZmlsZS1wcmV2aWV3JyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcyYTM4ZTJjYS0xMjk1LTQxNWQtYTUxZC02NWQ0ZmY5OTEyZDknLFxuICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9FcXVhbCh7XG4gICAgICAgIGlkOiAnMmEzOGUyY2EtMTI5NS00MTVkLWE1MWQtNjVkNGZmOTkxMmQ5JyxcbiAgICAgICAgbmFtZTogJ3Rlc3QuanBlZycsXG4gICAgICAgIHNpemU6IDI4ODE3NjEsXG4gICAgICAgIHR5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICAgICAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgIHN1cHBvcnRGaWxlVHlwZTogJ2ltYWdlJyxcbiAgICAgICAgdXBsb2FkZWRJZDogJzJhMzhlMmNhLTEyOTUtNDE1ZC1hNTFkLTY1ZDRmZjk5MTJkOScsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vdXBsb2FkLmRpZnkuZGV2L2ZpbGVzL3h4eC9maWxlLXByZXZpZXcnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0IGltYWdlIGZpbGUgbWlzY2xhc3NpZmllZCBhcyBkb2N1bWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gW3tcbiAgICAgICAgcmVsYXRlZF9pZDogJzEyMycsXG4gICAgICAgIGV4dGVuc2lvbjogJy5qcGcnLFxuICAgICAgICBmaWxlbmFtZTogJ2ltYWdlLmpwZycsXG4gICAgICAgIHNpemU6IDEwMjQsXG4gICAgICAgIG1pbWVfdHlwZTogJ2ltYWdlL2pwZWcnLFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgIHR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UuanBnJyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcxMjMnLFxuICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXS5zdXBwb3J0RmlsZVR5cGUpLnRvQmUoJ2ltYWdlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0IHZpZGVvIGZpbGUgbWlzY2xhc3NpZmllZCBhcyBkb2N1bWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gW3tcbiAgICAgICAgcmVsYXRlZF9pZDogJzEyMycsXG4gICAgICAgIGV4dGVuc2lvbjogJy5tcDQnLFxuICAgICAgICBmaWxlbmFtZTogJ3ZpZGVvLm1wNCcsXG4gICAgICAgIHNpemU6IDEwMjQsXG4gICAgICAgIG1pbWVfdHlwZTogJ3ZpZGVvL21wNCcsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgICAgdHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS92aWRlby5tcDQnLFxuICAgICAgICB1cGxvYWRfZmlsZV9pZDogJzEyMycsXG4gICAgICAgIHJlbW90ZV91cmw6ICcnLFxuICAgICAgfV1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UoZmlsZXMpXG4gICAgICBleHBlY3QocmVzdWx0WzBdLnN1cHBvcnRGaWxlVHlwZSkudG9CZSgndmlkZW8nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvcnJlY3QgYXVkaW8gZmlsZSBtaXNjbGFzc2lmaWVkIGFzIGRvY3VtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbe1xuICAgICAgICByZWxhdGVkX2lkOiAnMTIzJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnLm1wMycsXG4gICAgICAgIGZpbGVuYW1lOiAnYXVkaW8ubXAzJyxcbiAgICAgICAgc2l6ZTogMTAyNCxcbiAgICAgICAgbWltZV90eXBlOiAnYXVkaW8vbXAzJyxcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2F1ZGlvLm1wMycsXG4gICAgICAgIHVwbG9hZF9maWxlX2lkOiAnMTIzJyxcbiAgICAgICAgcmVtb3RlX3VybDogJycsXG4gICAgICB9XVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShmaWxlcylcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0uc3VwcG9ydEZpbGVUeXBlKS50b0JlKCdhdWRpbycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdCBkb2N1bWVudCBmaWxlIG1pc2NsYXNzaWZpZWQgYXMgaW1hZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IFt7XG4gICAgICAgIHJlbGF0ZWRfaWQ6ICcxMjMnLFxuICAgICAgICBleHRlbnNpb246ICcucGRmJyxcbiAgICAgICAgZmlsZW5hbWU6ICdkb2N1bWVudC5wZGYnLFxuICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICBtaW1lX3R5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vZG9jdW1lbnQucGRmJyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcxMjMnLFxuICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXS5zdXBwb3J0RmlsZVR5cGUpLnRvQmUoJ2RvY3VtZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBOT1QgY29ycmVjdCB3aGVuIGZpbGVuYW1lIGFuZCBNSU1FIHR5cGUgY29uZmxpY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IFt7XG4gICAgICAgIHJlbGF0ZWRfaWQ6ICcxMjMnLFxuICAgICAgICBleHRlbnNpb246ICcucGRmJyxcbiAgICAgICAgZmlsZW5hbWU6ICdkb2N1bWVudC5wZGYnLFxuICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICBtaW1lX3R5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2RvY3VtZW50LnBkZicsXG4gICAgICAgIHVwbG9hZF9maWxlX2lkOiAnMTIzJyxcbiAgICAgICAgcmVtb3RlX3VybDogJycsXG4gICAgICB9XVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShmaWxlcylcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0uc3VwcG9ydEZpbGVUeXBlKS50b0JlKCdkb2N1bWVudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgTk9UIGNvcnJlY3Qgd2hlbiBmaWxlbmFtZSBhbmQgTUlNRSB0eXBlIGJvdGggcG9pbnQgdG8gd3JvbmcgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVzID0gW3tcbiAgICAgICAgcmVsYXRlZF9pZDogJzEyMycsXG4gICAgICAgIGV4dGVuc2lvbjogJy5qcGcnLFxuICAgICAgICBmaWxlbmFtZTogJ2ltYWdlLmpwZycsXG4gICAgICAgIHNpemU6IDEwMjQsXG4gICAgICAgIG1pbWVfdHlwZTogJ2ltYWdlL2pwZWcnLFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaW1hZ2UuanBnJyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcxMjMnLFxuICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXS5zdXBwb3J0RmlsZVR5cGUpLnRvQmUoJ2ltYWdlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZXMgd2l0aCBtaXNzaW5nIGZpbGVuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbe1xuICAgICAgICByZWxhdGVkX2lkOiAnMTIzJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnJyxcbiAgICAgICAgZmlsZW5hbWU6ICcnLFxuICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICBtaW1lX3R5cGU6ICdpbWFnZS9qcGVnJyxcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ZpbGUnLFxuICAgICAgICB1cGxvYWRfZmlsZV9pZDogJzEyMycsXG4gICAgICAgIHJlbW90ZV91cmw6ICcnLFxuICAgICAgfV1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UoZmlsZXMpXG4gICAgICBleHBlY3QocmVzdWx0WzBdLnN1cHBvcnRGaWxlVHlwZSkudG9CZSgnZG9jdW1lbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlcyB3aXRoIG1pc3NpbmcgTUlNRSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbe1xuICAgICAgICByZWxhdGVkX2lkOiAnMTIzJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnLmpwZycsXG4gICAgICAgIGZpbGVuYW1lOiAnaW1hZ2UuanBnJyxcbiAgICAgICAgc2l6ZTogMTAyNCxcbiAgICAgICAgbWltZV90eXBlOiAnJyxcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ltYWdlLmpwZycsXG4gICAgICAgIHVwbG9hZF9maWxlX2lkOiAnMTIzJyxcbiAgICAgICAgcmVtb3RlX3VybDogJycsXG4gICAgICB9XVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRQcm9jZXNzZWRGaWxlc0Zyb21SZXNwb25zZShmaWxlcylcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0uc3VwcG9ydEZpbGVUeXBlKS50b0JlKCdkb2N1bWVudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGVzIHdpdGggdW5rbm93biBleHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbe1xuICAgICAgICByZWxhdGVkX2lkOiAnMTIzJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnLnVua25vd24nLFxuICAgICAgICBmaWxlbmFtZTogJ2ZpbGUudW5rbm93bicsXG4gICAgICAgIHNpemU6IDEwMjQsXG4gICAgICAgIG1pbWVfdHlwZTogJ2FwcGxpY2F0aW9uL3Vua25vd24nLFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgIHR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vZmlsZS51bmtub3duJyxcbiAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICcxMjMnLFxuICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgIH1dXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFByb2Nlc3NlZEZpbGVzRnJvbVJlc3BvbnNlKGZpbGVzKVxuICAgICAgZXhwZWN0KHJlc3VsdFswXS5zdXBwb3J0RmlsZVR5cGUpLnRvQmUoJ2RvY3VtZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgZGlmZmVyZW50IGZpbGUgdHlwZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICByZWxhdGVkX2lkOiAnMScsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAnLmpwZycsXG4gICAgICAgICAgZmlsZW5hbWU6ICdjb3JyZWN0LWltYWdlLmpwZycsXG4gICAgICAgICAgbWltZV90eXBlOiAnaW1hZ2UvanBlZycsXG4gICAgICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2NvcnJlY3QtaW1hZ2UuanBnJyxcbiAgICAgICAgICB1cGxvYWRfZmlsZV9pZDogJzEnLFxuICAgICAgICAgIHJlbW90ZV91cmw6ICcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVsYXRlZF9pZDogJzInLFxuICAgICAgICAgIGV4dGVuc2lvbjogJy5wbmcnLFxuICAgICAgICAgIGZpbGVuYW1lOiAnbWlzY2xhc3NpZmllZC1pbWFnZS5wbmcnLFxuICAgICAgICAgIG1pbWVfdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgdHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgICBzaXplOiAyMDQ4LFxuICAgICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgICAgICB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tL21pc2NsYXNzaWZpZWQtaW1hZ2UucG5nJyxcbiAgICAgICAgICB1cGxvYWRfZmlsZV9pZDogJzInLFxuICAgICAgICAgIHJlbW90ZV91cmw6ICcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVsYXRlZF9pZDogJzMnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJy5wZGYnLFxuICAgICAgICAgIGZpbGVuYW1lOiAnY29uZmxpY3RlZC5wZGYnLFxuICAgICAgICAgIG1pbWVfdHlwZTogJ2ltYWdlL2pwZWcnLFxuICAgICAgICAgIHR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgICAgc2l6ZTogMzA3MixcbiAgICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jb25mbGljdGVkLnBkZicsXG4gICAgICAgICAgdXBsb2FkX2ZpbGVfaWQ6ICczJyxcbiAgICAgICAgICByZW1vdGVfdXJsOiAnJyxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0UHJvY2Vzc2VkRmlsZXNGcm9tUmVzcG9uc2UoZmlsZXMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHRbMF0uc3VwcG9ydEZpbGVUeXBlKS50b0JlKCdpbWFnZScpIC8vIGNvcnJlY3QsIG5vIGNoYW5nZVxuICAgICAgZXhwZWN0KHJlc3VsdFsxXS5zdXBwb3J0RmlsZVR5cGUpLnRvQmUoJ2ltYWdlJykgLy8gY29ycmVjdGVkIGZyb20gZG9jdW1lbnQgdG8gaW1hZ2VcbiAgICAgIGV4cGVjdChyZXN1bHRbMl0uc3VwcG9ydEZpbGVUeXBlKS50b0JlKCdkb2N1bWVudCcpIC8vIGNvbmZsaWN0LCBubyBjaGFuZ2VcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRGaWxlTmFtZUZyb21VcmwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IGZpbGVuYW1lIGZyb20gVVJMJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEZpbGVOYW1lRnJvbVVybCgnaHR0cDovL2V4YW1wbGUuY29tL3BhdGgvZmlsZS50eHQnKSlcbiAgICAgICAgLnRvQmUoJ2ZpbGUudHh0JylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRTdXBwb3J0RmlsZUV4dGVuc2lvbkxpc3QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3VzdG9tIGZpbGUgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRTdXBwb3J0RmlsZUV4dGVuc2lvbkxpc3QoXG4gICAgICAgIFtTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmN1c3RvbV0sXG4gICAgICAgIFsnLnBkZicsICcudHh0JywgJy5kb2MnXSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydQREYnLCAnVFhUJywgJ0RPQyddKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGFuZGFyZCBmaWxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0ZpbGVFeHRzID0ge1xuICAgICAgICBpbWFnZTogWydKUEcnLCAnUE5HJ10sXG4gICAgICAgIGRvY3VtZW50OiBbJ1BERicsICdUWFQnXSxcbiAgICAgICAgdmlkZW86IFsnTVA0JywgJ01PViddLFxuICAgICAgfVxuXG4gICAgICAvLyBUZW1wb3JhcmlseSBtb2NrIEZJTEVfRVhUU1xuICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXh0cyA9IHsgLi4uRklMRV9FWFRTIH1cbiAgICAgIE9iamVjdC5hc3NpZ24oRklMRV9FWFRTLCBtb2NrRmlsZUV4dHMpXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFN1cHBvcnRGaWxlRXh0ZW5zaW9uTGlzdChcbiAgICAgICAgWydpbWFnZScsICdkb2N1bWVudCddLFxuICAgICAgICBbXSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydKUEcnLCAnUE5HJywgJ1BERicsICdUWFQnXSlcblxuICAgICAgLy8gUmVzdG9yZSBvcmlnaW5hbCBGSUxFX0VYVFNcbiAgICAgIE9iamVjdC5hc3NpZ24oRklMRV9FWFRTLCBvcmlnaW5hbEZpbGVFeHRzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSBmb3IgZW1wdHkgaW5wdXRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0U3VwcG9ydEZpbGVFeHRlbnNpb25MaXN0KFtdLCBbXSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJpb3JpdGl6ZSBjdXN0b20gdHlwZXMgb3ZlciBzdGFuZGFyZCB0eXBlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tGaWxlRXh0cyA9IHtcbiAgICAgICAgaW1hZ2U6IFsnSlBHJywgJ1BORyddLFxuICAgICAgfVxuXG4gICAgICAvLyBUZW1wb3JhcmlseSBtb2NrIEZJTEVfRVhUU1xuICAgICAgY29uc3Qgb3JpZ2luYWxGaWxlRXh0cyA9IHsgLi4uRklMRV9FWFRTIH1cbiAgICAgIE9iamVjdC5hc3NpZ24oRklMRV9FWFRTLCBtb2NrRmlsZUV4dHMpXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldFN1cHBvcnRGaWxlRXh0ZW5zaW9uTGlzdChcbiAgICAgICAgW1N1cHBvcnRVcGxvYWRGaWxlVHlwZXMuY3VzdG9tLCAnaW1hZ2UnXSxcbiAgICAgICAgWycuY3N2JywgJy54bWwnXSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydDU1YnLCAnWE1MJ10pXG5cbiAgICAgIC8vIFJlc3RvcmUgb3JpZ2luYWwgRklMRV9FWFRTXG4gICAgICBPYmplY3QuYXNzaWduKEZJTEVfRVhUUywgb3JpZ2luYWxGaWxlRXh0cylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdpc0FsbG93ZWRGaWxlRXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgYWxsb3dlZCBmaWxlIGV4dGVuc2lvbnMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQobWltZS5nZXRBbGxFeHRlbnNpb25zKS5tb2NrUmV0dXJuVmFsdWUobmV3IFNldChbJ3BkZiddKSlcbiAgICAgIGV4cGVjdChpc0FsbG93ZWRGaWxlRXh0ZW5zaW9uKFxuICAgICAgICAndGVzdC5wZGYnLFxuICAgICAgICAnYXBwbGljYXRpb24vcGRmJyxcbiAgICAgICAgWydkb2N1bWVudCddLFxuICAgICAgICBbJy5wZGYnXSxcbiAgICAgICkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRGaWxlc0luTG9ncycsICgpID0+IHtcbiAgICBjb25zdCBtb2NrRmlsZURhdGEgPSB7XG4gICAgICBkaWZ5X21vZGVsX2lkZW50aXR5OiAnX19kaWZ5X19maWxlX18nLFxuICAgICAgcmVsYXRlZF9pZDogJzEyMycsXG4gICAgICBmaWxlbmFtZTogJ3Rlc3QucGRmJyxcbiAgICAgIHNpemU6IDEwMjQsXG4gICAgICBtaW1lX3R5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgICAgdHJhbnNmZXJfbWV0aG9kOiAnbG9jYWxfZmlsZScsXG4gICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBvciBudWxsIGlucHV0JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEZpbGVzSW5Mb2dzKG51bGwpKS50b0VxdWFsKFtdKVxuICAgICAgZXhwZWN0KGdldEZpbGVzSW5Mb2dzKHt9KSkudG9FcXVhbChbXSlcbiAgICAgIGV4cGVjdChnZXRGaWxlc0luTG9ncyh1bmRlZmluZWQpKS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByb2Nlc3Mgc2luZ2xlIGZpbGUgb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIGZpbGUxOiBtb2NrRmlsZURhdGEsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gW3tcbiAgICAgICAgdmFyTmFtZTogJ2ZpbGUxJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICBpZDogJzEyMycsXG4gICAgICAgICAgbmFtZTogJ3Rlc3QucGRmJyxcbiAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgICAgICAgIHByb2dyZXNzOiAxMDAsXG4gICAgICAgICAgdHJhbnNmZXJNZXRob2Q6ICdsb2NhbF9maWxlJyxcbiAgICAgICAgICBzdXBwb3J0RmlsZVR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgICAgdXBsb2FkZWRJZDogJzEyMycsXG4gICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICAgICAgfV0sXG4gICAgICB9XVxuXG4gICAgICBleHBlY3QoZ2V0RmlsZXNJbkxvZ3MoaW5wdXQpKS50b0VxdWFsKGV4cGVjdGVkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByb2Nlc3MgYXJyYXkgb2YgZmlsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHtcbiAgICAgICAgZmlsZXM6IFttb2NrRmlsZURhdGEsIG1vY2tGaWxlRGF0YV0sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gW3tcbiAgICAgICAgdmFyTmFtZTogJ2ZpbGVzJyxcbiAgICAgICAgbGlzdDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnMTIzJyxcbiAgICAgICAgICAgIG5hbWU6ICd0ZXN0LnBkZicsXG4gICAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgICAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gICAgICAgICAgICBwcm9ncmVzczogMTAwLFxuICAgICAgICAgICAgdHJhbnNmZXJNZXRob2Q6ICdsb2NhbF9maWxlJyxcbiAgICAgICAgICAgIHN1cHBvcnRGaWxlVHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgICAgIHVwbG9hZGVkSWQ6ICcxMjMnLFxuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnMTIzJyxcbiAgICAgICAgICAgIG5hbWU6ICd0ZXN0LnBkZicsXG4gICAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgICAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gICAgICAgICAgICBwcm9ncmVzczogMTAwLFxuICAgICAgICAgICAgdHJhbnNmZXJNZXRob2Q6ICdsb2NhbF9maWxlJyxcbiAgICAgICAgICAgIHN1cHBvcnRGaWxlVHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgICAgIHVwbG9hZGVkSWQ6ICcxMjMnLFxuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfV1cblxuICAgICAgZXhwZWN0KGdldEZpbGVzSW5Mb2dzKGlucHV0KSkudG9FcXVhbChleHBlY3RlZClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgbm9uLWZpbGUgb2JqZWN0cyBhbmQgYXJyYXlzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIHJlZ3VsYXJTdHJpbmc6ICdub3QgYSBmaWxlJyxcbiAgICAgICAgcmVndWxhck51bWJlcjogMTIzLFxuICAgICAgICByZWd1bGFyQXJyYXk6IFsxLCAyLCAzXSxcbiAgICAgICAgcmVndWxhck9iamVjdDogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgZmlsZTogbW9ja0ZpbGVEYXRhLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBlY3RlZCA9IFt7XG4gICAgICAgIHZhck5hbWU6ICdmaWxlJyxcbiAgICAgICAgbGlzdDogW3tcbiAgICAgICAgICBpZDogJzEyMycsXG4gICAgICAgICAgbmFtZTogJ3Rlc3QucGRmJyxcbiAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgICAgICAgIHByb2dyZXNzOiAxMDAsXG4gICAgICAgICAgdHJhbnNmZXJNZXRob2Q6ICdsb2NhbF9maWxlJyxcbiAgICAgICAgICBzdXBwb3J0RmlsZVR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgICAgdXBsb2FkZWRJZDogJzEyMycsXG4gICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICAgICAgfV0sXG4gICAgICB9XVxuXG4gICAgICBleHBlY3QoZ2V0RmlsZXNJbkxvZ3MoaW5wdXQpKS50b0VxdWFsKGV4cGVjdGVkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBmaWxlIHR5cGVzIGluIGFycmF5JywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIG1peGVkRmlsZXM6IFtcbiAgICAgICAgICBtb2NrRmlsZURhdGEsXG4gICAgICAgICAgeyBub3RBRmlsZTogdHJ1ZSB9LFxuICAgICAgICAgIG1vY2tGaWxlRGF0YSxcbiAgICAgICAgXSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBbe1xuICAgICAgICB2YXJOYW1lOiAnbWl4ZWRGaWxlcycsXG4gICAgICAgIGxpc3Q6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogJzEyMycsXG4gICAgICAgICAgICBuYW1lOiAndGVzdC5wZGYnLFxuICAgICAgICAgICAgc2l6ZTogMTAyNCxcbiAgICAgICAgICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgICAgICAgICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICAgICAgICAgIHRyYW5zZmVyTWV0aG9kOiAnbG9jYWxfZmlsZScsXG4gICAgICAgICAgICBzdXBwb3J0RmlsZVR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgICAgICB1cGxvYWRlZElkOiAnMTIzJyxcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9leGFtcGxlLmNvbS90ZXN0LnBkZicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICAgICAgICAgIHNpemU6IDAsXG4gICAgICAgICAgICBzdXBwb3J0RmlsZVR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHRyYW5zZmVyTWV0aG9kOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0eXBlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1cGxvYWRlZElkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1cmw6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnMTIzJyxcbiAgICAgICAgICAgIG5hbWU6ICd0ZXN0LnBkZicsXG4gICAgICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgICAgICAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gICAgICAgICAgICBwcm9ncmVzczogMTAwLFxuICAgICAgICAgICAgdHJhbnNmZXJNZXRob2Q6ICdsb2NhbF9maWxlJyxcbiAgICAgICAgICAgIHN1cHBvcnRGaWxlVHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgICAgIHVwbG9hZGVkSWQ6ICcxMjMnLFxuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2V4YW1wbGUuY29tL3Rlc3QucGRmJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfV1cblxuICAgICAgZXhwZWN0KGdldEZpbGVzSW5Mb2dzKGlucHV0KSkudG9FcXVhbChleHBlY3RlZClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdmaWxlSXNVcGxvYWRlZCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IHVwbG9hZGVkIGZpbGVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGZpbGVJc1VwbG9hZGVkKHtcbiAgICAgICAgdXBsb2FkZWRJZDogJzEyMycsXG4gICAgICAgIHByb2dyZXNzOiAxMDAsXG4gICAgICB9IGFzIGFueSkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpZGVudGlmeSByZW1vdGUgZmlsZXMgYXMgdXBsb2FkZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZmlsZUlzVXBsb2FkZWQoe1xuICAgICAgICB0cmFuc2Zlck1ldGhvZDogVHJhbnNmZXJNZXRob2QucmVtb3RlX3VybCxcbiAgICAgICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICAgIH0gYXMgYW55KSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2Rvd25sb2FkRmlsZScsICgpID0+IHtcbiAgICBsZXQgbW9ja0FuY2hvcjogSFRNTEFuY2hvckVsZW1lbnRcbiAgICBsZXQgY3JlYXRlRWxlbWVudE1vY2s6IE1vY2tJbnN0YW5jZVxuICAgIGxldCBhcHBlbmRDaGlsZE1vY2s6IE1vY2tJbnN0YW5jZVxuICAgIGxldCByZW1vdmVDaGlsZE1vY2s6IE1vY2tJbnN0YW5jZVxuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAvLyBNb2NrIGNyZWF0ZUVsZW1lbnQgYW5kIGFwcGVuZENoaWxkXG4gICAgICBtb2NrQW5jaG9yID0ge1xuICAgICAgICBocmVmOiAnJyxcbiAgICAgICAgZG93bmxvYWQ6ICcnLFxuICAgICAgICBzdHlsZTogeyBkaXNwbGF5OiAnJyB9LFxuICAgICAgICB0YXJnZXQ6ICcnLFxuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIGNsaWNrOiB2aS5mbigpLFxuICAgICAgfSBhcyB1bmtub3duIGFzIEhUTUxBbmNob3JFbGVtZW50XG5cbiAgICAgIGNyZWF0ZUVsZW1lbnRNb2NrID0gdmkuc3B5T24oZG9jdW1lbnQsICdjcmVhdGVFbGVtZW50JykubW9ja1JldHVyblZhbHVlKG1vY2tBbmNob3IgYXMgYW55KVxuICAgICAgYXBwZW5kQ2hpbGRNb2NrID0gdmkuc3B5T24oZG9jdW1lbnQuYm9keSwgJ2FwcGVuZENoaWxkJykubW9ja0ltcGxlbWVudGF0aW9uKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICAgIHJldHVybiBub2RlXG4gICAgICB9KVxuICAgICAgcmVtb3ZlQ2hpbGRNb2NrID0gdmkuc3B5T24oZG9jdW1lbnQuYm9keSwgJ3JlbW92ZUNoaWxkJykubW9ja0ltcGxlbWVudGF0aW9uKChub2RlOiBOb2RlKSA9PiB7XG4gICAgICAgIHJldHVybiBub2RlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgdmkucmVzZXRBbGxNb2NrcygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIGFuZCB0cmlnZ2VyIGRvd25sb2FkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZXhhbXBsZS5jb20vdGVzdC5wZGYnXG4gICAgICBjb25zdCBmaWxlbmFtZSA9ICd0ZXN0LnBkZidcblxuICAgICAgZG93bmxvYWRGaWxlKHVybCwgZmlsZW5hbWUpXG5cbiAgICAgIC8vIFZlcmlmeSBhbmNob3IgZWxlbWVudCB3YXMgY3JlYXRlZCB3aXRoIGNvcnJlY3QgcHJvcGVydGllc1xuICAgICAgZXhwZWN0KGNyZWF0ZUVsZW1lbnRNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnYScpXG4gICAgICBleHBlY3QobW9ja0FuY2hvci5ocmVmKS50b0JlKHVybClcbiAgICAgIGV4cGVjdChtb2NrQW5jaG9yLmRvd25sb2FkKS50b0JlKGZpbGVuYW1lKVxuICAgICAgZXhwZWN0KG1vY2tBbmNob3Iuc3R5bGUuZGlzcGxheSkudG9CZSgnbm9uZScpXG4gICAgICBleHBlY3QobW9ja0FuY2hvci50YXJnZXQpLnRvQmUoJ19ibGFuaycpXG4gICAgICBleHBlY3QobW9ja0FuY2hvci50aXRsZSkudG9CZShmaWxlbmFtZSlcblxuICAgICAgLy8gVmVyaWZ5IERPTSBvcGVyYXRpb25zXG4gICAgICBleHBlY3QoYXBwZW5kQ2hpbGRNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2NrQW5jaG9yKVxuICAgICAgZXhwZWN0KG1vY2tBbmNob3IuY2xpY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KHJlbW92ZUNoaWxkTW9jaykudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9ja0FuY2hvcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZmlsZW5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbS90ZXN0LnBkZidcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gJydcblxuICAgICAgZG93bmxvYWRGaWxlKHVybCwgZmlsZW5hbWUpXG5cbiAgICAgIGV4cGVjdChtb2NrQW5jaG9yLmRvd25sb2FkKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KG1vY2tBbmNob3IudGl0bGUpLnRvQmUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHVybCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHVybCA9ICcnXG4gICAgICBjb25zdCBmaWxlbmFtZSA9ICd0ZXN0LnBkZidcblxuICAgICAgZG93bmxvYWRGaWxlKHVybCwgZmlsZW5hbWUpXG5cbiAgICAgIGV4cGVjdChtb2NrQW5jaG9yLmhyZWYpLnRvQmUoJycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=