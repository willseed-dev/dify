"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeAction = void 0;
const datasets_1 = require("@/service/datasets");
const classnames_1 = require("@/utils/classnames");
const files_1 = require("../../base/icons/src/vender/solid/files");
const EXTERNAL_PROVIDER = 'external';
const isExternalProvider = (provider) => provider === EXTERNAL_PROVIDER;
const parser = (datasets) => {
    return datasets.map((dataset) => {
        const path = isExternalProvider(dataset.provider) ? `/datasets/${dataset.id}/hitTesting` : `/datasets/${dataset.id}/documents`;
        return {
            id: dataset.id,
            title: dataset.name,
            description: dataset.description,
            type: 'knowledge',
            path,
            icon: (<div className={(0, classnames_1.cn)('flex shrink-0 items-center justify-center rounded-md border-[0.5px] border-[#E0EAFF] bg-[#F5F8FF] p-2.5', !dataset.embedding_available && 'opacity-50 hover:opacity-100')}>
          <files_1.Folder className="h-5 w-5 text-[#444CE7]"/>
        </div>),
            data: dataset,
        };
    });
};
exports.knowledgeAction = {
    key: '@knowledge',
    shortcut: '@kb',
    title: 'Search Knowledge Bases',
    description: 'Search and navigate to your knowledge bases',
    // action,
    search: async (_, searchTerm = '', _locale) => {
        try {
            const response = await (0, datasets_1.fetchDatasets)({
                url: '/datasets',
                params: {
                    page: 1,
                    limit: 10,
                    keyword: searchTerm,
                },
            });
            const datasets = response?.data || [];
            return parser(datasets);
        }
        catch (error) {
            console.warn('Knowledge search failed:', error);
            return [];
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vd2xlZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia25vd2xlZGdlLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpREFBa0Q7QUFDbEQsbURBQXVDO0FBQ3ZDLG1FQUFnRTtBQUVoRSxNQUFNLGlCQUFpQixHQUFHLFVBQW1CLENBQUE7QUFDN0MsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFFBQWdCLEVBQVcsRUFBRSxDQUFDLFFBQVEsS0FBSyxpQkFBaUIsQ0FBQTtBQUV4RixNQUFNLE1BQU0sR0FBRyxDQUFDLFFBQW1CLEVBQTJCLEVBQUU7SUFDOUQsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLE9BQU8sQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxPQUFPLENBQUMsRUFBRSxZQUFZLENBQUE7UUFDOUgsT0FBTztZQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNkLEtBQUssRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNuQixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDaEMsSUFBSSxFQUFFLFdBQW9CO1lBQzFCLElBQUk7WUFDSixJQUFJLEVBQUUsQ0FDSixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFDaEIseUdBQXlHLEVBQ3pHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixJQUFJLDhCQUE4QixDQUMvRCxDQUFDLENBRUE7VUFBQSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQzVDO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtZQUNELElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRVksUUFBQSxlQUFlLEdBQWU7SUFDekMsR0FBRyxFQUFFLFlBQVk7SUFDakIsUUFBUSxFQUFFLEtBQUs7SUFDZixLQUFLLEVBQUUsd0JBQXdCO0lBQy9CLFdBQVcsRUFBRSw2Q0FBNkM7SUFDMUQsVUFBVTtJQUNWLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFDNUMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHdCQUFhLEVBQUM7Z0JBQ25DLEdBQUcsRUFBRSxXQUFXO2dCQUNoQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLENBQUM7b0JBQ1AsS0FBSyxFQUFFLEVBQUU7b0JBQ1QsT0FBTyxFQUFFLFVBQVU7aUJBQ3BCO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxRQUFRLEdBQUcsUUFBUSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUE7WUFDckMsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekIsQ0FBQztRQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQy9DLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQztJQUNILENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBY3Rpb25JdGVtLCBLbm93bGVkZ2VTZWFyY2hSZXN1bHQgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmZXRjaERhdGFzZXRzIH0gZnJvbSAnQC9zZXJ2aWNlL2RhdGFzZXRzJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyBGb2xkZXIgfSBmcm9tICcuLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvc29saWQvZmlsZXMnXG5cbmNvbnN0IEVYVEVSTkFMX1BST1ZJREVSID0gJ2V4dGVybmFsJyBhcyBjb25zdFxuY29uc3QgaXNFeHRlcm5hbFByb3ZpZGVyID0gKHByb3ZpZGVyOiBzdHJpbmcpOiBib29sZWFuID0+IHByb3ZpZGVyID09PSBFWFRFUk5BTF9QUk9WSURFUlxuXG5jb25zdCBwYXJzZXIgPSAoZGF0YXNldHM6IERhdGFTZXRbXSk6IEtub3dsZWRnZVNlYXJjaFJlc3VsdFtdID0+IHtcbiAgcmV0dXJuIGRhdGFzZXRzLm1hcCgoZGF0YXNldCkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBpc0V4dGVybmFsUHJvdmlkZXIoZGF0YXNldC5wcm92aWRlcikgPyBgL2RhdGFzZXRzLyR7ZGF0YXNldC5pZH0vaGl0VGVzdGluZ2AgOiBgL2RhdGFzZXRzLyR7ZGF0YXNldC5pZH0vZG9jdW1lbnRzYFxuICAgIHJldHVybiB7XG4gICAgICBpZDogZGF0YXNldC5pZCxcbiAgICAgIHRpdGxlOiBkYXRhc2V0Lm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogZGF0YXNldC5kZXNjcmlwdGlvbixcbiAgICAgIHR5cGU6ICdrbm93bGVkZ2UnIGFzIGNvbnN0LFxuICAgICAgcGF0aCxcbiAgICAgIGljb246IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICdmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIGJvcmRlci1bMC41cHhdIGJvcmRlci1bI0UwRUFGRl0gYmctWyNGNUY4RkZdIHAtMi41JyxcbiAgICAgICAgICAhZGF0YXNldC5lbWJlZGRpbmdfYXZhaWxhYmxlICYmICdvcGFjaXR5LTUwIGhvdmVyOm9wYWNpdHktMTAwJyxcbiAgICAgICAgKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxGb2xkZXIgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LVsjNDQ0Q0U3XVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSxcbiAgICAgIGRhdGE6IGRhdGFzZXQsXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgY29uc3Qga25vd2xlZGdlQWN0aW9uOiBBY3Rpb25JdGVtID0ge1xuICBrZXk6ICdAa25vd2xlZGdlJyxcbiAgc2hvcnRjdXQ6ICdAa2InLFxuICB0aXRsZTogJ1NlYXJjaCBLbm93bGVkZ2UgQmFzZXMnLFxuICBkZXNjcmlwdGlvbjogJ1NlYXJjaCBhbmQgbmF2aWdhdGUgdG8geW91ciBrbm93bGVkZ2UgYmFzZXMnLFxuICAvLyBhY3Rpb24sXG4gIHNlYXJjaDogYXN5bmMgKF8sIHNlYXJjaFRlcm0gPSAnJywgX2xvY2FsZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoRGF0YXNldHMoe1xuICAgICAgICB1cmw6ICcvZGF0YXNldHMnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgIGxpbWl0OiAxMCxcbiAgICAgICAgICBrZXl3b3JkOiBzZWFyY2hUZXJtLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IGRhdGFzZXRzID0gcmVzcG9uc2U/LmRhdGEgfHwgW11cbiAgICAgIHJldHVybiBwYXJzZXIoZGF0YXNldHMpXG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS53YXJuKCdLbm93bGVkZ2Ugc2VhcmNoIGZhaWxlZDonLCBlcnJvcilcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgfSxcbn1cbiJdfQ==