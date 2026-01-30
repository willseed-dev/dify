"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetValidators = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_i18n_1 = require("@/hooks/use-i18n");
const useGetValidators = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const renderI18nObject = (0, use_i18n_1.useRenderI18nObject)();
    const getLabel = (0, react_1.useCallback)((label) => {
        if ((0, react_1.isValidElement)(label))
            return '';
        if (typeof label === 'string')
            return label;
        if (typeof label === 'object' && label !== null)
            return renderI18nObject(label);
    }, []);
    const getValidators = (0, react_1.useCallback)((formSchema) => {
        const { name, validators, required, label, } = formSchema;
        let mergedValidators = validators;
        const memorizedLabel = getLabel(label);
        if (required && !validators) {
            mergedValidators = {
                onMount: ({ value }) => {
                    if (!value)
                        return t('errorMsg.fieldRequired', { ns: 'common', field: memorizedLabel || name });
                },
                onChange: ({ value }) => {
                    if (!value)
                        return t('errorMsg.fieldRequired', { ns: 'common', field: memorizedLabel || name });
                },
                onBlur: ({ value }) => {
                    if (!value)
                        return t('errorMsg.fieldRequired', { ns: 'common', field: memorizedLabel });
                },
            };
        }
        return mergedValidators;
    }, [t, getLabel]);
    return {
        getValidators,
    };
};
exports.useGetValidators = useGetValidators;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdldC12YWxpZGF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWdldC12YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUdjO0FBQ2QsaURBQThDO0FBQzlDLCtDQUFzRDtBQUUvQyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtJQUNuQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLDhCQUFtQixHQUFFLENBQUE7SUFDOUMsTUFBTSxRQUFRLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsS0FBa0QsRUFBRSxFQUFFO1FBQ2xGLElBQUksSUFBQSxzQkFBYyxFQUFDLEtBQUssQ0FBQztZQUN2QixPQUFPLEVBQUUsQ0FBQTtRQUVYLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtZQUMzQixPQUFPLEtBQUssQ0FBQTtRQUVkLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJO1lBQzdDLE9BQU8sZ0JBQWdCLENBQUMsS0FBK0IsQ0FBQyxDQUFBO0lBQzVELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNOLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLFVBQXNCLEVBQUUsRUFBRTtRQUMzRCxNQUFNLEVBQ0osSUFBSSxFQUNKLFVBQVUsRUFDVixRQUFRLEVBQ1IsS0FBSyxHQUNOLEdBQUcsVUFBVSxDQUFBO1FBQ2QsSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUE7UUFDakMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RDLElBQUksUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUIsZ0JBQWdCLEdBQUc7Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFPLEVBQUUsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLEtBQUs7d0JBQ1IsT0FBTyxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxjQUFjLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDdkYsQ0FBQztnQkFDRCxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBTyxFQUFFLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxLQUFLO3dCQUNSLE9BQU8sQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsY0FBYyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUE7Z0JBQ3ZGLENBQUM7Z0JBQ0QsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQU8sRUFBRSxFQUFFO29CQUN6QixJQUFJLENBQUMsS0FBSzt3QkFDUixPQUFPLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUE7Z0JBQy9FLENBQUM7YUFDRixDQUFBO1FBQ0gsQ0FBQztRQUNELE9BQU8sZ0JBQWdCLENBQUE7SUFDekIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFFakIsT0FBTztRQUNMLGFBQWE7S0FDZCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBNUNZLFFBQUEsZ0JBQWdCLG9CQTRDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBGb3JtU2NoZW1hIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQge1xuICBpc1ZhbGlkRWxlbWVudCxcbiAgdXNlQ2FsbGJhY2ssXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlUmVuZGVySTE4bk9iamVjdCB9IGZyb20gJ0AvaG9va3MvdXNlLWkxOG4nXG5cbmV4cG9ydCBjb25zdCB1c2VHZXRWYWxpZGF0b3JzID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgcmVuZGVySTE4bk9iamVjdCA9IHVzZVJlbmRlckkxOG5PYmplY3QoKVxuICBjb25zdCBnZXRMYWJlbCA9IHVzZUNhbGxiYWNrKChsYWJlbDogc3RyaW5nIHwgUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IFJlYWN0Tm9kZSkgPT4ge1xuICAgIGlmIChpc1ZhbGlkRWxlbWVudChsYWJlbCkpXG4gICAgICByZXR1cm4gJydcblxuICAgIGlmICh0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnKVxuICAgICAgcmV0dXJuIGxhYmVsXG5cbiAgICBpZiAodHlwZW9mIGxhYmVsID09PSAnb2JqZWN0JyAmJiBsYWJlbCAhPT0gbnVsbClcbiAgICAgIHJldHVybiByZW5kZXJJMThuT2JqZWN0KGxhYmVsIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4pXG4gIH0sIFtdKVxuICBjb25zdCBnZXRWYWxpZGF0b3JzID0gdXNlQ2FsbGJhY2soKGZvcm1TY2hlbWE6IEZvcm1TY2hlbWEpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBuYW1lLFxuICAgICAgdmFsaWRhdG9ycyxcbiAgICAgIHJlcXVpcmVkLFxuICAgICAgbGFiZWwsXG4gICAgfSA9IGZvcm1TY2hlbWFcbiAgICBsZXQgbWVyZ2VkVmFsaWRhdG9ycyA9IHZhbGlkYXRvcnNcbiAgICBjb25zdCBtZW1vcml6ZWRMYWJlbCA9IGdldExhYmVsKGxhYmVsKVxuICAgIGlmIChyZXF1aXJlZCAmJiAhdmFsaWRhdG9ycykge1xuICAgICAgbWVyZ2VkVmFsaWRhdG9ycyA9IHtcbiAgICAgICAgb25Nb3VudDogKHsgdmFsdWUgfTogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIHJldHVybiB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywgeyBuczogJ2NvbW1vbicsIGZpZWxkOiBtZW1vcml6ZWRMYWJlbCB8fCBuYW1lIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiAoeyB2YWx1ZSB9OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuIHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnY29tbW9uJywgZmllbGQ6IG1lbW9yaXplZExhYmVsIHx8IG5hbWUgfSlcbiAgICAgICAgfSxcbiAgICAgICAgb25CbHVyOiAoeyB2YWx1ZSB9OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuIHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnY29tbW9uJywgZmllbGQ6IG1lbW9yaXplZExhYmVsIH0pXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWRWYWxpZGF0b3JzXG4gIH0sIFt0LCBnZXRMYWJlbF0pXG5cbiAgcmV0dXJuIHtcbiAgICBnZXRWYWxpZGF0b3JzLFxuICB9XG59XG4iXX0=