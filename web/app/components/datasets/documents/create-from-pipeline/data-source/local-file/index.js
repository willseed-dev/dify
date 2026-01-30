"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const immer_1 = require("immer");
const dynamic_1 = require("next/dynamic");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const toast_1 = require("@/app/components/base/toast");
const document_file_icon_1 = require("@/app/components/datasets/common/document-file-icon");
const config_1 = require("@/config");
const i18n_1 = require("@/context/i18n");
const use_theme_1 = require("@/hooks/use-theme");
const language_1 = require("@/i18n-config/language");
const base_1 = require("@/service/base");
const use_common_1 = require("@/service/use-common");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const store_1 = require("../store");
const SimplePieChart = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/simple-pie-chart')), { ssr: false });
const LocalFile = ({ allowedExtensions, supportBatchUpload = true, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const locale = (0, i18n_1.useLocale)();
    const localFileList = (0, store_1.useDataSourceStoreWithSelector)(state => state.localFileList);
    const dataSourceStore = (0, store_1.useDataSourceStore)();
    const [dragging, setDragging] = (0, react_2.useState)(false);
    const dropRef = (0, react_2.useRef)(null);
    const dragRef = (0, react_2.useRef)(null);
    const fileUploader = (0, react_2.useRef)(null);
    const fileListRef = (0, react_2.useRef)([]);
    const hideUpload = !supportBatchUpload && localFileList.length > 0;
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const supportTypesShowNames = (0, react_2.useMemo)(() => {
        const extensionMap = {
            md: 'markdown',
            pptx: 'pptx',
            htm: 'html',
            xlsx: 'xlsx',
            docx: 'docx',
        };
        return allowedExtensions
            .map(item => extensionMap[item] || item) // map to standardized extension
            .map(item => item.toLowerCase()) // convert to lower case
            .filter((item, index, self) => self.indexOf(item) === index) // remove duplicates
            .map(item => item.toUpperCase()) // convert to upper case
            .join(locale !== language_1.LanguagesSupported[1] ? ', ' : '、 ');
    }, [locale, allowedExtensions]);
    const ACCEPTS = allowedExtensions.map((ext) => `.${ext}`);
    const fileUploadConfig = (0, react_2.useMemo)(() => ({
        file_size_limit: fileUploadConfigResponse?.file_size_limit ?? 15,
        batch_count_limit: supportBatchUpload ? (fileUploadConfigResponse?.batch_count_limit ?? 5) : 1,
        file_upload_limit: supportBatchUpload ? (fileUploadConfigResponse?.file_upload_limit ?? 5) : 1,
    }), [fileUploadConfigResponse, supportBatchUpload]);
    const updateFile = (0, react_2.useCallback)((fileItem, progress, list) => {
        const { setLocalFileList } = dataSourceStore.getState();
        const newList = (0, immer_1.produce)(list, (draft) => {
            const targetIndex = draft.findIndex(file => file.fileID === fileItem.fileID);
            draft[targetIndex] = {
                ...draft[targetIndex],
                progress,
            };
        });
        setLocalFileList(newList);
    }, [dataSourceStore]);
    const updateFileList = (0, react_2.useCallback)((preparedFiles) => {
        const { setLocalFileList } = dataSourceStore.getState();
        setLocalFileList(preparedFiles);
    }, [dataSourceStore]);
    const handlePreview = (0, react_2.useCallback)((file) => {
        const { setCurrentLocalFile } = dataSourceStore.getState();
        if (file.id)
            setCurrentLocalFile(file);
    }, [dataSourceStore]);
    // utils
    const getFileType = (currentFile) => {
        if (!currentFile)
            return '';
        const arr = currentFile.name.split('.');
        return arr[arr.length - 1];
    };
    const getFileSize = (size) => {
        if (size / 1024 < 10)
            return `${(size / 1024).toFixed(2)}KB`;
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
    };
    const isValid = (0, react_2.useCallback)((file) => {
        const { size } = file;
        const ext = `.${getFileType(file)}`;
        const isValidType = ACCEPTS.includes(ext.toLowerCase());
        if (!isValidType)
            notify({ type: 'error', message: t('stepOne.uploader.validation.typeError', { ns: 'datasetCreation' }) });
        const isValidSize = size <= fileUploadConfig.file_size_limit * 1024 * 1024;
        if (!isValidSize)
            notify({ type: 'error', message: t('stepOne.uploader.validation.size', { ns: 'datasetCreation', size: fileUploadConfig.file_size_limit }) });
        return isValidType && isValidSize;
    }, [notify, t, ACCEPTS, fileUploadConfig.file_size_limit]);
    const fileUpload = (0, react_2.useCallback)(async (fileItem) => {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        const onProgress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.floor(e.loaded / e.total * 100);
                updateFile(fileItem, percent, fileListRef.current);
            }
        };
        return (0, base_1.upload)({
            xhr: new XMLHttpRequest(),
            data: formData,
            onprogress: onProgress,
        }, false, undefined, '?source=datasets')
            .then((res) => {
            const updatedFile = Object.assign({}, fileItem.file, {
                id: res.id,
                ...res,
            });
            const completeFile = {
                fileID: fileItem.fileID,
                file: updatedFile,
                progress: -1,
            };
            const index = fileListRef.current.findIndex(item => item.fileID === fileItem.fileID);
            fileListRef.current[index] = completeFile;
            updateFile(completeFile, 100, fileListRef.current);
            return Promise.resolve({ ...completeFile });
        })
            .catch((e) => {
            const errorMessage = (0, utils_1.getFileUploadErrorMessage)(e, t('stepOne.uploader.failed', { ns: 'datasetCreation' }), t);
            notify({ type: 'error', message: errorMessage });
            updateFile(fileItem, -2, fileListRef.current);
            return Promise.resolve({ ...fileItem });
        })
            .finally();
    }, [fileListRef, notify, updateFile, t]);
    const uploadBatchFiles = (0, react_2.useCallback)((bFiles) => {
        bFiles.forEach(bf => (bf.progress = 0));
        return Promise.all(bFiles.map(fileUpload));
    }, [fileUpload]);
    const uploadMultipleFiles = (0, react_2.useCallback)(async (files) => {
        const batchCountLimit = fileUploadConfig.batch_count_limit;
        const length = files.length;
        let start = 0;
        let end = 0;
        while (start < length) {
            if (start + batchCountLimit > length)
                end = length;
            else
                end = start + batchCountLimit;
            const bFiles = files.slice(start, end);
            await uploadBatchFiles(bFiles);
            start = end;
        }
    }, [fileUploadConfig, uploadBatchFiles]);
    const initialUpload = (0, react_2.useCallback)((files) => {
        const filesCountLimit = fileUploadConfig.file_upload_limit;
        if (!files.length)
            return false;
        if (files.length + localFileList.length > filesCountLimit && !config_1.IS_CE_EDITION) {
            notify({ type: 'error', message: t('stepOne.uploader.validation.filesNumber', { ns: 'datasetCreation', filesNumber: filesCountLimit }) });
            return false;
        }
        const preparedFiles = files.map((file, index) => ({
            fileID: `file${index}-${Date.now()}`,
            file,
            progress: -1,
        }));
        const newFiles = [...fileListRef.current, ...preparedFiles];
        updateFileList(newFiles);
        fileListRef.current = newFiles;
        uploadMultipleFiles(preparedFiles);
    }, [fileUploadConfig.file_upload_limit, localFileList.length, updateFileList, uploadMultipleFiles, notify, t]);
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target !== dragRef.current)
            setDragging(true);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === dragRef.current)
            setDragging(false);
    };
    const handleDrop = (0, react_2.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (!e.dataTransfer)
            return;
        let files = [...e.dataTransfer.files];
        if (!supportBatchUpload)
            files = files.slice(0, 1);
        const validFiles = files.filter(isValid);
        initialUpload(validFiles);
    }, [initialUpload, isValid, supportBatchUpload]);
    const selectHandle = (0, react_2.useCallback)(() => {
        if (fileUploader.current)
            fileUploader.current.click();
    }, []);
    const removeFile = (fileID) => {
        if (fileUploader.current)
            fileUploader.current.value = '';
        fileListRef.current = fileListRef.current.filter(item => item.fileID !== fileID);
        updateFileList([...fileListRef.current]);
    };
    const fileChangeHandle = (0, react_2.useCallback)((e) => {
        let files = [...(e.target.files ?? [])];
        files = files.slice(0, fileUploadConfig.batch_count_limit);
        initialUpload(files.filter(isValid));
    }, [isValid, initialUpload, fileUploadConfig.batch_count_limit]);
    const { theme } = (0, use_theme_1.default)();
    const chartColor = (0, react_2.useMemo)(() => theme === app_1.Theme.dark ? '#5289ff' : '#296dff', [theme]);
    (0, react_2.useEffect)(() => {
        const dropElement = dropRef.current;
        dropElement?.addEventListener('dragenter', handleDragEnter);
        dropElement?.addEventListener('dragover', handleDragOver);
        dropElement?.addEventListener('dragleave', handleDragLeave);
        dropElement?.addEventListener('drop', handleDrop);
        return () => {
            dropElement?.removeEventListener('dragenter', handleDragEnter);
            dropElement?.removeEventListener('dragover', handleDragOver);
            dropElement?.removeEventListener('dragleave', handleDragLeave);
            dropElement?.removeEventListener('drop', handleDrop);
        };
    }, [handleDrop]);
    return (<div className="flex flex-col">
      {!hideUpload && (<input ref={fileUploader} id="fileUploader" className="hidden" type="file" multiple={supportBatchUpload} accept={ACCEPTS.join(',')} onChange={fileChangeHandle}/>)}
      {!hideUpload && (<div ref={dropRef} className={(0, classnames_1.cn)('relative box-border flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-components-dropzone-border bg-components-dropzone-bg px-4 py-3 text-xs leading-4 text-text-tertiary', dragging && 'border-components-dropzone-border-accent bg-components-dropzone-bg-accent')}>
          <div className="flex min-h-5 items-center justify-center text-sm leading-4 text-text-secondary">
            <react_1.RiUploadCloud2Line className="mr-2 size-5"/>

            <span>
              {supportBatchUpload ? t('stepOne.uploader.button', { ns: 'datasetCreation' }) : t('stepOne.uploader.buttonSingleFile', { ns: 'datasetCreation' })}
              {allowedExtensions.length > 0 && (<label className="ml-1 cursor-pointer text-text-accent" onClick={selectHandle}>{t('stepOne.uploader.browse', { ns: 'datasetCreation' })}</label>)}
            </span>
          </div>
          <div>
            {t('stepOne.uploader.tip', {
                ns: 'datasetCreation',
                size: fileUploadConfig.file_size_limit,
                supportTypes: supportTypesShowNames,
                batchCount: fileUploadConfig.batch_count_limit,
                totalCount: fileUploadConfig.file_upload_limit,
            })}
          </div>
          {dragging && <div ref={dragRef} className="absolute left-0 top-0 h-full w-full"/>}
        </div>)}
      {localFileList.length > 0 && (<div className="mt-1 flex flex-col gap-y-1">
          {localFileList.map((fileItem, index) => {
                const isUploading = fileItem.progress >= 0 && fileItem.progress < 100;
                const isError = fileItem.progress === -2;
                return (<div key={`${fileItem.fileID}-${index}`} onClick={handlePreview.bind(null, fileItem.file)} className={(0, classnames_1.cn)('flex h-12 items-center rounded-lg border border-components-panel-border bg-components-panel-on-panel-item-bg shadow-xs shadow-shadow-shadow-4', isError && 'border-state-destructive-border bg-state-destructive-hover')}>
                <div className="flex w-12 shrink-0 items-center justify-center">
                  <document_file_icon_1.default size="lg" className="shrink-0" name={fileItem.file.name} extension={getFileType(fileItem.file)}/>
                </div>
                <div className="flex shrink grow flex-col gap-0.5">
                  <div className="flex w-full">
                    <div className="w-0 grow truncate text-xs text-text-secondary">{fileItem.file.name}</div>
                  </div>
                  <div className="w-full truncate text-2xs leading-3 text-text-tertiary">
                    <span className="uppercase">{getFileType(fileItem.file)}</span>
                    <span className="px-1 text-text-quaternary">·</span>
                    <span>{getFileSize(fileItem.file.size)}</span>
                  </div>
                </div>
                <div className="flex w-16 shrink-0 items-center justify-end gap-1 pr-3">
                  {isUploading && (<SimplePieChart percentage={fileItem.progress} stroke={chartColor} fill={chartColor} animationDuration={0}/>)}
                  {isError && (<react_1.RiErrorWarningFill className="size-4 text-text-destructive"/>)}
                  <span className="flex h-6 w-6 cursor-pointer items-center justify-center" onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileItem.fileID);
                    }}>
                    <react_1.RiDeleteBinLine className="size-4 text-text-tertiary"/>
                  </span>
                </div>
              </div>);
            })}
        </div>)}
    </div>);
};
exports.default = LocalFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FBMEY7QUFDMUYsaUNBQStCO0FBQy9CLDBDQUFrQztBQUNsQywrQkFBOEI7QUFDOUIsaUNBQXlFO0FBQ3pFLGlEQUE4QztBQUM5QywrREFBaUQ7QUFDakQscUVBQXFGO0FBQ3JGLHVEQUEwRDtBQUMxRCw0RkFBa0Y7QUFDbEYscUNBQXdDO0FBQ3hDLHlDQUEwQztBQUMxQyxpREFBd0M7QUFDeEMscURBQTJEO0FBQzNELHlDQUF1QztBQUN2QyxxREFBMEQ7QUFDMUQscUNBQW1DO0FBQ25DLG1EQUF1QztBQUN2QyxvQ0FBNkU7QUFFN0UsTUFBTSxjQUFjLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSx3Q0FBd0MsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7QUFPdEcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxFQUNqQixpQkFBaUIsRUFDakIsa0JBQWtCLEdBQUcsSUFBSSxHQUNWLEVBQUUsRUFBRTtJQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsaUNBQVUsRUFBQyxvQkFBWSxDQUFDLENBQUE7SUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxhQUFhLEdBQUcsSUFBQSxzQ0FBOEIsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNsRixNQUFNLGVBQWUsR0FBRyxJQUFBLDBCQUFrQixHQUFFLENBQUE7SUFDNUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0Ms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QywyQkFBMkIsRUFDeEQ7a0JBQUEsRUFBRSxJQUFJLENBQ1I7Z0JBQUEsRUFBRSxHQUFHLENBQ1A7Y0FBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FDSjtRQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBDdXN0b21GaWxlIGFzIEZpbGUsIEZpbGVJdGVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBSaURlbGV0ZUJpbkxpbmUsIFJpRXJyb3JXYXJuaW5nRmlsbCwgUmlVcGxvYWRDbG91ZDJMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCBkeW5hbWljIGZyb20gJ25leHQvZHluYW1pYydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgZ2V0RmlsZVVwbG9hZEVycm9yTWVzc2FnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9maWxlLXVwbG9hZGVyL3V0aWxzJ1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IERvY3VtZW50RmlsZUljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9jb21tb24vZG9jdW1lbnQtZmlsZS1pY29uJ1xuaW1wb3J0IHsgSVNfQ0VfRURJVElPTiB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgdXNlTG9jYWxlIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5pbXBvcnQgdXNlVGhlbWUgZnJvbSAnQC9ob29rcy91c2UtdGhlbWUnXG5pbXBvcnQgeyBMYW5ndWFnZXNTdXBwb3J0ZWQgfSBmcm9tICdAL2kxOG4tY29uZmlnL2xhbmd1YWdlJ1xuaW1wb3J0IHsgdXBsb2FkIH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgeyB1c2VGaWxlVXBsb2FkQ29uZmlnIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyB1c2VEYXRhU291cmNlU3RvcmUsIHVzZURhdGFTb3VyY2VTdG9yZVdpdGhTZWxlY3RvciB9IGZyb20gJy4uL3N0b3JlJ1xuXG5jb25zdCBTaW1wbGVQaWVDaGFydCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2ltcGxlLXBpZS1jaGFydCcpLCB7IHNzcjogZmFsc2UgfSlcblxuZXhwb3J0IHR5cGUgTG9jYWxGaWxlUHJvcHMgPSB7XG4gIGFsbG93ZWRFeHRlbnNpb25zOiBzdHJpbmdbXVxuICBzdXBwb3J0QmF0Y2hVcGxvYWQ/OiBib29sZWFuXG59XG5cbmNvbnN0IExvY2FsRmlsZSA9ICh7XG4gIGFsbG93ZWRFeHRlbnNpb25zLFxuICBzdXBwb3J0QmF0Y2hVcGxvYWQgPSB0cnVlLFxufTogTG9jYWxGaWxlUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VDb250ZXh0KFRvYXN0Q29udGV4dClcbiAgY29uc3QgbG9jYWxlID0gdXNlTG9jYWxlKClcbiAgY29uc3QgbG9jYWxGaWxlTGlzdCA9IHVzZURhdGFTb3VyY2VTdG9yZVdpdGhTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5sb2NhbEZpbGVMaXN0KVxuICBjb25zdCBkYXRhU291cmNlU3RvcmUgPSB1c2VEYXRhU291cmNlU3RvcmUoKVxuICBjb25zdCBbZHJhZ2dpbmcsIHNldERyYWdnaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGRyb3BSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IGRyYWdSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IGZpbGVVcGxvYWRlciA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKVxuICBjb25zdCBmaWxlTGlzdFJlZiA9IHVzZVJlZjxGaWxlSXRlbVtdPihbXSlcblxuICBjb25zdCBoaWRlVXBsb2FkID0gIXN1cHBvcnRCYXRjaFVwbG9hZCAmJiBsb2NhbEZpbGVMaXN0Lmxlbmd0aCA+IDBcblxuICBjb25zdCB7IGRhdGE6IGZpbGVVcGxvYWRDb25maWdSZXNwb25zZSB9ID0gdXNlRmlsZVVwbG9hZENvbmZpZygpXG4gIGNvbnN0IHN1cHBvcnRUeXBlc1Nob3dOYW1lcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGV4dGVuc2lvbk1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgIG1kOiAnbWFya2Rvd24nLFxuICAgICAgcHB0eDogJ3BwdHgnLFxuICAgICAgaHRtOiAnaHRtbCcsXG4gICAgICB4bHN4OiAneGxzeCcsXG4gICAgICBkb2N4OiAnZG9jeCcsXG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbG93ZWRFeHRlbnNpb25zXG4gICAgICAubWFwKGl0ZW0gPT4gZXh0ZW5zaW9uTWFwW2l0ZW1dIHx8IGl0ZW0pIC8vIG1hcCB0byBzdGFuZGFyZGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAubWFwKGl0ZW0gPT4gaXRlbS50b0xvd2VyQ2FzZSgpKSAvLyBjb252ZXJ0IHRvIGxvd2VyIGNhc2VcbiAgICAgIC5maWx0ZXIoKGl0ZW0sIGluZGV4LCBzZWxmKSA9PiBzZWxmLmluZGV4T2YoaXRlbSkgPT09IGluZGV4KSAvLyByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgLm1hcChpdGVtID0+IGl0ZW0udG9VcHBlckNhc2UoKSkgLy8gY29udmVydCB0byB1cHBlciBjYXNlXG4gICAgICAuam9pbihsb2NhbGUgIT09IExhbmd1YWdlc1N1cHBvcnRlZFsxXSA/ICcsICcgOiAn44CBICcpXG4gIH0sIFtsb2NhbGUsIGFsbG93ZWRFeHRlbnNpb25zXSlcbiAgY29uc3QgQUNDRVBUUyA9IGFsbG93ZWRFeHRlbnNpb25zLm1hcCgoZXh0OiBzdHJpbmcpID0+IGAuJHtleHR9YClcbiAgY29uc3QgZmlsZVVwbG9hZENvbmZpZyA9IHVzZU1lbW8oKCkgPT4gKHtcbiAgICBmaWxlX3NpemVfbGltaXQ6IGZpbGVVcGxvYWRDb25maWdSZXNwb25zZT8uZmlsZV9zaXplX2xpbWl0ID8/IDE1LFxuICAgIGJhdGNoX2NvdW50X2xpbWl0OiBzdXBwb3J0QmF0Y2hVcGxvYWQgPyAoZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlPy5iYXRjaF9jb3VudF9saW1pdCA/PyA1KSA6IDEsXG4gICAgZmlsZV91cGxvYWRfbGltaXQ6IHN1cHBvcnRCYXRjaFVwbG9hZCA/IChmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2U/LmZpbGVfdXBsb2FkX2xpbWl0ID8/IDUpIDogMSxcbiAgfSksIFtmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UsIHN1cHBvcnRCYXRjaFVwbG9hZF0pXG5cbiAgY29uc3QgdXBkYXRlRmlsZSA9IHVzZUNhbGxiYWNrKChmaWxlSXRlbTogRmlsZUl0ZW0sIHByb2dyZXNzOiBudW1iZXIsIGxpc3Q6IEZpbGVJdGVtW10pID0+IHtcbiAgICBjb25zdCB7IHNldExvY2FsRmlsZUxpc3QgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgbmV3TGlzdCA9IHByb2R1Y2UobGlzdCwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IGRyYWZ0LmZpbmRJbmRleChmaWxlID0+IGZpbGUuZmlsZUlEID09PSBmaWxlSXRlbS5maWxlSUQpXG4gICAgICBkcmFmdFt0YXJnZXRJbmRleF0gPSB7XG4gICAgICAgIC4uLmRyYWZ0W3RhcmdldEluZGV4XSxcbiAgICAgICAgcHJvZ3Jlc3MsXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRMb2NhbEZpbGVMaXN0KG5ld0xpc3QpXG4gIH0sIFtkYXRhU291cmNlU3RvcmVdKVxuXG4gIGNvbnN0IHVwZGF0ZUZpbGVMaXN0ID0gdXNlQ2FsbGJhY2soKHByZXBhcmVkRmlsZXM6IEZpbGVJdGVtW10pID0+IHtcbiAgICBjb25zdCB7IHNldExvY2FsRmlsZUxpc3QgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgc2V0TG9jYWxGaWxlTGlzdChwcmVwYXJlZEZpbGVzKVxuICB9LCBbZGF0YVNvdXJjZVN0b3JlXSlcblxuICBjb25zdCBoYW5kbGVQcmV2aWV3ID0gdXNlQ2FsbGJhY2soKGZpbGU6IEZpbGUpID0+IHtcbiAgICBjb25zdCB7IHNldEN1cnJlbnRMb2NhbEZpbGUgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgaWYgKGZpbGUuaWQpXG4gICAgICBzZXRDdXJyZW50TG9jYWxGaWxlKGZpbGUpXG4gIH0sIFtkYXRhU291cmNlU3RvcmVdKVxuXG4gIC8vIHV0aWxzXG4gIGNvbnN0IGdldEZpbGVUeXBlID0gKGN1cnJlbnRGaWxlOiBGaWxlKSA9PiB7XG4gICAgaWYgKCFjdXJyZW50RmlsZSlcbiAgICAgIHJldHVybiAnJ1xuXG4gICAgY29uc3QgYXJyID0gY3VycmVudEZpbGUubmFtZS5zcGxpdCgnLicpXG4gICAgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV1cbiAgfVxuXG4gIGNvbnN0IGdldEZpbGVTaXplID0gKHNpemU6IG51bWJlcikgPT4ge1xuICAgIGlmIChzaXplIC8gMTAyNCA8IDEwKVxuICAgICAgcmV0dXJuIGAkeyhzaXplIC8gMTAyNCkudG9GaXhlZCgyKX1LQmBcblxuICAgIHJldHVybiBgJHsoc2l6ZSAvIDEwMjQgLyAxMDI0KS50b0ZpeGVkKDIpfU1CYFxuICB9XG5cbiAgY29uc3QgaXNWYWxpZCA9IHVzZUNhbGxiYWNrKChmaWxlOiBGaWxlKSA9PiB7XG4gICAgY29uc3QgeyBzaXplIH0gPSBmaWxlXG4gICAgY29uc3QgZXh0ID0gYC4ke2dldEZpbGVUeXBlKGZpbGUpfWBcbiAgICBjb25zdCBpc1ZhbGlkVHlwZSA9IEFDQ0VQVFMuaW5jbHVkZXMoZXh0LnRvTG93ZXJDYXNlKCkpXG4gICAgaWYgKCFpc1ZhbGlkVHlwZSlcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3N0ZXBPbmUudXBsb2FkZXIudmFsaWRhdGlvbi50eXBlRXJyb3InLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KSB9KVxuXG4gICAgY29uc3QgaXNWYWxpZFNpemUgPSBzaXplIDw9IGZpbGVVcGxvYWRDb25maWcuZmlsZV9zaXplX2xpbWl0ICogMTAyNCAqIDEwMjRcbiAgICBpZiAoIWlzVmFsaWRTaXplKVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnc3RlcE9uZS51cGxvYWRlci52YWxpZGF0aW9uLnNpemUnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJywgc2l6ZTogZmlsZVVwbG9hZENvbmZpZy5maWxlX3NpemVfbGltaXQgfSkgfSlcblxuICAgIHJldHVybiBpc1ZhbGlkVHlwZSAmJiBpc1ZhbGlkU2l6ZVxuICB9LCBbbm90aWZ5LCB0LCBBQ0NFUFRTLCBmaWxlVXBsb2FkQ29uZmlnLmZpbGVfc2l6ZV9saW1pdF0pXG5cbiAgdHlwZSBVcGxvYWRSZXN1bHQgPSBBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIHVwbG9hZD4+XG5cbiAgY29uc3QgZmlsZVVwbG9hZCA9IHVzZUNhbGxiYWNrKGFzeW5jIChmaWxlSXRlbTogRmlsZUl0ZW0pOiBQcm9taXNlPEZpbGVJdGVtPiA9PiB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGVJdGVtLmZpbGUpXG4gICAgY29uc3Qgb25Qcm9ncmVzcyA9IChlOiBQcm9ncmVzc0V2ZW50KSA9PiB7XG4gICAgICBpZiAoZS5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnQgPSBNYXRoLmZsb29yKGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMClcbiAgICAgICAgdXBkYXRlRmlsZShmaWxlSXRlbSwgcGVyY2VudCwgZmlsZUxpc3RSZWYuY3VycmVudClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdXBsb2FkKHtcbiAgICAgIHhocjogbmV3IFhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIG9ucHJvZ3Jlc3M6IG9uUHJvZ3Jlc3MsXG4gICAgfSwgZmFsc2UsIHVuZGVmaW5lZCwgJz9zb3VyY2U9ZGF0YXNldHMnKVxuICAgICAgLnRoZW4oKHJlczogVXBsb2FkUmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0gT2JqZWN0LmFzc2lnbih7fSwgZmlsZUl0ZW0uZmlsZSwge1xuICAgICAgICAgIGlkOiByZXMuaWQsXG4gICAgICAgICAgLi4uKHJlcyBhcyBQYXJ0aWFsPEZpbGU+KSxcbiAgICAgICAgfSkgYXMgRmlsZVxuICAgICAgICBjb25zdCBjb21wbGV0ZUZpbGU6IEZpbGVJdGVtID0ge1xuICAgICAgICAgIGZpbGVJRDogZmlsZUl0ZW0uZmlsZUlELFxuICAgICAgICAgIGZpbGU6IHVwZGF0ZWRGaWxlLFxuICAgICAgICAgIHByb2dyZXNzOiAtMSxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpbGVMaXN0UmVmLmN1cnJlbnQuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5maWxlSUQgPT09IGZpbGVJdGVtLmZpbGVJRClcbiAgICAgICAgZmlsZUxpc3RSZWYuY3VycmVudFtpbmRleF0gPSBjb21wbGV0ZUZpbGVcbiAgICAgICAgdXBkYXRlRmlsZShjb21wbGV0ZUZpbGUsIDEwMCwgZmlsZUxpc3RSZWYuY3VycmVudClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IC4uLmNvbXBsZXRlRmlsZSB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBnZXRGaWxlVXBsb2FkRXJyb3JNZXNzYWdlKGUsIHQoJ3N0ZXBPbmUudXBsb2FkZXIuZmFpbGVkJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksIHQpXG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSB9KVxuICAgICAgICB1cGRhdGVGaWxlKGZpbGVJdGVtLCAtMiwgZmlsZUxpc3RSZWYuY3VycmVudClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IC4uLmZpbGVJdGVtIH0pXG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKVxuICB9LCBbZmlsZUxpc3RSZWYsIG5vdGlmeSwgdXBkYXRlRmlsZSwgdF0pXG5cbiAgY29uc3QgdXBsb2FkQmF0Y2hGaWxlcyA9IHVzZUNhbGxiYWNrKChiRmlsZXM6IEZpbGVJdGVtW10pID0+IHtcbiAgICBiRmlsZXMuZm9yRWFjaChiZiA9PiAoYmYucHJvZ3Jlc3MgPSAwKSlcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoYkZpbGVzLm1hcChmaWxlVXBsb2FkKSlcbiAgfSwgW2ZpbGVVcGxvYWRdKVxuXG4gIGNvbnN0IHVwbG9hZE11bHRpcGxlRmlsZXMgPSB1c2VDYWxsYmFjayhhc3luYyAoZmlsZXM6IEZpbGVJdGVtW10pID0+IHtcbiAgICBjb25zdCBiYXRjaENvdW50TGltaXQgPSBmaWxlVXBsb2FkQ29uZmlnLmJhdGNoX2NvdW50X2xpbWl0XG4gICAgY29uc3QgbGVuZ3RoID0gZmlsZXMubGVuZ3RoXG4gICAgbGV0IHN0YXJ0ID0gMFxuICAgIGxldCBlbmQgPSAwXG5cbiAgICB3aGlsZSAoc3RhcnQgPCBsZW5ndGgpIHtcbiAgICAgIGlmIChzdGFydCArIGJhdGNoQ291bnRMaW1pdCA+IGxlbmd0aClcbiAgICAgICAgZW5kID0gbGVuZ3RoXG4gICAgICBlbHNlXG4gICAgICAgIGVuZCA9IHN0YXJ0ICsgYmF0Y2hDb3VudExpbWl0XG4gICAgICBjb25zdCBiRmlsZXMgPSBmaWxlcy5zbGljZShzdGFydCwgZW5kKVxuICAgICAgYXdhaXQgdXBsb2FkQmF0Y2hGaWxlcyhiRmlsZXMpXG4gICAgICBzdGFydCA9IGVuZFxuICAgIH1cbiAgfSwgW2ZpbGVVcGxvYWRDb25maWcsIHVwbG9hZEJhdGNoRmlsZXNdKVxuXG4gIGNvbnN0IGluaXRpYWxVcGxvYWQgPSB1c2VDYWxsYmFjaygoZmlsZXM6IEZpbGVbXSkgPT4ge1xuICAgIGNvbnN0IGZpbGVzQ291bnRMaW1pdCA9IGZpbGVVcGxvYWRDb25maWcuZmlsZV91cGxvYWRfbGltaXRcbiAgICBpZiAoIWZpbGVzLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgaWYgKGZpbGVzLmxlbmd0aCArIGxvY2FsRmlsZUxpc3QubGVuZ3RoID4gZmlsZXNDb3VudExpbWl0ICYmICFJU19DRV9FRElUSU9OKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdzdGVwT25lLnVwbG9hZGVyLnZhbGlkYXRpb24uZmlsZXNOdW1iZXInLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJywgZmlsZXNOdW1iZXI6IGZpbGVzQ291bnRMaW1pdCB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgcHJlcGFyZWRGaWxlcyA9IGZpbGVzLm1hcCgoZmlsZSwgaW5kZXgpID0+ICh7XG4gICAgICBmaWxlSUQ6IGBmaWxlJHtpbmRleH0tJHtEYXRlLm5vdygpfWAsXG4gICAgICBmaWxlLFxuICAgICAgcHJvZ3Jlc3M6IC0xLFxuICAgIH0pKVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gWy4uLmZpbGVMaXN0UmVmLmN1cnJlbnQsIC4uLnByZXBhcmVkRmlsZXNdXG4gICAgdXBkYXRlRmlsZUxpc3QobmV3RmlsZXMpXG4gICAgZmlsZUxpc3RSZWYuY3VycmVudCA9IG5ld0ZpbGVzXG4gICAgdXBsb2FkTXVsdGlwbGVGaWxlcyhwcmVwYXJlZEZpbGVzKVxuICB9LCBbZmlsZVVwbG9hZENvbmZpZy5maWxlX3VwbG9hZF9saW1pdCwgbG9jYWxGaWxlTGlzdC5sZW5ndGgsIHVwZGF0ZUZpbGVMaXN0LCB1cGxvYWRNdWx0aXBsZUZpbGVzLCBub3RpZnksIHRdKVxuXG4gIGNvbnN0IGhhbmRsZURyYWdFbnRlciA9IChlOiBEcmFnRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKGUudGFyZ2V0ICE9PSBkcmFnUmVmLmN1cnJlbnQpXG4gICAgICBzZXREcmFnZ2luZyh0cnVlKVxuICB9XG4gIGNvbnN0IGhhbmRsZURyYWdPdmVyID0gKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgfVxuICBjb25zdCBoYW5kbGVEcmFnTGVhdmUgPSAoZTogRHJhZ0V2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGlmIChlLnRhcmdldCA9PT0gZHJhZ1JlZi5jdXJyZW50KVxuICAgICAgc2V0RHJhZ2dpbmcoZmFsc2UpXG4gIH1cblxuICBjb25zdCBoYW5kbGVEcm9wID0gdXNlQ2FsbGJhY2soKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBzZXREcmFnZ2luZyhmYWxzZSlcbiAgICBpZiAoIWUuZGF0YVRyYW5zZmVyKVxuICAgICAgcmV0dXJuXG5cbiAgICBsZXQgZmlsZXMgPSBbLi4uZS5kYXRhVHJhbnNmZXIuZmlsZXNdIGFzIEZpbGVbXVxuICAgIGlmICghc3VwcG9ydEJhdGNoVXBsb2FkKVxuICAgICAgZmlsZXMgPSBmaWxlcy5zbGljZSgwLCAxKVxuXG4gICAgY29uc3QgdmFsaWRGaWxlcyA9IGZpbGVzLmZpbHRlcihpc1ZhbGlkKVxuICAgIGluaXRpYWxVcGxvYWQodmFsaWRGaWxlcylcbiAgfSwgW2luaXRpYWxVcGxvYWQsIGlzVmFsaWQsIHN1cHBvcnRCYXRjaFVwbG9hZF0pXG5cbiAgY29uc3Qgc2VsZWN0SGFuZGxlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChmaWxlVXBsb2FkZXIuY3VycmVudClcbiAgICAgIGZpbGVVcGxvYWRlci5jdXJyZW50LmNsaWNrKClcbiAgfSwgW10pXG5cbiAgY29uc3QgcmVtb3ZlRmlsZSA9IChmaWxlSUQ6IHN0cmluZykgPT4ge1xuICAgIGlmIChmaWxlVXBsb2FkZXIuY3VycmVudClcbiAgICAgIGZpbGVVcGxvYWRlci5jdXJyZW50LnZhbHVlID0gJydcblxuICAgIGZpbGVMaXN0UmVmLmN1cnJlbnQgPSBmaWxlTGlzdFJlZi5jdXJyZW50LmZpbHRlcihpdGVtID0+IGl0ZW0uZmlsZUlEICE9PSBmaWxlSUQpXG4gICAgdXBkYXRlRmlsZUxpc3QoWy4uLmZpbGVMaXN0UmVmLmN1cnJlbnRdKVxuICB9XG4gIGNvbnN0IGZpbGVDaGFuZ2VIYW5kbGUgPSB1c2VDYWxsYmFjaygoZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICBsZXQgZmlsZXMgPSBbLi4uKGUudGFyZ2V0LmZpbGVzID8/IFtdKV0gYXMgRmlsZVtdXG4gICAgZmlsZXMgPSBmaWxlcy5zbGljZSgwLCBmaWxlVXBsb2FkQ29uZmlnLmJhdGNoX2NvdW50X2xpbWl0KVxuICAgIGluaXRpYWxVcGxvYWQoZmlsZXMuZmlsdGVyKGlzVmFsaWQpKVxuICB9LCBbaXNWYWxpZCwgaW5pdGlhbFVwbG9hZCwgZmlsZVVwbG9hZENvbmZpZy5iYXRjaF9jb3VudF9saW1pdF0pXG5cbiAgY29uc3QgeyB0aGVtZSB9ID0gdXNlVGhlbWUoKVxuICBjb25zdCBjaGFydENvbG9yID0gdXNlTWVtbygoKSA9PiB0aGVtZSA9PT0gVGhlbWUuZGFyayA/ICcjNTI4OWZmJyA6ICcjMjk2ZGZmJywgW3RoZW1lXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGRyb3BFbGVtZW50ID0gZHJvcFJlZi5jdXJyZW50XG4gICAgZHJvcEVsZW1lbnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlcilcbiAgICBkcm9wRWxlbWVudD8uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBoYW5kbGVEcmFnT3ZlcilcbiAgICBkcm9wRWxlbWVudD8uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlKVxuICAgIGRyb3BFbGVtZW50Py5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgaGFuZGxlRHJvcClcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZHJvcEVsZW1lbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlcilcbiAgICAgIGRyb3BFbGVtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIGhhbmRsZURyYWdPdmVyKVxuICAgICAgZHJvcEVsZW1lbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGhhbmRsZURyYWdMZWF2ZSlcbiAgICAgIGRyb3BFbGVtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgaGFuZGxlRHJvcClcbiAgICB9XG4gIH0sIFtoYW5kbGVEcm9wXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbFwiPlxuICAgICAgeyFoaWRlVXBsb2FkICYmIChcbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVmPXtmaWxlVXBsb2FkZXJ9XG4gICAgICAgICAgaWQ9XCJmaWxlVXBsb2FkZXJcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiXG4gICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgIG11bHRpcGxlPXtzdXBwb3J0QmF0Y2hVcGxvYWR9XG4gICAgICAgICAgYWNjZXB0PXtBQ0NFUFRTLmpvaW4oJywnKX1cbiAgICAgICAgICBvbkNoYW5nZT17ZmlsZUNoYW5nZUhhbmRsZX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7IWhpZGVVcGxvYWQgJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPXtkcm9wUmVmfVxuICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAncmVsYXRpdmUgYm94LWJvcmRlciBmbGV4IG1pbi1oLTIwIGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMSByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1jb21wb25lbnRzLWRyb3B6b25lLWJvcmRlciBiZy1jb21wb25lbnRzLWRyb3B6b25lLWJnIHB4LTQgcHktMyB0ZXh0LXhzIGxlYWRpbmctNCB0ZXh0LXRleHQtdGVydGlhcnknLFxuICAgICAgICAgICAgZHJhZ2dpbmcgJiYgJ2JvcmRlci1jb21wb25lbnRzLWRyb3B6b25lLWJvcmRlci1hY2NlbnQgYmctY29tcG9uZW50cy1kcm9wem9uZS1iZy1hY2NlbnQnLFxuICAgICAgICAgICl9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLWgtNSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1zbSBsZWFkaW5nLTQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgPFJpVXBsb2FkQ2xvdWQyTGluZSBjbGFzc05hbWU9XCJtci0yIHNpemUtNVwiIC8+XG5cbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICB7c3VwcG9ydEJhdGNoVXBsb2FkID8gdCgnc3RlcE9uZS51cGxvYWRlci5idXR0b24nLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KSA6IHQoJ3N0ZXBPbmUudXBsb2FkZXIuYnV0dG9uU2luZ2xlRmlsZScsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfVxuICAgICAgICAgICAgICB7YWxsb3dlZEV4dGVuc2lvbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1sLTEgY3Vyc29yLXBvaW50ZXIgdGV4dC10ZXh0LWFjY2VudFwiIG9uQ2xpY2s9e3NlbGVjdEhhbmRsZX0+e3QoJ3N0ZXBPbmUudXBsb2FkZXIuYnJvd3NlJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSl9PC9sYWJlbD5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3QoJ3N0ZXBPbmUudXBsb2FkZXIudGlwJywge1xuICAgICAgICAgICAgICBuczogJ2RhdGFzZXRDcmVhdGlvbicsXG4gICAgICAgICAgICAgIHNpemU6IGZpbGVVcGxvYWRDb25maWcuZmlsZV9zaXplX2xpbWl0LFxuICAgICAgICAgICAgICBzdXBwb3J0VHlwZXM6IHN1cHBvcnRUeXBlc1Nob3dOYW1lcyxcbiAgICAgICAgICAgICAgYmF0Y2hDb3VudDogZmlsZVVwbG9hZENvbmZpZy5iYXRjaF9jb3VudF9saW1pdCxcbiAgICAgICAgICAgICAgdG90YWxDb3VudDogZmlsZVVwbG9hZENvbmZpZy5maWxlX3VwbG9hZF9saW1pdCxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtkcmFnZ2luZyAmJiA8ZGl2IHJlZj17ZHJhZ1JlZn0gY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0wIHRvcC0wIGgtZnVsbCB3LWZ1bGxcIiAvPn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2xvY2FsRmlsZUxpc3QubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMSBmbGV4IGZsZXgtY29sIGdhcC15LTFcIj5cbiAgICAgICAgICB7bG9jYWxGaWxlTGlzdC5tYXAoKGZpbGVJdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNVcGxvYWRpbmcgPSBmaWxlSXRlbS5wcm9ncmVzcyA+PSAwICYmIGZpbGVJdGVtLnByb2dyZXNzIDwgMTAwXG4gICAgICAgICAgICBjb25zdCBpc0Vycm9yID0gZmlsZUl0ZW0ucHJvZ3Jlc3MgPT09IC0yXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAga2V5PXtgJHtmaWxlSXRlbS5maWxlSUR9LSR7aW5kZXh9YH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVQcmV2aWV3LmJpbmQobnVsbCwgZmlsZUl0ZW0uZmlsZSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAgICdmbGV4IGgtMTIgaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmcgc2hhZG93LXhzIHNoYWRvdy1zaGFkb3ctc2hhZG93LTQnLFxuICAgICAgICAgICAgICAgICAgaXNFcnJvciAmJiAnYm9yZGVyLXN0YXRlLWRlc3RydWN0aXZlLWJvcmRlciBiZy1zdGF0ZS1kZXN0cnVjdGl2ZS1ob3ZlcicsXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LTEyIHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPERvY3VtZW50RmlsZUljb25cbiAgICAgICAgICAgICAgICAgICAgc2l6ZT1cImxnXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTBcIlxuICAgICAgICAgICAgICAgICAgICBuYW1lPXtmaWxlSXRlbS5maWxlLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbj17Z2V0RmlsZVR5cGUoZmlsZUl0ZW0uZmlsZSl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaHJpbmsgZ3JvdyBmbGV4LWNvbCBnYXAtMC41XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0wIGdyb3cgdHJ1bmNhdGUgdGV4dC14cyB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e2ZpbGVJdGVtLmZpbGUubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgdHJ1bmNhdGUgdGV4dC0yeHMgbGVhZGluZy0zIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ1cHBlcmNhc2VcIj57Z2V0RmlsZVR5cGUoZmlsZUl0ZW0uZmlsZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0xIHRleHQtdGV4dC1xdWF0ZXJuYXJ5XCI+wrc8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntnZXRGaWxlU2l6ZShmaWxlSXRlbS5maWxlLnNpemUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LTE2IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMSBwci0zXCI+XG4gICAgICAgICAgICAgICAgICB7aXNVcGxvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8U2ltcGxlUGllQ2hhcnQgcGVyY2VudGFnZT17ZmlsZUl0ZW0ucHJvZ3Jlc3N9IHN0cm9rZT17Y2hhcnRDb2xvcn0gZmlsbD17Y2hhcnRDb2xvcn0gYW5pbWF0aW9uRHVyYXRpb249ezB9IC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpc0Vycm9yICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8UmlFcnJvcldhcm5pbmdGaWxsIGNsYXNzTmFtZT1cInNpemUtNCB0ZXh0LXRleHQtZGVzdHJ1Y3RpdmVcIiAvPlxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRmlsZShmaWxlSXRlbS5maWxlSUQpXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxSaURlbGV0ZUJpbkxpbmUgY2xhc3NOYW1lPVwic2l6ZS00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9jYWxGaWxlXG4iXX0=