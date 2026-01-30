"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ahooks_1 = require("ahooks");
const react_1 = require("react");
const keyPrefix = 'gen-data-';
const useGenData = ({ storageKey }) => {
    const [versions, setVersions] = (0, ahooks_1.useSessionStorageState)(`${keyPrefix}${storageKey}-versions`, {
        defaultValue: [],
    });
    const [currentVersionIndex, setCurrentVersionIndex] = (0, ahooks_1.useSessionStorageState)(`${keyPrefix}${storageKey}-version-index`, {
        defaultValue: 0,
    });
    const current = versions?.[currentVersionIndex || 0];
    const addVersion = (0, react_1.useCallback)((version) => {
        setCurrentVersionIndex(() => versions?.length || 0);
        setVersions((prev) => {
            return [...prev, version];
        });
    }, [setVersions, setCurrentVersionIndex, versions?.length]);
    return {
        versions,
        addVersion,
        currentVersionIndex,
        setCurrentVersionIndex,
        current,
    };
};
exports.default = useGenData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdlbi1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWdlbi1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQStDO0FBQy9DLGlDQUFtQztBQUtuQyxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUE7QUFDN0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBVSxFQUFFLEVBQUU7SUFDNUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLCtCQUFzQixFQUFXLEdBQUcsU0FBUyxHQUFHLFVBQVUsV0FBVyxFQUFFO1FBQ3JHLFlBQVksRUFBRSxFQUFFO0tBQ2pCLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQyxHQUFHLElBQUEsK0JBQXNCLEVBQVMsR0FBRyxTQUFTLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRTtRQUM5SCxZQUFZLEVBQUUsQ0FBQztLQUNoQixDQUFDLENBQUE7SUFFRixNQUFNLE9BQU8sR0FBRyxRQUFRLEVBQUUsQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUVwRCxNQUFNLFVBQVUsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxPQUFlLEVBQUUsRUFBRTtRQUNqRCxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ25ELFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLElBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUUzRCxPQUFPO1FBQ0wsUUFBUTtRQUNSLFVBQVU7UUFDVixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLE9BQU87S0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBHZW5SZXMgfSBmcm9tICdAL3NlcnZpY2UvZGVidWcnXG5pbXBvcnQgeyB1c2VTZXNzaW9uU3RvcmFnZVN0YXRlIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcblxudHlwZSBQYXJhbXMgPSB7XG4gIHN0b3JhZ2VLZXk6IHN0cmluZ1xufVxuY29uc3Qga2V5UHJlZml4ID0gJ2dlbi1kYXRhLSdcbmNvbnN0IHVzZUdlbkRhdGEgPSAoeyBzdG9yYWdlS2V5IH06IFBhcmFtcykgPT4ge1xuICBjb25zdCBbdmVyc2lvbnMsIHNldFZlcnNpb25zXSA9IHVzZVNlc3Npb25TdG9yYWdlU3RhdGU8R2VuUmVzW10+KGAke2tleVByZWZpeH0ke3N0b3JhZ2VLZXl9LXZlcnNpb25zYCwge1xuICAgIGRlZmF1bHRWYWx1ZTogW10sXG4gIH0pXG5cbiAgY29uc3QgW2N1cnJlbnRWZXJzaW9uSW5kZXgsIHNldEN1cnJlbnRWZXJzaW9uSW5kZXhdID0gdXNlU2Vzc2lvblN0b3JhZ2VTdGF0ZTxudW1iZXI+KGAke2tleVByZWZpeH0ke3N0b3JhZ2VLZXl9LXZlcnNpb24taW5kZXhgLCB7XG4gICAgZGVmYXVsdFZhbHVlOiAwLFxuICB9KVxuXG4gIGNvbnN0IGN1cnJlbnQgPSB2ZXJzaW9ucz8uW2N1cnJlbnRWZXJzaW9uSW5kZXggfHwgMF1cblxuICBjb25zdCBhZGRWZXJzaW9uID0gdXNlQ2FsbGJhY2soKHZlcnNpb246IEdlblJlcykgPT4ge1xuICAgIHNldEN1cnJlbnRWZXJzaW9uSW5kZXgoKCkgPT4gdmVyc2lvbnM/Lmxlbmd0aCB8fCAwKVxuICAgIHNldFZlcnNpb25zKChwcmV2KSA9PiB7XG4gICAgICByZXR1cm4gWy4uLnByZXYhLCB2ZXJzaW9uXVxuICAgIH0pXG4gIH0sIFtzZXRWZXJzaW9ucywgc2V0Q3VycmVudFZlcnNpb25JbmRleCwgdmVyc2lvbnM/Lmxlbmd0aF0pXG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9ucyxcbiAgICBhZGRWZXJzaW9uLFxuICAgIGN1cnJlbnRWZXJzaW9uSW5kZXgsXG4gICAgc2V0Q3VycmVudFZlcnNpb25JbmRleCxcbiAgICBjdXJyZW50LFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUdlbkRhdGFcbiJdfQ==