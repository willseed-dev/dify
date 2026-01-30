"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_i18next_1 = require("react-i18next");
const i18n_1 = require("@/context/i18n");
const FailBranchCard = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    return (<div className="px-4 pt-2">
      <div className="rounded-[10px] bg-workflow-process-bg p-4">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[10px] border-[0.5px] border-components-card-border bg-components-card-bg shadow-lg">
          <react_1.RiMindMap className="h-5 w-5 text-text-tertiary"/>
        </div>
        <div className="system-sm-medium mb-1 text-text-secondary">
          {t('nodes.common.errorHandle.failBranch.customize', { ns: 'workflow' })}
        </div>
        <div className="system-xs-regular text-text-tertiary">
          {t('nodes.common.errorHandle.failBranch.customizeTip', { ns: 'workflow' })}
          &nbsp;
          <a href={docLink('/guides/workflow/error-handling/error-type')} target="_blank" className="text-text-accent">
            {t('common.learnMore', { ns: 'workflow' })}
          </a>
        </div>
      </div>
    </div>);
};
exports.default = FailBranchCard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFpbC1icmFuY2gtY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZhaWwtYnJhbmNoLWNhcmQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTRDO0FBQzVDLGlEQUE4QztBQUM5Qyx5Q0FBMkM7QUFFM0MsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFVLEdBQUUsQ0FBQTtJQUU1QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDeEI7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkNBQTJDLENBQ3hEO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJJQUEySSxDQUN4SjtVQUFBLENBQUMsaUJBQVMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQ25EO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkNBQTJDLENBQ3hEO1VBQUEsQ0FBQyxDQUFDLENBQUMsK0NBQStDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDekU7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDbkQ7VUFBQSxDQUFDLENBQUMsQ0FBQyxrREFBa0QsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUMxRTs7VUFDQSxDQUFDLENBQUMsQ0FDQSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUM1RCxNQUFNLENBQUMsUUFBUSxDQUNmLFNBQVMsQ0FBQyxrQkFBa0IsQ0FFNUI7WUFBQSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUM1QztVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJpTWluZE1hcCB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VEb2NMaW5rIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5cbmNvbnN0IEZhaWxCcmFuY2hDYXJkID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZG9jTGluayA9IHVzZURvY0xpbmsoKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHB0LTJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1bMTBweF0gYmctd29ya2Zsb3ctcHJvY2Vzcy1iZyBwLTRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaC04IHctOCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1bMTBweF0gYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtY2FyZC1ib3JkZXIgYmctY29tcG9uZW50cy1jYXJkLWJnIHNoYWRvdy1sZ1wiPlxuICAgICAgICAgIDxSaU1pbmRNYXAgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1iLTEgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIHt0KCdub2Rlcy5jb21tb24uZXJyb3JIYW5kbGUuZmFpbEJyYW5jaC5jdXN0b21pemUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICB7dCgnbm9kZXMuY29tbW9uLmVycm9ySGFuZGxlLmZhaWxCcmFuY2guY3VzdG9taXplVGlwJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICA8YVxuICAgICAgICAgICAgaHJlZj17ZG9jTGluaygnL2d1aWRlcy93b3JrZmxvdy9lcnJvci1oYW5kbGluZy9lcnJvci10eXBlJyl9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC10ZXh0LWFjY2VudFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ2NvbW1vbi5sZWFybk1vcmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBGYWlsQnJhbmNoQ2FyZFxuIl19