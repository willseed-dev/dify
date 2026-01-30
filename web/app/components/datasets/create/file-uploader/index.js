"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const utils_1 = require("@/app/components/base/file-uploader/utils");
const simple_pie_chart_1 = require("@/app/components/base/simple-pie-chart");
const toast_1 = require("@/app/components/base/toast");
const config_1 = require("@/config");
const i18n_1 = require("@/context/i18n");
const use_theme_1 = require("@/hooks/use-theme");
const language_1 = require("@/i18n-config/language");
const base_1 = require("@/service/base");
const use_common_1 = require("@/service/use-common");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const document_file_icon_1 = require("../../common/document-file-icon");
const FileUploader = ({ fileList, titleClassName, prepareFileList, onFileUpdate, onFileListUpdate, onPreview, supportBatchUpload = false, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const locale = (0, i18n_1.useLocale)();
    const [dragging, setDragging] = (0, react_2.useState)(false);
    const dropRef = (0, react_2.useRef)(null);
    const dragRef = (0, react_2.useRef)(null);
    const fileUploader = (0, react_2.useRef)(null);
    const hideUpload = !supportBatchUpload && fileList.length > 0;
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const { data: supportFileTypesResponse } = (0, use_common_1.useFileSupportTypes)();
    const supportTypes = supportFileTypesResponse?.allowed_extensions || [];
    const supportTypesShowNames = (() => {
        const extensionMap = {
            md: 'markdown',
            pptx: 'pptx',
            htm: 'html',
            xlsx: 'xlsx',
            docx: 'docx',
        };
        return [...supportTypes]
            .map(item => extensionMap[item] || item) // map to standardized extension
            .map(item => item.toLowerCase()) // convert to lower case
            .filter((item, index, self) => self.indexOf(item) === index) // remove duplicates
            .map(item => item.toUpperCase()) // convert to upper case
            .join(locale !== language_1.LanguagesSupported[1] ? ', ' : '、 ');
    })();
    const ACCEPTS = supportTypes.map((ext) => `.${ext}`);
    const fileUploadConfig = (0, react_2.useMemo)(() => ({
        file_size_limit: fileUploadConfigResponse?.file_size_limit ?? 15,
        batch_count_limit: supportBatchUpload ? (fileUploadConfigResponse?.batch_count_limit ?? 5) : 1,
        file_upload_limit: supportBatchUpload ? (fileUploadConfigResponse?.file_upload_limit ?? 5) : 1,
    }), [fileUploadConfigResponse, supportBatchUpload]);
    const fileListRef = (0, react_2.useRef)([]);
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
    }, [fileUploadConfig, notify, t, ACCEPTS]);
    const fileUpload = (0, react_2.useCallback)(async (fileItem) => {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        const onProgress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.floor(e.loaded / e.total * 100);
                onFileUpdate(fileItem, percent, fileListRef.current);
            }
        };
        return (0, base_1.upload)({
            xhr: new XMLHttpRequest(),
            data: formData,
            onprogress: onProgress,
        }, false, undefined, '?source=datasets')
            .then((res) => {
            const completeFile = {
                fileID: fileItem.fileID,
                file: res,
                progress: -1,
            };
            const index = fileListRef.current.findIndex(item => item.fileID === fileItem.fileID);
            fileListRef.current[index] = completeFile;
            onFileUpdate(completeFile, 100, fileListRef.current);
            return Promise.resolve({ ...completeFile });
        })
            .catch((e) => {
            const errorMessage = (0, utils_1.getFileUploadErrorMessage)(e, t('stepOne.uploader.failed', { ns: 'datasetCreation' }), t);
            notify({ type: 'error', message: errorMessage });
            onFileUpdate(fileItem, -2, fileListRef.current);
            return Promise.resolve({ ...fileItem });
        })
            .finally();
    }, [fileListRef, notify, onFileUpdate, t]);
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
        if (files.length + fileList.length > filesCountLimit && !config_1.IS_CE_EDITION) {
            notify({ type: 'error', message: t('stepOne.uploader.validation.filesNumber', { ns: 'datasetCreation', filesNumber: filesCountLimit }) });
            return false;
        }
        const preparedFiles = files.map((file, index) => ({
            fileID: `file${index}-${Date.now()}`,
            file,
            progress: -1,
        }));
        const newFiles = [...fileListRef.current, ...preparedFiles];
        prepareFileList(newFiles);
        fileListRef.current = newFiles;
        uploadMultipleFiles(preparedFiles);
    }, [prepareFileList, uploadMultipleFiles, notify, t, fileList, fileUploadConfig]);
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
    const traverseFileEntry = (0, react_2.useCallback)((entry, prefix = '') => {
        return new Promise((resolve) => {
            if (entry.isFile) {
                entry.file((file) => {
                    file.relativePath = `${prefix}${file.name}`;
                    resolve([file]);
                });
            }
            else if (entry.isDirectory) {
                const reader = entry.createReader();
                const entries = [];
                const read = () => {
                    reader.readEntries(async (results) => {
                        if (!results.length) {
                            const files = await Promise.all(entries.map(ent => traverseFileEntry(ent, `${prefix}${entry.name}/`)));
                            resolve(files.flat());
                        }
                        else {
                            entries.push(...results);
                            read();
                        }
                    });
                };
                read();
            }
            else {
                resolve([]);
            }
        });
    }, []);
    const handleDrop = (0, react_2.useCallback)(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (!e.dataTransfer)
            return;
        const nested = await Promise.all(Array.from(e.dataTransfer.items).map((it) => {
            const entry = it.webkitGetAsEntry?.();
            if (entry)
                return traverseFileEntry(entry);
            const f = it.getAsFile?.();
            return f ? Promise.resolve([f]) : Promise.resolve([]);
        }));
        let files = nested.flat();
        if (!supportBatchUpload)
            files = files.slice(0, 1);
        files = files.slice(0, fileUploadConfig.batch_count_limit);
        const valid = files.filter(isValid);
        initialUpload(valid);
    }, [initialUpload, isValid, supportBatchUpload, traverseFileEntry, fileUploadConfig]);
    const selectHandle = () => {
        if (fileUploader.current)
            fileUploader.current.click();
    };
    const removeFile = (fileID) => {
        if (fileUploader.current)
            fileUploader.current.value = '';
        fileListRef.current = fileListRef.current.filter(item => item.fileID !== fileID);
        onFileListUpdate?.([...fileListRef.current]);
    };
    const fileChangeHandle = (0, react_2.useCallback)((e) => {
        let files = [...(e.target.files ?? [])];
        files = files.slice(0, fileUploadConfig.batch_count_limit);
        initialUpload(files.filter(isValid));
    }, [isValid, initialUpload, fileUploadConfig]);
    const { theme } = (0, use_theme_1.default)();
    const chartColor = (0, react_2.useMemo)(() => theme === app_1.Theme.dark ? '#5289ff' : '#296dff', [theme]);
    (0, react_2.useEffect)(() => {
        dropRef.current?.addEventListener('dragenter', handleDragEnter);
        dropRef.current?.addEventListener('dragover', handleDragOver);
        dropRef.current?.addEventListener('dragleave', handleDragLeave);
        dropRef.current?.addEventListener('drop', handleDrop);
        return () => {
            dropRef.current?.removeEventListener('dragenter', handleDragEnter);
            dropRef.current?.removeEventListener('dragover', handleDragOver);
            dropRef.current?.removeEventListener('dragleave', handleDragLeave);
            dropRef.current?.removeEventListener('drop', handleDrop);
        };
    }, [handleDrop]);
    return (<div className="mb-5 w-[640px]">
      {!hideUpload && (<input ref={fileUploader} id="fileUploader" className="hidden" type="file" multiple={supportBatchUpload} accept={ACCEPTS.join(',')} onChange={fileChangeHandle}/>)}

      <div className={(0, classnames_1.cn)('mb-1 text-sm font-semibold leading-6 text-text-secondary', titleClassName)}>{t('stepOne.uploader.title', { ns: 'datasetCreation' })}</div>

      {!hideUpload && (<div ref={dropRef} className={(0, classnames_1.cn)('relative mb-2 box-border flex min-h-20 max-w-[640px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-components-dropzone-border bg-components-dropzone-bg px-4 py-3 text-xs leading-4 text-text-tertiary', dragging && 'border-components-dropzone-border-accent bg-components-dropzone-bg-accent')}>
          <div className="flex min-h-5 items-center justify-center text-sm leading-4 text-text-secondary">
            <react_1.RiUploadCloud2Line className="mr-2 size-5"/>

            <span>
              {supportBatchUpload ? t('stepOne.uploader.button', { ns: 'datasetCreation' }) : t('stepOne.uploader.buttonSingleFile', { ns: 'datasetCreation' })}
              {supportTypes.length > 0 && (<label className="ml-1 cursor-pointer text-text-accent" onClick={selectHandle}>{t('stepOne.uploader.browse', { ns: 'datasetCreation' })}</label>)}
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
      <div className="max-w-[640px] cursor-default space-y-1">

        {fileList.map((fileItem, index) => (<div key={`${fileItem.fileID}-${index}`} onClick={() => fileItem.file?.id && onPreview(fileItem.file)} className={(0, classnames_1.cn)('flex h-12 max-w-[640px] items-center rounded-lg border border-components-panel-border bg-components-panel-on-panel-item-bg text-xs leading-3 text-text-tertiary shadow-xs')}>
            <div className="flex w-12 shrink-0 items-center justify-center">
              <document_file_icon_1.default size="xl" className="shrink-0" name={fileItem.file.name} extension={getFileType(fileItem.file)}/>
            </div>
            <div className="flex shrink grow flex-col gap-0.5">
              <div className="flex w-full">
                <div className="w-0 grow truncate text-sm leading-4 text-text-secondary">{fileItem.file.name}</div>
              </div>
              <div className="w-full truncate leading-3 text-text-tertiary">
                <span className="uppercase">{getFileType(fileItem.file)}</span>
                <span className="px-1 text-text-quaternary">·</span>
                <span>{getFileSize(fileItem.file.size)}</span>
                {/* <span className='px-1 text-text-quaternary'>·</span>
              <span>10k characters</span> */}
              </div>
            </div>
            <div className="flex w-16 shrink-0 items-center justify-end gap-1 pr-3">
              {/* <span className="flex justify-center items-center w-6 h-6 cursor-pointer">
                <RiErrorWarningFill className='size-4 text-text-warning' />
              </span> */}
              {(fileItem.progress < 100 && fileItem.progress >= 0) && (
            // <div className={s.percent}>{`${fileItem.progress}%`}</div>
            <simple_pie_chart_1.default percentage={fileItem.progress} stroke={chartColor} fill={chartColor} animationDuration={0}/>)}
              <span className="flex h-6 w-6 cursor-pointer items-center justify-center" onClick={(e) => {
                e.stopPropagation();
                removeFile(fileItem.fileID);
            }}>
                <react_1.RiDeleteBinLine className="size-4 text-text-tertiary"/>
              </span>
            </div>
          </div>))}
      </div>
    </div>);
};
exports.default = FileUploader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FBc0U7QUFDdEUsK0JBQThCO0FBQzlCLGlDQUF5RTtBQUN6RSxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELHFFQUFxRjtBQUNyRiw2RUFBbUU7QUFDbkUsdURBQTBEO0FBQzFELHFDQUF3QztBQUV4Qyx5Q0FBMEM7QUFDMUMsaURBQXdDO0FBQ3hDLHFEQUEyRDtBQUMzRCx5Q0FBdUM7QUFDdkMscURBQStFO0FBQy9FLHFDQUFtQztBQUNuQyxtREFBdUM7QUFDdkMsd0VBQThEO0FBWTlELE1BQU0sWUFBWSxHQUFHLENBQUMsRUFDcEIsUUFBUSxFQUNSLGNBQWMsRUFDZCxlQUFlLEVBQ2YsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixTQUFTLEVBQ1Qsa0JBQWtCLEdBQUcsS0FBSyxHQUNQLEVBQUUsRUFBRTtJQUN2QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsaUNBQVUsRUFBQyxvQkFBWSxDQUFDLENBQUE7SUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxjQUFNLEVBQWlCLElBQUksQ0FBQyxDQUFBO0lBQzVDLE1BQU0sT0FBTyxHQUFHLElBQUEsY0FBTSxFQUFpQixJQUFJLENBQUMsQ0FBQTtJQUM1QyxNQUFNLFlBQVksR0FBRyxJQUFBLGNBQU0sRUFBbUIsSUFBSSxDQUFDLENBQUE7SUFDbkQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFH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Q0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUk7WUFDdEQsNkRBQTZEO1lBQzdELENBQUMsMEJBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUM5RyxDQUNEO2NBQUEsQ0FBQyxJQUFJLENBQ0gsU0FBUyxDQUFDLHlEQUF5RCxDQUNuRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNiLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDbkIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QixDQUFDLENBQUMsQ0FFRjtnQkFBQSxDQUFDLHVCQUFlLENBQUMsU0FBUyxDQUFDLDJCQUEyQixFQUN4RDtjQUFBLEVBQUUsSUFBSSxDQUNSO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEN1c3RvbUZpbGUgYXMgRmlsZSwgRmlsZUl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IFJpRGVsZXRlQmluTGluZSwgUmlVcGxvYWRDbG91ZDJMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IHsgZ2V0RmlsZVVwbG9hZEVycm9yTWVzc2FnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9maWxlLXVwbG9hZGVyL3V0aWxzJ1xuaW1wb3J0IFNpbXBsZVBpZUNoYXJ0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9zaW1wbGUtcGllLWNoYXJ0J1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgSVNfQ0VfRURJVElPTiB9IGZyb20gJ0AvY29uZmlnJ1xuXG5pbXBvcnQgeyB1c2VMb2NhbGUgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCB1c2VUaGVtZSBmcm9tICdAL2hvb2tzL3VzZS10aGVtZSdcbmltcG9ydCB7IExhbmd1YWdlc1N1cHBvcnRlZCB9IGZyb20gJ0AvaTE4bi1jb25maWcvbGFuZ3VhZ2UnXG5pbXBvcnQgeyB1cGxvYWQgfSBmcm9tICdAL3NlcnZpY2UvYmFzZSdcbmltcG9ydCB7IHVzZUZpbGVTdXBwb3J0VHlwZXMsIHVzZUZpbGVVcGxvYWRDb25maWcgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBEb2N1bWVudEZpbGVJY29uIGZyb20gJy4uLy4uL2NvbW1vbi9kb2N1bWVudC1maWxlLWljb24nXG5cbnR5cGUgSUZpbGVVcGxvYWRlclByb3BzID0ge1xuICBmaWxlTGlzdDogRmlsZUl0ZW1bXVxuICB0aXRsZUNsYXNzTmFtZT86IHN0cmluZ1xuICBwcmVwYXJlRmlsZUxpc3Q6IChmaWxlczogRmlsZUl0ZW1bXSkgPT4gdm9pZFxuICBvbkZpbGVVcGRhdGU6IChmaWxlSXRlbTogRmlsZUl0ZW0sIHByb2dyZXNzOiBudW1iZXIsIGxpc3Q6IEZpbGVJdGVtW10pID0+IHZvaWRcbiAgb25GaWxlTGlzdFVwZGF0ZT86IChmaWxlczogRmlsZUl0ZW1bXSkgPT4gdm9pZFxuICBvblByZXZpZXc6IChmaWxlOiBGaWxlKSA9PiB2b2lkXG4gIHN1cHBvcnRCYXRjaFVwbG9hZD86IGJvb2xlYW5cbn1cblxuY29uc3QgRmlsZVVwbG9hZGVyID0gKHtcbiAgZmlsZUxpc3QsXG4gIHRpdGxlQ2xhc3NOYW1lLFxuICBwcmVwYXJlRmlsZUxpc3QsXG4gIG9uRmlsZVVwZGF0ZSxcbiAgb25GaWxlTGlzdFVwZGF0ZSxcbiAgb25QcmV2aWV3LFxuICBzdXBwb3J0QmF0Y2hVcGxvYWQgPSBmYWxzZSxcbn06IElGaWxlVXBsb2FkZXJQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZUNvbnRleHQoVG9hc3RDb250ZXh0KVxuICBjb25zdCBsb2NhbGUgPSB1c2VMb2NhbGUoKVxuICBjb25zdCBbZHJhZ2dpbmcsIHNldERyYWdnaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBkcm9wUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKVxuICBjb25zdCBkcmFnUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKVxuICBjb25zdCBmaWxlVXBsb2FkZXIgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudD4obnVsbClcbiAgY29uc3QgaGlkZVVwbG9hZCA9ICFzdXBwb3J0QmF0Y2hVcGxvYWQgJiYgZmlsZUxpc3QubGVuZ3RoID4gMFxuXG4gIGNvbnN0IHsgZGF0YTogZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlIH0gPSB1c2VGaWxlVXBsb2FkQ29uZmlnKClcbiAgY29uc3QgeyBkYXRhOiBzdXBwb3J0RmlsZVR5cGVzUmVzcG9uc2UgfSA9IHVzZUZpbGVTdXBwb3J0VHlwZXMoKVxuICBjb25zdCBzdXBwb3J0VHlwZXMgPSBzdXBwb3J0RmlsZVR5cGVzUmVzcG9uc2U/LmFsbG93ZWRfZXh0ZW5zaW9ucyB8fCBbXVxuICBjb25zdCBzdXBwb3J0VHlwZXNTaG93TmFtZXMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IGV4dGVuc2lvbk1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgIG1kOiAnbWFya2Rvd24nLFxuICAgICAgcHB0eDogJ3BwdHgnLFxuICAgICAgaHRtOiAnaHRtbCcsXG4gICAgICB4bHN4OiAneGxzeCcsXG4gICAgICBkb2N4OiAnZG9jeCcsXG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5zdXBwb3J0VHlwZXNdXG4gICAgICAubWFwKGl0ZW0gPT4gZXh0ZW5zaW9uTWFwW2l0ZW1dIHx8IGl0ZW0pIC8vIG1hcCB0byBzdGFuZGFyZGl6ZWQgZXh0ZW5zaW9uXG4gICAgICAubWFwKGl0ZW0gPT4gaXRlbS50b0xvd2VyQ2FzZSgpKSAvLyBjb252ZXJ0IHRvIGxvd2VyIGNhc2VcbiAgICAgIC5maWx0ZXIoKGl0ZW0sIGluZGV4LCBzZWxmKSA9PiBzZWxmLmluZGV4T2YoaXRlbSkgPT09IGluZGV4KSAvLyByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgLm1hcChpdGVtID0+IGl0ZW0udG9VcHBlckNhc2UoKSkgLy8gY29udmVydCB0byB1cHBlciBjYXNlXG4gICAgICAuam9pbihsb2NhbGUgIT09IExhbmd1YWdlc1N1cHBvcnRlZFsxXSA/ICcsICcgOiAn44CBICcpXG4gIH0pKClcbiAgY29uc3QgQUNDRVBUUyA9IHN1cHBvcnRUeXBlcy5tYXAoKGV4dDogc3RyaW5nKSA9PiBgLiR7ZXh0fWApXG4gIGNvbnN0IGZpbGVVcGxvYWRDb25maWcgPSB1c2VNZW1vKCgpID0+ICh7XG4gICAgZmlsZV9zaXplX2xpbWl0OiBmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2U/LmZpbGVfc2l6ZV9saW1pdCA/PyAxNSxcbiAgICBiYXRjaF9jb3VudF9saW1pdDogc3VwcG9ydEJhdGNoVXBsb2FkID8gKGZpbGVVcGxvYWRDb25maWdSZXNwb25zZT8uYmF0Y2hfY291bnRfbGltaXQgPz8gNSkgOiAxLFxuICAgIGZpbGVfdXBsb2FkX2xpbWl0OiBzdXBwb3J0QmF0Y2hVcGxvYWQgPyAoZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlPy5maWxlX3VwbG9hZF9saW1pdCA/PyA1KSA6IDEsXG4gIH0pLCBbZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlLCBzdXBwb3J0QmF0Y2hVcGxvYWRdKVxuXG4gIGNvbnN0IGZpbGVMaXN0UmVmID0gdXNlUmVmPEZpbGVJdGVtW10+KFtdKVxuXG4gIC8vIHV0aWxzXG4gIGNvbnN0IGdldEZpbGVUeXBlID0gKGN1cnJlbnRGaWxlOiBGaWxlKSA9PiB7XG4gICAgaWYgKCFjdXJyZW50RmlsZSlcbiAgICAgIHJldHVybiAnJ1xuXG4gICAgY29uc3QgYXJyID0gY3VycmVudEZpbGUubmFtZS5zcGxpdCgnLicpXG4gICAgcmV0dXJuIGFyclthcnIubGVuZ3RoIC0gMV1cbiAgfVxuXG4gIGNvbnN0IGdldEZpbGVTaXplID0gKHNpemU6IG51bWJlcikgPT4ge1xuICAgIGlmIChzaXplIC8gMTAyNCA8IDEwKVxuICAgICAgcmV0dXJuIGAkeyhzaXplIC8gMTAyNCkudG9GaXhlZCgyKX1LQmBcblxuICAgIHJldHVybiBgJHsoc2l6ZSAvIDEwMjQgLyAxMDI0KS50b0ZpeGVkKDIpfU1CYFxuICB9XG5cbiAgY29uc3QgaXNWYWxpZCA9IHVzZUNhbGxiYWNrKChmaWxlOiBGaWxlKSA9PiB7XG4gICAgY29uc3QgeyBzaXplIH0gPSBmaWxlXG4gICAgY29uc3QgZXh0ID0gYC4ke2dldEZpbGVUeXBlKGZpbGUpfWBcbiAgICBjb25zdCBpc1ZhbGlkVHlwZSA9IEFDQ0VQVFMuaW5jbHVkZXMoZXh0LnRvTG93ZXJDYXNlKCkpXG4gICAgaWYgKCFpc1ZhbGlkVHlwZSlcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3N0ZXBPbmUudXBsb2FkZXIudmFsaWRhdGlvbi50eXBlRXJyb3InLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KSB9KVxuXG4gICAgY29uc3QgaXNWYWxpZFNpemUgPSBzaXplIDw9IGZpbGVVcGxvYWRDb25maWcuZmlsZV9zaXplX2xpbWl0ICogMTAyNCAqIDEwMjRcbiAgICBpZiAoIWlzVmFsaWRTaXplKVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnc3RlcE9uZS51cGxvYWRlci52YWxpZGF0aW9uLnNpemUnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJywgc2l6ZTogZmlsZVVwbG9hZENvbmZpZy5maWxlX3NpemVfbGltaXQgfSkgfSlcblxuICAgIHJldHVybiBpc1ZhbGlkVHlwZSAmJiBpc1ZhbGlkU2l6ZVxuICB9LCBbZmlsZVVwbG9hZENvbmZpZywgbm90aWZ5LCB0LCBBQ0NFUFRTXSlcblxuICBjb25zdCBmaWxlVXBsb2FkID0gdXNlQ2FsbGJhY2soYXN5bmMgKGZpbGVJdGVtOiBGaWxlSXRlbSk6IFByb21pc2U8RmlsZUl0ZW0+ID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaWxlJywgZmlsZUl0ZW0uZmlsZSlcbiAgICBjb25zdCBvblByb2dyZXNzID0gKGU6IFByb2dyZXNzRXZlbnQpID0+IHtcbiAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IE1hdGguZmxvb3IoZS5sb2FkZWQgLyBlLnRvdGFsICogMTAwKVxuICAgICAgICBvbkZpbGVVcGRhdGUoZmlsZUl0ZW0sIHBlcmNlbnQsIGZpbGVMaXN0UmVmLmN1cnJlbnQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwbG9hZCh7XG4gICAgICB4aHI6IG5ldyBYTUxIdHRwUmVxdWVzdCgpLFxuICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAgICBvbnByb2dyZXNzOiBvblByb2dyZXNzLFxuICAgIH0sIGZhbHNlLCB1bmRlZmluZWQsICc/c291cmNlPWRhdGFzZXRzJylcbiAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgY29tcGxldGVGaWxlID0ge1xuICAgICAgICAgIGZpbGVJRDogZmlsZUl0ZW0uZmlsZUlELFxuICAgICAgICAgIGZpbGU6IHJlcyBhcyB1bmtub3duIGFzIEZpbGUsXG4gICAgICAgICAgcHJvZ3Jlc3M6IC0xLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmlsZUxpc3RSZWYuY3VycmVudC5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmZpbGVJRCA9PT0gZmlsZUl0ZW0uZmlsZUlEKVxuICAgICAgICBmaWxlTGlzdFJlZi5jdXJyZW50W2luZGV4XSA9IGNvbXBsZXRlRmlsZVxuICAgICAgICBvbkZpbGVVcGRhdGUoY29tcGxldGVGaWxlLCAxMDAsIGZpbGVMaXN0UmVmLmN1cnJlbnQpXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyAuLi5jb21wbGV0ZUZpbGUgfSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZ2V0RmlsZVVwbG9hZEVycm9yTWVzc2FnZShlLCB0KCdzdGVwT25lLnVwbG9hZGVyLmZhaWxlZCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pLCB0KVxuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBlcnJvck1lc3NhZ2UgfSlcbiAgICAgICAgb25GaWxlVXBkYXRlKGZpbGVJdGVtLCAtMiwgZmlsZUxpc3RSZWYuY3VycmVudClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IC4uLmZpbGVJdGVtIH0pXG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKVxuICB9LCBbZmlsZUxpc3RSZWYsIG5vdGlmeSwgb25GaWxlVXBkYXRlLCB0XSlcblxuICBjb25zdCB1cGxvYWRCYXRjaEZpbGVzID0gdXNlQ2FsbGJhY2soKGJGaWxlczogRmlsZUl0ZW1bXSkgPT4ge1xuICAgIGJGaWxlcy5mb3JFYWNoKGJmID0+IChiZi5wcm9ncmVzcyA9IDApKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChiRmlsZXMubWFwKGZpbGVVcGxvYWQpKVxuICB9LCBbZmlsZVVwbG9hZF0pXG5cbiAgY29uc3QgdXBsb2FkTXVsdGlwbGVGaWxlcyA9IHVzZUNhbGxiYWNrKGFzeW5jIChmaWxlczogRmlsZUl0ZW1bXSkgPT4ge1xuICAgIGNvbnN0IGJhdGNoQ291bnRMaW1pdCA9IGZpbGVVcGxvYWRDb25maWcuYmF0Y2hfY291bnRfbGltaXRcbiAgICBjb25zdCBsZW5ndGggPSBmaWxlcy5sZW5ndGhcbiAgICBsZXQgc3RhcnQgPSAwXG4gICAgbGV0IGVuZCA9IDBcblxuICAgIHdoaWxlIChzdGFydCA8IGxlbmd0aCkge1xuICAgICAgaWYgKHN0YXJ0ICsgYmF0Y2hDb3VudExpbWl0ID4gbGVuZ3RoKVxuICAgICAgICBlbmQgPSBsZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgZW5kID0gc3RhcnQgKyBiYXRjaENvdW50TGltaXRcbiAgICAgIGNvbnN0IGJGaWxlcyA9IGZpbGVzLnNsaWNlKHN0YXJ0LCBlbmQpXG4gICAgICBhd2FpdCB1cGxvYWRCYXRjaEZpbGVzKGJGaWxlcylcbiAgICAgIHN0YXJ0ID0gZW5kXG4gICAgfVxuICB9LCBbZmlsZVVwbG9hZENvbmZpZywgdXBsb2FkQmF0Y2hGaWxlc10pXG5cbiAgY29uc3QgaW5pdGlhbFVwbG9hZCA9IHVzZUNhbGxiYWNrKChmaWxlczogRmlsZVtdKSA9PiB7XG4gICAgY29uc3QgZmlsZXNDb3VudExpbWl0ID0gZmlsZVVwbG9hZENvbmZpZy5maWxlX3VwbG9hZF9saW1pdFxuICAgIGlmICghZmlsZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBpZiAoZmlsZXMubGVuZ3RoICsgZmlsZUxpc3QubGVuZ3RoID4gZmlsZXNDb3VudExpbWl0ICYmICFJU19DRV9FRElUSU9OKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdzdGVwT25lLnVwbG9hZGVyLnZhbGlkYXRpb24uZmlsZXNOdW1iZXInLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJywgZmlsZXNOdW1iZXI6IGZpbGVzQ291bnRMaW1pdCB9KSB9KVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgcHJlcGFyZWRGaWxlcyA9IGZpbGVzLm1hcCgoZmlsZSwgaW5kZXgpID0+ICh7XG4gICAgICBmaWxlSUQ6IGBmaWxlJHtpbmRleH0tJHtEYXRlLm5vdygpfWAsXG4gICAgICBmaWxlLFxuICAgICAgcHJvZ3Jlc3M6IC0xLFxuICAgIH0pKVxuICAgIGNvbnN0IG5ld0ZpbGVzID0gWy4uLmZpbGVMaXN0UmVmLmN1cnJlbnQsIC4uLnByZXBhcmVkRmlsZXNdXG4gICAgcHJlcGFyZUZpbGVMaXN0KG5ld0ZpbGVzKVxuICAgIGZpbGVMaXN0UmVmLmN1cnJlbnQgPSBuZXdGaWxlc1xuICAgIHVwbG9hZE11bHRpcGxlRmlsZXMocHJlcGFyZWRGaWxlcylcbiAgfSwgW3ByZXBhcmVGaWxlTGlzdCwgdXBsb2FkTXVsdGlwbGVGaWxlcywgbm90aWZ5LCB0LCBmaWxlTGlzdCwgZmlsZVVwbG9hZENvbmZpZ10pXG5cbiAgY29uc3QgaGFuZGxlRHJhZ0VudGVyID0gKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBpZiAoZS50YXJnZXQgIT09IGRyYWdSZWYuY3VycmVudClcbiAgICAgIHNldERyYWdnaW5nKHRydWUpXG4gIH1cbiAgY29uc3QgaGFuZGxlRHJhZ092ZXIgPSAoZTogRHJhZ0V2ZW50KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICB9XG4gIGNvbnN0IGhhbmRsZURyYWdMZWF2ZSA9IChlOiBEcmFnRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKGUudGFyZ2V0ID09PSBkcmFnUmVmLmN1cnJlbnQpXG4gICAgICBzZXREcmFnZ2luZyhmYWxzZSlcbiAgfVxuICB0eXBlIEZpbGVXaXRoUGF0aCA9IHtcbiAgICByZWxhdGl2ZVBhdGg/OiBzdHJpbmdcbiAgfSAmIEZpbGVcbiAgY29uc3QgdHJhdmVyc2VGaWxlRW50cnkgPSB1c2VDYWxsYmFjayhcbiAgICAoZW50cnk6IGFueSwgcHJlZml4ID0gJycpOiBQcm9taXNlPEZpbGVXaXRoUGF0aFtdPiA9PiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuICAgICAgICAgIGVudHJ5LmZpbGUoKGZpbGU6IEZpbGVXaXRoUGF0aCkgPT4ge1xuICAgICAgICAgICAgZmlsZS5yZWxhdGl2ZVBhdGggPSBgJHtwcmVmaXh9JHtmaWxlLm5hbWV9YFxuICAgICAgICAgICAgcmVzb2x2ZShbZmlsZV0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChlbnRyeS5pc0RpcmVjdG9yeSkge1xuICAgICAgICAgIGNvbnN0IHJlYWRlciA9IGVudHJ5LmNyZWF0ZVJlYWRlcigpXG4gICAgICAgICAgY29uc3QgZW50cmllczogYW55W10gPSBbXVxuICAgICAgICAgIGNvbnN0IHJlYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoYXN5bmMgKHJlc3VsdHM6IEZpbGVTeXN0ZW1FbnRyeVtdKSA9PiB7XG4gICAgICAgICAgICAgIGlmICghcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgZW50cmllcy5tYXAoZW50ID0+XG4gICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlRmlsZUVudHJ5KGVudCwgYCR7cHJlZml4fSR7ZW50cnkubmFtZX0vYCksXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZpbGVzLmZsYXQoKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goLi4ucmVzdWx0cylcbiAgICAgICAgICAgICAgICByZWFkKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVhZCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShbXSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICAgIFtdLFxuICApXG5cbiAgY29uc3QgaGFuZGxlRHJvcCA9IHVzZUNhbGxiYWNrKFxuICAgIGFzeW5jIChlOiBEcmFnRXZlbnQpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgc2V0RHJhZ2dpbmcoZmFsc2UpXG4gICAgICBpZiAoIWUuZGF0YVRyYW5zZmVyKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNvbnN0IG5lc3RlZCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLml0ZW1zKS5tYXAoKGl0KSA9PiB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSAoaXQgYXMgYW55KS53ZWJraXRHZXRBc0VudHJ5Py4oKVxuICAgICAgICAgIGlmIChlbnRyeSlcbiAgICAgICAgICAgIHJldHVybiB0cmF2ZXJzZUZpbGVFbnRyeShlbnRyeSlcbiAgICAgICAgICBjb25zdCBmID0gaXQuZ2V0QXNGaWxlPy4oKVxuICAgICAgICAgIHJldHVybiBmID8gUHJvbWlzZS5yZXNvbHZlKFtmXSkgOiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgICAgbGV0IGZpbGVzID0gbmVzdGVkLmZsYXQoKVxuICAgICAgaWYgKCFzdXBwb3J0QmF0Y2hVcGxvYWQpXG4gICAgICAgIGZpbGVzID0gZmlsZXMuc2xpY2UoMCwgMSlcbiAgICAgIGZpbGVzID0gZmlsZXMuc2xpY2UoMCwgZmlsZVVwbG9hZENvbmZpZy5iYXRjaF9jb3VudF9saW1pdClcbiAgICAgIGNvbnN0IHZhbGlkID0gZmlsZXMuZmlsdGVyKGlzVmFsaWQpXG4gICAgICBpbml0aWFsVXBsb2FkKHZhbGlkKVxuICAgIH0sXG4gICAgW2luaXRpYWxVcGxvYWQsIGlzVmFsaWQsIHN1cHBvcnRCYXRjaFVwbG9hZCwgdHJhdmVyc2VGaWxlRW50cnksIGZpbGVVcGxvYWRDb25maWddLFxuICApXG4gIGNvbnN0IHNlbGVjdEhhbmRsZSA9ICgpID0+IHtcbiAgICBpZiAoZmlsZVVwbG9hZGVyLmN1cnJlbnQpXG4gICAgICBmaWxlVXBsb2FkZXIuY3VycmVudC5jbGljaygpXG4gIH1cblxuICBjb25zdCByZW1vdmVGaWxlID0gKGZpbGVJRDogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGZpbGVVcGxvYWRlci5jdXJyZW50KVxuICAgICAgZmlsZVVwbG9hZGVyLmN1cnJlbnQudmFsdWUgPSAnJ1xuXG4gICAgZmlsZUxpc3RSZWYuY3VycmVudCA9IGZpbGVMaXN0UmVmLmN1cnJlbnQuZmlsdGVyKGl0ZW0gPT4gaXRlbS5maWxlSUQgIT09IGZpbGVJRClcbiAgICBvbkZpbGVMaXN0VXBkYXRlPy4oWy4uLmZpbGVMaXN0UmVmLmN1cnJlbnRdKVxuICB9XG4gIGNvbnN0IGZpbGVDaGFuZ2VIYW5kbGUgPSB1c2VDYWxsYmFjaygoZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICBsZXQgZmlsZXMgPSBbLi4uKGUudGFyZ2V0LmZpbGVzID8/IFtdKV0gYXMgRmlsZVtdXG4gICAgZmlsZXMgPSBmaWxlcy5zbGljZSgwLCBmaWxlVXBsb2FkQ29uZmlnLmJhdGNoX2NvdW50X2xpbWl0KVxuICAgIGluaXRpYWxVcGxvYWQoZmlsZXMuZmlsdGVyKGlzVmFsaWQpKVxuICB9LCBbaXNWYWxpZCwgaW5pdGlhbFVwbG9hZCwgZmlsZVVwbG9hZENvbmZpZ10pXG5cbiAgY29uc3QgeyB0aGVtZSB9ID0gdXNlVGhlbWUoKVxuICBjb25zdCBjaGFydENvbG9yID0gdXNlTWVtbygoKSA9PiB0aGVtZSA9PT0gVGhlbWUuZGFyayA/ICcjNTI4OWZmJyA6ICcjMjk2ZGZmJywgW3RoZW1lXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGRyb3BSZWYuY3VycmVudD8uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgaGFuZGxlRHJhZ0VudGVyKVxuICAgIGRyb3BSZWYuY3VycmVudD8uYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBoYW5kbGVEcmFnT3ZlcilcbiAgICBkcm9wUmVmLmN1cnJlbnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIGhhbmRsZURyYWdMZWF2ZSlcbiAgICBkcm9wUmVmLmN1cnJlbnQ/LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBoYW5kbGVEcm9wKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkcm9wUmVmLmN1cnJlbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIGhhbmRsZURyYWdFbnRlcilcbiAgICAgIGRyb3BSZWYuY3VycmVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBoYW5kbGVEcmFnT3ZlcilcbiAgICAgIGRyb3BSZWYuY3VycmVudD8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ2xlYXZlJywgaGFuZGxlRHJhZ0xlYXZlKVxuICAgICAgZHJvcFJlZi5jdXJyZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKCdkcm9wJywgaGFuZGxlRHJvcClcbiAgICB9XG4gIH0sIFtoYW5kbGVEcm9wXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNSB3LVs2NDBweF1cIj5cbiAgICAgIHshaGlkZVVwbG9hZCAmJiAoXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17ZmlsZVVwbG9hZGVyfVxuICAgICAgICAgIGlkPVwiZmlsZVVwbG9hZGVyXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJoaWRkZW5cIlxuICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICBtdWx0aXBsZT17c3VwcG9ydEJhdGNoVXBsb2FkfVxuICAgICAgICAgIGFjY2VwdD17QUNDRVBUUy5qb2luKCcsJyl9XG4gICAgICAgICAgb25DaGFuZ2U9e2ZpbGVDaGFuZ2VIYW5kbGV9XG4gICAgICAgIC8+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ21iLTEgdGV4dC1zbSBmb250LXNlbWlib2xkIGxlYWRpbmctNiB0ZXh0LXRleHQtc2Vjb25kYXJ5JywgdGl0bGVDbGFzc05hbWUpfT57dCgnc3RlcE9uZS51cGxvYWRlci50aXRsZScsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfTwvZGl2PlxuXG4gICAgICB7IWhpZGVVcGxvYWQgJiYgKFxuICAgICAgICA8ZGl2IHJlZj17ZHJvcFJlZn0gY2xhc3NOYW1lPXtjbigncmVsYXRpdmUgbWItMiBib3gtYm9yZGVyIGZsZXggbWluLWgtMjAgbWF4LXctWzY0MHB4XSBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTEgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWRhc2hlZCBib3JkZXItY29tcG9uZW50cy1kcm9wem9uZS1ib3JkZXIgYmctY29tcG9uZW50cy1kcm9wem9uZS1iZyBweC00IHB5LTMgdGV4dC14cyBsZWFkaW5nLTQgdGV4dC10ZXh0LXRlcnRpYXJ5JywgZHJhZ2dpbmcgJiYgJ2JvcmRlci1jb21wb25lbnRzLWRyb3B6b25lLWJvcmRlci1hY2NlbnQgYmctY29tcG9uZW50cy1kcm9wem9uZS1iZy1hY2NlbnQnKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLTUgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRleHQtc20gbGVhZGluZy00IHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIDxSaVVwbG9hZENsb3VkMkxpbmUgY2xhc3NOYW1lPVwibXItMiBzaXplLTVcIiAvPlxuXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAge3N1cHBvcnRCYXRjaFVwbG9hZCA/IHQoJ3N0ZXBPbmUudXBsb2FkZXIuYnV0dG9uJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSkgOiB0KCdzdGVwT25lLnVwbG9hZGVyLmJ1dHRvblNpbmdsZUZpbGUnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KX1cbiAgICAgICAgICAgICAge3N1cHBvcnRUeXBlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWwtMSBjdXJzb3ItcG9pbnRlciB0ZXh0LXRleHQtYWNjZW50XCIgb25DbGljaz17c2VsZWN0SGFuZGxlfT57dCgnc3RlcE9uZS51cGxvYWRlci5icm93c2UnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KX08L2xhYmVsPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7dCgnc3RlcE9uZS51cGxvYWRlci50aXAnLCB7XG4gICAgICAgICAgICAgIG5zOiAnZGF0YXNldENyZWF0aW9uJyxcbiAgICAgICAgICAgICAgc2l6ZTogZmlsZVVwbG9hZENvbmZpZy5maWxlX3NpemVfbGltaXQsXG4gICAgICAgICAgICAgIHN1cHBvcnRUeXBlczogc3VwcG9ydFR5cGVzU2hvd05hbWVzLFxuICAgICAgICAgICAgICBiYXRjaENvdW50OiBmaWxlVXBsb2FkQ29uZmlnLmJhdGNoX2NvdW50X2xpbWl0LFxuICAgICAgICAgICAgICB0b3RhbENvdW50OiBmaWxlVXBsb2FkQ29uZmlnLmZpbGVfdXBsb2FkX2xpbWl0LFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2RyYWdnaW5nICYmIDxkaXYgcmVmPXtkcmFnUmVmfSBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgaC1mdWxsIHctZnVsbFwiIC8+fVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LVs2NDBweF0gY3Vyc29yLWRlZmF1bHQgc3BhY2UteS0xXCI+XG5cbiAgICAgICAge2ZpbGVMaXN0Lm1hcCgoZmlsZUl0ZW0sIGluZGV4KSA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAga2V5PXtgJHtmaWxlSXRlbS5maWxlSUR9LSR7aW5kZXh9YH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZpbGVJdGVtLmZpbGU/LmlkICYmIG9uUHJldmlldyhmaWxlSXRlbS5maWxlKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICdmbGV4IGgtMTIgbWF4LXctWzY0MHB4XSBpdGVtcy1jZW50ZXIgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyB0ZXh0LXhzIGxlYWRpbmctMyB0ZXh0LXRleHQtdGVydGlhcnkgc2hhZG93LXhzJyxcbiAgICAgICAgICAgICAgLy8gJ2JvcmRlci1zdGF0ZS1kZXN0cnVjdGl2ZS1ib3JkZXIgYmctc3RhdGUtZGVzdHJ1Y3RpdmUtaG92ZXInLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy0xMiBzaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPERvY3VtZW50RmlsZUljb25cbiAgICAgICAgICAgICAgICBzaXplPVwieGxcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wXCJcbiAgICAgICAgICAgICAgICBuYW1lPXtmaWxlSXRlbS5maWxlLm5hbWV9XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uPXtnZXRGaWxlVHlwZShmaWxlSXRlbS5maWxlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluayBncm93IGZsZXgtY29sIGdhcC0wLjVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0wIGdyb3cgdHJ1bmNhdGUgdGV4dC1zbSBsZWFkaW5nLTQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPntmaWxlSXRlbS5maWxlLm5hbWV9PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCB0cnVuY2F0ZSBsZWFkaW5nLTMgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidXBwZXJjYXNlXCI+e2dldEZpbGVUeXBlKGZpbGVJdGVtLmZpbGUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0xIHRleHQtdGV4dC1xdWF0ZXJuYXJ5XCI+wrc8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+e2dldEZpbGVTaXplKGZpbGVJdGVtLmZpbGUuc2l6ZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgIHsvKiA8c3BhbiBjbGFzc05hbWU9J3B4LTEgdGV4dC10ZXh0LXF1YXRlcm5hcnknPsK3PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+MTBrIGNoYXJhY3RlcnM8L3NwYW4+ICovfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctMTYgc2hyaW5rLTAgaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0xIHByLTNcIj5cbiAgICAgICAgICAgICAgey8qIDxzcGFuIGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIHctNiBoLTYgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxSaUVycm9yV2FybmluZ0ZpbGwgY2xhc3NOYW1lPSdzaXplLTQgdGV4dC10ZXh0LXdhcm5pbmcnIC8+XG4gICAgICAgICAgICAgICAgPC9zcGFuPiAqL31cbiAgICAgICAgICAgICAgeyhmaWxlSXRlbS5wcm9ncmVzcyA8IDEwMCAmJiBmaWxlSXRlbS5wcm9ncmVzcyA+PSAwKSAmJiAoXG4gICAgICAgICAgICAgICAgLy8gPGRpdiBjbGFzc05hbWU9e3MucGVyY2VudH0+e2Ake2ZpbGVJdGVtLnByb2dyZXNzfSVgfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxTaW1wbGVQaWVDaGFydCBwZXJjZW50YWdlPXtmaWxlSXRlbS5wcm9ncmVzc30gc3Ryb2tlPXtjaGFydENvbG9yfSBmaWxsPXtjaGFydENvbG9yfSBhbmltYXRpb25EdXJhdGlvbj17MH0gLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgcmVtb3ZlRmlsZShmaWxlSXRlbS5maWxlSUQpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxSaURlbGV0ZUJpbkxpbmUgY2xhc3NOYW1lPVwic2l6ZS00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVVcGxvYWRlclxuIl19