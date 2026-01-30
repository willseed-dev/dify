"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTdValue = void 0;
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const array_1 = require("es-toolkit/array");
const object_1 = require("es-toolkit/object");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const checkbox_1 = require("@/app/components/base/checkbox");
const notion_icon_1 = require("@/app/components/base/notion-icon");
const pagination_1 = require("@/app/components/base/pagination");
const toast_1 = require("@/app/components/base/toast");
const tooltip_1 = require("@/app/components/base/tooltip");
const status_filter_1 = require("@/app/components/datasets/documents/status-filter");
const extension_to_file_type_1 = require("@/app/components/datasets/hit-testing/utils/extension-to-file-type");
const modal_1 = require("@/app/components/datasets/metadata/edit-metadata-batch/modal");
const dataset_detail_1 = require("@/context/dataset-detail");
const use_timestamp_1 = require("@/hooks/use-timestamp");
const datasets_1 = require("@/models/datasets");
const pipeline_1 = require("@/models/pipeline");
const use_document_1 = require("@/service/knowledge/use-document");
const utils_1 = require("@/utils");
const classnames_1 = require("@/utils/classnames");
const format_1 = require("@/utils/format");
const file_type_icon_1 = require("../../base/file-uploader/file-type-icon");
const chunking_mode_label_1 = require("../common/chunking-mode-label");
const use_batch_edit_document_metadata_1 = require("../metadata/hooks/use-batch-edit-document-metadata");
const batch_action_1 = require("./detail/completed/common/batch-action");
const operations_1 = require("./operations");
const rename_modal_1 = require("./rename-modal");
const status_item_1 = require("./status-item");
const style_module_css_1 = require("./style.module.css");
const renderTdValue = (value, isEmptyStyle = false) => {
    return (<div className={(0, classnames_1.cn)(isEmptyStyle ? 'text-text-tertiary' : 'text-text-secondary', style_module_css_1.default.tdValue)}>
      {value ?? '-'}
    </div>);
};
exports.renderTdValue = renderTdValue;
const renderCount = (count) => {
    if (!count)
        return (0, exports.renderTdValue)(0, true);
    if (count < 1000)
        return count;
    return `${(0, format_1.formatNumber)((count / 1000).toFixed(1))}k`;
};
/**
 * Document list component including basic information
 */
const DocumentList = ({ embeddingAvailable, documents = [], selectedIds, onSelectedIdChange, datasetId, pagination, onUpdate, onManageMetadata, statusFilterValue, remoteSortValue, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { formatTime } = (0, use_timestamp_1.default)();
    const router = (0, navigation_1.useRouter)();
    const datasetConfig = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.dataset);
    const chunkingMode = datasetConfig?.doc_form;
    const isGeneralMode = chunkingMode !== datasets_1.ChunkingMode.parentChild;
    const isQAMode = chunkingMode === datasets_1.ChunkingMode.qa;
    const [sortField, setSortField] = (0, react_2.useState)(null);
    const [sortOrder, setSortOrder] = (0, react_2.useState)('desc');
    (0, react_2.useEffect)(() => {
        setSortField(null);
        setSortOrder('desc');
    }, [remoteSortValue]);
    const { isShowEditModal, showEditModal, hideEditModal, originalList, handleSave, } = (0, use_batch_edit_document_metadata_1.default)({
        datasetId,
        docList: documents.filter(doc => selectedIds.includes(doc.id)),
        selectedDocumentIds: selectedIds, // Pass all selected IDs separately
        onUpdate,
    });
    const localDocs = (0, react_2.useMemo)(() => {
        let filteredDocs = documents;
        if (statusFilterValue && statusFilterValue !== 'all') {
            filteredDocs = filteredDocs.filter(doc => typeof doc.display_status === 'string'
                && (0, status_filter_1.normalizeStatusForQuery)(doc.display_status) === statusFilterValue);
        }
        if (!sortField)
            return filteredDocs;
        const sortedDocs = [...filteredDocs].sort((a, b) => {
            let aValue;
            let bValue;
            switch (sortField) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'word_count':
                    aValue = a.word_count || 0;
                    bValue = b.word_count || 0;
                    break;
                case 'hit_count':
                    aValue = a.hit_count || 0;
                    bValue = b.hit_count || 0;
                    break;
                case 'created_at':
                    aValue = a.created_at;
                    bValue = b.created_at;
                    break;
                default:
                    return 0;
            }
            if (sortField === 'name') {
                const result = aValue.localeCompare(bValue);
                return sortOrder === 'asc' ? result : -result;
            }
            else {
                const result = aValue - bValue;
                return sortOrder === 'asc' ? result : -result;
            }
        });
        return sortedDocs;
    }, [documents, sortField, sortOrder, statusFilterValue]);
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortOrder('desc');
        }
    };
    const renderSortHeader = (field, label) => {
        const isActive = sortField === field;
        const isDesc = isActive && sortOrder === 'desc';
        return (<div className="flex cursor-pointer items-center hover:text-text-secondary" onClick={() => handleSort(field)}>
        {label}
        <react_1.RiArrowDownLine className={(0, classnames_1.cn)('ml-0.5 h-3 w-3 transition-all', isActive ? 'text-text-tertiary' : 'text-text-disabled', isActive && !isDesc ? 'rotate-180' : '')}/>
      </div>);
    };
    const [currDocument, setCurrDocument] = (0, react_2.useState)(null);
    const [isShowRenameModal, { setTrue: setShowRenameModalTrue, setFalse: setShowRenameModalFalse, }] = (0, ahooks_1.useBoolean)(false);
    const handleShowRenameModal = (0, react_2.useCallback)((doc) => {
        setCurrDocument(doc);
        setShowRenameModalTrue();
    }, [setShowRenameModalTrue]);
    const handleRenamed = (0, react_2.useCallback)(() => {
        onUpdate();
    }, [onUpdate]);
    const isAllSelected = (0, react_2.useMemo)(() => {
        return localDocs.length > 0 && localDocs.every(doc => selectedIds.includes(doc.id));
    }, [localDocs, selectedIds]);
    const isSomeSelected = (0, react_2.useMemo)(() => {
        return localDocs.some(doc => selectedIds.includes(doc.id));
    }, [localDocs, selectedIds]);
    const onSelectedAll = (0, react_2.useCallback)(() => {
        if (isAllSelected)
            onSelectedIdChange([]);
        else
            onSelectedIdChange((0, array_1.uniq)([...selectedIds, ...localDocs.map(doc => doc.id)]));
    }, [isAllSelected, localDocs, onSelectedIdChange, selectedIds]);
    const { mutateAsync: archiveDocument } = (0, use_document_1.useDocumentArchive)();
    const { mutateAsync: enableDocument } = (0, use_document_1.useDocumentEnable)();
    const { mutateAsync: disableDocument } = (0, use_document_1.useDocumentDisable)();
    const { mutateAsync: deleteDocument } = (0, use_document_1.useDocumentDelete)();
    const { mutateAsync: retryIndexDocument } = (0, use_document_1.useDocumentBatchRetryIndex)();
    const handleAction = (actionName) => {
        return async () => {
            let opApi;
            switch (actionName) {
                case datasets_1.DocumentActionType.archive:
                    opApi = archiveDocument;
                    break;
                case datasets_1.DocumentActionType.enable:
                    opApi = enableDocument;
                    break;
                case datasets_1.DocumentActionType.disable:
                    opApi = disableDocument;
                    break;
                default:
                    opApi = deleteDocument;
                    break;
            }
            const [e] = await (0, utils_1.asyncRunSafe)(opApi({ datasetId, documentIds: selectedIds }));
            if (!e) {
                if (actionName === datasets_1.DocumentActionType.delete)
                    onSelectedIdChange([]);
                toast_1.default.notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                onUpdate();
            }
            else {
                toast_1.default.notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            }
        };
    };
    const handleBatchReIndex = async () => {
        const [e] = await (0, utils_1.asyncRunSafe)(retryIndexDocument({ datasetId, documentIds: selectedIds }));
        if (!e) {
            onSelectedIdChange([]);
            toast_1.default.notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            onUpdate();
        }
        else {
            toast_1.default.notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
        }
    };
    const hasErrorDocumentsSelected = (0, react_2.useMemo)(() => {
        return localDocs.some(doc => selectedIds.includes(doc.id) && doc.display_status === 'error');
    }, [localDocs, selectedIds]);
    const getFileExtension = (0, react_2.useCallback)((fileName) => {
        if (!fileName)
            return '';
        const parts = fileName.split('.');
        if (parts.length <= 1 || (parts[0] === '' && parts.length === 2))
            return '';
        return parts[parts.length - 1].toLowerCase();
    }, []);
    const isCreateFromRAGPipeline = (0, react_2.useCallback)((createdFrom) => {
        return createdFrom === 'rag-pipeline';
    }, []);
    /**
     * Calculate the data source type
     * DataSourceType: FILE, NOTION, WEB (legacy)
     * DatasourceType: localFile, onlineDocument, websiteCrawl, onlineDrive (new)
     */
    const isLocalFile = (0, react_2.useCallback)((dataSourceType) => {
        return dataSourceType === pipeline_1.DatasourceType.localFile || dataSourceType === datasets_1.DataSourceType.FILE;
    }, []);
    const isOnlineDocument = (0, react_2.useCallback)((dataSourceType) => {
        return dataSourceType === pipeline_1.DatasourceType.onlineDocument || dataSourceType === datasets_1.DataSourceType.NOTION;
    }, []);
    const isWebsiteCrawl = (0, react_2.useCallback)((dataSourceType) => {
        return dataSourceType === pipeline_1.DatasourceType.websiteCrawl || dataSourceType === datasets_1.DataSourceType.WEB;
    }, []);
    const isOnlineDrive = (0, react_2.useCallback)((dataSourceType) => {
        return dataSourceType === pipeline_1.DatasourceType.onlineDrive;
    }, []);
    return (<div className="relative mt-3 flex h-full w-full flex-col">
      <div className="relative h-0 grow overflow-x-auto">
        <table className={`w-full min-w-[700px] max-w-full border-collapse border-0 text-sm ${style_module_css_1.default.documentTable}`}>
          <thead className="h-8 border-b border-divider-subtle text-xs font-medium uppercase leading-8 text-text-tertiary">
            <tr>
              <td className="w-12">
                <div className="flex items-center" onClick={e => e.stopPropagation()}>
                  {embeddingAvailable && (<checkbox_1.default className="mr-2 shrink-0" checked={isAllSelected} indeterminate={!isAllSelected && isSomeSelected} onCheck={onSelectedAll}/>)}
                  #
                </div>
              </td>
              <td>
                {renderSortHeader('name', t('list.table.header.fileName', { ns: 'datasetDocuments' }))}
              </td>
              <td className="w-[130px]">{t('list.table.header.chunkingMode', { ns: 'datasetDocuments' })}</td>
              <td className="w-24">
                {renderSortHeader('word_count', t('list.table.header.words', { ns: 'datasetDocuments' }))}
              </td>
              <td className="w-44">
                {renderSortHeader('hit_count', t('list.table.header.hitCount', { ns: 'datasetDocuments' }))}
              </td>
              <td className="w-44">
                {renderSortHeader('created_at', t('list.table.header.uploadTime', { ns: 'datasetDocuments' }))}
              </td>
              <td className="w-40">{t('list.table.header.status', { ns: 'datasetDocuments' })}</td>
              <td className="w-20">{t('list.table.header.action', { ns: 'datasetDocuments' })}</td>
            </tr>
          </thead>
          <tbody className="text-text-secondary">
            {localDocs.map((doc, index) => {
            const isFile = isLocalFile(doc.data_source_type);
            const fileType = isFile ? doc.data_source_detail_dict?.upload_file?.extension : '';
            return (<tr key={doc.id} className="h-8 cursor-pointer border-b border-divider-subtle hover:bg-background-default-hover" onClick={() => {
                    router.push(`/datasets/${datasetId}/documents/${doc.id}`);
                }}>
                  <td className="text-left align-middle text-xs text-text-tertiary">
                    <div className="flex items-center" onClick={e => e.stopPropagation()}>
                      <checkbox_1.default className="mr-2 shrink-0" checked={selectedIds.includes(doc.id)} onCheck={() => {
                    onSelectedIdChange(selectedIds.includes(doc.id)
                        ? selectedIds.filter(id => id !== doc.id)
                        : [...selectedIds, doc.id]);
                }}/>
                      {index + 1}
                    </div>
                  </td>
                  <td>
                    <div className="group mr-6 flex max-w-[460px] items-center hover:mr-0">
                      <div className="flex shrink-0 items-center">
                        {isOnlineDocument(doc.data_source_type) && (<notion_icon_1.default className="mr-1.5" type="page" src={isCreateFromRAGPipeline(doc.created_from)
                        ? doc.data_source_info.page.page_icon
                        : doc.data_source_info.notion_page_icon}/>)}
                        {isLocalFile(doc.data_source_type) && (<file_type_icon_1.default type={(0, extension_to_file_type_1.extensionToFileType)(isCreateFromRAGPipeline(doc.created_from)
                        ? doc?.data_source_info?.extension
                        : (doc?.data_source_info?.upload_file?.extension ?? fileType))} className="mr-1.5"/>)}
                        {isOnlineDrive(doc.data_source_type) && (<file_type_icon_1.default type={(0, extension_to_file_type_1.extensionToFileType)(getFileExtension(doc?.data_source_info?.name))} className="mr-1.5"/>)}
                        {isWebsiteCrawl(doc.data_source_type) && (<react_1.RiGlobalLine className="mr-1.5 size-4"/>)}
                      </div>
                      <tooltip_1.default popupContent={doc.name}>
                        <span className="grow-1 truncate text-sm">{doc.name}</span>
                      </tooltip_1.default>
                      <div className="hidden shrink-0 group-hover:ml-auto group-hover:flex">
                        <tooltip_1.default popupContent={t('list.table.rename', { ns: 'datasetDocuments' })}>
                          <div className="cursor-pointer rounded-md p-1 hover:bg-state-base-hover" onClick={(e) => {
                    e.stopPropagation();
                    handleShowRenameModal(doc);
                }}>
                            <react_1.RiEditLine className="h-4 w-4 text-text-tertiary"/>
                          </div>
                        </tooltip_1.default>
                      </div>
                    </div>
                  </td>
                  <td>
                    <chunking_mode_label_1.default isGeneralMode={isGeneralMode} isQAMode={isQAMode}/>
                  </td>
                  <td>{renderCount(doc.word_count)}</td>
                  <td>{renderCount(doc.hit_count)}</td>
                  <td className="text-[13px] text-text-secondary">
                    {formatTime(doc.created_at, t('dateTimeFormat', { ns: 'datasetHitTesting' }))}
                  </td>
                  <td>
                    <status_item_1.default status={doc.display_status}/>
                  </td>
                  <td>
                    <operations_1.default selectedIds={selectedIds} onSelectedIdChange={onSelectedIdChange} embeddingAvailable={embeddingAvailable} datasetId={datasetId} detail={(0, object_1.pick)(doc, ['name', 'enabled', 'archived', 'id', 'data_source_type', 'doc_form', 'display_status'])} onUpdate={onUpdate}/>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
      {(selectedIds.length > 0) && (<batch_action_1.default className="absolute bottom-16 left-0 z-20" selectedIds={selectedIds} onArchive={handleAction(datasets_1.DocumentActionType.archive)} onBatchEnable={handleAction(datasets_1.DocumentActionType.enable)} onBatchDisable={handleAction(datasets_1.DocumentActionType.disable)} onBatchDelete={handleAction(datasets_1.DocumentActionType.delete)} onEditMetadata={showEditModal} onBatchReIndex={hasErrorDocumentsSelected ? handleBatchReIndex : undefined} onCancel={() => {
                onSelectedIdChange([]);
            }}/>)}
      {/* Show Pagination only if the total is more than the limit */}
      {pagination.total && (<pagination_1.default {...pagination} className="w-full shrink-0"/>)}

      {isShowRenameModal && currDocument && (<rename_modal_1.default datasetId={datasetId} documentId={currDocument.id} name={currDocument.name} onClose={setShowRenameModalFalse} onSaved={handleRenamed}/>)}

      {isShowEditModal && (<modal_1.default datasetId={datasetId} documentNum={selectedIds.length} list={originalList} onSave={handleSave} onHide={hideEditModal} onShowManage={() => {
                hideEditModal();
                onManageMetadata();
            }}/>)}
    </div>);
};
exports.default = DocumentList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUtaLDRDQUl5QjtBQUN6QixtQ0FBbUM7QUFDbkMsNENBQXVDO0FBQ3ZDLDhDQUF3QztBQUN4QyxnREFBMkM7QUFDM0MsK0JBQThCO0FBQzlCLGlDQUFpRTtBQUNqRSxpREFBOEM7QUFDOUMsNkRBQXFEO0FBQ3JELG1FQUEwRDtBQUMxRCxpRUFBeUQ7QUFDekQsdURBQStDO0FBQy9DLDJEQUFtRDtBQUNuRCxxRkFBMkY7QUFDM0YsK0dBQXdHO0FBQ3hHLHdGQUFpRztBQUNqRyw2REFBeUc7QUFDekcseURBQWdEO0FBQ2hELGdEQUFvRjtBQUNwRixnREFBa0Q7QUFDbEQsbUVBQTJKO0FBQzNKLG1DQUFzQztBQUN0QyxtREFBdUM7QUFDdkMsMkNBQTZDO0FBQzdDLDRFQUFrRTtBQUNsRSx1RUFBNkQ7QUFDN0QseUdBQTZGO0FBQzdGLHlFQUFnRTtBQUNoRSw2Q0FBcUM7QUFDckMsaURBQXdDO0FBQ3hDLCtDQUFzQztBQUN0Qyx5REFBa0M7QUFFM0IsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUE2QixFQUFFLFlBQVksR0FBRyxLQUFLLEVBQUUsRUFBRTtJQUNuRixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEVBQUUsMEJBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUN6RjtNQUFBLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FDZjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQU5ZLFFBQUEsYUFBYSxpQkFNekI7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQXlCLEVBQUUsRUFBRTtJQUNoRCxJQUFJLENBQUMsS0FBSztRQUNSLE9B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QTtnQkFDZixnQkFBZ0IsRUFBRSxDQUFBO1lBQ3BCLENBQUMsQ0FBQyxFQUNGLENBQ0gsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBQYWdpbmF0aW9uUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcGFnaW5hdGlvbidcbmltcG9ydCB0eXBlIHsgQ29tbW9uUmVzcG9uc2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IExlZ2FjeURhdGFTb3VyY2VJbmZvLCBMb2NhbEZpbGVJbmZvLCBPbmxpbmVEb2N1bWVudEluZm8sIE9ubGluZURyaXZlSW5mbywgU2ltcGxlRG9jdW1lbnREZXRhaWwgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7XG4gIFJpQXJyb3dEb3duTGluZSxcbiAgUmlFZGl0TGluZSxcbiAgUmlHbG9iYWxMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQm9vbGVhbiB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IHVuaXEgfSBmcm9tICdlcy10b29sa2l0L2FycmF5J1xuaW1wb3J0IHsgcGljayB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IENoZWNrYm94IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGVja2JveCdcbmltcG9ydCBOb3Rpb25JY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9ub3Rpb24taWNvbidcbmltcG9ydCBQYWdpbmF0aW9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wYWdpbmF0aW9uJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBUb29sdGlwIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b29sdGlwJ1xuaW1wb3J0IHsgbm9ybWFsaXplU3RhdHVzRm9yUXVlcnkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9zdGF0dXMtZmlsdGVyJ1xuaW1wb3J0IHsgZXh0ZW5zaW9uVG9GaWxlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvaGl0LXRlc3RpbmcvdXRpbHMvZXh0ZW5zaW9uLXRvLWZpbGUtdHlwZSdcbmltcG9ydCBFZGl0TWV0YWRhdGFCYXRjaE1vZGFsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvbWV0YWRhdGEvZWRpdC1tZXRhZGF0YS1iYXRjaC9tb2RhbCdcbmltcG9ydCB7IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yIGFzIHVzZURhdGFzZXREZXRhaWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2RhdGFzZXQtZGV0YWlsJ1xuaW1wb3J0IHVzZVRpbWVzdGFtcCBmcm9tICdAL2hvb2tzL3VzZS10aW1lc3RhbXAnXG5pbXBvcnQgeyBDaHVua2luZ01vZGUsIERhdGFTb3VyY2VUeXBlLCBEb2N1bWVudEFjdGlvblR5cGUgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyB1c2VEb2N1bWVudEFyY2hpdmUsIHVzZURvY3VtZW50QmF0Y2hSZXRyeUluZGV4LCB1c2VEb2N1bWVudERlbGV0ZSwgdXNlRG9jdW1lbnREaXNhYmxlLCB1c2VEb2N1bWVudEVuYWJsZSB9IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRvY3VtZW50J1xuaW1wb3J0IHsgYXN5bmNSdW5TYWZlIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgZm9ybWF0TnVtYmVyIH0gZnJvbSAnQC91dGlscy9mb3JtYXQnXG5pbXBvcnQgRmlsZVR5cGVJY29uIGZyb20gJy4uLy4uL2Jhc2UvZmlsZS11cGxvYWRlci9maWxlLXR5cGUtaWNvbidcbmltcG9ydCBDaHVua2luZ01vZGVMYWJlbCBmcm9tICcuLi9jb21tb24vY2h1bmtpbmctbW9kZS1sYWJlbCdcbmltcG9ydCB1c2VCYXRjaEVkaXREb2N1bWVudE1ldGFkYXRhIGZyb20gJy4uL21ldGFkYXRhL2hvb2tzL3VzZS1iYXRjaC1lZGl0LWRvY3VtZW50LW1ldGFkYXRhJ1xuaW1wb3J0IEJhdGNoQWN0aW9uIGZyb20gJy4vZGV0YWlsL2NvbXBsZXRlZC9jb21tb24vYmF0Y2gtYWN0aW9uJ1xuaW1wb3J0IE9wZXJhdGlvbnMgZnJvbSAnLi9vcGVyYXRpb25zJ1xuaW1wb3J0IFJlbmFtZU1vZGFsIGZyb20gJy4vcmVuYW1lLW1vZGFsJ1xuaW1wb3J0IFN0YXR1c0l0ZW0gZnJvbSAnLi9zdGF0dXMtaXRlbSdcbmltcG9ydCBzIGZyb20gJy4vc3R5bGUubW9kdWxlLmNzcydcblxuZXhwb3J0IGNvbnN0IHJlbmRlclRkVmFsdWUgPSAodmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwsIGlzRW1wdHlTdHlsZSA9IGZhbHNlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKGlzRW1wdHlTdHlsZSA/ICd0ZXh0LXRleHQtdGVydGlhcnknIDogJ3RleHQtdGV4dC1zZWNvbmRhcnknLCBzLnRkVmFsdWUpfT5cbiAgICAgIHt2YWx1ZSA/PyAnLSd9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgcmVuZGVyQ291bnQgPSAoY291bnQ6IG51bWJlciB8IHVuZGVmaW5lZCkgPT4ge1xuICBpZiAoIWNvdW50KVxuICAgIHJldHVybiByZW5kZXJUZFZhbHVlKDAsIHRydWUpXG5cbiAgaWYgKGNvdW50IDwgMTAwMClcbiAgICByZXR1cm4gY291bnRcblxuICByZXR1cm4gYCR7Zm9ybWF0TnVtYmVyKChjb3VudCAvIDEwMDApLnRvRml4ZWQoMSkpfWtgXG59XG5cbnR5cGUgTG9jYWxEb2MgPSBTaW1wbGVEb2N1bWVudERldGFpbCAmIHsgcGVyY2VudD86IG51bWJlciB9XG50eXBlIElEb2N1bWVudExpc3RQcm9wcyA9IHtcbiAgZW1iZWRkaW5nQXZhaWxhYmxlOiBib29sZWFuXG4gIGRvY3VtZW50czogTG9jYWxEb2NbXVxuICBzZWxlY3RlZElkczogc3RyaW5nW11cbiAgb25TZWxlY3RlZElkQ2hhbmdlOiAoc2VsZWN0ZWRJZHM6IHN0cmluZ1tdKSA9PiB2b2lkXG4gIGRhdGFzZXRJZDogc3RyaW5nXG4gIHBhZ2luYXRpb246IFBhZ2luYXRpb25Qcm9wc1xuICBvblVwZGF0ZTogKCkgPT4gdm9pZFxuICBvbk1hbmFnZU1ldGFkYXRhOiAoKSA9PiB2b2lkXG4gIHN0YXR1c0ZpbHRlclZhbHVlOiBzdHJpbmdcbiAgcmVtb3RlU29ydFZhbHVlOiBzdHJpbmdcbn1cblxuLyoqXG4gKiBEb2N1bWVudCBsaXN0IGNvbXBvbmVudCBpbmNsdWRpbmcgYmFzaWMgaW5mb3JtYXRpb25cbiAqL1xuY29uc3QgRG9jdW1lbnRMaXN0OiBGQzxJRG9jdW1lbnRMaXN0UHJvcHM+ID0gKHtcbiAgZW1iZWRkaW5nQXZhaWxhYmxlLFxuICBkb2N1bWVudHMgPSBbXSxcbiAgc2VsZWN0ZWRJZHMsXG4gIG9uU2VsZWN0ZWRJZENoYW5nZSxcbiAgZGF0YXNldElkLFxuICBwYWdpbmF0aW9uLFxuICBvblVwZGF0ZSxcbiAgb25NYW5hZ2VNZXRhZGF0YSxcbiAgc3RhdHVzRmlsdGVyVmFsdWUsXG4gIHJlbW90ZVNvcnRWYWx1ZSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgZm9ybWF0VGltZSB9ID0gdXNlVGltZXN0YW1wKClcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3QgZGF0YXNldENvbmZpZyA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0KHMgPT4gcy5kYXRhc2V0KVxuICBjb25zdCBjaHVua2luZ01vZGUgPSBkYXRhc2V0Q29uZmlnPy5kb2NfZm9ybVxuICBjb25zdCBpc0dlbmVyYWxNb2RlID0gY2h1bmtpbmdNb2RlICE9PSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgY29uc3QgaXNRQU1vZGUgPSBjaHVua2luZ01vZGUgPT09IENodW5raW5nTW9kZS5xYVxuICBjb25zdCBbc29ydEZpZWxkLCBzZXRTb3J0RmllbGRdID0gdXNlU3RhdGU8J25hbWUnIHwgJ3dvcmRfY291bnQnIHwgJ2hpdF9jb3VudCcgfCAnY3JlYXRlZF9hdCcgfCBudWxsPihudWxsKVxuICBjb25zdCBbc29ydE9yZGVyLCBzZXRTb3J0T3JkZXJdID0gdXNlU3RhdGU8J2FzYycgfCAnZGVzYyc+KCdkZXNjJylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFNvcnRGaWVsZChudWxsKVxuICAgIHNldFNvcnRPcmRlcignZGVzYycpXG4gIH0sIFtyZW1vdGVTb3J0VmFsdWVdKVxuXG4gIGNvbnN0IHtcbiAgICBpc1Nob3dFZGl0TW9kYWwsXG4gICAgc2hvd0VkaXRNb2RhbCxcbiAgICBoaWRlRWRpdE1vZGFsLFxuICAgIG9yaWdpbmFsTGlzdCxcbiAgICBoYW5kbGVTYXZlLFxuICB9ID0gdXNlQmF0Y2hFZGl0RG9jdW1lbnRNZXRhZGF0YSh7XG4gICAgZGF0YXNldElkLFxuICAgIGRvY0xpc3Q6IGRvY3VtZW50cy5maWx0ZXIoZG9jID0+IHNlbGVjdGVkSWRzLmluY2x1ZGVzKGRvYy5pZCkpLFxuICAgIHNlbGVjdGVkRG9jdW1lbnRJZHM6IHNlbGVjdGVkSWRzLCAvLyBQYXNzIGFsbCBzZWxlY3RlZCBJRHMgc2VwYXJhdGVseVxuICAgIG9uVXBkYXRlLFxuICB9KVxuXG4gIGNvbnN0IGxvY2FsRG9jcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGxldCBmaWx0ZXJlZERvY3MgPSBkb2N1bWVudHNcblxuICAgIGlmIChzdGF0dXNGaWx0ZXJWYWx1ZSAmJiBzdGF0dXNGaWx0ZXJWYWx1ZSAhPT0gJ2FsbCcpIHtcbiAgICAgIGZpbHRlcmVkRG9jcyA9IGZpbHRlcmVkRG9jcy5maWx0ZXIoZG9jID0+XG4gICAgICAgIHR5cGVvZiBkb2MuZGlzcGxheV9zdGF0dXMgPT09ICdzdHJpbmcnXG4gICAgICAgICYmIG5vcm1hbGl6ZVN0YXR1c0ZvclF1ZXJ5KGRvYy5kaXNwbGF5X3N0YXR1cykgPT09IHN0YXR1c0ZpbHRlclZhbHVlLFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghc29ydEZpZWxkKVxuICAgICAgcmV0dXJuIGZpbHRlcmVkRG9jc1xuXG4gICAgY29uc3Qgc29ydGVkRG9jcyA9IFsuLi5maWx0ZXJlZERvY3NdLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGxldCBhVmFsdWU6IGFueVxuICAgICAgbGV0IGJWYWx1ZTogYW55XG5cbiAgICAgIHN3aXRjaCAoc29ydEZpZWxkKSB7XG4gICAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICAgIGFWYWx1ZSA9IGEubmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJ1xuICAgICAgICAgIGJWYWx1ZSA9IGIubmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJ1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3dvcmRfY291bnQnOlxuICAgICAgICAgIGFWYWx1ZSA9IGEud29yZF9jb3VudCB8fCAwXG4gICAgICAgICAgYlZhbHVlID0gYi53b3JkX2NvdW50IHx8IDBcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdoaXRfY291bnQnOlxuICAgICAgICAgIGFWYWx1ZSA9IGEuaGl0X2NvdW50IHx8IDBcbiAgICAgICAgICBiVmFsdWUgPSBiLmhpdF9jb3VudCB8fCAwXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnY3JlYXRlZF9hdCc6XG4gICAgICAgICAgYVZhbHVlID0gYS5jcmVhdGVkX2F0XG4gICAgICAgICAgYlZhbHVlID0gYi5jcmVhdGVkX2F0XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gMFxuICAgICAgfVxuXG4gICAgICBpZiAoc29ydEZpZWxkID09PSAnbmFtZScpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYVZhbHVlLmxvY2FsZUNvbXBhcmUoYlZhbHVlKVxuICAgICAgICByZXR1cm4gc29ydE9yZGVyID09PSAnYXNjJyA/IHJlc3VsdCA6IC1yZXN1bHRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhVmFsdWUgLSBiVmFsdWVcbiAgICAgICAgcmV0dXJuIHNvcnRPcmRlciA9PT0gJ2FzYycgPyByZXN1bHQgOiAtcmVzdWx0XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzb3J0ZWREb2NzXG4gIH0sIFtkb2N1bWVudHMsIHNvcnRGaWVsZCwgc29ydE9yZGVyLCBzdGF0dXNGaWx0ZXJWYWx1ZV0pXG5cbiAgY29uc3QgaGFuZGxlU29ydCA9IChmaWVsZDogJ25hbWUnIHwgJ3dvcmRfY291bnQnIHwgJ2hpdF9jb3VudCcgfCAnY3JlYXRlZF9hdCcpID0+IHtcbiAgICBpZiAoc29ydEZpZWxkID09PSBmaWVsZCkge1xuICAgICAgc2V0U29ydE9yZGVyKHNvcnRPcmRlciA9PT0gJ2FzYycgPyAnZGVzYycgOiAnYXNjJylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzZXRTb3J0RmllbGQoZmllbGQpXG4gICAgICBzZXRTb3J0T3JkZXIoJ2Rlc2MnKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlbmRlclNvcnRIZWFkZXIgPSAoZmllbGQ6ICduYW1lJyB8ICd3b3JkX2NvdW50JyB8ICdoaXRfY291bnQnIHwgJ2NyZWF0ZWRfYXQnLCBsYWJlbDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBzb3J0RmllbGQgPT09IGZpZWxkXG4gICAgY29uc3QgaXNEZXNjID0gaXNBY3RpdmUgJiYgc29ydE9yZGVyID09PSAnZGVzYydcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGhvdmVyOnRleHQtdGV4dC1zZWNvbmRhcnlcIiBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTb3J0KGZpZWxkKX0+XG4gICAgICAgIHtsYWJlbH1cbiAgICAgICAgPFJpQXJyb3dEb3duTGluZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y24oJ21sLTAuNSBoLTMgdy0zIHRyYW5zaXRpb24tYWxsJywgaXNBY3RpdmUgPyAndGV4dC10ZXh0LXRlcnRpYXJ5JyA6ICd0ZXh0LXRleHQtZGlzYWJsZWQnLCBpc0FjdGl2ZSAmJiAhaXNEZXNjID8gJ3JvdGF0ZS0xODAnIDogJycpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgY29uc3QgW2N1cnJEb2N1bWVudCwgc2V0Q3VyckRvY3VtZW50XSA9IHVzZVN0YXRlPExvY2FsRG9jIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW2lzU2hvd1JlbmFtZU1vZGFsLCB7XG4gICAgc2V0VHJ1ZTogc2V0U2hvd1JlbmFtZU1vZGFsVHJ1ZSxcbiAgICBzZXRGYWxzZTogc2V0U2hvd1JlbmFtZU1vZGFsRmFsc2UsXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgY29uc3QgaGFuZGxlU2hvd1JlbmFtZU1vZGFsID0gdXNlQ2FsbGJhY2soKGRvYzogTG9jYWxEb2MpID0+IHtcbiAgICBzZXRDdXJyRG9jdW1lbnQoZG9jKVxuICAgIHNldFNob3dSZW5hbWVNb2RhbFRydWUoKVxuICB9LCBbc2V0U2hvd1JlbmFtZU1vZGFsVHJ1ZV0pXG4gIGNvbnN0IGhhbmRsZVJlbmFtZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgb25VcGRhdGUoKVxuICB9LCBbb25VcGRhdGVdKVxuXG4gIGNvbnN0IGlzQWxsU2VsZWN0ZWQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gbG9jYWxEb2NzLmxlbmd0aCA+IDAgJiYgbG9jYWxEb2NzLmV2ZXJ5KGRvYyA9PiBzZWxlY3RlZElkcy5pbmNsdWRlcyhkb2MuaWQpKVxuICB9LCBbbG9jYWxEb2NzLCBzZWxlY3RlZElkc10pXG5cbiAgY29uc3QgaXNTb21lU2VsZWN0ZWQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gbG9jYWxEb2NzLnNvbWUoZG9jID0+IHNlbGVjdGVkSWRzLmluY2x1ZGVzKGRvYy5pZCkpXG4gIH0sIFtsb2NhbERvY3MsIHNlbGVjdGVkSWRzXSlcblxuICBjb25zdCBvblNlbGVjdGVkQWxsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpc0FsbFNlbGVjdGVkKVxuICAgICAgb25TZWxlY3RlZElkQ2hhbmdlKFtdKVxuICAgIGVsc2VcbiAgICAgIG9uU2VsZWN0ZWRJZENoYW5nZSh1bmlxKFsuLi5zZWxlY3RlZElkcywgLi4ubG9jYWxEb2NzLm1hcChkb2MgPT4gZG9jLmlkKV0pKVxuICB9LCBbaXNBbGxTZWxlY3RlZCwgbG9jYWxEb2NzLCBvblNlbGVjdGVkSWRDaGFuZ2UsIHNlbGVjdGVkSWRzXSlcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogYXJjaGl2ZURvY3VtZW50IH0gPSB1c2VEb2N1bWVudEFyY2hpdmUoKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBlbmFibGVEb2N1bWVudCB9ID0gdXNlRG9jdW1lbnRFbmFibGUoKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBkaXNhYmxlRG9jdW1lbnQgfSA9IHVzZURvY3VtZW50RGlzYWJsZSgpXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmM6IGRlbGV0ZURvY3VtZW50IH0gPSB1c2VEb2N1bWVudERlbGV0ZSgpXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmM6IHJldHJ5SW5kZXhEb2N1bWVudCB9ID0gdXNlRG9jdW1lbnRCYXRjaFJldHJ5SW5kZXgoKVxuXG4gIGNvbnN0IGhhbmRsZUFjdGlvbiA9IChhY3Rpb25OYW1lOiBEb2N1bWVudEFjdGlvblR5cGUpID0+IHtcbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IG9wQXBpXG4gICAgICBzd2l0Y2ggKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgY2FzZSBEb2N1bWVudEFjdGlvblR5cGUuYXJjaGl2ZTpcbiAgICAgICAgICBvcEFwaSA9IGFyY2hpdmVEb2N1bWVudFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgRG9jdW1lbnRBY3Rpb25UeXBlLmVuYWJsZTpcbiAgICAgICAgICBvcEFwaSA9IGVuYWJsZURvY3VtZW50XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBEb2N1bWVudEFjdGlvblR5cGUuZGlzYWJsZTpcbiAgICAgICAgICBvcEFwaSA9IGRpc2FibGVEb2N1bWVudFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgb3BBcGkgPSBkZWxldGVEb2N1bWVudFxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjb25zdCBbZV0gPSBhd2FpdCBhc3luY1J1blNhZmU8Q29tbW9uUmVzcG9uc2U+KG9wQXBpKHsgZGF0YXNldElkLCBkb2N1bWVudElkczogc2VsZWN0ZWRJZHMgfSkgYXMgUHJvbWlzZTxDb21tb25SZXNwb25zZT4pXG5cbiAgICAgIGlmICghZSkge1xuICAgICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gRG9jdW1lbnRBY3Rpb25UeXBlLmRlbGV0ZSlcbiAgICAgICAgICBvblNlbGVjdGVkSWRDaGFuZ2UoW10pXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgICAgb25VcGRhdGUoKVxuICAgICAgfVxuICAgICAgZWxzZSB7IFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSkgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUJhdGNoUmVJbmRleCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBbZV0gPSBhd2FpdCBhc3luY1J1blNhZmU8Q29tbW9uUmVzcG9uc2U+KHJldHJ5SW5kZXhEb2N1bWVudCh7IGRhdGFzZXRJZCwgZG9jdW1lbnRJZHM6IHNlbGVjdGVkSWRzIH0pKVxuICAgIGlmICghZSkge1xuICAgICAgb25TZWxlY3RlZElkQ2hhbmdlKFtdKVxuICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgb25VcGRhdGUoKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFVuc3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYXNFcnJvckRvY3VtZW50c1NlbGVjdGVkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGxvY2FsRG9jcy5zb21lKGRvYyA9PiBzZWxlY3RlZElkcy5pbmNsdWRlcyhkb2MuaWQpICYmIGRvYy5kaXNwbGF5X3N0YXR1cyA9PT0gJ2Vycm9yJylcbiAgfSwgW2xvY2FsRG9jcywgc2VsZWN0ZWRJZHNdKVxuXG4gIGNvbnN0IGdldEZpbGVFeHRlbnNpb24gPSB1c2VDYWxsYmFjaygoZmlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgaWYgKCFmaWxlTmFtZSlcbiAgICAgIHJldHVybiAnJ1xuICAgIGNvbnN0IHBhcnRzID0gZmlsZU5hbWUuc3BsaXQoJy4nKVxuICAgIGlmIChwYXJ0cy5sZW5ndGggPD0gMSB8fCAocGFydHNbMF0gPT09ICcnICYmIHBhcnRzLmxlbmd0aCA9PT0gMikpXG4gICAgICByZXR1cm4gJydcblxuICAgIHJldHVybiBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS50b0xvd2VyQ2FzZSgpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGlzQ3JlYXRlRnJvbVJBR1BpcGVsaW5lID0gdXNlQ2FsbGJhY2soKGNyZWF0ZWRGcm9tOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlZEZyb20gPT09ICdyYWctcGlwZWxpbmUnXG4gIH0sIFtdKVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGRhdGEgc291cmNlIHR5cGVcbiAgICogRGF0YVNvdXJjZVR5cGU6IEZJTEUsIE5PVElPTiwgV0VCIChsZWdhY3kpXG4gICAqIERhdGFzb3VyY2VUeXBlOiBsb2NhbEZpbGUsIG9ubGluZURvY3VtZW50LCB3ZWJzaXRlQ3Jhd2wsIG9ubGluZURyaXZlIChuZXcpXG4gICAqL1xuICBjb25zdCBpc0xvY2FsRmlsZSA9IHVzZUNhbGxiYWNrKChkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUgfCBEYXRhc291cmNlVHlwZSkgPT4ge1xuICAgIHJldHVybiBkYXRhU291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlIHx8IGRhdGFTb3VyY2VUeXBlID09PSBEYXRhU291cmNlVHlwZS5GSUxFXG4gIH0sIFtdKVxuICBjb25zdCBpc09ubGluZURvY3VtZW50ID0gdXNlQ2FsbGJhY2soKGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZSB8IERhdGFzb3VyY2VUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGRhdGFTb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudCB8fCBkYXRhU291cmNlVHlwZSA9PT0gRGF0YVNvdXJjZVR5cGUuTk9USU9OXG4gIH0sIFtdKVxuICBjb25zdCBpc1dlYnNpdGVDcmF3bCA9IHVzZUNhbGxiYWNrKChkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUgfCBEYXRhc291cmNlVHlwZSkgPT4ge1xuICAgIHJldHVybiBkYXRhU291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsIHx8IGRhdGFTb3VyY2VUeXBlID09PSBEYXRhU291cmNlVHlwZS5XRUJcbiAgfSwgW10pXG4gIGNvbnN0IGlzT25saW5lRHJpdmUgPSB1c2VDYWxsYmFjaygoZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlIHwgRGF0YXNvdXJjZVR5cGUpID0+IHtcbiAgICByZXR1cm4gZGF0YVNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlXG4gIH0sIFtdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtdC0zIGZsZXggaC1mdWxsIHctZnVsbCBmbGV4LWNvbFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLTAgZ3JvdyBvdmVyZmxvdy14LWF1dG9cIj5cbiAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17YHctZnVsbCBtaW4tdy1bNzAwcHhdIG1heC13LWZ1bGwgYm9yZGVyLWNvbGxhcHNlIGJvcmRlci0wIHRleHQtc20gJHtzLmRvY3VtZW50VGFibGV9YH0+XG4gICAgICAgICAgPHRoZWFkIGNsYXNzTmFtZT1cImgtOCBib3JkZXItYiBib3JkZXItZGl2aWRlci1zdWJ0bGUgdGV4dC14cyBmb250LW1lZGl1bSB1cHBlcmNhc2UgbGVhZGluZy04IHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidy0xMlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXJcIiBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgICAgICAgICAgICAgICAge2VtYmVkZGluZ0F2YWlsYWJsZSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTIgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWxsU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgaW5kZXRlcm1pbmF0ZT17IWlzQWxsU2VsZWN0ZWQgJiYgaXNTb21lU2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICAgICAgb25DaGVjaz17b25TZWxlY3RlZEFsbH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAjXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICB7cmVuZGVyU29ydEhlYWRlcignbmFtZScsIHQoJ2xpc3QudGFibGUuaGVhZGVyLmZpbGVOYW1lJywgeyBuczogJ2RhdGFzZXREb2N1bWVudHMnIH0pKX1cbiAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInctWzEzMHB4XVwiPnt0KCdsaXN0LnRhYmxlLmhlYWRlci5jaHVua2luZ01vZGUnLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSl9PC90ZD5cbiAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInctMjRcIj5cbiAgICAgICAgICAgICAgICB7cmVuZGVyU29ydEhlYWRlcignd29yZF9jb3VudCcsIHQoJ2xpc3QudGFibGUuaGVhZGVyLndvcmRzJywgeyBuczogJ2RhdGFzZXREb2N1bWVudHMnIH0pKX1cbiAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInctNDRcIj5cbiAgICAgICAgICAgICAgICB7cmVuZGVyU29ydEhlYWRlcignaGl0X2NvdW50JywgdCgnbGlzdC50YWJsZS5oZWFkZXIuaGl0Q291bnQnLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSkpfVxuICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidy00NFwiPlxuICAgICAgICAgICAgICAgIHtyZW5kZXJTb3J0SGVhZGVyKCdjcmVhdGVkX2F0JywgdCgnbGlzdC50YWJsZS5oZWFkZXIudXBsb2FkVGltZScsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KSl9XG4gICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBjbGFzc05hbWU9XCJ3LTQwXCI+e3QoJ2xpc3QudGFibGUuaGVhZGVyLnN0YXR1cycsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KX08L3RkPlxuICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidy0yMFwiPnt0KCdsaXN0LnRhYmxlLmhlYWRlci5hY3Rpb24nLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSl9PC90ZD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHkgY2xhc3NOYW1lPVwidGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAge2xvY2FsRG9jcy5tYXAoKGRvYywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaXNGaWxlID0gaXNMb2NhbEZpbGUoZG9jLmRhdGFfc291cmNlX3R5cGUpXG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVUeXBlID0gaXNGaWxlID8gZG9jLmRhdGFfc291cmNlX2RldGFpbF9kaWN0Py51cGxvYWRfZmlsZT8uZXh0ZW5zaW9uIDogJydcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8dHJcbiAgICAgICAgICAgICAgICAgIGtleT17ZG9jLmlkfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC04IGN1cnNvci1wb2ludGVyIGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBob3ZlcjpiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtaG92ZXJcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByb3V0ZXIucHVzaChgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2MuaWR9YClcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cInRleHQtbGVmdCBhbGlnbi1taWRkbGUgdGV4dC14cyB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX0+XG4gICAgICAgICAgICAgICAgICAgICAgPENoZWNrYm94XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci0yIHNocmluay0wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ9e3NlbGVjdGVkSWRzLmluY2x1ZGVzKGRvYy5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoZWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0ZWRJZENoYW5nZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElkcy5pbmNsdWRlcyhkb2MuaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHNlbGVjdGVkSWRzLmZpbHRlcihpZCA9PiBpZCAhPT0gZG9jLmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBbLi4uc2VsZWN0ZWRJZHMsIGRvYy5pZF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICB7aW5kZXggKyAxfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdXAgbXItNiBmbGV4IG1heC13LVs0NjBweF0gaXRlbXMtY2VudGVyIGhvdmVyOm1yLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7aXNPbmxpbmVEb2N1bWVudChkb2MuZGF0YV9zb3VyY2VfdHlwZSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Tm90aW9uSWNvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTEuNVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInBhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NyZWF0ZUZyb21SQUdQaXBlbGluZShkb2MuY3JlYXRlZF9mcm9tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChkb2MuZGF0YV9zb3VyY2VfaW5mbyBhcyBPbmxpbmVEb2N1bWVudEluZm8pLnBhZ2UucGFnZV9pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGRvYy5kYXRhX3NvdXJjZV9pbmZvIGFzIExlZ2FjeURhdGFTb3VyY2VJbmZvKS5ub3Rpb25fcGFnZV9pY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpc0xvY2FsRmlsZShkb2MuZGF0YV9zb3VyY2VfdHlwZSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8RmlsZVR5cGVJY29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT17XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25Ub0ZpbGVUeXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NyZWF0ZUZyb21SQUdQaXBlbGluZShkb2MuY3JlYXRlZF9mcm9tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGRvYz8uZGF0YV9zb3VyY2VfaW5mbyBhcyBMb2NhbEZpbGVJbmZvKT8uZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoKGRvYz8uZGF0YV9zb3VyY2VfaW5mbyBhcyBMZWdhY3lEYXRhU291cmNlSW5mbyk/LnVwbG9hZF9maWxlPy5leHRlbnNpb24gPz8gZmlsZVR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci0xLjVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpc09ubGluZURyaXZlKGRvYy5kYXRhX3NvdXJjZV90eXBlKSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxGaWxlVHlwZUljb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvblRvRmlsZVR5cGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpbGVFeHRlbnNpb24oKGRvYz8uZGF0YV9zb3VyY2VfaW5mbyBhcyB1bmtub3duIGFzIE9ubGluZURyaXZlSW5mbyk/Lm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtci0xLjVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpc1dlYnNpdGVDcmF3bChkb2MuZGF0YV9zb3VyY2VfdHlwZSkgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8UmlHbG9iYWxMaW5lIGNsYXNzTmFtZT1cIm1yLTEuNSBzaXplLTRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBDb250ZW50PXtkb2MubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJncm93LTEgdHJ1bmNhdGUgdGV4dC1zbVwiPntkb2MubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuIHNocmluay0wIGdyb3VwLWhvdmVyOm1sLWF1dG8gZ3JvdXAtaG92ZXI6ZmxleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBDb250ZW50PXt0KCdsaXN0LnRhYmxlLnJlbmFtZScsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyIHJvdW5kZWQtbWQgcC0xIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVTaG93UmVuYW1lTW9kYWwoZG9jKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmlFZGl0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgIDxDaHVua2luZ01vZGVMYWJlbFxuICAgICAgICAgICAgICAgICAgICAgIGlzR2VuZXJhbE1vZGU9e2lzR2VuZXJhbE1vZGV9XG4gICAgICAgICAgICAgICAgICAgICAgaXNRQU1vZGU9e2lzUUFNb2RlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD57cmVuZGVyQ291bnQoZG9jLndvcmRfY291bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+e3JlbmRlckNvdW50KGRvYy5oaXRfY291bnQpfTwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQgY2xhc3NOYW1lPVwidGV4dC1bMTNweF0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0VGltZShkb2MuY3JlYXRlZF9hdCwgdCgnZGF0ZVRpbWVGb3JtYXQnLCB7IG5zOiAnZGF0YXNldEhpdFRlc3RpbmcnIH0pIGFzIHN0cmluZyl9XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICA8U3RhdHVzSXRlbSBzdGF0dXM9e2RvYy5kaXNwbGF5X3N0YXR1c30gLz5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgIDxPcGVyYXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJZHM9e3NlbGVjdGVkSWRzfVxuICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0ZWRJZENoYW5nZT17b25TZWxlY3RlZElkQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17ZW1iZWRkaW5nQXZhaWxhYmxlfVxuICAgICAgICAgICAgICAgICAgICAgIGRhdGFzZXRJZD17ZGF0YXNldElkfVxuICAgICAgICAgICAgICAgICAgICAgIGRldGFpbD17cGljayhkb2MsIFsnbmFtZScsICdlbmFibGVkJywgJ2FyY2hpdmVkJywgJ2lkJywgJ2RhdGFfc291cmNlX3R5cGUnLCAnZG9jX2Zvcm0nLCAnZGlzcGxheV9zdGF0dXMnXSl9XG4gICAgICAgICAgICAgICAgICAgICAgb25VcGRhdGU9e29uVXBkYXRlfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgPC9kaXY+XG4gICAgICB7KHNlbGVjdGVkSWRzLmxlbmd0aCA+IDApICYmIChcbiAgICAgICAgPEJhdGNoQWN0aW9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTE2IGxlZnQtMCB6LTIwXCJcbiAgICAgICAgICBzZWxlY3RlZElkcz17c2VsZWN0ZWRJZHN9XG4gICAgICAgICAgb25BcmNoaXZlPXtoYW5kbGVBY3Rpb24oRG9jdW1lbnRBY3Rpb25UeXBlLmFyY2hpdmUpfVxuICAgICAgICAgIG9uQmF0Y2hFbmFibGU9e2hhbmRsZUFjdGlvbihEb2N1bWVudEFjdGlvblR5cGUuZW5hYmxlKX1cbiAgICAgICAgICBvbkJhdGNoRGlzYWJsZT17aGFuZGxlQWN0aW9uKERvY3VtZW50QWN0aW9uVHlwZS5kaXNhYmxlKX1cbiAgICAgICAgICBvbkJhdGNoRGVsZXRlPXtoYW5kbGVBY3Rpb24oRG9jdW1lbnRBY3Rpb25UeXBlLmRlbGV0ZSl9XG4gICAgICAgICAgb25FZGl0TWV0YWRhdGE9e3Nob3dFZGl0TW9kYWx9XG4gICAgICAgICAgb25CYXRjaFJlSW5kZXg9e2hhc0Vycm9yRG9jdW1lbnRzU2VsZWN0ZWQgPyBoYW5kbGVCYXRjaFJlSW5kZXggOiB1bmRlZmluZWR9XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHtcbiAgICAgICAgICAgIG9uU2VsZWN0ZWRJZENoYW5nZShbXSlcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHsvKiBTaG93IFBhZ2luYXRpb24gb25seSBpZiB0aGUgdG90YWwgaXMgbW9yZSB0aGFuIHRoZSBsaW1pdCAqL31cbiAgICAgIHtwYWdpbmF0aW9uLnRvdGFsICYmIChcbiAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICB7Li4ucGFnaW5hdGlvbn1cbiAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgc2hyaW5rLTBcIlxuICAgICAgICAvPlxuICAgICAgKX1cblxuICAgICAge2lzU2hvd1JlbmFtZU1vZGFsICYmIGN1cnJEb2N1bWVudCAmJiAoXG4gICAgICAgIDxSZW5hbWVNb2RhbFxuICAgICAgICAgIGRhdGFzZXRJZD17ZGF0YXNldElkfVxuICAgICAgICAgIGRvY3VtZW50SWQ9e2N1cnJEb2N1bWVudC5pZH1cbiAgICAgICAgICBuYW1lPXtjdXJyRG9jdW1lbnQubmFtZX1cbiAgICAgICAgICBvbkNsb3NlPXtzZXRTaG93UmVuYW1lTW9kYWxGYWxzZX1cbiAgICAgICAgICBvblNhdmVkPXtoYW5kbGVSZW5hbWVkfVxuICAgICAgICAvPlxuICAgICAgKX1cblxuICAgICAge2lzU2hvd0VkaXRNb2RhbCAmJiAoXG4gICAgICAgIDxFZGl0TWV0YWRhdGFCYXRjaE1vZGFsXG4gICAgICAgICAgZGF0YXNldElkPXtkYXRhc2V0SWR9XG4gICAgICAgICAgZG9jdW1lbnROdW09e3NlbGVjdGVkSWRzLmxlbmd0aH1cbiAgICAgICAgICBsaXN0PXtvcmlnaW5hbExpc3R9XG4gICAgICAgICAgb25TYXZlPXtoYW5kbGVTYXZlfVxuICAgICAgICAgIG9uSGlkZT17aGlkZUVkaXRNb2RhbH1cbiAgICAgICAgICBvblNob3dNYW5hZ2U9eygpID0+IHtcbiAgICAgICAgICAgIGhpZGVFZGl0TW9kYWwoKVxuICAgICAgICAgICAgb25NYW5hZ2VNZXRhZGF0YSgpXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9jdW1lbnRMaXN0XG4iXX0=