"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSegmentListContext = void 0;
const ahooks_1 = require("ahooks");
const function_1 = require("es-toolkit/function");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const checkbox_1 = require("@/app/components/base/checkbox");
const divider_1 = require("@/app/components/base/divider");
const input_1 = require("@/app/components/base/input");
const pagination_1 = require("@/app/components/base/pagination");
const select_1 = require("@/app/components/base/select");
const toast_1 = require("@/app/components/base/toast");
const new_segment_1 = require("@/app/components/datasets/documents/detail/new-segment");
const event_emitter_1 = require("@/context/event-emitter");
const datasets_1 = require("@/models/datasets");
const use_segment_1 = require("@/service/knowledge/use-segment");
const use_base_1 = require("@/service/use-base");
const classnames_1 = require("@/utils/classnames");
const format_1 = require("@/utils/format");
const context_1 = require("../context");
const segment_add_1 = require("../segment-add");
const child_segment_detail_1 = require("./child-segment-detail");
const child_segment_list_1 = require("./child-segment-list");
const batch_action_1 = require("./common/batch-action");
const full_screen_drawer_1 = require("./common/full-screen-drawer");
const display_toggle_1 = require("./display-toggle");
const new_child_segment_1 = require("./new-child-segment");
const segment_card_1 = require("./segment-card");
const segment_detail_1 = require("./segment-detail");
const segment_list_1 = require("./segment-list");
const status_item_1 = require("./status-item");
const style_module_css_1 = require("./style.module.css");
const DEFAULT_LIMIT = 10;
const SegmentListContext = (0, use_context_selector_1.createContext)({
    isCollapsed: true,
    fullScreen: false,
    toggleFullScreen: function_1.noop,
    currSegment: { showModal: false },
    currChildChunk: { showModal: false },
});
const useSegmentListContext = (selector) => {
    return (0, use_context_selector_1.useContextSelector)(SegmentListContext, selector);
};
exports.useSegmentListContext = useSegmentListContext;
/**
 * Embedding done, show list of all segments
 * Support search and filter
 */
const Completed = ({ embeddingAvailable, showNewSegmentModal, onNewSegmentModalChange, importStatus, archived, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const pathname = (0, navigation_1.usePathname)();
    const datasetId = (0, context_1.useDocumentContext)(s => s.datasetId) || '';
    const documentId = (0, context_1.useDocumentContext)(s => s.documentId) || '';
    const docForm = (0, context_1.useDocumentContext)(s => s.docForm);
    const parentMode = (0, context_1.useDocumentContext)(s => s.parentMode);
    // the current segment id and whether to show the modal
    const [currSegment, setCurrSegment] = (0, react_1.useState)({ showModal: false });
    const [currChildChunk, setCurrChildChunk] = (0, react_1.useState)({ showModal: false });
    const [currChunkId, setCurrChunkId] = (0, react_1.useState)('');
    const [inputValue, setInputValue] = (0, react_1.useState)(''); // the input value
    const [searchValue, setSearchValue] = (0, react_1.useState)(''); // the search value
    const [selectedStatus, setSelectedStatus] = (0, react_1.useState)('all'); // the selected status, enabled/disabled/undefined
    const [segments, setSegments] = (0, react_1.useState)([]); // all segments data
    const [childSegments, setChildSegments] = (0, react_1.useState)([]); // all child segments data
    const [selectedSegmentIds, setSelectedSegmentIds] = (0, react_1.useState)([]);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(true);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1); // start from 1
    const [limit, setLimit] = (0, react_1.useState)(DEFAULT_LIMIT);
    const [fullScreen, setFullScreen] = (0, react_1.useState)(false);
    const [showNewChildSegmentModal, setShowNewChildSegmentModal] = (0, react_1.useState)(false);
    const [isRegenerationModalOpen, setIsRegenerationModalOpen] = (0, react_1.useState)(false);
    const segmentListRef = (0, react_1.useRef)(null);
    const childSegmentListRef = (0, react_1.useRef)(null);
    const needScrollToBottom = (0, react_1.useRef)(false);
    const statusList = (0, react_1.useRef)([
        { value: 'all', name: t('list.index.all', { ns: 'datasetDocuments' }) },
        { value: 0, name: t('list.status.disabled', { ns: 'datasetDocuments' }) },
        { value: 1, name: t('list.status.enabled', { ns: 'datasetDocuments' }) },
    ]);
    const { run: handleSearch } = (0, ahooks_1.useDebounceFn)(() => {
        setSearchValue(inputValue);
        setCurrentPage(1);
    }, { wait: 500 });
    const handleInputChange = (value) => {
        setInputValue(value);
        handleSearch();
    };
    const onChangeStatus = ({ value }) => {
        setSelectedStatus(value === 'all' ? 'all' : !!value);
        setCurrentPage(1);
    };
    const isFullDocMode = (0, react_1.useMemo)(() => {
        return docForm === datasets_1.ChunkingMode.parentChild && parentMode === 'full-doc';
    }, [docForm, parentMode]);
    const { isLoading: isLoadingSegmentList, data: segmentListData } = (0, use_segment_1.useSegmentList)({
        datasetId,
        documentId,
        params: {
            page: isFullDocMode ? 1 : currentPage,
            limit: isFullDocMode ? 10 : limit,
            keyword: isFullDocMode ? '' : searchValue,
            enabled: selectedStatus,
        },
    });
    const invalidSegmentList = (0, use_base_1.useInvalid)(use_segment_1.useSegmentListKey);
    (0, react_1.useEffect)(() => {
        if (segmentListData) {
            setSegments(segmentListData.data || []);
            const totalPages = segmentListData.total_pages;
            if (totalPages < currentPage)
                setCurrentPage(totalPages === 0 ? 1 : totalPages);
        }
    }, [segmentListData]);
    (0, react_1.useEffect)(() => {
        if (segmentListRef.current && needScrollToBottom.current) {
            segmentListRef.current.scrollTo({ top: segmentListRef.current.scrollHeight, behavior: 'smooth' });
            needScrollToBottom.current = false;
        }
    }, [segments]);
    const { isLoading: isLoadingChildSegmentList, data: childChunkListData } = (0, use_segment_1.useChildSegmentList)({
        datasetId,
        documentId,
        segmentId: segments[0]?.id || '',
        params: {
            page: currentPage === 0 ? 1 : currentPage,
            limit,
            keyword: searchValue,
        },
    }, !isFullDocMode || segments.length === 0);
    const invalidChildSegmentList = (0, use_base_1.useInvalid)(use_segment_1.useChildSegmentListKey);
    (0, react_1.useEffect)(() => {
        if (childSegmentListRef.current && needScrollToBottom.current) {
            childSegmentListRef.current.scrollTo({ top: childSegmentListRef.current.scrollHeight, behavior: 'smooth' });
            needScrollToBottom.current = false;
        }
    }, [childSegments]);
    (0, react_1.useEffect)(() => {
        if (childChunkListData) {
            setChildSegments(childChunkListData.data || []);
            const totalPages = childChunkListData.total_pages;
            if (totalPages < currentPage)
                setCurrentPage(totalPages === 0 ? 1 : totalPages);
        }
    }, [childChunkListData]);
    const resetList = (0, react_1.useCallback)(() => {
        setSelectedSegmentIds([]);
        invalidSegmentList();
    }, [invalidSegmentList]);
    const resetChildList = (0, react_1.useCallback)(() => {
        invalidChildSegmentList();
    }, [invalidChildSegmentList]);
    const onClickCard = (detail, isEditMode = false) => {
        setCurrSegment({ segInfo: detail, showModal: true, isEditMode });
    };
    const onCloseSegmentDetail = (0, react_1.useCallback)(() => {
        setCurrSegment({ showModal: false });
        setFullScreen(false);
    }, []);
    const onCloseNewSegmentModal = (0, react_1.useCallback)(() => {
        onNewSegmentModalChange(false);
        setFullScreen(false);
    }, [onNewSegmentModalChange]);
    const onCloseNewChildChunkModal = (0, react_1.useCallback)(() => {
        setShowNewChildSegmentModal(false);
        setFullScreen(false);
    }, []);
    const { mutateAsync: enableSegment } = (0, use_segment_1.useEnableSegment)();
    const { mutateAsync: disableSegment } = (0, use_segment_1.useDisableSegment)();
    const invalidChunkListAll = (0, use_base_1.useInvalid)(use_segment_1.useChunkListAllKey);
    const invalidChunkListEnabled = (0, use_base_1.useInvalid)(use_segment_1.useChunkListEnabledKey);
    const invalidChunkListDisabled = (0, use_base_1.useInvalid)(use_segment_1.useChunkListDisabledKey);
    const refreshChunkListWithStatusChanged = (0, react_1.useCallback)(() => {
        switch (selectedStatus) {
            case 'all':
                invalidChunkListDisabled();
                invalidChunkListEnabled();
                break;
            default:
                invalidSegmentList();
        }
    }, [selectedStatus, invalidChunkListDisabled, invalidChunkListEnabled, invalidSegmentList]);
    const onChangeSwitch = (0, react_1.useCallback)(async (enable, segId) => {
        const operationApi = enable ? enableSegment : disableSegment;
        await operationApi({ datasetId, documentId, segmentIds: segId ? [segId] : selectedSegmentIds }, {
            onSuccess: () => {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                for (const seg of segments) {
                    if (segId ? seg.id === segId : selectedSegmentIds.includes(seg.id))
                        seg.enabled = enable;
                }
                setSegments([...segments]);
                refreshChunkListWithStatusChanged();
            },
            onError: () => {
                notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            },
        });
    }, [datasetId, documentId, selectedSegmentIds, segments, disableSegment, enableSegment, t, notify, refreshChunkListWithStatusChanged]);
    const { mutateAsync: deleteSegment } = (0, use_segment_1.useDeleteSegment)();
    const onDelete = (0, react_1.useCallback)(async (segId) => {
        await deleteSegment({ datasetId, documentId, segmentIds: segId ? [segId] : selectedSegmentIds }, {
            onSuccess: () => {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                resetList();
                if (!segId)
                    setSelectedSegmentIds([]);
            },
            onError: () => {
                notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            },
        });
    }, [datasetId, documentId, selectedSegmentIds, deleteSegment, resetList, t, notify]);
    const { mutateAsync: updateSegment } = (0, use_segment_1.useUpdateSegment)();
    const refreshChunkListDataWithDetailChanged = (0, react_1.useCallback)(() => {
        switch (selectedStatus) {
            case 'all':
                invalidChunkListDisabled();
                invalidChunkListEnabled();
                break;
            case true:
                invalidChunkListAll();
                invalidChunkListDisabled();
                break;
            case false:
                invalidChunkListAll();
                invalidChunkListEnabled();
                break;
        }
    }, [selectedStatus, invalidChunkListDisabled, invalidChunkListEnabled, invalidChunkListAll]);
    const handleUpdateSegment = (0, react_1.useCallback)(async (segmentId, question, answer, keywords, attachments, needRegenerate = false) => {
        const params = { content: '', attachment_ids: [] };
        if (docForm === datasets_1.ChunkingMode.qa) {
            if (!question.trim())
                return notify({ type: 'error', message: t('segment.questionEmpty', { ns: 'datasetDocuments' }) });
            if (!answer.trim())
                return notify({ type: 'error', message: t('segment.answerEmpty', { ns: 'datasetDocuments' }) });
            params.content = question;
            params.answer = answer;
        }
        else {
            if (!question.trim())
                return notify({ type: 'error', message: t('segment.contentEmpty', { ns: 'datasetDocuments' }) });
            params.content = question;
        }
        if (keywords.length)
            params.keywords = keywords;
        if (attachments.length) {
            const notAllUploaded = attachments.some(item => !item.uploadedId);
            if (notAllUploaded)
                return notify({ type: 'error', message: t('segment.allFilesUploaded', { ns: 'datasetDocuments' }) });
            params.attachment_ids = attachments.map(item => item.uploadedId);
        }
        if (needRegenerate)
            params.regenerate_child_chunks = needRegenerate;
        eventEmitter?.emit('update-segment');
        await updateSegment({ datasetId, documentId, segmentId, body: params }, {
            onSuccess(res) {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                if (!needRegenerate)
                    onCloseSegmentDetail();
                for (const seg of segments) {
                    if (seg.id === segmentId) {
                        seg.answer = res.data.answer;
                        seg.content = res.data.content;
                        seg.sign_content = res.data.sign_content;
                        seg.keywords = res.data.keywords;
                        seg.attachments = res.data.attachments;
                        seg.word_count = res.data.word_count;
                        seg.hit_count = res.data.hit_count;
                        seg.enabled = res.data.enabled;
                        seg.updated_at = res.data.updated_at;
                        seg.child_chunks = res.data.child_chunks;
                    }
                }
                setSegments([...segments]);
                refreshChunkListDataWithDetailChanged();
                eventEmitter?.emit('update-segment-success');
            },
            onSettled() {
                eventEmitter?.emit('update-segment-done');
            },
        });
    }, [segments, datasetId, documentId, updateSegment, docForm, notify, eventEmitter, onCloseSegmentDetail, refreshChunkListDataWithDetailChanged, t]);
    (0, react_1.useEffect)(() => {
        resetList();
    }, [pathname]);
    (0, react_1.useEffect)(() => {
        if (importStatus === segment_add_1.ProcessStatus.COMPLETED)
            resetList();
    }, [importStatus]);
    const onCancelBatchOperation = (0, react_1.useCallback)(() => {
        setSelectedSegmentIds([]);
    }, []);
    const onSelected = (0, react_1.useCallback)((segId) => {
        setSelectedSegmentIds(prev => prev.includes(segId)
            ? prev.filter(id => id !== segId)
            : [...prev, segId]);
    }, []);
    const isAllSelected = (0, react_1.useMemo)(() => {
        return segments.length > 0 && segments.every(seg => selectedSegmentIds.includes(seg.id));
    }, [segments, selectedSegmentIds]);
    const isSomeSelected = (0, react_1.useMemo)(() => {
        return segments.some(seg => selectedSegmentIds.includes(seg.id));
    }, [segments, selectedSegmentIds]);
    const onSelectedAll = (0, react_1.useCallback)(() => {
        setSelectedSegmentIds((prev) => {
            const currentAllSegIds = segments.map(seg => seg.id);
            const prevSelectedIds = prev.filter(item => !currentAllSegIds.includes(item));
            return [...prevSelectedIds, ...(isAllSelected ? [] : currentAllSegIds)];
        });
    }, [segments, isAllSelected]);
    const totalText = (0, react_1.useMemo)(() => {
        const isSearch = searchValue !== '' || selectedStatus !== 'all';
        if (!isSearch) {
            const total = segmentListData?.total ? (0, format_1.formatNumber)(segmentListData.total) : '--';
            const count = total === '--' ? 0 : segmentListData.total;
            const translationKey = (docForm === datasets_1.ChunkingMode.parentChild && parentMode === 'paragraph')
                ? 'segment.parentChunks'
                : 'segment.chunks';
            return `${total} ${t(translationKey, { ns: 'datasetDocuments', count })}`;
        }
        else {
            const total = typeof segmentListData?.total === 'number' ? (0, format_1.formatNumber)(segmentListData.total) : 0;
            const count = segmentListData?.total || 0;
            return `${total} ${t('segment.searchResults', { ns: 'datasetDocuments', count })}`;
        }
    }, [segmentListData, docForm, parentMode, searchValue, selectedStatus, t]);
    const toggleFullScreen = (0, react_1.useCallback)(() => {
        setFullScreen(!fullScreen);
    }, [fullScreen]);
    const viewNewlyAddedChunk = (0, react_1.useCallback)(async () => {
        const totalPages = segmentListData?.total_pages || 0;
        const total = segmentListData?.total || 0;
        const newPage = Math.ceil((total + 1) / limit);
        needScrollToBottom.current = true;
        if (newPage > totalPages) {
            setCurrentPage(totalPages + 1);
        }
        else {
            resetList();
            if (currentPage !== totalPages)
                setCurrentPage(totalPages);
        }
    }, [segmentListData, limit, currentPage, resetList]);
    const { mutateAsync: deleteChildSegment } = (0, use_segment_1.useDeleteChildSegment)();
    const onDeleteChildChunk = (0, react_1.useCallback)(async (segmentId, childChunkId) => {
        await deleteChildSegment({ datasetId, documentId, segmentId, childChunkId }, {
            onSuccess: () => {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                if (parentMode === 'paragraph')
                    resetList();
                else
                    resetChildList();
            },
            onError: () => {
                notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
            },
        });
    }, [datasetId, documentId, parentMode, deleteChildSegment, resetList, resetChildList, t, notify]);
    const handleAddNewChildChunk = (0, react_1.useCallback)((parentChunkId) => {
        setShowNewChildSegmentModal(true);
        setCurrChunkId(parentChunkId);
    }, []);
    const onSaveNewChildChunk = (0, react_1.useCallback)((newChildChunk) => {
        if (parentMode === 'paragraph') {
            for (const seg of segments) {
                if (seg.id === currChunkId)
                    seg.child_chunks?.push(newChildChunk);
            }
            setSegments([...segments]);
            refreshChunkListDataWithDetailChanged();
        }
        else {
            resetChildList();
        }
    }, [parentMode, currChunkId, segments, refreshChunkListDataWithDetailChanged, resetChildList]);
    const viewNewlyAddedChildChunk = (0, react_1.useCallback)(() => {
        const totalPages = childChunkListData?.total_pages || 0;
        const total = childChunkListData?.total || 0;
        const newPage = Math.ceil((total + 1) / limit);
        needScrollToBottom.current = true;
        if (newPage > totalPages) {
            setCurrentPage(totalPages + 1);
        }
        else {
            resetChildList();
            if (currentPage !== totalPages)
                setCurrentPage(totalPages);
        }
    }, [childChunkListData, limit, currentPage, resetChildList]);
    const onClickSlice = (0, react_1.useCallback)((detail) => {
        setCurrChildChunk({ childChunkInfo: detail, showModal: true });
        setCurrChunkId(detail.segment_id);
    }, []);
    const onCloseChildSegmentDetail = (0, react_1.useCallback)(() => {
        setCurrChildChunk({ showModal: false });
        setFullScreen(false);
    }, []);
    const { mutateAsync: updateChildSegment } = (0, use_segment_1.useUpdateChildSegment)();
    const handleUpdateChildChunk = (0, react_1.useCallback)(async (segmentId, childChunkId, content) => {
        const params = { content: '' };
        if (!content.trim())
            return notify({ type: 'error', message: t('segment.contentEmpty', { ns: 'datasetDocuments' }) });
        params.content = content;
        eventEmitter?.emit('update-child-segment');
        await updateChildSegment({ datasetId, documentId, segmentId, childChunkId, body: params }, {
            onSuccess: (res) => {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                onCloseChildSegmentDetail();
                if (parentMode === 'paragraph') {
                    for (const seg of segments) {
                        if (seg.id === segmentId) {
                            for (const childSeg of seg.child_chunks) {
                                if (childSeg.id === childChunkId) {
                                    childSeg.content = res.data.content;
                                    childSeg.type = res.data.type;
                                    childSeg.word_count = res.data.word_count;
                                    childSeg.updated_at = res.data.updated_at;
                                }
                            }
                        }
                    }
                    setSegments([...segments]);
                    refreshChunkListDataWithDetailChanged();
                }
                else {
                    resetChildList();
                }
            },
            onSettled: () => {
                eventEmitter?.emit('update-child-segment-done');
            },
        });
    }, [segments, datasetId, documentId, parentMode, updateChildSegment, notify, eventEmitter, onCloseChildSegmentDetail, refreshChunkListDataWithDetailChanged, resetChildList, t]);
    const onClearFilter = (0, react_1.useCallback)(() => {
        setInputValue('');
        setSearchValue('');
        setSelectedStatus('all');
        setCurrentPage(1);
    }, []);
    const selectDefaultValue = (0, react_1.useMemo)(() => {
        if (selectedStatus === 'all')
            return 'all';
        return selectedStatus ? 1 : 0;
    }, [selectedStatus]);
    return (<SegmentListContext.Provider value={{
            isCollapsed,
            fullScreen,
            toggleFullScreen,
            currSegment,
            currChildChunk,
        }}>
      {/* Menu Bar */}
      {!isFullDocMode && (<div className={style_module_css_1.default.docSearchWrapper}>
          <checkbox_1.default className="shrink-0" checked={isAllSelected} indeterminate={!isAllSelected && isSomeSelected} onCheck={onSelectedAll} disabled={isLoadingSegmentList}/>
          <div className="system-sm-semibold-uppercase flex-1 pl-5 text-text-secondary">{totalText}</div>
          <select_1.SimpleSelect onSelect={onChangeStatus} items={statusList.current} defaultValue={selectDefaultValue} className={style_module_css_1.default.select} wrapperClassName="h-fit mr-2" optionWrapClassName="w-[160px]" optionClassName="p-0" renderOption={({ item, selected }) => <status_item_1.default item={item} selected={selected}/>} notClearable/>
          <input_1.default showLeftIcon showClearIcon wrapperClassName="!w-52" value={inputValue} onChange={e => handleInputChange(e.target.value)} onClear={() => handleInputChange('')}/>
          <divider_1.default type="vertical" className="mx-3 h-3.5"/>
          <display_toggle_1.default isCollapsed={isCollapsed} toggleCollapsed={() => setIsCollapsed(!isCollapsed)}/>
        </div>)}
      {/* Segment list */}
      {isFullDocMode
            ? (<div className={(0, classnames_1.cn)('flex grow flex-col overflow-x-hidden', (isLoadingSegmentList || isLoadingChildSegmentList) ? 'overflow-y-hidden' : 'overflow-y-auto')}>
                <segment_card_1.default detail={segments[0]} onClick={() => onClickCard(segments[0])} loading={isLoadingSegmentList} focused={{
                    segmentIndex: currSegment?.segInfo?.id === segments[0]?.id,
                    segmentContent: currSegment?.segInfo?.id === segments[0]?.id,
                }}/>
                <child_segment_list_1.default parentChunkId={segments[0]?.id} onDelete={onDeleteChildChunk} childChunks={childSegments} handleInputChange={handleInputChange} handleAddNewChildChunk={handleAddNewChildChunk} onClickSlice={onClickSlice} enabled={!archived} total={childChunkListData?.total || 0} inputValue={inputValue} onClearFilter={onClearFilter} isLoading={isLoadingSegmentList || isLoadingChildSegmentList}/>
              </div>)
            : (<segment_list_1.default ref={segmentListRef} embeddingAvailable={embeddingAvailable} isLoading={isLoadingSegmentList} items={segments} selectedSegmentIds={selectedSegmentIds} onSelected={onSelected} onChangeSwitch={onChangeSwitch} onDelete={onDelete} onClick={onClickCard} archived={archived} onDeleteChildChunk={onDeleteChildChunk} handleAddNewChildChunk={handleAddNewChildChunk} onClickSlice={onClickSlice} onClearFilter={onClearFilter}/>)}
      {/* Pagination */}
      <divider_1.default type="horizontal" className="mx-6 my-0 h-px w-auto bg-divider-subtle"/>
      <pagination_1.default current={currentPage - 1} onChange={cur => setCurrentPage(cur + 1)} total={(isFullDocMode ? childChunkListData?.total : segmentListData?.total) || 0} limit={limit} onLimitChange={limit => setLimit(limit)} className={isFullDocMode ? 'px-3' : ''}/>
      {/* Edit or view segment detail */}
      <full_screen_drawer_1.default isOpen={currSegment.showModal} fullScreen={fullScreen} onClose={onCloseSegmentDetail} showOverlay={false} needCheckChunks modal={isRegenerationModalOpen}>
        <segment_detail_1.default key={currSegment.segInfo?.id} segInfo={currSegment.segInfo ?? { id: '' }} docForm={docForm} isEditMode={currSegment.isEditMode} onUpdate={handleUpdateSegment} onCancel={onCloseSegmentDetail} onModalStateChange={setIsRegenerationModalOpen}/>
      </full_screen_drawer_1.default>
      {/* Create New Segment */}
      <full_screen_drawer_1.default isOpen={showNewSegmentModal} fullScreen={fullScreen} onClose={onCloseNewSegmentModal} modal>
        <new_segment_1.default docForm={docForm} onCancel={onCloseNewSegmentModal} onSave={resetList} viewNewlyAddedChunk={viewNewlyAddedChunk}/>
      </full_screen_drawer_1.default>
      {/* Edit or view child segment detail */}
      <full_screen_drawer_1.default isOpen={currChildChunk.showModal} fullScreen={fullScreen} onClose={onCloseChildSegmentDetail} showOverlay={false} needCheckChunks>
        <child_segment_detail_1.default key={currChildChunk.childChunkInfo?.id} chunkId={currChunkId} childChunkInfo={currChildChunk.childChunkInfo ?? { id: '' }} docForm={docForm} onUpdate={handleUpdateChildChunk} onCancel={onCloseChildSegmentDetail}/>
      </full_screen_drawer_1.default>
      {/* Create New Child Segment */}
      <full_screen_drawer_1.default isOpen={showNewChildSegmentModal} fullScreen={fullScreen} onClose={onCloseNewChildChunkModal} modal>
        <new_child_segment_1.default chunkId={currChunkId} onCancel={onCloseNewChildChunkModal} onSave={onSaveNewChildChunk} viewNewlyAddedChildChunk={viewNewlyAddedChildChunk}/>
      </full_screen_drawer_1.default>
      {/* Batch Action Buttons */}
      {selectedSegmentIds.length > 0 && (<batch_action_1.default className="absolute bottom-16 left-0 z-20" selectedIds={selectedSegmentIds} onBatchEnable={onChangeSwitch.bind(null, true, '')} onBatchDisable={onChangeSwitch.bind(null, false, '')} onBatchDelete={onDelete.bind(null, '')} onCancel={onCancelBatchOperation}/>)}
    </SegmentListContext.Provider>);
};
exports.default = Completed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBS1osbUNBQXNDO0FBQ3RDLGtEQUEwQztBQUMxQyxnREFBNkM7QUFDN0MsK0JBQThCO0FBQzlCLGlDQUF5RTtBQUN6RSxpREFBOEM7QUFDOUMsK0RBQW9GO0FBQ3BGLDZEQUFxRDtBQUNyRCwyREFBbUQ7QUFDbkQsdURBQStDO0FBQy9DLGlFQUF5RDtBQUN6RCx5REFBMkQ7QUFDM0QsdURBQTBEO0FBQzFELHdGQUErRTtBQUMvRSwyREFBdUU7QUFDdkUsZ0RBQWdEO0FBQ2hELGlFQWN3QztBQUN4QyxpREFBK0M7QUFDL0MsbURBQXVDO0FBQ3ZDLDJDQUE2QztBQUM3Qyx3Q0FBK0M7QUFDL0MsZ0RBQThDO0FBQzlDLGlFQUF1RDtBQUN2RCw2REFBbUQ7QUFDbkQsd0RBQStDO0FBQy9DLG9FQUEwRDtBQUMxRCxxREFBNEM7QUFDNUMsMkRBQWlEO0FBQ2pELGlEQUF3QztBQUN4QyxxREFBNEM7QUFDNUMsaURBQXdDO0FBQ3hDLCtDQUFzQztBQUN0Qyx5REFBa0M7QUFFbEMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBcUJ4QixNQUFNLGtCQUFrQixHQUFHLElBQUEsb0NBQWEsRUFBMEI7SUFDaEUsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLEtBQUs7SUFDakIsZ0JBQWdCLEVBQUUsZUFBSTtJQUN0QixXQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO0lBQ2pDLGNBQWMsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7Q0FDckMsQ0FBQyxDQUFBO0FBRUssTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQWlELEVBQUUsRUFBRTtJQUN6RixPQUFPLElBQUEseUNBQWtCLEVBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDekQsQ0FBQyxDQUFBO0FBRlksUUFBQSxx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IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBJdGVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3NlbGVjdCdcbmltcG9ydCB0eXBlIHsgRmlsZUVudGl0eSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2ltYWdlLXVwbG9hZGVyL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBDaGlsZENodW5rRGV0YWlsLCBTZWdtZW50RGV0YWlsTW9kZWwsIFNlZ21lbnRVcGRhdGVyIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyB1c2VEZWJvdW5jZUZuIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2VzLXRvb2xraXQvZnVuY3Rpb24nXG5pbXBvcnQgeyB1c2VQYXRobmFtZSB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlQ29udGV4dFNlbGVjdG9yIH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoZWNrYm94J1xuaW1wb3J0IERpdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RpdmlkZXInXG5pbXBvcnQgSW5wdXQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2lucHV0J1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BhZ2luYXRpb24nXG5pbXBvcnQgeyBTaW1wbGVTZWxlY3QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0J1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IE5ld1NlZ21lbnQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvZGV0YWlsL25ldy1zZWdtZW50J1xuaW1wb3J0IHsgdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcidcbmltcG9ydCB7IENodW5raW5nTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHtcbiAgdXNlQ2hpbGRTZWdtZW50TGlzdCxcbiAgdXNlQ2hpbGRTZWdtZW50TGlzdEtleSxcbiAgdXNlQ2h1bmtMaXN0QWxsS2V5LFxuICB1c2VDaHVua0xpc3REaXNhYmxlZEtleSxcbiAgdXNlQ2h1bmtMaXN0RW5hYmxlZEtleSxcbiAgdXNlRGVsZXRlQ2hpbGRTZWdtZW50LFxuICB1c2VEZWxldGVTZWdtZW50LFxuICB1c2VEaXNhYmxlU2VnbWVudCxcbiAgdXNlRW5hYmxlU2VnbWVudCxcbiAgdXNlU2VnbWVudExpc3QsXG4gIHVzZVNlZ21lbnRMaXN0S2V5LFxuICB1c2VVcGRhdGVDaGlsZFNlZ21lbnQsXG4gIHVzZVVwZGF0ZVNlZ21lbnQsXG59IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLXNlZ21lbnQnXG5pbXBvcnQgeyB1c2VJbnZhbGlkIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1iYXNlJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyBmb3JtYXROdW1iZXIgfSBmcm9tICdAL3V0aWxzL2Zvcm1hdCdcbmltcG9ydCB7IHVzZURvY3VtZW50Q29udGV4dCB9IGZyb20gJy4uL2NvbnRleHQnXG5pbXBvcnQgeyBQcm9jZXNzU3RhdHVzIH0gZnJvbSAnLi4vc2VnbWVudC1hZGQnXG5pbXBvcnQgQ2hpbGRTZWdtZW50RGV0YWlsIGZyb20gJy4vY2hpbGQtc2VnbWVudC1kZXRhaWwnXG5pbXBvcnQgQ2hpbGRTZWdtZW50TGlzdCBmcm9tICcuL2NoaWxkLXNlZ21lbnQtbGlzdCdcbmltcG9ydCBCYXRjaEFjdGlvbiBmcm9tICcuL2NvbW1vbi9iYXRjaC1hY3Rpb24nXG5pbXBvcnQgRnVsbFNjcmVlbkRyYXdlciBmcm9tICcuL2NvbW1vbi9mdWxsLXNjcmVlbi1kcmF3ZXInXG5pbXBvcnQgRGlzcGxheVRvZ2dsZSBmcm9tICcuL2Rpc3BsYXktdG9nZ2xlJ1xuaW1wb3J0IE5ld0NoaWxkU2VnbWVudCBmcm9tICcuL25ldy1jaGlsZC1zZWdtZW50J1xuaW1wb3J0IFNlZ21lbnRDYXJkIGZyb20gJy4vc2VnbWVudC1jYXJkJ1xuaW1wb3J0IFNlZ21lbnREZXRhaWwgZnJvbSAnLi9zZWdtZW50LWRldGFpbCdcbmltcG9ydCBTZWdtZW50TGlzdCBmcm9tICcuL3NlZ21lbnQtbGlzdCdcbmltcG9ydCBTdGF0dXNJdGVtIGZyb20gJy4vc3RhdHVzLWl0ZW0nXG5pbXBvcnQgcyBmcm9tICcuL3N0eWxlLm1vZHVsZS5jc3MnXG5cbmNvbnN0IERFRkFVTFRfTElNSVQgPSAxMFxuXG50eXBlIEN1cnJTZWdtZW50VHlwZSA9IHtcbiAgc2VnSW5mbz86IFNlZ21lbnREZXRhaWxNb2RlbFxuICBzaG93TW9kYWw6IGJvb2xlYW5cbiAgaXNFZGl0TW9kZT86IGJvb2xlYW5cbn1cblxudHlwZSBDdXJyQ2hpbGRDaHVua1R5cGUgPSB7XG4gIGNoaWxkQ2h1bmtJbmZvPzogQ2hpbGRDaHVua0RldGFpbFxuICBzaG93TW9kYWw6IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgU2VnbWVudExpc3RDb250ZXh0VmFsdWUgPSB7XG4gIGlzQ29sbGFwc2VkOiBib29sZWFuXG4gIGZ1bGxTY3JlZW46IGJvb2xlYW5cbiAgdG9nZ2xlRnVsbFNjcmVlbjogKGZ1bGxzY3JlZW4/OiBib29sZWFuKSA9PiB2b2lkXG4gIGN1cnJTZWdtZW50OiBDdXJyU2VnbWVudFR5cGVcbiAgY3VyckNoaWxkQ2h1bms6IEN1cnJDaGlsZENodW5rVHlwZVxufVxuXG5jb25zdCBTZWdtZW50TGlzdENvbnRleHQgPSBjcmVhdGVDb250ZXh0PFNlZ21lbnRMaXN0Q29udGV4dFZhbHVlPih7XG4gIGlzQ29sbGFwc2VkOiB0cnVlLFxuICBmdWxsU2NyZWVuOiBmYWxzZSxcbiAgdG9nZ2xlRnVsbFNjcmVlbjogbm9vcCxcbiAgY3VyclNlZ21lbnQ6IHsgc2hvd01vZGFsOiBmYWxzZSB9LFxuICBjdXJyQ2hpbGRDaHVuazogeyBzaG93TW9kYWw6IGZhbHNlIH0sXG59KVxuXG5leHBvcnQgY29uc3QgdXNlU2VnbWVudExpc3RDb250ZXh0ID0gKHNlbGVjdG9yOiAodmFsdWU6IFNlZ21lbnRMaXN0Q29udGV4dFZhbHVlKSA9PiBhbnkpID0+IHtcbiAgcmV0dXJuIHVzZUNvbnRleHRTZWxlY3RvcihTZWdtZW50TGlzdENvbnRleHQsIHNlbGVjdG9yKVxufVxuXG50eXBlIElDb21wbGV0ZWRQcm9wcyA9IHtcbiAgZW1iZWRkaW5nQXZhaWxhYmxlOiBib29sZWFuXG4gIHNob3dOZXdTZWdtZW50TW9kYWw6IGJvb2xlYW5cbiAgb25OZXdTZWdtZW50TW9kYWxDaGFuZ2U6IChzdGF0ZTogYm9vbGVhbikgPT4gdm9pZFxuICBpbXBvcnRTdGF0dXM6IFByb2Nlc3NTdGF0dXMgfCBzdHJpbmcgfCB1bmRlZmluZWRcbiAgYXJjaGl2ZWQ/OiBib29sZWFuXG59XG4vKipcbiAqIEVtYmVkZGluZyBkb25lLCBzaG93IGxpc3Qgb2YgYWxsIHNlZ21lbnRzXG4gKiBTdXBwb3J0IHNlYXJjaCBhbmQgZmlsdGVyXG4gKi9cbmNvbnN0IENvbXBsZXRlZDogRkM8SUNvbXBsZXRlZFByb3BzPiA9ICh7XG4gIGVtYmVkZGluZ0F2YWlsYWJsZSxcbiAgc2hvd05ld1NlZ21lbnRNb2RhbCxcbiAgb25OZXdTZWdtZW50TW9kYWxDaGFuZ2UsXG4gIGltcG9ydFN0YXR1cyxcbiAgYXJjaGl2ZWQsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IHBhdGhuYW1lID0gdXNlUGF0aG5hbWUoKVxuICBjb25zdCBkYXRhc2V0SWQgPSB1c2VEb2N1bWVudENvbnRleHQocyA9PiBzLmRhdGFzZXRJZCkgfHwgJydcbiAgY29uc3QgZG9jdW1lbnRJZCA9IHVzZURvY3VtZW50Q29udGV4dChzID0+IHMuZG9jdW1lbnRJZCkgfHwgJydcbiAgY29uc3QgZG9jRm9ybSA9IHVzZURvY3VtZW50Q29udGV4dChzID0+IHMuZG9jRm9ybSlcbiAgY29uc3QgcGFyZW50TW9kZSA9IHVzZURvY3VtZW50Q29udGV4dChzID0+IHMucGFyZW50TW9kZSlcbiAgLy8gdGhlIGN1cnJlbnQgc2VnbWVudCBpZCBhbmQgd2hldGhlciB0byBzaG93IHRoZSBtb2RhbFxuICBjb25zdCBbY3VyclNlZ21lbnQsIHNldEN1cnJTZWdtZW50XSA9IHVzZVN0YXRlPEN1cnJTZWdtZW50VHlwZT4oeyBzaG93TW9kYWw6IGZhbHNlIH0pXG4gIGNvbnN0IFtjdXJyQ2hpbGRDaHVuaywgc2V0Q3VyckNoaWxkQ2h1bmtdID0gdXNlU3RhdGU8Q3VyckNoaWxkQ2h1bmtUeXBlPih7IHNob3dNb2RhbDogZmFsc2UgfSlcbiAgY29uc3QgW2N1cnJDaHVua0lkLCBzZXRDdXJyQ2h1bmtJZF0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBbaW5wdXRWYWx1ZSwgc2V0SW5wdXRWYWx1ZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKSAvLyB0aGUgaW5wdXQgdmFsdWVcbiAgY29uc3QgW3NlYXJjaFZhbHVlLCBzZXRTZWFyY2hWYWx1ZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKSAvLyB0aGUgc2VhcmNoIHZhbHVlXG4gIGNvbnN0IFtzZWxlY3RlZFN0YXR1cywgc2V0U2VsZWN0ZWRTdGF0dXNdID0gdXNlU3RhdGU8Ym9vbGVhbiB8ICdhbGwnPignYWxsJykgLy8gdGhlIHNlbGVjdGVkIHN0YXR1cywgZW5hYmxlZC9kaXNhYmxlZC91bmRlZmluZWRcblxuICBjb25zdCBbc2VnbWVudHMsIHNldFNlZ21lbnRzXSA9IHVzZVN0YXRlPFNlZ21lbnREZXRhaWxNb2RlbFtdPihbXSkgLy8gYWxsIHNlZ21lbnRzIGRhdGFcbiAgY29uc3QgW2NoaWxkU2VnbWVudHMsIHNldENoaWxkU2VnbWVudHNdID0gdXNlU3RhdGU8Q2hpbGRDaHVua0RldGFpbFtdPihbXSkgLy8gYWxsIGNoaWxkIHNlZ21lbnRzIGRhdGFcbiAgY29uc3QgW3NlbGVjdGVkU2VnbWVudElkcywgc2V0U2VsZWN0ZWRTZWdtZW50SWRzXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSlcbiAgY29uc3QgeyBldmVudEVtaXR0ZXIgfSA9IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0KClcbiAgY29uc3QgW2lzQ29sbGFwc2VkLCBzZXRJc0NvbGxhcHNlZF0gPSB1c2VTdGF0ZSh0cnVlKVxuICBjb25zdCBbY3VycmVudFBhZ2UsIHNldEN1cnJlbnRQYWdlXSA9IHVzZVN0YXRlKDEpIC8vIHN0YXJ0IGZyb20gMVxuICBjb25zdCBbbGltaXQsIHNldExpbWl0XSA9IHVzZVN0YXRlKERFRkFVTFRfTElNSVQpXG4gIGNvbnN0IFtmdWxsU2NyZWVuLCBzZXRGdWxsU2NyZWVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2hvd05ld0NoaWxkU2VnbWVudE1vZGFsLCBzZXRTaG93TmV3Q2hpbGRTZWdtZW50TW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtpc1JlZ2VuZXJhdGlvbk1vZGFsT3Blbiwgc2V0SXNSZWdlbmVyYXRpb25Nb2RhbE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3Qgc2VnbWVudExpc3RSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IGNoaWxkU2VnbWVudExpc3RSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IG5lZWRTY3JvbGxUb0JvdHRvbSA9IHVzZVJlZihmYWxzZSlcbiAgY29uc3Qgc3RhdHVzTGlzdCA9IHVzZVJlZjxJdGVtW10+KFtcbiAgICB7IHZhbHVlOiAnYWxsJywgbmFtZTogdCgnbGlzdC5pbmRleC5hbGwnLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSkgfSxcbiAgICB7IHZhbHVlOiAwLCBuYW1lOiB0KCdsaXN0LnN0YXR1cy5kaXNhYmxlZCcsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KSB9LFxuICAgIHsgdmFsdWU6IDEsIG5hbWU6IHQoJ2xpc3Quc3RhdHVzLmVuYWJsZWQnLCB7IG5zOiAnZGF0YXNldERvY3VtZW50cycgfSkgfSxcbiAgXSlcblxuICBjb25zdCB7IHJ1bjogaGFuZGxlU2VhcmNoIH0gPSB1c2VEZWJvdW5jZUZuKCgpID0+IHtcbiAgICBzZXRTZWFyY2hWYWx1ZShpbnB1dFZhbHVlKVxuICAgIHNldEN1cnJlbnRQYWdlKDEpXG4gIH0sIHsgd2FpdDogNTAwIH0pXG5cbiAgY29uc3QgaGFuZGxlSW5wdXRDaGFuZ2UgPSAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgIHNldElucHV0VmFsdWUodmFsdWUpXG4gICAgaGFuZGxlU2VhcmNoKClcbiAgfVxuXG4gIGNvbnN0IG9uQ2hhbmdlU3RhdHVzID0gKHsgdmFsdWUgfTogSXRlbSkgPT4ge1xuICAgIHNldFNlbGVjdGVkU3RhdHVzKHZhbHVlID09PSAnYWxsJyA/ICdhbGwnIDogISF2YWx1ZSlcbiAgICBzZXRDdXJyZW50UGFnZSgxKVxuICB9XG5cbiAgY29uc3QgaXNGdWxsRG9jTW9kZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBkb2NGb3JtID09PSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGQgJiYgcGFyZW50TW9kZSA9PT0gJ2Z1bGwtZG9jJ1xuICB9LCBbZG9jRm9ybSwgcGFyZW50TW9kZV0pXG5cbiAgY29uc3QgeyBpc0xvYWRpbmc6IGlzTG9hZGluZ1NlZ21lbnRMaXN0LCBkYXRhOiBzZWdtZW50TGlzdERhdGEgfSA9IHVzZVNlZ21lbnRMaXN0KFxuICAgIHtcbiAgICAgIGRhdGFzZXRJZCxcbiAgICAgIGRvY3VtZW50SWQsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgcGFnZTogaXNGdWxsRG9jTW9kZSA/IDEgOiBjdXJyZW50UGFnZSxcbiAgICAgICAgbGltaXQ6IGlzRnVsbERvY01vZGUgPyAxMCA6IGxpbWl0LFxuICAgICAgICBrZXl3b3JkOiBpc0Z1bGxEb2NNb2RlID8gJycgOiBzZWFyY2hWYWx1ZSxcbiAgICAgICAgZW5hYmxlZDogc2VsZWN0ZWRTdGF0dXMsXG4gICAgICB9LFxuICAgIH0sXG4gIClcbiAgY29uc3QgaW52YWxpZFNlZ21lbnRMaXN0ID0gdXNlSW52YWxpZCh1c2VTZWdtZW50TGlzdEtleSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZWdtZW50TGlzdERhdGEpIHtcbiAgICAgIHNldFNlZ21lbnRzKHNlZ21lbnRMaXN0RGF0YS5kYXRhIHx8IFtdKVxuICAgICAgY29uc3QgdG90YWxQYWdlcyA9IHNlZ21lbnRMaXN0RGF0YS50b3RhbF9wYWdlc1xuICAgICAgaWYgKHRvdGFsUGFnZXMgPCBjdXJyZW50UGFnZSlcbiAgICAgICAgc2V0Q3VycmVudFBhZ2UodG90YWxQYWdlcyA9PT0gMCA/IDEgOiB0b3RhbFBhZ2VzKVxuICAgIH1cbiAgfSwgW3NlZ21lbnRMaXN0RGF0YV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2VnbWVudExpc3RSZWYuY3VycmVudCAmJiBuZWVkU2Nyb2xsVG9Cb3R0b20uY3VycmVudCkge1xuICAgICAgc2VnbWVudExpc3RSZWYuY3VycmVudC5zY3JvbGxUbyh7IHRvcDogc2VnbWVudExpc3RSZWYuY3VycmVudC5zY3JvbGxIZWlnaHQsIGJlaGF2aW9yOiAnc21vb3RoJyB9KVxuICAgICAgbmVlZFNjcm9sbFRvQm90dG9tLmN1cnJlbnQgPSBmYWxzZVxuICAgIH1cbiAgfSwgW3NlZ21lbnRzXSlcblxuICBjb25zdCB7IGlzTG9hZGluZzogaXNMb2FkaW5nQ2hpbGRTZWdtZW50TGlzdCwgZGF0YTogY2hpbGRDaHVua0xpc3REYXRhIH0gPSB1c2VDaGlsZFNlZ21lbnRMaXN0KFxuICAgIHtcbiAgICAgIGRhdGFzZXRJZCxcbiAgICAgIGRvY3VtZW50SWQsXG4gICAgICBzZWdtZW50SWQ6IHNlZ21lbnRzWzBdPy5pZCB8fCAnJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBwYWdlOiBjdXJyZW50UGFnZSA9PT0gMCA/IDEgOiBjdXJyZW50UGFnZSxcbiAgICAgICAgbGltaXQsXG4gICAgICAgIGtleXdvcmQ6IHNlYXJjaFZhbHVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgICFpc0Z1bGxEb2NNb2RlIHx8IHNlZ21lbnRzLmxlbmd0aCA9PT0gMCxcbiAgKVxuICBjb25zdCBpbnZhbGlkQ2hpbGRTZWdtZW50TGlzdCA9IHVzZUludmFsaWQodXNlQ2hpbGRTZWdtZW50TGlzdEtleSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChjaGlsZFNlZ21lbnRMaXN0UmVmLmN1cnJlbnQgJiYgbmVlZFNjcm9sbFRvQm90dG9tLmN1cnJlbnQpIHtcbiAgICAgIGNoaWxkU2VnbWVudExpc3RSZWYuY3VycmVudC5zY3JvbGxUbyh7IHRvcDogY2hpbGRTZWdtZW50TGlzdFJlZi5jdXJyZW50LnNjcm9sbEhlaWdodCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pXG4gICAgICBuZWVkU2Nyb2xsVG9Cb3R0b20uY3VycmVudCA9IGZhbHNlXG4gICAgfVxuICB9LCBbY2hpbGRTZWdtZW50c10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoY2hpbGRDaHVua0xpc3REYXRhKSB7XG4gICAgICBzZXRDaGlsZFNlZ21lbnRzKGNoaWxkQ2h1bmtMaXN0RGF0YS5kYXRhIHx8IFtdKVxuICAgICAgY29uc3QgdG90YWxQYWdlcyA9IGNoaWxkQ2h1bmtMaXN0RGF0YS50b3RhbF9wYWdlc1xuICAgICAgaWYgKHRvdGFsUGFnZXMgPCBjdXJyZW50UGFnZSlcbiAgICAgICAgc2V0Q3VycmVudFBhZ2UodG90YWxQYWdlcyA9PT0gMCA/IDEgOiB0b3RhbFBhZ2VzKVxuICAgIH1cbiAgfSwgW2NoaWxkQ2h1bmtMaXN0RGF0YV0pXG5cbiAgY29uc3QgcmVzZXRMaXN0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFNlbGVjdGVkU2VnbWVudElkcyhbXSlcbiAgICBpbnZhbGlkU2VnbWVudExpc3QoKVxuICB9LCBbaW52YWxpZFNlZ21lbnRMaXN0XSlcblxuICBjb25zdCByZXNldENoaWxkTGlzdCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpbnZhbGlkQ2hpbGRTZWdtZW50TGlzdCgpXG4gIH0sIFtpbnZhbGlkQ2hpbGRTZWdtZW50TGlzdF0pXG5cbiAgY29uc3Qgb25DbGlja0NhcmQgPSAoZGV0YWlsOiBTZWdtZW50RGV0YWlsTW9kZWwsIGlzRWRpdE1vZGUgPSBmYWxzZSkgPT4ge1xuICAgIHNldEN1cnJTZWdtZW50KHsgc2VnSW5mbzogZGV0YWlsLCBzaG93TW9kYWw6IHRydWUsIGlzRWRpdE1vZGUgfSlcbiAgfVxuXG4gIGNvbnN0IG9uQ2xvc2VTZWdtZW50RGV0YWlsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEN1cnJTZWdtZW50KHsgc2hvd01vZGFsOiBmYWxzZSB9KVxuICAgIHNldEZ1bGxTY3JlZW4oZmFsc2UpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IG9uQ2xvc2VOZXdTZWdtZW50TW9kYWwgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgb25OZXdTZWdtZW50TW9kYWxDaGFuZ2UoZmFsc2UpXG4gICAgc2V0RnVsbFNjcmVlbihmYWxzZSlcbiAgfSwgW29uTmV3U2VnbWVudE1vZGFsQ2hhbmdlXSlcblxuICBjb25zdCBvbkNsb3NlTmV3Q2hpbGRDaHVua01vZGFsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldFNob3dOZXdDaGlsZFNlZ21lbnRNb2RhbChmYWxzZSlcbiAgICBzZXRGdWxsU2NyZWVuKGZhbHNlKVxuICB9LCBbXSlcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBlbmFibGVTZWdtZW50IH0gPSB1c2VFbmFibGVTZWdtZW50KClcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZGlzYWJsZVNlZ21lbnQgfSA9IHVzZURpc2FibGVTZWdtZW50KClcbiAgY29uc3QgaW52YWxpZENodW5rTGlzdEFsbCA9IHVzZUludmFsaWQodXNlQ2h1bmtMaXN0QWxsS2V5KVxuICBjb25zdCBpbnZhbGlkQ2h1bmtMaXN0RW5hYmxlZCA9IHVzZUludmFsaWQodXNlQ2h1bmtMaXN0RW5hYmxlZEtleSlcbiAgY29uc3QgaW52YWxpZENodW5rTGlzdERpc2FibGVkID0gdXNlSW52YWxpZCh1c2VDaHVua0xpc3REaXNhYmxlZEtleSlcblxuICBjb25zdCByZWZyZXNoQ2h1bmtMaXN0V2l0aFN0YXR1c0NoYW5nZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc3dpdGNoIChzZWxlY3RlZFN0YXR1cykge1xuICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgaW52YWxpZENodW5rTGlzdERpc2FibGVkKClcbiAgICAgICAgaW52YWxpZENodW5rTGlzdEVuYWJsZWQoKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaW52YWxpZFNlZ21lbnRMaXN0KClcbiAgICB9XG4gIH0sIFtzZWxlY3RlZFN0YXR1cywgaW52YWxpZENodW5rTGlzdERpc2FibGVkLCBpbnZhbGlkQ2h1bmtMaXN0RW5hYmxlZCwgaW52YWxpZFNlZ21lbnRMaXN0XSlcblxuICBjb25zdCBvbkNoYW5nZVN3aXRjaCA9IHVzZUNhbGxiYWNrKGFzeW5jIChlbmFibGU6IGJvb2xlYW4sIHNlZ0lkPzogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qgb3BlcmF0aW9uQXBpID0gZW5hYmxlID8gZW5hYmxlU2VnbWVudCA6IGRpc2FibGVTZWdtZW50XG4gICAgYXdhaXQgb3BlcmF0aW9uQXBpKHsgZGF0YXNldElkLCBkb2N1bWVudElkLCBzZWdtZW50SWRzOiBzZWdJZCA/IFtzZWdJZF0gOiBzZWxlY3RlZFNlZ21lbnRJZHMgfSwge1xuICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgICAgZm9yIChjb25zdCBzZWcgb2Ygc2VnbWVudHMpIHtcbiAgICAgICAgICBpZiAoc2VnSWQgPyBzZWcuaWQgPT09IHNlZ0lkIDogc2VsZWN0ZWRTZWdtZW50SWRzLmluY2x1ZGVzKHNlZy5pZCkpXG4gICAgICAgICAgICBzZWcuZW5hYmxlZCA9IGVuYWJsZVxuICAgICAgICB9XG4gICAgICAgIHNldFNlZ21lbnRzKFsuLi5zZWdtZW50c10pXG4gICAgICAgIHJlZnJlc2hDaHVua0xpc3RXaXRoU3RhdHVzQ2hhbmdlZCgpXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogKCkgPT4ge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRVbnN1Y2Nlc3NmdWxseScsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtkYXRhc2V0SWQsIGRvY3VtZW50SWQsIHNlbGVjdGVkU2VnbWVudElkcywgc2VnbWVudHMsIGRpc2FibGVTZWdtZW50LCBlbmFibGVTZWdtZW50LCB0LCBub3RpZnksIHJlZnJlc2hDaHVua0xpc3RXaXRoU3RhdHVzQ2hhbmdlZF0pXG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZGVsZXRlU2VnbWVudCB9ID0gdXNlRGVsZXRlU2VnbWVudCgpXG5cbiAgY29uc3Qgb25EZWxldGUgPSB1c2VDYWxsYmFjayhhc3luYyAoc2VnSWQ/OiBzdHJpbmcpID0+IHtcbiAgICBhd2FpdCBkZWxldGVTZWdtZW50KHsgZGF0YXNldElkLCBkb2N1bWVudElkLCBzZWdtZW50SWRzOiBzZWdJZCA/IFtzZWdJZF0gOiBzZWxlY3RlZFNlZ21lbnRJZHMgfSwge1xuICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgICAgcmVzZXRMaXN0KClcbiAgICAgICAgaWYgKCFzZWdJZClcbiAgICAgICAgICBzZXRTZWxlY3RlZFNlZ21lbnRJZHMoW10pXG4gICAgICB9LFxuICAgICAgb25FcnJvcjogKCkgPT4ge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRVbnN1Y2Nlc3NmdWxseScsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtkYXRhc2V0SWQsIGRvY3VtZW50SWQsIHNlbGVjdGVkU2VnbWVudElkcywgZGVsZXRlU2VnbWVudCwgcmVzZXRMaXN0LCB0LCBub3RpZnldKVxuXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmM6IHVwZGF0ZVNlZ21lbnQgfSA9IHVzZVVwZGF0ZVNlZ21lbnQoKVxuXG4gIGNvbnN0IHJlZnJlc2hDaHVua0xpc3REYXRhV2l0aERldGFpbENoYW5nZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc3dpdGNoIChzZWxlY3RlZFN0YXR1cykge1xuICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgaW52YWxpZENodW5rTGlzdERpc2FibGVkKClcbiAgICAgICAgaW52YWxpZENodW5rTGlzdEVuYWJsZWQoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSB0cnVlOlxuICAgICAgICBpbnZhbGlkQ2h1bmtMaXN0QWxsKClcbiAgICAgICAgaW52YWxpZENodW5rTGlzdERpc2FibGVkKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgIGludmFsaWRDaHVua0xpc3RBbGwoKVxuICAgICAgICBpbnZhbGlkQ2h1bmtMaXN0RW5hYmxlZCgpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9LCBbc2VsZWN0ZWRTdGF0dXMsIGludmFsaWRDaHVua0xpc3REaXNhYmxlZCwgaW52YWxpZENodW5rTGlzdEVuYWJsZWQsIGludmFsaWRDaHVua0xpc3RBbGxdKVxuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZVNlZ21lbnQgPSB1c2VDYWxsYmFjayhhc3luYyAoXG4gICAgc2VnbWVudElkOiBzdHJpbmcsXG4gICAgcXVlc3Rpb246IHN0cmluZyxcbiAgICBhbnN3ZXI6IHN0cmluZyxcbiAgICBrZXl3b3Jkczogc3RyaW5nW10sXG4gICAgYXR0YWNobWVudHM6IEZpbGVFbnRpdHlbXSxcbiAgICBuZWVkUmVnZW5lcmF0ZSA9IGZhbHNlLFxuICApID0+IHtcbiAgICBjb25zdCBwYXJhbXM6IFNlZ21lbnRVcGRhdGVyID0geyBjb250ZW50OiAnJywgYXR0YWNobWVudF9pZHM6IFtdIH1cbiAgICBpZiAoZG9jRm9ybSA9PT0gQ2h1bmtpbmdNb2RlLnFhKSB7XG4gICAgICBpZiAoIXF1ZXN0aW9uLnRyaW0oKSlcbiAgICAgICAgcmV0dXJuIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3NlZ21lbnQucXVlc3Rpb25FbXB0eScsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KSB9KVxuICAgICAgaWYgKCFhbnN3ZXIudHJpbSgpKVxuICAgICAgICByZXR1cm4gbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnc2VnbWVudC5hbnN3ZXJFbXB0eScsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KSB9KVxuXG4gICAgICBwYXJhbXMuY29udGVudCA9IHF1ZXN0aW9uXG4gICAgICBwYXJhbXMuYW5zd2VyID0gYW5zd2VyXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCFxdWVzdGlvbi50cmltKCkpXG4gICAgICAgIHJldHVybiBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdzZWdtZW50LmNvbnRlbnRFbXB0eScsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJyB9KSB9KVxuXG4gICAgICBwYXJhbXMuY29udGVudCA9IHF1ZXN0aW9uXG4gICAgfVxuXG4gICAgaWYgKGtleXdvcmRzLmxlbmd0aClcbiAgICAgIHBhcmFtcy5rZXl3b3JkcyA9IGtleXdvcmRzXG5cbiAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBub3RBbGxVcGxvYWRlZCA9IGF0dGFjaG1lbnRzLnNvbWUoaXRlbSA9PiAhaXRlbS51cGxvYWRlZElkKVxuICAgICAgaWYgKG5vdEFsbFVwbG9hZGVkKVxuICAgICAgICByZXR1cm4gbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnc2VnbWVudC5hbGxGaWxlc1VwbG9hZGVkJywgeyBuczogJ2RhdGFzZXREb2N1bWVudHMnIH0pIH0pXG4gICAgICBwYXJhbXMuYXR0YWNobWVudF9pZHMgPSBhdHRhY2htZW50cy5tYXAoaXRlbSA9PiBpdGVtLnVwbG9hZGVkSWQhKVxuICAgIH1cblxuICAgIGlmIChuZWVkUmVnZW5lcmF0ZSlcbiAgICAgIHBhcmFtcy5yZWdlbmVyYXRlX2NoaWxkX2NodW5rcyA9IG5lZWRSZWdlbmVyYXRlXG5cbiAgICBldmVudEVtaXR0ZXI/LmVtaXQoJ3VwZGF0ZS1zZWdtZW50JylcbiAgICBhd2FpdCB1cGRhdGVTZWdtZW50KHsgZGF0YXNldElkLCBkb2N1bWVudElkLCBzZWdtZW50SWQsIGJvZHk6IHBhcmFtcyB9LCB7XG4gICAgICBvblN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkU3VjY2Vzc2Z1bGx5JywgeyBuczogJ2NvbW1vbicgfSkgfSlcbiAgICAgICAgaWYgKCFuZWVkUmVnZW5lcmF0ZSlcbiAgICAgICAgICBvbkNsb3NlU2VnbWVudERldGFpbCgpXG4gICAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHNlZ21lbnRzKSB7XG4gICAgICAgICAgaWYgKHNlZy5pZCA9PT0gc2VnbWVudElkKSB7XG4gICAgICAgICAgICBzZWcuYW5zd2VyID0gcmVzLmRhdGEuYW5zd2VyXG4gICAgICAgICAgICBzZWcuY29udGVudCA9IHJlcy5kYXRhLmNvbnRlbnRcbiAgICAgICAgICAgIHNlZy5zaWduX2NvbnRlbnQgPSByZXMuZGF0YS5zaWduX2NvbnRlbnRcbiAgICAgICAgICAgIHNlZy5rZXl3b3JkcyA9IHJlcy5kYXRhLmtleXdvcmRzXG4gICAgICAgICAgICBzZWcuYXR0YWNobWVudHMgPSByZXMuZGF0YS5hdHRhY2htZW50c1xuICAgICAgICAgICAgc2VnLndvcmRfY291bnQgPSByZXMuZGF0YS53b3JkX2NvdW50XG4gICAgICAgICAgICBzZWcuaGl0X2NvdW50ID0gcmVzLmRhdGEuaGl0X2NvdW50XG4gICAgICAgICAgICBzZWcuZW5hYmxlZCA9IHJlcy5kYXRhLmVuYWJsZWRcbiAgICAgICAgICAgIHNlZy51cGRhdGVkX2F0ID0gcmVzLmRhdGEudXBkYXRlZF9hdFxuICAgICAgICAgICAgc2VnLmNoaWxkX2NodW5rcyA9IHJlcy5kYXRhLmNoaWxkX2NodW5rc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRTZWdtZW50cyhbLi4uc2VnbWVudHNdKVxuICAgICAgICByZWZyZXNoQ2h1bmtMaXN0RGF0YVdpdGhEZXRhaWxDaGFuZ2VkKClcbiAgICAgICAgZXZlbnRFbWl0dGVyPy5lbWl0KCd1cGRhdGUtc2VnbWVudC1zdWNjZXNzJylcbiAgICAgIH0sXG4gICAgICBvblNldHRsZWQoKSB7XG4gICAgICAgIGV2ZW50RW1pdHRlcj8uZW1pdCgndXBkYXRlLXNlZ21lbnQtZG9uZScpXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtzZWdtZW50cywgZGF0YXNldElkLCBkb2N1bWVudElkLCB1cGRhdGVTZWdtZW50LCBkb2NGb3JtLCBub3RpZnksIGV2ZW50RW1pdHRlciwgb25DbG9zZVNlZ21lbnREZXRhaWwsIHJlZnJlc2hDaHVua0xpc3REYXRhV2l0aERldGFpbENoYW5nZWQsIHRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmVzZXRMaXN0KClcbiAgfSwgW3BhdGhuYW1lXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbXBvcnRTdGF0dXMgPT09IFByb2Nlc3NTdGF0dXMuQ09NUExFVEVEKVxuICAgICAgcmVzZXRMaXN0KClcbiAgfSwgW2ltcG9ydFN0YXR1c10pXG5cbiAgY29uc3Qgb25DYW5jZWxCYXRjaE9wZXJhdGlvbiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRTZWxlY3RlZFNlZ21lbnRJZHMoW10pXG4gIH0sIFtdKVxuXG4gIGNvbnN0IG9uU2VsZWN0ZWQgPSB1c2VDYWxsYmFjaygoc2VnSWQ6IHN0cmluZykgPT4ge1xuICAgIHNldFNlbGVjdGVkU2VnbWVudElkcyhwcmV2ID0+XG4gICAgICBwcmV2LmluY2x1ZGVzKHNlZ0lkKVxuICAgICAgICA/IHByZXYuZmlsdGVyKGlkID0+IGlkICE9PSBzZWdJZClcbiAgICAgICAgOiBbLi4ucHJldiwgc2VnSWRdLFxuICAgIClcbiAgfSwgW10pXG5cbiAgY29uc3QgaXNBbGxTZWxlY3RlZCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBzZWdtZW50cy5sZW5ndGggPiAwICYmIHNlZ21lbnRzLmV2ZXJ5KHNlZyA9PiBzZWxlY3RlZFNlZ21lbnRJZHMuaW5jbHVkZXMoc2VnLmlkKSlcbiAgfSwgW3NlZ21lbnRzLCBzZWxlY3RlZFNlZ21lbnRJZHNdKVxuXG4gIGNvbnN0IGlzU29tZVNlbGVjdGVkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHNlZ21lbnRzLnNvbWUoc2VnID0+IHNlbGVjdGVkU2VnbWVudElkcy5pbmNsdWRlcyhzZWcuaWQpKVxuICB9LCBbc2VnbWVudHMsIHNlbGVjdGVkU2VnbWVudElkc10pXG5cbiAgY29uc3Qgb25TZWxlY3RlZEFsbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRTZWxlY3RlZFNlZ21lbnRJZHMoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRBbGxTZWdJZHMgPSBzZWdtZW50cy5tYXAoc2VnID0+IHNlZy5pZClcbiAgICAgIGNvbnN0IHByZXZTZWxlY3RlZElkcyA9IHByZXYuZmlsdGVyKGl0ZW0gPT4gIWN1cnJlbnRBbGxTZWdJZHMuaW5jbHVkZXMoaXRlbSkpXG4gICAgICByZXR1cm4gWy4uLnByZXZTZWxlY3RlZElkcywgLi4uKGlzQWxsU2VsZWN0ZWQgPyBbXSA6IGN1cnJlbnRBbGxTZWdJZHMpXVxuICAgIH0pXG4gIH0sIFtzZWdtZW50cywgaXNBbGxTZWxlY3RlZF0pXG5cbiAgY29uc3QgdG90YWxUZXh0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgaXNTZWFyY2ggPSBzZWFyY2hWYWx1ZSAhPT0gJycgfHwgc2VsZWN0ZWRTdGF0dXMgIT09ICdhbGwnXG4gICAgaWYgKCFpc1NlYXJjaCkge1xuICAgICAgY29uc3QgdG90YWwgPSBzZWdtZW50TGlzdERhdGE/LnRvdGFsID8gZm9ybWF0TnVtYmVyKHNlZ21lbnRMaXN0RGF0YS50b3RhbCkgOiAnLS0nXG4gICAgICBjb25zdCBjb3VudCA9IHRvdGFsID09PSAnLS0nID8gMCA6IHNlZ21lbnRMaXN0RGF0YSEudG90YWxcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uS2V5ID0gKGRvY0Zvcm0gPT09IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCAmJiBwYXJlbnRNb2RlID09PSAncGFyYWdyYXBoJylcbiAgICAgICAgPyAnc2VnbWVudC5wYXJlbnRDaHVua3MnIGFzIGNvbnN0XG4gICAgICAgIDogJ3NlZ21lbnQuY2h1bmtzJyBhcyBjb25zdFxuICAgICAgcmV0dXJuIGAke3RvdGFsfSAke3QodHJhbnNsYXRpb25LZXksIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJywgY291bnQgfSl9YFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHRvdGFsID0gdHlwZW9mIHNlZ21lbnRMaXN0RGF0YT8udG90YWwgPT09ICdudW1iZXInID8gZm9ybWF0TnVtYmVyKHNlZ21lbnRMaXN0RGF0YS50b3RhbCkgOiAwXG4gICAgICBjb25zdCBjb3VudCA9IHNlZ21lbnRMaXN0RGF0YT8udG90YWwgfHwgMFxuICAgICAgcmV0dXJuIGAke3RvdGFsfSAke3QoJ3NlZ21lbnQuc2VhcmNoUmVzdWx0cycsIHsgbnM6ICdkYXRhc2V0RG9jdW1lbnRzJywgY291bnQgfSl9YFxuICAgIH1cbiAgfSwgW3NlZ21lbnRMaXN0RGF0YSwgZG9jRm9ybSwgcGFyZW50TW9kZSwgc2VhcmNoVmFsdWUsIHNlbGVjdGVkU3RhdHVzLCB0XSlcblxuICBjb25zdCB0b2dnbGVGdWxsU2NyZWVuID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEZ1bGxTY3JlZW4oIWZ1bGxTY3JlZW4pXG4gIH0sIFtmdWxsU2NyZWVuXSlcblxuICBjb25zdCB2aWV3TmV3bHlBZGRlZENodW5rID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBzZWdtZW50TGlzdERhdGE/LnRvdGFsX3BhZ2VzIHx8IDBcbiAgICBjb25zdCB0b3RhbCA9IHNlZ21lbnRMaXN0RGF0YT8udG90YWwgfHwgMFxuICAgIGNvbnN0IG5ld1BhZ2UgPSBNYXRoLmNlaWwoKHRvdGFsICsgMSkgLyBsaW1pdClcbiAgICBuZWVkU2Nyb2xsVG9Cb3R0b20uY3VycmVudCA9IHRydWVcbiAgICBpZiAobmV3UGFnZSA+IHRvdGFsUGFnZXMpIHtcbiAgICAgIHNldEN1cnJlbnRQYWdlKHRvdGFsUGFnZXMgKyAxKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc2V0TGlzdCgpXG4gICAgICBpZiAoY3VycmVudFBhZ2UgIT09IHRvdGFsUGFnZXMpXG4gICAgICAgIHNldEN1cnJlbnRQYWdlKHRvdGFsUGFnZXMpXG4gICAgfVxuICB9LCBbc2VnbWVudExpc3REYXRhLCBsaW1pdCwgY3VycmVudFBhZ2UsIHJlc2V0TGlzdF0pXG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZGVsZXRlQ2hpbGRTZWdtZW50IH0gPSB1c2VEZWxldGVDaGlsZFNlZ21lbnQoKVxuXG4gIGNvbnN0IG9uRGVsZXRlQ2hpbGRDaHVuayA9IHVzZUNhbGxiYWNrKGFzeW5jIChzZWdtZW50SWQ6IHN0cmluZywgY2hpbGRDaHVua0lkOiBzdHJpbmcpID0+IHtcbiAgICBhd2FpdCBkZWxldGVDaGlsZFNlZ21lbnQoXG4gICAgICB7IGRhdGFzZXRJZCwgZG9jdW1lbnRJZCwgc2VnbWVudElkLCBjaGlsZENodW5rSWQgfSxcbiAgICAgIHtcbiAgICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgICAgIGlmIChwYXJlbnRNb2RlID09PSAncGFyYWdyYXBoJylcbiAgICAgICAgICAgIHJlc2V0TGlzdCgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVzZXRDaGlsZExpc3QoKVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkVW5zdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICApXG4gIH0sIFtkYXRhc2V0SWQsIGRvY3VtZW50SWQsIHBhcmVudE1vZGUsIGRlbGV0ZUNoaWxkU2VnbWVudCwgcmVzZXRMaXN0LCByZXNldENoaWxkTGlzdCwgdCwgbm90aWZ5XSlcblxuICBjb25zdCBoYW5kbGVBZGROZXdDaGlsZENodW5rID0gdXNlQ2FsbGJhY2soKHBhcmVudENodW5rSWQ6IHN0cmluZykgPT4ge1xuICAgIHNldFNob3dOZXdDaGlsZFNlZ21lbnRNb2RhbCh0cnVlKVxuICAgIHNldEN1cnJDaHVua0lkKHBhcmVudENodW5rSWQpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IG9uU2F2ZU5ld0NoaWxkQ2h1bmsgPSB1c2VDYWxsYmFjaygobmV3Q2hpbGRDaHVuaz86IENoaWxkQ2h1bmtEZXRhaWwpID0+IHtcbiAgICBpZiAocGFyZW50TW9kZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgIGZvciAoY29uc3Qgc2VnIG9mIHNlZ21lbnRzKSB7XG4gICAgICAgIGlmIChzZWcuaWQgPT09IGN1cnJDaHVua0lkKVxuICAgICAgICAgIHNlZy5jaGlsZF9jaHVua3M/LnB1c2gobmV3Q2hpbGRDaHVuayEpXG4gICAgICB9XG4gICAgICBzZXRTZWdtZW50cyhbLi4uc2VnbWVudHNdKVxuICAgICAgcmVmcmVzaENodW5rTGlzdERhdGFXaXRoRGV0YWlsQ2hhbmdlZCgpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmVzZXRDaGlsZExpc3QoKVxuICAgIH1cbiAgfSwgW3BhcmVudE1vZGUsIGN1cnJDaHVua0lkLCBzZWdtZW50cywgcmVmcmVzaENodW5rTGlzdERhdGFXaXRoRGV0YWlsQ2hhbmdlZCwgcmVzZXRDaGlsZExpc3RdKVxuXG4gIGNvbnN0IHZpZXdOZXdseUFkZGVkQ2hpbGRDaHVuayA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB0b3RhbFBhZ2VzID0gY2hpbGRDaHVua0xpc3REYXRhPy50b3RhbF9wYWdlcyB8fCAwXG4gICAgY29uc3QgdG90YWwgPSBjaGlsZENodW5rTGlzdERhdGE/LnRvdGFsIHx8IDBcbiAgICBjb25zdCBuZXdQYWdlID0gTWF0aC5jZWlsKCh0b3RhbCArIDEpIC8gbGltaXQpXG4gICAgbmVlZFNjcm9sbFRvQm90dG9tLmN1cnJlbnQgPSB0cnVlXG4gICAgaWYgKG5ld1BhZ2UgPiB0b3RhbFBhZ2VzKSB7XG4gICAgICBzZXRDdXJyZW50UGFnZSh0b3RhbFBhZ2VzICsgMSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXNldENoaWxkTGlzdCgpXG4gICAgICBpZiAoY3VycmVudFBhZ2UgIT09IHRvdGFsUGFnZXMpXG4gICAgICAgIHNldEN1cnJlbnRQYWdlKHRvdGFsUGFnZXMpXG4gICAgfVxuICB9LCBbY2hpbGRDaHVua0xpc3REYXRhLCBsaW1pdCwgY3VycmVudFBhZ2UsIHJlc2V0Q2hpbGRMaXN0XSlcblxuICBjb25zdCBvbkNsaWNrU2xpY2UgPSB1c2VDYWxsYmFjaygoZGV0YWlsOiBDaGlsZENodW5rRGV0YWlsKSA9PiB7XG4gICAgc2V0Q3VyckNoaWxkQ2h1bmsoeyBjaGlsZENodW5rSW5mbzogZGV0YWlsLCBzaG93TW9kYWw6IHRydWUgfSlcbiAgICBzZXRDdXJyQ2h1bmtJZChkZXRhaWwuc2VnbWVudF9pZClcbiAgfSwgW10pXG5cbiAgY29uc3Qgb25DbG9zZUNoaWxkU2VnbWVudERldGFpbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRDdXJyQ2hpbGRDaHVuayh7IHNob3dNb2RhbDogZmFsc2UgfSlcbiAgICBzZXRGdWxsU2NyZWVuKGZhbHNlKVxuICB9LCBbXSlcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiB1cGRhdGVDaGlsZFNlZ21lbnQgfSA9IHVzZVVwZGF0ZUNoaWxkU2VnbWVudCgpXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlQ2hpbGRDaHVuayA9IHVzZUNhbGxiYWNrKGFzeW5jIChcbiAgICBzZWdtZW50SWQ6IHN0cmluZyxcbiAgICBjaGlsZENodW5rSWQ6IHN0cmluZyxcbiAgICBjb250ZW50OiBzdHJpbmcsXG4gICkgPT4ge1xuICAgIGNvbnN0IHBhcmFtczogU2VnbWVudFVwZGF0ZXIgPSB7IGNvbnRlbnQ6ICcnIH1cbiAgICBpZiAoIWNvbnRlbnQudHJpbSgpKVxuICAgICAgcmV0dXJuIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3NlZ21lbnQuY29udGVudEVtcHR5JywgeyBuczogJ2RhdGFzZXREb2N1bWVudHMnIH0pIH0pXG5cbiAgICBwYXJhbXMuY29udGVudCA9IGNvbnRlbnRcblxuICAgIGV2ZW50RW1pdHRlcj8uZW1pdCgndXBkYXRlLWNoaWxkLXNlZ21lbnQnKVxuICAgIGF3YWl0IHVwZGF0ZUNoaWxkU2VnbWVudCh7IGRhdGFzZXRJZCwgZG9jdW1lbnRJZCwgc2VnbWVudElkLCBjaGlsZENodW5rSWQsIGJvZHk6IHBhcmFtcyB9LCB7XG4gICAgICBvblN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgICBvbkNsb3NlQ2hpbGRTZWdtZW50RGV0YWlsKClcbiAgICAgICAgaWYgKHBhcmVudE1vZGUgPT09ICdwYXJhZ3JhcGgnKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBzZWcgb2Ygc2VnbWVudHMpIHtcbiAgICAgICAgICAgIGlmIChzZWcuaWQgPT09IHNlZ21lbnRJZCkge1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkU2VnIG9mIHNlZy5jaGlsZF9jaHVua3MhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkU2VnLmlkID09PSBjaGlsZENodW5rSWQpIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkU2VnLmNvbnRlbnQgPSByZXMuZGF0YS5jb250ZW50XG4gICAgICAgICAgICAgICAgICBjaGlsZFNlZy50eXBlID0gcmVzLmRhdGEudHlwZVxuICAgICAgICAgICAgICAgICAgY2hpbGRTZWcud29yZF9jb3VudCA9IHJlcy5kYXRhLndvcmRfY291bnRcbiAgICAgICAgICAgICAgICAgIGNoaWxkU2VnLnVwZGF0ZWRfYXQgPSByZXMuZGF0YS51cGRhdGVkX2F0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldFNlZ21lbnRzKFsuLi5zZWdtZW50c10pXG4gICAgICAgICAgcmVmcmVzaENodW5rTGlzdERhdGFXaXRoRGV0YWlsQ2hhbmdlZCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzZXRDaGlsZExpc3QoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25TZXR0bGVkOiAoKSA9PiB7XG4gICAgICAgIGV2ZW50RW1pdHRlcj8uZW1pdCgndXBkYXRlLWNoaWxkLXNlZ21lbnQtZG9uZScpXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtzZWdtZW50cywgZGF0YXNldElkLCBkb2N1bWVudElkLCBwYXJlbnRNb2RlLCB1cGRhdGVDaGlsZFNlZ21lbnQsIG5vdGlmeSwgZXZlbnRFbWl0dGVyLCBvbkNsb3NlQ2hpbGRTZWdtZW50RGV0YWlsLCByZWZyZXNoQ2h1bmtMaXN0RGF0YVdpdGhEZXRhaWxDaGFuZ2VkLCByZXNldENoaWxkTGlzdCwgdF0pXG5cbiAgY29uc3Qgb25DbGVhckZpbHRlciA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRJbnB1dFZhbHVlKCcnKVxuICAgIHNldFNlYXJjaFZhbHVlKCcnKVxuICAgIHNldFNlbGVjdGVkU3RhdHVzKCdhbGwnKVxuICAgIHNldEN1cnJlbnRQYWdlKDEpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IHNlbGVjdERlZmF1bHRWYWx1ZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChzZWxlY3RlZFN0YXR1cyA9PT0gJ2FsbCcpXG4gICAgICByZXR1cm4gJ2FsbCdcbiAgICByZXR1cm4gc2VsZWN0ZWRTdGF0dXMgPyAxIDogMFxuICB9LCBbc2VsZWN0ZWRTdGF0dXNdKVxuXG4gIHJldHVybiAoXG4gICAgPFNlZ21lbnRMaXN0Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17e1xuICAgICAgaXNDb2xsYXBzZWQsXG4gICAgICBmdWxsU2NyZWVuLFxuICAgICAgdG9nZ2xlRnVsbFNjcmVlbixcbiAgICAgIGN1cnJTZWdtZW50LFxuICAgICAgY3VyckNoaWxkQ2h1bmssXG4gICAgfX1cbiAgICA+XG4gICAgICB7LyogTWVudSBCYXIgKi99XG4gICAgICB7IWlzRnVsbERvY01vZGUgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17cy5kb2NTZWFyY2hXcmFwcGVyfT5cbiAgICAgICAgICA8Q2hlY2tib3hcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wXCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzQWxsU2VsZWN0ZWR9XG4gICAgICAgICAgICBpbmRldGVybWluYXRlPXshaXNBbGxTZWxlY3RlZCAmJiBpc1NvbWVTZWxlY3RlZH1cbiAgICAgICAgICAgIG9uQ2hlY2s9e29uU2VsZWN0ZWRBbGx9XG4gICAgICAgICAgICBkaXNhYmxlZD17aXNMb2FkaW5nU2VnbWVudExpc3R9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZC11cHBlcmNhc2UgZmxleC0xIHBsLTUgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0b3RhbFRleHR9PC9kaXY+XG4gICAgICAgICAgPFNpbXBsZVNlbGVjdFxuICAgICAgICAgICAgb25TZWxlY3Q9e29uQ2hhbmdlU3RhdHVzfVxuICAgICAgICAgICAgaXRlbXM9e3N0YXR1c0xpc3QuY3VycmVudH1cbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17c2VsZWN0RGVmYXVsdFZhbHVlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtzLnNlbGVjdH1cbiAgICAgICAgICAgIHdyYXBwZXJDbGFzc05hbWU9XCJoLWZpdCBtci0yXCJcbiAgICAgICAgICAgIG9wdGlvbldyYXBDbGFzc05hbWU9XCJ3LVsxNjBweF1cIlxuICAgICAgICAgICAgb3B0aW9uQ2xhc3NOYW1lPVwicC0wXCJcbiAgICAgICAgICAgIHJlbmRlck9wdGlvbj17KHsgaXRlbSwgc2VsZWN0ZWQgfSkgPT4gPFN0YXR1c0l0ZW0gaXRlbT17aXRlbX0gc2VsZWN0ZWQ9e3NlbGVjdGVkfSAvPn1cbiAgICAgICAgICAgIG5vdENsZWFyYWJsZVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICBzaG93TGVmdEljb25cbiAgICAgICAgICAgIHNob3dDbGVhckljb25cbiAgICAgICAgICAgIHdyYXBwZXJDbGFzc05hbWU9XCIhdy01MlwiXG4gICAgICAgICAgICB2YWx1ZT17aW5wdXRWYWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGhhbmRsZUlucHV0Q2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIG9uQ2xlYXI9eygpID0+IGhhbmRsZUlucHV0Q2hhbmdlKCcnKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxEaXZpZGVyIHR5cGU9XCJ2ZXJ0aWNhbFwiIGNsYXNzTmFtZT1cIm14LTMgaC0zLjVcIiAvPlxuICAgICAgICAgIDxEaXNwbGF5VG9nZ2xlIGlzQ29sbGFwc2VkPXtpc0NvbGxhcHNlZH0gdG9nZ2xlQ29sbGFwc2VkPXsoKSA9PiBzZXRJc0NvbGxhcHNlZCghaXNDb2xsYXBzZWQpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7LyogU2VnbWVudCBsaXN0ICovfVxuICAgICAge1xuICAgICAgICBpc0Z1bGxEb2NNb2RlXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAnZmxleCBncm93IGZsZXgtY29sIG92ZXJmbG93LXgtaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAoaXNMb2FkaW5nU2VnbWVudExpc3QgfHwgaXNMb2FkaW5nQ2hpbGRTZWdtZW50TGlzdCkgPyAnb3ZlcmZsb3cteS1oaWRkZW4nIDogJ292ZXJmbG93LXktYXV0bycsXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8U2VnbWVudENhcmRcbiAgICAgICAgICAgICAgICAgIGRldGFpbD17c2VnbWVudHNbMF19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrQ2FyZChzZWdtZW50c1swXSl9XG4gICAgICAgICAgICAgICAgICBsb2FkaW5nPXtpc0xvYWRpbmdTZWdtZW50TGlzdH1cbiAgICAgICAgICAgICAgICAgIGZvY3VzZWQ9e3tcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudEluZGV4OiBjdXJyU2VnbWVudD8uc2VnSW5mbz8uaWQgPT09IHNlZ21lbnRzWzBdPy5pZCxcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudENvbnRlbnQ6IGN1cnJTZWdtZW50Py5zZWdJbmZvPy5pZCA9PT0gc2VnbWVudHNbMF0/LmlkLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxDaGlsZFNlZ21lbnRMaXN0XG4gICAgICAgICAgICAgICAgICBwYXJlbnRDaHVua0lkPXtzZWdtZW50c1swXT8uaWR9XG4gICAgICAgICAgICAgICAgICBvbkRlbGV0ZT17b25EZWxldGVDaGlsZENodW5rfVxuICAgICAgICAgICAgICAgICAgY2hpbGRDaHVua3M9e2NoaWxkU2VnbWVudHN9XG4gICAgICAgICAgICAgICAgICBoYW5kbGVJbnB1dENoYW5nZT17aGFuZGxlSW5wdXRDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBoYW5kbGVBZGROZXdDaGlsZENodW5rPXtoYW5kbGVBZGROZXdDaGlsZENodW5rfVxuICAgICAgICAgICAgICAgICAgb25DbGlja1NsaWNlPXtvbkNsaWNrU2xpY2V9XG4gICAgICAgICAgICAgICAgICBlbmFibGVkPXshYXJjaGl2ZWR9XG4gICAgICAgICAgICAgICAgICB0b3RhbD17Y2hpbGRDaHVua0xpc3REYXRhPy50b3RhbCB8fCAwfVxuICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZT17aW5wdXRWYWx1ZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xlYXJGaWx0ZXI9e29uQ2xlYXJGaWx0ZXJ9XG4gICAgICAgICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ1NlZ21lbnRMaXN0IHx8IGlzTG9hZGluZ0NoaWxkU2VnbWVudExpc3R9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIDxTZWdtZW50TGlzdFxuICAgICAgICAgICAgICAgIHJlZj17c2VnbWVudExpc3RSZWZ9XG4gICAgICAgICAgICAgICAgZW1iZWRkaW5nQXZhaWxhYmxlPXtlbWJlZGRpbmdBdmFpbGFibGV9XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nPXtpc0xvYWRpbmdTZWdtZW50TGlzdH1cbiAgICAgICAgICAgICAgICBpdGVtcz17c2VnbWVudHN9XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTZWdtZW50SWRzPXtzZWxlY3RlZFNlZ21lbnRJZHN9XG4gICAgICAgICAgICAgICAgb25TZWxlY3RlZD17b25TZWxlY3RlZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZVN3aXRjaD17b25DaGFuZ2VTd2l0Y2h9XG4gICAgICAgICAgICAgICAgb25EZWxldGU9e29uRGVsZXRlfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xpY2tDYXJkfVxuICAgICAgICAgICAgICAgIGFyY2hpdmVkPXthcmNoaXZlZH1cbiAgICAgICAgICAgICAgICBvbkRlbGV0ZUNoaWxkQ2h1bms9e29uRGVsZXRlQ2hpbGRDaHVua31cbiAgICAgICAgICAgICAgICBoYW5kbGVBZGROZXdDaGlsZENodW5rPXtoYW5kbGVBZGROZXdDaGlsZENodW5rfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2tTbGljZT17b25DbGlja1NsaWNlfVxuICAgICAgICAgICAgICAgIG9uQ2xlYXJGaWx0ZXI9e29uQ2xlYXJGaWx0ZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApXG4gICAgICB9XG4gICAgICB7LyogUGFnaW5hdGlvbiAqL31cbiAgICAgIDxEaXZpZGVyIHR5cGU9XCJob3Jpem9udGFsXCIgY2xhc3NOYW1lPVwibXgtNiBteS0wIGgtcHggdy1hdXRvIGJnLWRpdmlkZXItc3VidGxlXCIgLz5cbiAgICAgIDxQYWdpbmF0aW9uXG4gICAgICAgIGN1cnJlbnQ9e2N1cnJlbnRQYWdlIC0gMX1cbiAgICAgICAgb25DaGFuZ2U9e2N1ciA9PiBzZXRDdXJyZW50UGFnZShjdXIgKyAxKX1cbiAgICAgICAgdG90YWw9eyhpc0Z1bGxEb2NNb2RlID8gY2hpbGRDaHVua0xpc3REYXRhPy50b3RhbCA6IHNlZ21lbnRMaXN0RGF0YT8udG90YWwpIHx8IDB9XG4gICAgICAgIGxpbWl0PXtsaW1pdH1cbiAgICAgICAgb25MaW1pdENoYW5nZT17bGltaXQgPT4gc2V0TGltaXQobGltaXQpfVxuICAgICAgICBjbGFzc05hbWU9e2lzRnVsbERvY01vZGUgPyAncHgtMycgOiAnJ31cbiAgICAgIC8+XG4gICAgICB7LyogRWRpdCBvciB2aWV3IHNlZ21lbnQgZGV0YWlsICovfVxuICAgICAgPEZ1bGxTY3JlZW5EcmF3ZXJcbiAgICAgICAgaXNPcGVuPXtjdXJyU2VnbWVudC5zaG93TW9kYWx9XG4gICAgICAgIGZ1bGxTY3JlZW49e2Z1bGxTY3JlZW59XG4gICAgICAgIG9uQ2xvc2U9e29uQ2xvc2VTZWdtZW50RGV0YWlsfVxuICAgICAgICBzaG93T3ZlcmxheT17ZmFsc2V9XG4gICAgICAgIG5lZWRDaGVja0NodW5rc1xuICAgICAgICBtb2RhbD17aXNSZWdlbmVyYXRpb25Nb2RhbE9wZW59XG4gICAgICA+XG4gICAgICAgIDxTZWdtZW50RGV0YWlsXG4gICAgICAgICAga2V5PXtjdXJyU2VnbWVudC5zZWdJbmZvPy5pZH1cbiAgICAgICAgICBzZWdJbmZvPXtjdXJyU2VnbWVudC5zZWdJbmZvID8/IHsgaWQ6ICcnIH19XG4gICAgICAgICAgZG9jRm9ybT17ZG9jRm9ybX1cbiAgICAgICAgICBpc0VkaXRNb2RlPXtjdXJyU2VnbWVudC5pc0VkaXRNb2RlfVxuICAgICAgICAgIG9uVXBkYXRlPXtoYW5kbGVVcGRhdGVTZWdtZW50fVxuICAgICAgICAgIG9uQ2FuY2VsPXtvbkNsb3NlU2VnbWVudERldGFpbH1cbiAgICAgICAgICBvbk1vZGFsU3RhdGVDaGFuZ2U9e3NldElzUmVnZW5lcmF0aW9uTW9kYWxPcGVufVxuICAgICAgICAvPlxuICAgICAgPC9GdWxsU2NyZWVuRHJhd2VyPlxuICAgICAgey8qIENyZWF0ZSBOZXcgU2VnbWVudCAqL31cbiAgICAgIDxGdWxsU2NyZWVuRHJhd2VyXG4gICAgICAgIGlzT3Blbj17c2hvd05ld1NlZ21lbnRNb2RhbH1cbiAgICAgICAgZnVsbFNjcmVlbj17ZnVsbFNjcmVlbn1cbiAgICAgICAgb25DbG9zZT17b25DbG9zZU5ld1NlZ21lbnRNb2RhbH1cbiAgICAgICAgbW9kYWxcbiAgICAgID5cbiAgICAgICAgPE5ld1NlZ21lbnRcbiAgICAgICAgICBkb2NGb3JtPXtkb2NGb3JtfVxuICAgICAgICAgIG9uQ2FuY2VsPXtvbkNsb3NlTmV3U2VnbWVudE1vZGFsfVxuICAgICAgICAgIG9uU2F2ZT17cmVzZXRMaXN0fVxuICAgICAgICAgIHZpZXdOZXdseUFkZGVkQ2h1bms9e3ZpZXdOZXdseUFkZGVkQ2h1bmt9XG4gICAgICAgIC8+XG4gICAgICA8L0Z1bGxTY3JlZW5EcmF3ZXI+XG4gICAgICB7LyogRWRpdCBvciB2aWV3IGNoaWxkIHNlZ21lbnQgZGV0YWlsICovfVxuICAgICAgPEZ1bGxTY3JlZW5EcmF3ZXJcbiAgICAgICAgaXNPcGVuPXtjdXJyQ2hpbGRDaHVuay5zaG93TW9kYWx9XG4gICAgICAgIGZ1bGxTY3JlZW49e2Z1bGxTY3JlZW59XG4gICAgICAgIG9uQ2xvc2U9e29uQ2xvc2VDaGlsZFNlZ21lbnREZXRhaWx9XG4gICAgICAgIHNob3dPdmVybGF5PXtmYWxzZX1cbiAgICAgICAgbmVlZENoZWNrQ2h1bmtzXG4gICAgICA+XG4gICAgICAgIDxDaGlsZFNlZ21lbnREZXRhaWxcbiAgICAgICAgICBrZXk9e2N1cnJDaGlsZENodW5rLmNoaWxkQ2h1bmtJbmZvPy5pZH1cbiAgICAgICAgICBjaHVua0lkPXtjdXJyQ2h1bmtJZH1cbiAgICAgICAgICBjaGlsZENodW5rSW5mbz17Y3VyckNoaWxkQ2h1bmsuY2hpbGRDaHVua0luZm8gPz8geyBpZDogJycgfX1cbiAgICAgICAgICBkb2NGb3JtPXtkb2NGb3JtfVxuICAgICAgICAgIG9uVXBkYXRlPXtoYW5kbGVVcGRhdGVDaGlsZENodW5rfVxuICAgICAgICAgIG9uQ2FuY2VsPXtvbkNsb3NlQ2hpbGRTZWdtZW50RGV0YWlsfVxuICAgICAgICAvPlxuICAgICAgPC9GdWxsU2NyZWVuRHJhd2VyPlxuICAgICAgey8qIENyZWF0ZSBOZXcgQ2hpbGQgU2VnbWVudCAqL31cbiAgICAgIDxGdWxsU2NyZWVuRHJhd2VyXG4gICAgICAgIGlzT3Blbj17c2hvd05ld0NoaWxkU2VnbWVudE1vZGFsfVxuICAgICAgICBmdWxsU2NyZWVuPXtmdWxsU2NyZWVufVxuICAgICAgICBvbkNsb3NlPXtvbkNsb3NlTmV3Q2hpbGRDaHVua01vZGFsfVxuICAgICAgICBtb2RhbFxuICAgICAgPlxuICAgICAgICA8TmV3Q2hpbGRTZWdtZW50XG4gICAgICAgICAgY2h1bmtJZD17Y3VyckNodW5rSWR9XG4gICAgICAgICAgb25DYW5jZWw9e29uQ2xvc2VOZXdDaGlsZENodW5rTW9kYWx9XG4gICAgICAgICAgb25TYXZlPXtvblNhdmVOZXdDaGlsZENodW5rfVxuICAgICAgICAgIHZpZXdOZXdseUFkZGVkQ2hpbGRDaHVuaz17dmlld05ld2x5QWRkZWRDaGlsZENodW5rfVxuICAgICAgICAvPlxuICAgICAgPC9GdWxsU2NyZWVuRHJhd2VyPlxuICAgICAgey8qIEJhdGNoIEFjdGlvbiBCdXR0b25zICovfVxuICAgICAge3NlbGVjdGVkU2VnbWVudElkcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPEJhdGNoQWN0aW9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTE2IGxlZnQtMCB6LTIwXCJcbiAgICAgICAgICBzZWxlY3RlZElkcz17c2VsZWN0ZWRTZWdtZW50SWRzfVxuICAgICAgICAgIG9uQmF0Y2hFbmFibGU9e29uQ2hhbmdlU3dpdGNoLmJpbmQobnVsbCwgdHJ1ZSwgJycpfVxuICAgICAgICAgIG9uQmF0Y2hEaXNhYmxlPXtvbkNoYW5nZVN3aXRjaC5iaW5kKG51bGwsIGZhbHNlLCAnJyl9XG4gICAgICAgICAgb25CYXRjaERlbGV0ZT17b25EZWxldGUuYmluZChudWxsLCAnJyl9XG4gICAgICAgICAgb25DYW5jZWw9e29uQ2FuY2VsQmF0Y2hPcGVyYXRpb259XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvU2VnbWVudExpc3RDb250ZXh0LlByb3ZpZGVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBsZXRlZFxuIl19