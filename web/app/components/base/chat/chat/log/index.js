"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const store_1 = require("@/app/components/app/store");
const action_button_1 = require("@/app/components/base/action-button");
const Log = ({ logItem, }) => {
    const setCurrentLogItem = (0, store_1.useStore)(s => s.setCurrentLogItem);
    const setShowPromptLogModal = (0, store_1.useStore)(s => s.setShowPromptLogModal);
    const setShowAgentLogModal = (0, store_1.useStore)(s => s.setShowAgentLogModal);
    const setShowMessageLogModal = (0, store_1.useStore)(s => s.setShowMessageLogModal);
    const { workflow_run_id: runID, agent_thoughts } = logItem;
    const isAgent = agent_thoughts && agent_thoughts.length > 0;
    return (<div className="ml-1 flex items-center gap-0.5 rounded-[10px] border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 shadow-md backdrop-blur-sm" onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setCurrentLogItem(logItem);
            if (runID)
                setShowMessageLogModal(true);
            else if (isAgent)
                setShowAgentLogModal(true);
            else
                setShowPromptLogModal(true);
        }}>
      <action_button_1.default>
        <react_1.RiFileList3Line className="h-4 w-4"/>
      </action_button_1.default>
    </div>);
};
exports.default = Log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FBa0Q7QUFDbEQsc0RBQW9FO0FBQ3BFLHVFQUE4RDtBQUs5RCxNQUFNLEdBQUcsR0FBaUIsQ0FBQyxFQUN6QixPQUFPLEdBQ1IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLGdCQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtJQUMvRCxNQUFNLHFCQUFxQixHQUFHLElBQUEsZ0JBQVcsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBQ3ZFLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxnQkFBVyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDckUsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLGdCQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUN6RSxNQUFNLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsR0FBRyxPQUFPLENBQUE7SUFDMUQsTUFBTSxPQUFPLEdBQUcsY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBRTNELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsNkpBQTZKLENBQ3ZLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDYixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDbkIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO1lBQ3hDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzFCLElBQUksS0FBSztnQkFDUCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDekIsSUFBSSxPQUFPO2dCQUNkLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBOztnQkFFMUIscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBRUY7TUFBQSxDQUFDLHVCQUFZLENBQ1g7UUFBQSxDQUFDLHVCQUFlLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDdEM7TUFBQSxFQUFFLHVCQUFZLENBQ2hCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsR0FBRyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBJQ2hhdEl0ZW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0L3R5cGUnXG5pbXBvcnQgeyBSaUZpbGVMaXN0M0xpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlQXBwU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9zdG9yZSdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5cbnR5cGUgTG9nUHJvcHMgPSB7XG4gIGxvZ0l0ZW06IElDaGF0SXRlbVxufVxuY29uc3QgTG9nOiBGQzxMb2dQcm9wcz4gPSAoe1xuICBsb2dJdGVtLFxufSkgPT4ge1xuICBjb25zdCBzZXRDdXJyZW50TG9nSXRlbSA9IHVzZUFwcFN0b3JlKHMgPT4gcy5zZXRDdXJyZW50TG9nSXRlbSlcbiAgY29uc3Qgc2V0U2hvd1Byb21wdExvZ01vZGFsID0gdXNlQXBwU3RvcmUocyA9PiBzLnNldFNob3dQcm9tcHRMb2dNb2RhbClcbiAgY29uc3Qgc2V0U2hvd0FnZW50TG9nTW9kYWwgPSB1c2VBcHBTdG9yZShzID0+IHMuc2V0U2hvd0FnZW50TG9nTW9kYWwpXG4gIGNvbnN0IHNldFNob3dNZXNzYWdlTG9nTW9kYWwgPSB1c2VBcHBTdG9yZShzID0+IHMuc2V0U2hvd01lc3NhZ2VMb2dNb2RhbClcbiAgY29uc3QgeyB3b3JrZmxvd19ydW5faWQ6IHJ1bklELCBhZ2VudF90aG91Z2h0cyB9ID0gbG9nSXRlbVxuICBjb25zdCBpc0FnZW50ID0gYWdlbnRfdGhvdWdodHMgJiYgYWdlbnRfdGhvdWdodHMubGVuZ3RoID4gMFxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwibWwtMSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMC41IHJvdW5kZWQtWzEwcHhdIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLWFjdGlvbmJhci1ib3JkZXIgYmctY29tcG9uZW50cy1hY3Rpb25iYXItYmcgcC0wLjUgc2hhZG93LW1kIGJhY2tkcm9wLWJsdXItc21cIlxuICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBlLm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICAgIHNldEN1cnJlbnRMb2dJdGVtKGxvZ0l0ZW0pXG4gICAgICAgIGlmIChydW5JRClcbiAgICAgICAgICBzZXRTaG93TWVzc2FnZUxvZ01vZGFsKHRydWUpXG4gICAgICAgIGVsc2UgaWYgKGlzQWdlbnQpXG4gICAgICAgICAgc2V0U2hvd0FnZW50TG9nTW9kYWwodHJ1ZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNldFNob3dQcm9tcHRMb2dNb2RhbCh0cnVlKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8QWN0aW9uQnV0dG9uPlxuICAgICAgICA8UmlGaWxlTGlzdDNMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgPC9BY3Rpb25CdXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9nXG4iXX0=