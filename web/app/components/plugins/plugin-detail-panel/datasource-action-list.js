"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const utils_1 = require("@/app/components/workflow/block-selector/utils");
const use_pipeline_1 = require("@/service/use-pipeline");
const ActionList = ({ detail, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    // const { isCurrentWorkspaceManager } = useAppContext()
    // const providerBriefInfo = detail.declaration.datasource?.identity
    // const providerKey = `${detail.plugin_id}/${providerBriefInfo?.name}`
    const { data: dataSourceList } = (0, use_pipeline_1.useDataSourceList)(true);
    const provider = (0, react_1.useMemo)(() => {
        const result = dataSourceList?.find(collection => collection.plugin_id === detail.plugin_id);
        if (result)
            return (0, utils_1.transformDataSourceToTool)(result);
    }, [detail.plugin_id, dataSourceList]);
    const data = [];
    // const { data } = useBuiltinTools(providerKey)
    // const [showSettingAuth, setShowSettingAuth] = useState(false)
    // const handleCredentialSettingUpdate = () => {
    //   Toast.notify({
    //     type: 'success',
    //     message: t('common.api.actionSuccess'),
    //   })
    //   setShowSettingAuth(false)
    // }
    // const { mutate: updatePermission, isPending } = useUpdateProviderCredentials({
    //   onSuccess: handleCredentialSettingUpdate,
    // })
    // const { mutate: removePermission } = useRemoveProviderCredentials({
    //   onSuccess: handleCredentialSettingUpdate,
    // })
    if (!data || !provider)
        return null;
    return (<div className="px-4 pb-4 pt-2">
      <div className="mb-1 py-1">
        <div className="system-sm-semibold-uppercase mb-1 flex h-6 items-center justify-between text-text-secondary">
          {t('detailPanel.actionNum', { ns: 'plugin', num: data.length, action: data.length > 1 ? 'actions' : 'action' })}
          {/* {provider.is_team_authorization && provider.allow_delete && (
          <Button
            variant='secondary'
            size='small'
            onClick={() => setShowSettingAuth(true)}
            disabled={!isCurrentWorkspaceManager}
          >
            <Indicator className='mr-2' color={'green'} />
            {t('tools.auth.authorized')}
          </Button>
        )} */}
        </div>
        {/* {!provider.is_team_authorization && provider.allow_delete && (
          <Button
            variant='primary'
            className='w-full'
            onClick={() => setShowSettingAuth(true)}
            disabled={!isCurrentWorkspaceManager}
          >{t('workflow.nodes.tool.authorize')}</Button>
        )} */}
      </div>
      {/* <div className='flex flex-col gap-2'>
          {data.map(tool => (
            <ToolItem
              key={`${detail.plugin_id}${tool.name}`}
              disabled={false}
              collection={provider}
              tool={tool}
              isBuiltIn={true}
              isModel={false}
            />
          ))}
        </div>
        {showSettingAuth && (
          <ConfigCredential
            collection={provider}
            onCancel={() => setShowSettingAuth(false)}
            onSaved={async value => updatePermission({
              providerName: provider.name,
              credentials: value,
            })}
            onRemove={async () => removePermission(provider.name)}
            isSaving={isPending}
          />
        )} */}
    </div>);
};
exports.default = ActionList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXNvdXJjZS1hY3Rpb24tbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRhdGFzb3VyY2UtYWN0aW9uLWxpc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsK0JBQThCO0FBQzlCLGlDQUErQjtBQUMvQixpREFBOEM7QUFDOUMsMEVBQTBGO0FBQzFGLHlEQUEwRDtBQU0xRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEVBQ2xCLE1BQU0sR0FDQSxFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsd0RBQXdEO0lBQ3hELG9FQUFvRTtJQUNwRSx1RUFBdUU7SUFDdkUsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLGdDQUFpQixFQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hELE1BQU0sUUFBUSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUM1QixNQUFNLE1BQU0sR0FBRyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFNUYsSUFBSSxNQUFNO1lBQ1IsT0FBTyxJQUFBLGlDQUF5QixFQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzVDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUN0QyxNQUFNLElBQUksR0FBUSxFQUFFLENBQUE7SUFDcEIsZ0RBQWdEO0lBRWhELGdFQUFnRTtJQUVoRSxnREFBZ0Q7SUFDaEQsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2Qiw4Q0FBOEM7SUFDOUMsT0FBTztJQUNQLDhCQUE4QjtJQUM5QixJQUFJO0lBRUosaUZBQWlGO0lBQ2pGLDhDQUE4QztJQUM5QyxLQUFLO0lBRUwsc0VBQXNFO0lBQ3RFLDhDQUE4QztJQUM5QyxLQUFLO0lBRUwsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVE7UUFDcEIsT0FBTyxJQUFJLENBQUE7SUFFYixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUM3QjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZGQUE2RixDQUMxRztVQUFBLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FDL0c7VUFBQSxDQUFDOzs7Ozs7Ozs7O2FBVUksQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQzs7Ozs7OzthQU9JLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBdUJJLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuLy8gaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuLy8gaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbi8vIGltcG9ydCBJbmRpY2F0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvaW5kaWNhdG9yJ1xuLy8gaW1wb3J0IFRvb2xJdGVtIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvcHJvdmlkZXIvdG9vbC1pdGVtJ1xuLy8gaW1wb3J0IENvbmZpZ0NyZWRlbnRpYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy9zZXR0aW5nL2J1aWxkLWluL2NvbmZpZy1jcmVkZW50aWFscydcbmltcG9ydCB0eXBlIHsgUGx1Z2luRGV0YWlsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB0cmFuc2Zvcm1EYXRhU291cmNlVG9Ub29sIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci91dGlscydcbmltcG9ydCB7IHVzZURhdGFTb3VyY2VMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1waXBlbGluZSdcblxudHlwZSBQcm9wcyA9IHtcbiAgZGV0YWlsOiBQbHVnaW5EZXRhaWxcbn1cblxuY29uc3QgQWN0aW9uTGlzdCA9ICh7XG4gIGRldGFpbCxcbn06IFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICAvLyBjb25zdCB7IGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIgfSA9IHVzZUFwcENvbnRleHQoKVxuICAvLyBjb25zdCBwcm92aWRlckJyaWVmSW5mbyA9IGRldGFpbC5kZWNsYXJhdGlvbi5kYXRhc291cmNlPy5pZGVudGl0eVxuICAvLyBjb25zdCBwcm92aWRlcktleSA9IGAke2RldGFpbC5wbHVnaW5faWR9LyR7cHJvdmlkZXJCcmllZkluZm8/Lm5hbWV9YFxuICBjb25zdCB7IGRhdGE6IGRhdGFTb3VyY2VMaXN0IH0gPSB1c2VEYXRhU291cmNlTGlzdCh0cnVlKVxuICBjb25zdCBwcm92aWRlciA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGRhdGFTb3VyY2VMaXN0Py5maW5kKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5wbHVnaW5faWQgPT09IGRldGFpbC5wbHVnaW5faWQpXG5cbiAgICBpZiAocmVzdWx0KVxuICAgICAgcmV0dXJuIHRyYW5zZm9ybURhdGFTb3VyY2VUb1Rvb2wocmVzdWx0KVxuICB9LCBbZGV0YWlsLnBsdWdpbl9pZCwgZGF0YVNvdXJjZUxpc3RdKVxuICBjb25zdCBkYXRhOiBhbnkgPSBbXVxuICAvLyBjb25zdCB7IGRhdGEgfSA9IHVzZUJ1aWx0aW5Ub29scyhwcm92aWRlcktleSlcblxuICAvLyBjb25zdCBbc2hvd1NldHRpbmdBdXRoLCBzZXRTaG93U2V0dGluZ0F1dGhdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgLy8gY29uc3QgaGFuZGxlQ3JlZGVudGlhbFNldHRpbmdVcGRhdGUgPSAoKSA9PiB7XG4gIC8vICAgVG9hc3Qubm90aWZ5KHtcbiAgLy8gICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgLy8gICAgIG1lc3NhZ2U6IHQoJ2NvbW1vbi5hcGkuYWN0aW9uU3VjY2VzcycpLFxuICAvLyAgIH0pXG4gIC8vICAgc2V0U2hvd1NldHRpbmdBdXRoKGZhbHNlKVxuICAvLyB9XG5cbiAgLy8gY29uc3QgeyBtdXRhdGU6IHVwZGF0ZVBlcm1pc3Npb24sIGlzUGVuZGluZyB9ID0gdXNlVXBkYXRlUHJvdmlkZXJDcmVkZW50aWFscyh7XG4gIC8vICAgb25TdWNjZXNzOiBoYW5kbGVDcmVkZW50aWFsU2V0dGluZ1VwZGF0ZSxcbiAgLy8gfSlcblxuICAvLyBjb25zdCB7IG11dGF0ZTogcmVtb3ZlUGVybWlzc2lvbiB9ID0gdXNlUmVtb3ZlUHJvdmlkZXJDcmVkZW50aWFscyh7XG4gIC8vICAgb25TdWNjZXNzOiBoYW5kbGVDcmVkZW50aWFsU2V0dGluZ1VwZGF0ZSxcbiAgLy8gfSlcblxuICBpZiAoIWRhdGEgfHwgIXByb3ZpZGVyKVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgcGItNCBwdC0yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTEgcHktMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZC11cHBlcmNhc2UgbWItMSBmbGV4IGgtNiBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICB7dCgnZGV0YWlsUGFuZWwuYWN0aW9uTnVtJywgeyBuczogJ3BsdWdpbicsIG51bTogZGF0YS5sZW5ndGgsIGFjdGlvbjogZGF0YS5sZW5ndGggPiAxID8gJ2FjdGlvbnMnIDogJ2FjdGlvbicgfSl9XG4gICAgICAgICAgey8qIHtwcm92aWRlci5pc190ZWFtX2F1dGhvcml6YXRpb24gJiYgcHJvdmlkZXIuYWxsb3dfZGVsZXRlICYmIChcbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgdmFyaWFudD0nc2Vjb25kYXJ5J1xuICAgICAgICAgICAgICBzaXplPSdzbWFsbCdcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1NldHRpbmdBdXRoKHRydWUpfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXJ9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxJbmRpY2F0b3IgY2xhc3NOYW1lPSdtci0yJyBjb2xvcj17J2dyZWVuJ30gLz5cbiAgICAgICAgICAgICAge3QoJ3Rvb2xzLmF1dGguYXV0aG9yaXplZCcpfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgKX0gKi99XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7LyogeyFwcm92aWRlci5pc190ZWFtX2F1dGhvcml6YXRpb24gJiYgcHJvdmlkZXIuYWxsb3dfZGVsZXRlICYmIChcbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB2YXJpYW50PSdwcmltYXJ5J1xuICAgICAgICAgICAgY2xhc3NOYW1lPSd3LWZ1bGwnXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93U2V0dGluZ0F1dGgodHJ1ZSl9XG4gICAgICAgICAgICBkaXNhYmxlZD17IWlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXJ9XG4gICAgICAgICAgPnt0KCd3b3JrZmxvdy5ub2Rlcy50b29sLmF1dGhvcml6ZScpfTwvQnV0dG9uPlxuICAgICAgICApfSAqL31cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIDxkaXYgY2xhc3NOYW1lPSdmbGV4IGZsZXgtY29sIGdhcC0yJz5cbiAgICAgICAge2RhdGEubWFwKHRvb2wgPT4gKFxuICAgICAgICAgIDxUb29sSXRlbVxuICAgICAgICAgICAga2V5PXtgJHtkZXRhaWwucGx1Z2luX2lkfSR7dG9vbC5uYW1lfWB9XG4gICAgICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gICAgICAgICAgICBjb2xsZWN0aW9uPXtwcm92aWRlcn1cbiAgICAgICAgICAgIHRvb2w9e3Rvb2x9XG4gICAgICAgICAgICBpc0J1aWx0SW49e3RydWV9XG4gICAgICAgICAgICBpc01vZGVsPXtmYWxzZX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICAge3Nob3dTZXR0aW5nQXV0aCAmJiAoXG4gICAgICAgIDxDb25maWdDcmVkZW50aWFsXG4gICAgICAgICAgY29sbGVjdGlvbj17cHJvdmlkZXJ9XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldFNob3dTZXR0aW5nQXV0aChmYWxzZSl9XG4gICAgICAgICAgb25TYXZlZD17YXN5bmMgdmFsdWUgPT4gdXBkYXRlUGVybWlzc2lvbih7XG4gICAgICAgICAgICBwcm92aWRlck5hbWU6IHByb3ZpZGVyLm5hbWUsXG4gICAgICAgICAgICBjcmVkZW50aWFsczogdmFsdWUsXG4gICAgICAgICAgfSl9XG4gICAgICAgICAgb25SZW1vdmU9e2FzeW5jICgpID0+IHJlbW92ZVBlcm1pc3Npb24ocHJvdmlkZXIubmFtZSl9XG4gICAgICAgICAgaXNTYXZpbmc9e2lzUGVuZGluZ31cbiAgICAgICAgLz5cbiAgICAgICl9ICovfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbkxpc3RcbiJdfQ==