"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const _i18n_1 = require("#i18n");
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const atoms_1 = require("../atoms");
const SortDropdown = () => {
    const { t } = (0, _i18n_1.useTranslation)();
    const options = [
        {
            value: 'install_count',
            order: 'DESC',
            text: t('marketplace.sortOption.mostPopular', { ns: 'plugin' }),
        },
        {
            value: 'version_updated_at',
            order: 'DESC',
            text: t('marketplace.sortOption.recentlyUpdated', { ns: 'plugin' }),
        },
        {
            value: 'created_at',
            order: 'DESC',
            text: t('marketplace.sortOption.newlyReleased', { ns: 'plugin' }),
        },
        {
            value: 'created_at',
            order: 'ASC',
            text: t('marketplace.sortOption.firstReleased', { ns: 'plugin' }),
        },
    ];
    const [sort, handleSortChange] = (0, atoms_1.useMarketplaceSort)();
    const [open, setOpen] = (0, react_2.useState)(false);
    const selectedOption = options.find(option => option.value === sort.sortBy && option.order === sort.sortOrder) ?? options[0];
    return (<portal_to_follow_elem_1.PortalToFollowElem placement="bottom-start" offset={{
            mainAxis: 4,
            crossAxis: 0,
        }} open={open} onOpenChange={setOpen}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => setOpen(v => !v)}>
        <div className="flex h-8 cursor-pointer items-center rounded-lg bg-state-base-hover-alt px-2 pr-3">
          <span className="system-sm-regular mr-1 text-text-secondary">
            {t('marketplace.sortBy', { ns: 'plugin' })}
          </span>
          <span className="system-sm-medium mr-1 text-text-primary">
            {selectedOption.text}
          </span>
          <react_1.RiArrowDownSLine className="h-4 w-4 text-text-tertiary"/>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent>
        <div className="rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg backdrop-blur-sm">
          {options.map(option => (<div key={`${option.value}-${option.order}`} className="system-md-regular flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 pr-2 text-text-primary hover:bg-components-panel-on-panel-item-bg-hover" onClick={() => handleSortChange({ sortBy: option.value, sortOrder: option.order })}>
                {option.text}
                {sort.sortBy === option.value && sort.sortOrder === option.order && (<react_1.RiCheckLine className="ml-2 h-4 w-4 text-text-accent"/>)}
              </div>))}
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = SortDropdown;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFDWixpQ0FBc0M7QUFDdEMsNENBR3lCO0FBQ3pCLGlDQUFnQztBQUNoQyx1RkFJb0Q7QUFDcEQsb0NBQTZDO0FBRTdDLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtJQUN4QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSxzQkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUc7UUFDZDtZQUNFLEtBQUssRUFBRSxlQUFlO1lBQ3RCLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztTQUNoRTtRQUNEO1lBQ0UsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixLQUFLLEVBQUUsTUFBTTtZQUNiLElBQUksRUFBRSxDQUFDLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7U0FDcEU7UUFDRDtZQUNFLEtBQUssRUFBRSxZQUFZO1lBQ25CLEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztTQUNsRTtRQUNEO1lBQ0UsS0FBSyxFQUFFLFlBQVk7WUFDbkIsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsQ0FBQyxDQUFDLHNDQUFzQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1NBQ2xFO0tBQ0YsQ0FBQTtJQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxJQUFBLDBCQUFrQixHQUFFLENBQUE7SUFDckQsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFNUgsT0FBTyxDQUNMLENBQUMsMENBQWtCLENBQ2pCLFNBQVMsQ0FBQyxjQUFjLENBQ3hCLE1BQU0sQ0FBQyxDQUFDO1lBQ04sUUFBUSxFQUFFLENBQUM7WUFDWCxTQUFTLEVBQUUsQ0FBQztTQUNiLENBQUMsQ0FDRixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDWCxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FFdEI7TUFBQSxDQUFDLGlEQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDekQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUZBQW1GLENBQ2hHO1VBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDRDQUE0QyxDQUMxRDtZQUFBLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzVDO1VBQUEsRUFBRSxJQUFJLENBQ047VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQ3ZEO1lBQUEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUN0QjtVQUFBLEVBQUUsSUFBSSxDQUNOO1VBQUEsQ0FBQyx3QkFBZ0IsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQzFEO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLGlEQUF5QixDQUMzQjtNQUFBLENBQUMsaURBQXlCLENBQ3hCO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFIQUFxSCxDQUNsSTtVQUFBLENBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQ3BCLENBQUMsR0FBRyxDQUNGLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FDdkMsU0FBUyxDQUFDLGdLQUFnSyxDQUMxSyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUVuRjtnQkFBQSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ1o7Z0JBQUEsQ0FDRSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQ2pFLENBQUMsbUJBQVcsQ0FBQyxTQUFTLENBQUMsK0JBQStCLEVBQUcsQ0FFN0QsQ0FDRjtjQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSCxDQUNGO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLGlEQUF5QixDQUM3QjtJQUFBLEVBQUUsMENBQWtCLENBQUMsQ0FDdEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICcjaTE4bidcbmltcG9ydCB7XG4gIFJpQXJyb3dEb3duU0xpbmUsXG4gIFJpQ2hlY2tMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbSdcbmltcG9ydCB7IHVzZU1hcmtldHBsYWNlU29ydCB9IGZyb20gJy4uL2F0b21zJ1xuXG5jb25zdCBTb3J0RHJvcGRvd24gPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBvcHRpb25zID0gW1xuICAgIHtcbiAgICAgIHZhbHVlOiAnaW5zdGFsbF9jb3VudCcsXG4gICAgICBvcmRlcjogJ0RFU0MnLFxuICAgICAgdGV4dDogdCgnbWFya2V0cGxhY2Uuc29ydE9wdGlvbi5tb3N0UG9wdWxhcicsIHsgbnM6ICdwbHVnaW4nIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAgdmFsdWU6ICd2ZXJzaW9uX3VwZGF0ZWRfYXQnLFxuICAgICAgb3JkZXI6ICdERVNDJyxcbiAgICAgIHRleHQ6IHQoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24ucmVjZW50bHlVcGRhdGVkJywgeyBuczogJ3BsdWdpbicgfSksXG4gICAgfSxcbiAgICB7XG4gICAgICB2YWx1ZTogJ2NyZWF0ZWRfYXQnLFxuICAgICAgb3JkZXI6ICdERVNDJyxcbiAgICAgIHRleHQ6IHQoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24ubmV3bHlSZWxlYXNlZCcsIHsgbnM6ICdwbHVnaW4nIH0pLFxuICAgIH0sXG4gICAge1xuICAgICAgdmFsdWU6ICdjcmVhdGVkX2F0JyxcbiAgICAgIG9yZGVyOiAnQVNDJyxcbiAgICAgIHRleHQ6IHQoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24uZmlyc3RSZWxlYXNlZCcsIHsgbnM6ICdwbHVnaW4nIH0pLFxuICAgIH0sXG4gIF1cbiAgY29uc3QgW3NvcnQsIGhhbmRsZVNvcnRDaGFuZ2VdID0gdXNlTWFya2V0cGxhY2VTb3J0KClcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHNlbGVjdGVkT3B0aW9uID0gb3B0aW9ucy5maW5kKG9wdGlvbiA9PiBvcHRpb24udmFsdWUgPT09IHNvcnQuc29ydEJ5ICYmIG9wdGlvbi5vcmRlciA9PT0gc29ydC5zb3J0T3JkZXIpID8/IG9wdGlvbnNbMF1cblxuICByZXR1cm4gKFxuICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1cbiAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1zdGFydFwiXG4gICAgICBvZmZzZXQ9e3tcbiAgICAgICAgbWFpbkF4aXM6IDQsXG4gICAgICAgIGNyb3NzQXhpczogMCxcbiAgICAgIH19XG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgb25PcGVuQ2hhbmdlPXtzZXRPcGVufVxuICAgID5cbiAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyIG9uQ2xpY2s9eygpID0+IHNldE9wZW4odiA9PiAhdil9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIGJnLXN0YXRlLWJhc2UtaG92ZXItYWx0IHB4LTIgcHItM1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIG1yLTEgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAge3QoJ21hcmtldHBsYWNlLnNvcnRCeScsIHsgbnM6ICdwbHVnaW4nIH0pfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIG1yLTEgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbi50ZXh0fVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8UmlBcnJvd0Rvd25TTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyPlxuICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHAtMSBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1zbVwiPlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wdGlvbnMubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBrZXk9e2Ake29wdGlvbi52YWx1ZX0tJHtvcHRpb24ub3JkZXJ9YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgcHgtMyBwci0yIHRleHQtdGV4dC1wcmltYXJ5IGhvdmVyOmJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZy1ob3ZlclwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlU29ydENoYW5nZSh7IHNvcnRCeTogb3B0aW9uLnZhbHVlLCBzb3J0T3JkZXI6IG9wdGlvbi5vcmRlciB9KX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtvcHRpb24udGV4dH1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzb3J0LnNvcnRCeSA9PT0gb3B0aW9uLnZhbHVlICYmIHNvcnQuc29ydE9yZGVyID09PSBvcHRpb24ub3JkZXIgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8UmlDaGVja0xpbmUgY2xhc3NOYW1lPVwibWwtMiBoLTQgdy00IHRleHQtdGV4dC1hY2NlbnRcIiAvPlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKVxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU29ydERyb3Bkb3duXG4iXX0=