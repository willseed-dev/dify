"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomActions = exports.ConditionalVisibility = exports.FieldExplorer = exports.Playground = void 0;
const react_form_1 = require("@tanstack/react-form");
const react_1 = require("react");
const types_1 = require("@/app/components/base/features/types");
const app_1 = require("@/types/app");
const form_story_wrapper_1 = require("../../../../.storybook/utils/form-story-wrapper");
const button_1 = require("../button");
const base_form_1 = require("./components/base/base-form");
const contact_fields_1 = require("./form-scenarios/demo/contact-fields");
const shared_options_1 = require("./form-scenarios/demo/shared-options");
const types_2 = require("./form-scenarios/demo/types");
const types_3 = require("./types");
const FormStoryHost = () => null;
const meta = {
    title: 'Base/Data Entry/AppForm',
    component: FormStoryHost,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Helper utilities built on top of `@tanstack/react-form` that power form rendering across Dify. These stories demonstrate the `useAppForm` hook, field primitives, conditional visibility, and custom actions.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const PlaygroundFormFields = ({ form, status }) => {
    const name = (0, react_form_1.useStore)(form.store, state => state.values.name);
    const contactFormApi = form;
    return (<form className="flex w-full max-w-xl flex-col gap-4" onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
        }}>
      <form.AppField name="name" children={field => (<field.TextField label="Name" placeholder="Start with a capital letter"/>)}/>
      <form.AppField name="surname" children={field => (<field.TextField label="Surname" placeholder="Surname must be at least 3 characters"/>)}/>
      <form.AppField name="isAcceptingTerms" children={field => (<field.CheckboxField label="I accept the terms and conditions"/>)}/>

      {!!name && <contact_fields_1.default form={contactFormApi}/>}

      <form.AppForm>
        <form.Actions />
      </form.AppForm>

      <p className="text-xs text-text-tertiary">{status}</p>
    </form>);
};
const FormPlayground = () => {
    const [status, setStatus] = (0, react_1.useState)('Fill in the form and submit to see results.');
    return (<form_story_wrapper_1.FormStoryWrapper title="Customer onboarding form" subtitle="Validates with zod and conditionally reveals contact preferences." options={{
            ...shared_options_1.demoFormOpts,
            validators: {
                onSubmit: ({ value: formValue }) => {
                    const result = types_2.UserSchema.safeParse(formValue);
                    if (!result.success)
                        return result.error.issues[0].message;
                    return undefined;
                },
            },
            onSubmit: () => {
                setStatus('Successfully saved profile.');
            },
        }}>
      {form => <PlaygroundFormFields form={form} status={status}/>}
    </form_story_wrapper_1.FormStoryWrapper>);
};
const mockFileUploadConfig = {
    enabled: true,
    allowed_file_extensions: ['pdf', 'png'],
    allowed_file_upload_methods: [app_1.TransferMethod.local_file, app_1.TransferMethod.remote_url],
    number_limits: 3,
    preview_config: {
        mode: types_1.PreviewMode.CurrentPage,
        file_type_list: ['pdf', 'png'],
    },
};
const mockFieldDefaults = {
    headline: 'Dify App',
    description: 'Streamline your AI workflows with configurable building blocks.',
    category: 'workbench',
    allowNotifications: true,
    dailyLimit: 40,
    attachment: [],
};
const FieldGallery = () => {
    const selectOptions = (0, react_1.useMemo)(() => [
        { value: 'workbench', label: 'Workbench' },
        { value: 'playground', label: 'Playground' },
        { value: 'production', label: 'Production' },
    ], []);
    return (<form_story_wrapper_1.FormStoryWrapper title="Field gallery" subtitle="Preview the most common field primitives exposed through `form.AppField` helpers." options={{
            defaultValues: mockFieldDefaults,
        }}>
      {form => (<form className="grid w-full max-w-4xl grid-cols-1 gap-4 lg:grid-cols-2" onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}>
          <form.AppField name="headline" children={field => (<field.TextField label="Headline" placeholder="Name your experience"/>)}/>
          <form.AppField name="description" children={field => (<field.TextAreaField label="Description" placeholder="Describe what this configuration does"/>)}/>
          <form.AppField name="category" children={field => (<field.SelectField label="Category" options={selectOptions}/>)}/>
          <form.AppField name="allowNotifications" children={field => (<field.CheckboxField label="Enable usage notifications"/>)}/>
          <form.AppField name="dailyLimit" children={field => (<field.NumberSliderField label="Daily session limit" description="Control the maximum number of runs per user each day." min={10} max={100}/>)}/>
          <form.AppField name="attachment" children={field => (<field.FileUploaderField label="Reference materials" fileConfig={mockFileUploadConfig}/>)}/>
          <div className="lg:col-span-2">
            <form.AppForm>
              <form.Actions />
            </form.AppForm>
          </div>
        </form>)}
    </form_story_wrapper_1.FormStoryWrapper>);
};
const conditionalSchemas = [
    {
        type: types_3.FormTypeEnum.select,
        name: 'channel',
        label: 'Preferred channel',
        required: true,
        default: 'email',
        options: types_2.ContactMethods,
    },
    {
        type: types_3.FormTypeEnum.textInput,
        name: 'contactEmail',
        label: 'Email address',
        required: true,
        placeholder: 'user@example.com',
        show_on: [{ variable: 'channel', value: 'email' }],
    },
    {
        type: types_3.FormTypeEnum.textInput,
        name: 'contactPhone',
        label: 'Phone number',
        required: true,
        placeholder: '+1 555 123 4567',
        show_on: [{ variable: 'channel', value: 'phone' }],
    },
    {
        type: types_3.FormTypeEnum.boolean,
        name: 'optIn',
        label: 'Opt in to marketing messages',
        required: false,
    },
];
const ConditionalFieldsStory = () => {
    const [values, setValues] = (0, react_1.useState)({
        channel: 'email',
        optIn: false,
    });
    return (<div className="flex flex-col gap-6 px-6 md:flex-row md:px-10">
      <div className="flex-1 rounded-xl border border-divider-subtle bg-components-panel-bg p-5 shadow-sm">
        <base_form_1.default formSchemas={conditionalSchemas} defaultValues={values} formClassName="flex flex-col gap-4" onChange={(field, value) => {
            setValues(prev => ({
                ...prev,
                [field]: value,
            }));
        }}/>
      </div>
      <aside className="w-full max-w-sm rounded-xl border border-divider-subtle bg-components-panel-bg p-4 text-xs text-text-secondary shadow-sm">
        <h3 className="text-sm font-semibold text-text-primary">Live values</h3>
        <p className="mb-2 text-[11px] text-text-tertiary">`show_on` rules hide or reveal inputs without losing track of the form state.</p>
        <pre className="max-h-48 overflow-auto rounded-md bg-background-default-subtle p-3 font-mono text-[11px] leading-tight text-text-primary">
          {JSON.stringify(values, null, 2)}
        </pre>
      </aside>
    </div>);
};
const CustomActionsStory = () => {
    return (<form_story_wrapper_1.FormStoryWrapper title="Custom footer actions" subtitle="Override the default submit button to add reset or secondary operations." options={{
            defaultValues: {
                datasetName: 'Support FAQ',
                datasetDescription: 'Knowledge base snippets sourced from Zendesk exports.',
            },
            validators: {
                onChange: ({ value }) => {
                    const nextValues = value;
                    if (!nextValues.datasetName || nextValues.datasetName.length < 3)
                        return 'Dataset name must contain at least 3 characters.';
                    return undefined;
                },
            },
        }}>
      {form => (<form className="flex w-full max-w-xl flex-col gap-4" onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}>
          <form.AppField name="datasetName" children={field => (<field.TextField label="Dataset name" placeholder="Support knowledge base"/>)}/>
          <form.AppField name="datasetDescription" children={field => (<field.TextAreaField label="Description" placeholder="Add a helpful summary for collaborators"/>)}/>
          <form.AppForm>
            <form.Actions CustomActions={({ form: appForm, isSubmitting, canSubmit }) => (<div className="flex items-center gap-2">
                  <button_1.default variant="ghost" onClick={() => appForm.reset()} disabled={isSubmitting}>
                    Reset
                  </button_1.default>
                  <button_1.default variant="tertiary" onClick={() => {
                    appForm.handleSubmit();
                }} disabled={!canSubmit} loading={isSubmitting}>
                    Save draft
                  </button_1.default>
                  <button_1.default variant="primary" onClick={() => appForm.handleSubmit()} disabled={!canSubmit} loading={isSubmitting}>
                    Publish
                  </button_1.default>
                </div>)}/>
          </form.AppForm>
        </form>)}
    </form_story_wrapper_1.FormStoryWrapper>);
};
exports.Playground = {
    render: () => <FormPlayground />,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const form = useAppForm({
  ...demoFormOpts,
  validators: {
    onSubmit: ({ value }) => UserSchema.safeParse(value).success ? undefined : 'Validation failed',
  },
  onSubmit: ({ value }) => {
    setStatus(\`Successfully saved profile for \${value.name}\`)
  },
})

return (
  <form onSubmit={handleSubmit}>
    <form.AppField name="name">
      {field => <field.TextField label="Name" placeholder="Start with a capital letter" />}
    </form.AppField>
    <form.AppField name="surname">
      {field => <field.TextField label="Surname" />}
    </form.AppField>
    <form.AppField name="isAcceptingTerms">
      {field => <field.CheckboxField label="I accept the terms and conditions" />}
    </form.AppField>
    {!!form.store.state.values.name && <ContactFields form={form} />}
    <form.AppForm>
      <form.Actions />
    </form.AppForm>
  </form>
)
        `.trim(),
            },
        },
    },
};
exports.FieldExplorer = {
    render: () => <FieldGallery />,
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/apps/demo-app/form',
                params: { appId: 'demo-app' },
            },
        },
        docs: {
            source: {
                language: 'tsx',
                code: `
const form = useAppForm({
  defaultValues: {
    headline: 'Dify App',
    description: 'Streamline your AI workflows',
    category: 'workbench',
    allowNotifications: true,
    dailyLimit: 40,
    attachment: [],
  },
})

return (
  <form className="grid grid-cols-1 gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
    <form.AppField name="headline">
      {field => <field.TextField label="Headline" />}
    </form.AppField>
    <form.AppField name="description">
      {field => <field.TextAreaField label="Description" />}
    </form.AppField>
    <form.AppField name="category">
      {field => <field.SelectField label="Category" options={selectOptions} />}
    </form.AppField>
    <form.AppField name="allowNotifications">
      {field => <field.CheckboxField label="Enable usage notifications" />}
    </form.AppField>
    <form.AppField name="dailyLimit">
      {field => <field.NumberSliderField label="Daily session limit" min={10} max={100} step={10} />}
    </form.AppField>
    <form.AppField name="attachment">
      {field => <field.FileUploaderField label="Reference materials" fileConfig={mockFileUploadConfig} />}
    </form.AppField>
    <form.AppForm>
      <form.Actions />
    </form.AppForm>
  </form>
)
        `.trim(),
            },
        },
    },
};
exports.ConditionalVisibility = {
    render: () => <ConditionalFieldsStory />,
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates schema-driven visibility using `show_on` conditions rendered through the reusable `BaseForm` component.',
            },
            source: {
                language: 'tsx',
                code: `
const conditionalSchemas: FormSchema[] = [
  { type: FormTypeEnum.select, name: 'channel', label: 'Preferred channel', options: ContactMethods },
  { type: FormTypeEnum.textInput, name: 'contactEmail', label: 'Email', show_on: [{ variable: 'channel', value: 'email' }] },
  { type: FormTypeEnum.textInput, name: 'contactPhone', label: 'Phone', show_on: [{ variable: 'channel', value: 'phone' }] },
  { type: FormTypeEnum.boolean, name: 'optIn', label: 'Opt in to marketing messages' },
]

return (
  <BaseForm
    formSchemas={conditionalSchemas}
    defaultValues={{ channel: 'email', optIn: false }}
    formClassName="flex flex-col gap-4"
    onChange={(field, value) => setValues(prev => ({ ...prev, [field]: value }))}
  />
)
        `.trim(),
            },
        },
    },
};
exports.CustomActions = {
    render: () => <CustomActionsStory />,
    parameters: {
        docs: {
            description: {
                story: 'Shows how to replace the default submit button with a fully custom footer leveraging contextual form state.',
            },
            source: {
                language: 'tsx',
                code: `
const form = useAppForm({
  defaultValues: {
    datasetName: 'Support FAQ',
    datasetDescription: 'Knowledge base snippets sourced from Zendesk exports.',
  },
  validators: {
    onChange: ({ value }) => value.datasetName?.length >= 3 ? undefined : 'Dataset name must contain at least 3 characters.',
  },
})

return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <form.AppField name="datasetName">
      {field => <field.TextField label="Dataset name" />}
    </form.AppField>
    <form.AppField name="datasetDescription">
      {field => <field.TextAreaField label="Description" />}
    </form.AppField>
    <form.AppForm>
      <form.Actions
        CustomActions={({ form: appForm, isSubmitting, canSubmit }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => appForm.reset()} disabled={isSubmitting}>
              Reset
            </Button>
            <Button variant="tertiary" onClick={() => appForm.handleSubmit()} disabled={!canSubmit} loading={isSubmitting}>
              Save draft
            </Button>
            <Button variant="primary" onClick={() => appForm.handleSubmit()} disabled={!canSubmit} loading={isSubmitting}>
              Publish
            </Button>
          </div>
        )}
      />
    </form.AppForm>
  </form>
)
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHFEQUErQztBQUMvQyxpQ0FBeUM7QUFDekMsZ0VBQWtFO0FBQ2xFLHFDQUE0QztBQUM1Qyx3RkFBa0Y7QUFDbEYsc0NBQThCO0FBQzlCLDJEQUFrRDtBQUNsRCx5RUFBZ0U7QUFDaEUseUVBQW1FO0FBQ25FLHVEQUF3RTtBQUN4RSxtQ0FBc0M7QUFFdEMsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFBO0FBRWhDLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHlCQUF5QjtJQUNoQyxTQUFTLEVBQUUsYUFBYTtJQUN4QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsWUFBWTtRQUNwQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLCtNQUErTTthQUMzTjtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDa0IsQ0FBQTtBQUV0QyxrQkFBZSxJQUFJLENBQUE7QUFZbkIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBNkIsRUFBRSxFQUFFO0lBRTNFLE1BQU0sSUFBSSxHQUFHLElBQUEscUJBQVEsRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUUsS0FBSyxDQUFDLE1BQStCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkYsTUFBTSxjQUFjLEdBQUcsSUFBNEIsQ0FBQTtJQUVuRCxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQ0gsU0FBUyxDQUFDLHFDQUFxQyxDQUMvQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUN0QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7WUFDdkIs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QUFFWSxRQUFBLHFCQUFxQixHQUFVO0lBQzFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEFBQUQsRUFBRztJQUN4QyxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsS0FBSyxFQUFFLHNIQUFzSDthQUM5SDtZQUNELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7U0FnQkwsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxhQUFhLEdBQVU7SUFDbEMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQUFBRCxFQUFHO0lBQ3BDLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxLQUFLLEVBQUUsNkdBQTZHO2FBQ3JIO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FzQ0wsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBGb3JtU3RvcnlSZW5kZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uc3Rvcnlib29rL3V0aWxzL2Zvcm0tc3Rvcnktd3JhcHBlcidcbmltcG9ydCB0eXBlIHsgRm9ybVNjaGVtYSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1mb3JtJ1xuaW1wb3J0IHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFByZXZpZXdNb2RlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL3R5cGVzJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IEZvcm1TdG9yeVdyYXBwZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uc3Rvcnlib29rL3V0aWxzL2Zvcm0tc3Rvcnktd3JhcHBlcidcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYnV0dG9uJ1xuaW1wb3J0IEJhc2VGb3JtIGZyb20gJy4vY29tcG9uZW50cy9iYXNlL2Jhc2UtZm9ybSdcbmltcG9ydCBDb250YWN0RmllbGRzIGZyb20gJy4vZm9ybS1zY2VuYXJpb3MvZGVtby9jb250YWN0LWZpZWxkcydcbmltcG9ydCB7IGRlbW9Gb3JtT3B0cyB9IGZyb20gJy4vZm9ybS1zY2VuYXJpb3MvZGVtby9zaGFyZWQtb3B0aW9ucydcbmltcG9ydCB7IENvbnRhY3RNZXRob2RzLCBVc2VyU2NoZW1hIH0gZnJvbSAnLi9mb3JtLXNjZW5hcmlvcy9kZW1vL3R5cGVzJ1xuaW1wb3J0IHsgRm9ybVR5cGVFbnVtIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgRm9ybVN0b3J5SG9zdCA9ICgpID0+IG51bGxcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRW50cnkvQXBwRm9ybScsXG4gIGNvbXBvbmVudDogRm9ybVN0b3J5SG9zdCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0hlbHBlciB1dGlsaXRpZXMgYnVpbHQgb24gdG9wIG9mIGBAdGFuc3RhY2svcmVhY3QtZm9ybWAgdGhhdCBwb3dlciBmb3JtIHJlbmRlcmluZyBhY3Jvc3MgRGlmeS4gVGhlc2Ugc3RvcmllcyBkZW1vbnN0cmF0ZSB0aGUgYHVzZUFwcEZvcm1gIGhvb2ssIGZpZWxkIHByaW1pdGl2ZXMsIGNvbmRpdGlvbmFsIHZpc2liaWxpdHksIGFuZCBjdXN0b20gYWN0aW9ucy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGb3JtU3RvcnlIb3N0PlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbnR5cGUgQXBwRm9ybUluc3RhbmNlID0gUGFyYW1ldGVyczxGb3JtU3RvcnlSZW5kZXI+WzBdXG50eXBlIENvbnRhY3RGaWVsZHNQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBDb250YWN0RmllbGRzPlxudHlwZSBDb250YWN0RmllbGRzRm9ybUFwaSA9IENvbnRhY3RGaWVsZHNQcm9wc1snZm9ybSddXG5cbnR5cGUgUGxheWdyb3VuZEZvcm1GaWVsZHNQcm9wcyA9IHtcbiAgZm9ybTogQXBwRm9ybUluc3RhbmNlXG4gIHN0YXR1czogc3RyaW5nXG59XG5cbmNvbnN0IFBsYXlncm91bmRGb3JtRmllbGRzID0gKHsgZm9ybSwgc3RhdHVzIH06IFBsYXlncm91bmRGb3JtRmllbGRzUHJvcHMpID0+IHtcbiAgdHlwZSBQbGF5Z3JvdW5kRm9ybVZhbHVlcyA9IHR5cGVvZiBkZW1vRm9ybU9wdHMuZGVmYXVsdFZhbHVlc1xuICBjb25zdCBuYW1lID0gdXNlU3RvcmUoZm9ybS5zdG9yZSwgc3RhdGUgPT4gKHN0YXRlLnZhbHVlcyBhcyBQbGF5Z3JvdW5kRm9ybVZhbHVlcykubmFtZSlcbiAgY29uc3QgY29udGFjdEZvcm1BcGkgPSBmb3JtIGFzIENvbnRhY3RGaWVsZHNGb3JtQXBpXG5cbiAgcmV0dXJuIChcbiAgICA8Zm9ybVxuICAgICAgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXcteGwgZmxleC1jb2wgZ2FwLTRcIlxuICAgICAgb25TdWJtaXQ9eyhldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIGZvcm0uaGFuZGxlU3VibWl0KClcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGZvcm0uQXBwRmllbGRcbiAgICAgICAgbmFtZT1cIm5hbWVcIlxuICAgICAgICBjaGlsZHJlbj17ZmllbGQgPT4gKFxuICAgICAgICAgIDxmaWVsZC5UZXh0RmllbGRcbiAgICAgICAgICAgIGxhYmVsPVwiTmFtZVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlN0YXJ0IHdpdGggYSBjYXBpdGFsIGxldHRlclwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgICA8Zm9ybS5BcHBGaWVsZFxuICAgICAgICBuYW1lPVwic3VybmFtZVwiXG4gICAgICAgIGNoaWxkcmVuPXtmaWVsZCA9PiAoXG4gICAgICAgICAgPGZpZWxkLlRleHRGaWVsZFxuICAgICAgICAgICAgbGFiZWw9XCJTdXJuYW1lXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU3VybmFtZSBtdXN0IGJlIGF0IGxlYXN0IDMgY2hhcmFjdGVyc1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgICA8Zm9ybS5BcHBGaWVsZFxuICAgICAgICBuYW1lPVwiaXNBY2NlcHRpbmdUZXJtc1wiXG4gICAgICAgIGNoaWxkcmVuPXtmaWVsZCA9PiAoXG4gICAgICAgICAgPGZpZWxkLkNoZWNrYm94RmllbGRcbiAgICAgICAgICAgIGxhYmVsPVwiSSBhY2NlcHQgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zXCJcbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgLz5cblxuICAgICAgeyEhbmFtZSAmJiA8Q29udGFjdEZpZWxkcyBmb3JtPXtjb250YWN0Rm9ybUFwaX0gLz59XG5cbiAgICAgIDxmb3JtLkFwcEZvcm0+XG4gICAgICAgIDxmb3JtLkFjdGlvbnMgLz5cbiAgICAgIDwvZm9ybS5BcHBGb3JtPlxuXG4gICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtdGV4dC10ZXJ0aWFyeVwiPntzdGF0dXN9PC9wPlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5jb25zdCBGb3JtUGxheWdyb3VuZCA9ICgpID0+IHtcbiAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlKCdGaWxsIGluIHRoZSBmb3JtIGFuZCBzdWJtaXQgdG8gc2VlIHJlc3VsdHMuJylcblxuICByZXR1cm4gKFxuICAgIDxGb3JtU3RvcnlXcmFwcGVyXG4gICAgICB0aXRsZT1cIkN1c3RvbWVyIG9uYm9hcmRpbmcgZm9ybVwiXG4gICAgICBzdWJ0aXRsZT1cIlZhbGlkYXRlcyB3aXRoIHpvZCBhbmQgY29uZGl0aW9uYWxseSByZXZlYWxzIGNvbnRhY3QgcHJlZmVyZW5jZXMuXCJcbiAgICAgIG9wdGlvbnM9e3tcbiAgICAgICAgLi4uZGVtb0Zvcm1PcHRzLFxuICAgICAgICB2YWxpZGF0b3JzOiB7XG4gICAgICAgICAgb25TdWJtaXQ6ICh7IHZhbHVlOiBmb3JtVmFsdWUgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gVXNlclNjaGVtYS5zYWZlUGFyc2UoZm9ybVZhbHVlIGFzIHR5cGVvZiBkZW1vRm9ybU9wdHMuZGVmYXVsdFZhbHVlcylcbiAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpXG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHQuZXJyb3IuaXNzdWVzWzBdLm1lc3NhZ2VcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdDogKCkgPT4ge1xuICAgICAgICAgIHNldFN0YXR1cygnU3VjY2Vzc2Z1bGx5IHNhdmVkIHByb2ZpbGUuJylcbiAgICAgICAgfSxcbiAgICAgIH19XG4gICAgPlxuICAgICAge2Zvcm0gPT4gPFBsYXlncm91bmRGb3JtRmllbGRzIGZvcm09e2Zvcm19IHN0YXR1cz17c3RhdHVzfSAvPn1cbiAgICA8L0Zvcm1TdG9yeVdyYXBwZXI+XG4gIClcbn1cblxuY29uc3QgbW9ja0ZpbGVVcGxvYWRDb25maWcgPSB7XG4gIGVuYWJsZWQ6IHRydWUsXG4gIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJ3BkZicsICdwbmcnXSxcbiAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSwgVHJhbnNmZXJNZXRob2QucmVtb3RlX3VybF0sXG4gIG51bWJlcl9saW1pdHM6IDMsXG4gIHByZXZpZXdfY29uZmlnOiB7XG4gICAgbW9kZTogUHJldmlld01vZGUuQ3VycmVudFBhZ2UsXG4gICAgZmlsZV90eXBlX2xpc3Q6IFsncGRmJywgJ3BuZyddLFxuICB9LFxufVxuXG5jb25zdCBtb2NrRmllbGREZWZhdWx0cyA9IHtcbiAgaGVhZGxpbmU6ICdEaWZ5IEFwcCcsXG4gIGRlc2NyaXB0aW9uOiAnU3RyZWFtbGluZSB5b3VyIEFJIHdvcmtmbG93cyB3aXRoIGNvbmZpZ3VyYWJsZSBidWlsZGluZyBibG9ja3MuJyxcbiAgY2F0ZWdvcnk6ICd3b3JrYmVuY2gnLFxuICBhbGxvd05vdGlmaWNhdGlvbnM6IHRydWUsXG4gIGRhaWx5TGltaXQ6IDQwLFxuICBhdHRhY2htZW50OiBbXSxcbn1cblxuY29uc3QgRmllbGRHYWxsZXJ5ID0gKCkgPT4ge1xuICBjb25zdCBzZWxlY3RPcHRpb25zID0gdXNlTWVtbygoKSA9PiBbXG4gICAgeyB2YWx1ZTogJ3dvcmtiZW5jaCcsIGxhYmVsOiAnV29ya2JlbmNoJyB9LFxuICAgIHsgdmFsdWU6ICdwbGF5Z3JvdW5kJywgbGFiZWw6ICdQbGF5Z3JvdW5kJyB9LFxuICAgIHsgdmFsdWU6ICdwcm9kdWN0aW9uJywgbGFiZWw6ICdQcm9kdWN0aW9uJyB9LFxuICBdLCBbXSlcblxuICByZXR1cm4gKFxuICAgIDxGb3JtU3RvcnlXcmFwcGVyXG4gICAgICB0aXRsZT1cIkZpZWxkIGdhbGxlcnlcIlxuICAgICAgc3VidGl0bGU9XCJQcmV2aWV3IHRoZSBtb3N0IGNvbW1vbiBmaWVsZCBwcmltaXRpdmVzIGV4cG9zZWQgdGhyb3VnaCBgZm9ybS5BcHBGaWVsZGAgaGVscGVycy5cIlxuICAgICAgb3B0aW9ucz17e1xuICAgICAgICBkZWZhdWx0VmFsdWVzOiBtb2NrRmllbGREZWZhdWx0cyxcbiAgICAgIH19XG4gICAgPlxuICAgICAge2Zvcm0gPT4gKFxuICAgICAgICA8Zm9ybVxuICAgICAgICAgIGNsYXNzTmFtZT1cImdyaWQgdy1mdWxsIG1heC13LTR4bCBncmlkLWNvbHMtMSBnYXAtNCBsZzpncmlkLWNvbHMtMlwiXG4gICAgICAgICAgb25TdWJtaXQ9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGZvcm0uaGFuZGxlU3VibWl0KClcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGZvcm0uQXBwRmllbGRcbiAgICAgICAgICAgIG5hbWU9XCJoZWFkbGluZVwiXG4gICAgICAgICAgICBjaGlsZHJlbj17ZmllbGQgPT4gKFxuICAgICAgICAgICAgICA8ZmllbGQuVGV4dEZpZWxkXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJIZWFkbGluZVwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJOYW1lIHlvdXIgZXhwZXJpZW5jZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGZvcm0uQXBwRmllbGRcbiAgICAgICAgICAgIG5hbWU9XCJkZXNjcmlwdGlvblwiXG4gICAgICAgICAgICBjaGlsZHJlbj17ZmllbGQgPT4gKFxuICAgICAgICAgICAgICA8ZmllbGQuVGV4dEFyZWFGaWVsZFxuICAgICAgICAgICAgICAgIGxhYmVsPVwiRGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRGVzY3JpYmUgd2hhdCB0aGlzIGNvbmZpZ3VyYXRpb24gZG9lc1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGZvcm0uQXBwRmllbGRcbiAgICAgICAgICAgIG5hbWU9XCJjYXRlZ29yeVwiXG4gICAgICAgICAgICBjaGlsZHJlbj17ZmllbGQgPT4gKFxuICAgICAgICAgICAgICA8ZmllbGQuU2VsZWN0RmllbGRcbiAgICAgICAgICAgICAgICBsYWJlbD1cIkNhdGVnb3J5XCJcbiAgICAgICAgICAgICAgICBvcHRpb25zPXtzZWxlY3RPcHRpb25zfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxmb3JtLkFwcEZpZWxkXG4gICAgICAgICAgICBuYW1lPVwiYWxsb3dOb3RpZmljYXRpb25zXCJcbiAgICAgICAgICAgIGNoaWxkcmVuPXtmaWVsZCA9PiAoXG4gICAgICAgICAgICAgIDxmaWVsZC5DaGVja2JveEZpZWxkIGxhYmVsPVwiRW5hYmxlIHVzYWdlIG5vdGlmaWNhdGlvbnNcIiAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxmb3JtLkFwcEZpZWxkXG4gICAgICAgICAgICBuYW1lPVwiZGFpbHlMaW1pdFwiXG4gICAgICAgICAgICBjaGlsZHJlbj17ZmllbGQgPT4gKFxuICAgICAgICAgICAgICA8ZmllbGQuTnVtYmVyU2xpZGVyRmllbGRcbiAgICAgICAgICAgICAgICBsYWJlbD1cIkRhaWx5IHNlc3Npb24gbGltaXRcIlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uPVwiQ29udHJvbCB0aGUgbWF4aW11bSBudW1iZXIgb2YgcnVucyBwZXIgdXNlciBlYWNoIGRheS5cIlxuICAgICAgICAgICAgICAgIG1pbj17MTB9XG4gICAgICAgICAgICAgICAgbWF4PXsxMDB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGZvcm0uQXBwRmllbGRcbiAgICAgICAgICAgIG5hbWU9XCJhdHRhY2htZW50XCJcbiAgICAgICAgICAgIGNoaWxkcmVuPXtmaWVsZCA9PiAoXG4gICAgICAgICAgICAgIDxmaWVsZC5GaWxlVXBsb2FkZXJGaWVsZFxuICAgICAgICAgICAgICAgIGxhYmVsPVwiUmVmZXJlbmNlIG1hdGVyaWFsc1wiXG4gICAgICAgICAgICAgICAgZmlsZUNvbmZpZz17bW9ja0ZpbGVVcGxvYWRDb25maWd9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZzpjb2wtc3Bhbi0yXCI+XG4gICAgICAgICAgICA8Zm9ybS5BcHBGb3JtPlxuICAgICAgICAgICAgICA8Zm9ybS5BY3Rpb25zIC8+XG4gICAgICAgICAgICA8L2Zvcm0uQXBwRm9ybT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgKX1cbiAgICA8L0Zvcm1TdG9yeVdyYXBwZXI+XG4gIClcbn1cblxuY29uc3QgY29uZGl0aW9uYWxTY2hlbWFzOiBGb3JtU2NoZW1hW10gPSBbXG4gIHtcbiAgICB0eXBlOiBGb3JtVHlwZUVudW0uc2VsZWN0LFxuICAgIG5hbWU6ICdjaGFubmVsJyxcbiAgICBsYWJlbDogJ1ByZWZlcnJlZCBjaGFubmVsJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBkZWZhdWx0OiAnZW1haWwnLFxuICAgIG9wdGlvbnM6IENvbnRhY3RNZXRob2RzLFxuICB9LFxuICB7XG4gICAgdHlwZTogRm9ybVR5cGVFbnVtLnRleHRJbnB1dCxcbiAgICBuYW1lOiAnY29udGFjdEVtYWlsJyxcbiAgICBsYWJlbDogJ0VtYWlsIGFkZHJlc3MnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIHBsYWNlaG9sZGVyOiAndXNlckBleGFtcGxlLmNvbScsXG4gICAgc2hvd19vbjogW3sgdmFyaWFibGU6ICdjaGFubmVsJywgdmFsdWU6ICdlbWFpbCcgfV0sXG4gIH0sXG4gIHtcbiAgICB0eXBlOiBGb3JtVHlwZUVudW0udGV4dElucHV0LFxuICAgIG5hbWU6ICdjb250YWN0UGhvbmUnLFxuICAgIGxhYmVsOiAnUGhvbmUgbnVtYmVyJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBwbGFjZWhvbGRlcjogJysxIDU1NSAxMjMgNDU2NycsXG4gICAgc2hvd19vbjogW3sgdmFyaWFibGU6ICdjaGFubmVsJywgdmFsdWU6ICdwaG9uZScgfV0sXG4gIH0sXG4gIHtcbiAgICB0eXBlOiBGb3JtVHlwZUVudW0uYm9vbGVhbixcbiAgICBuYW1lOiAnb3B0SW4nLFxuICAgIGxhYmVsOiAnT3B0IGluIHRvIG1hcmtldGluZyBtZXNzYWdlcycsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICB9LFxuXVxuXG5jb25zdCBDb25kaXRpb25hbEZpZWxkc1N0b3J5ID0gKCkgPT4ge1xuICBjb25zdCBbdmFsdWVzLCBzZXRWYWx1ZXNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KHtcbiAgICBjaGFubmVsOiAnZW1haWwnLFxuICAgIG9wdEluOiBmYWxzZSxcbiAgfSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtNiBweC02IG1kOmZsZXgtcm93IG1kOnB4LTEwXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTUgc2hhZG93LXNtXCI+XG4gICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgIGZvcm1TY2hlbWFzPXtjb25kaXRpb25hbFNjaGVtYXN9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlcz17dmFsdWVzfVxuICAgICAgICAgIGZvcm1DbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC00XCJcbiAgICAgICAgICBvbkNoYW5nZT17KGZpZWxkLCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc2V0VmFsdWVzKHByZXYgPT4gKHtcbiAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgW2ZpZWxkXTogdmFsdWUsXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8YXNpZGUgY2xhc3NOYW1lPVwidy1mdWxsIG1heC13LXNtIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNCB0ZXh0LXhzIHRleHQtdGV4dC1zZWNvbmRhcnkgc2hhZG93LXNtXCI+XG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtc2VtaWJvbGQgdGV4dC10ZXh0LXByaW1hcnlcIj5MaXZlIHZhbHVlczwvaDM+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1bMTFweF0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+YHNob3dfb25gIHJ1bGVzIGhpZGUgb3IgcmV2ZWFsIGlucHV0cyB3aXRob3V0IGxvc2luZyB0cmFjayBvZiB0aGUgZm9ybSBzdGF0ZS48L3A+XG4gICAgICAgIDxwcmUgY2xhc3NOYW1lPVwibWF4LWgtNDggb3ZlcmZsb3ctYXV0byByb3VuZGVkLW1kIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUgcC0zIGZvbnQtbW9ubyB0ZXh0LVsxMXB4XSBsZWFkaW5nLXRpZ2h0IHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAge0pTT04uc3RyaW5naWZ5KHZhbHVlcywgbnVsbCwgMil9XG4gICAgICAgIDwvcHJlPlxuICAgICAgPC9hc2lkZT5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBDdXN0b21BY3Rpb25zU3RvcnkgPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPEZvcm1TdG9yeVdyYXBwZXJcbiAgICAgIHRpdGxlPVwiQ3VzdG9tIGZvb3RlciBhY3Rpb25zXCJcbiAgICAgIHN1YnRpdGxlPVwiT3ZlcnJpZGUgdGhlIGRlZmF1bHQgc3VibWl0IGJ1dHRvbiB0byBhZGQgcmVzZXQgb3Igc2Vjb25kYXJ5IG9wZXJhdGlvbnMuXCJcbiAgICAgIG9wdGlvbnM9e3tcbiAgICAgICAgZGVmYXVsdFZhbHVlczoge1xuICAgICAgICAgIGRhdGFzZXROYW1lOiAnU3VwcG9ydCBGQVEnLFxuICAgICAgICAgIGRhdGFzZXREZXNjcmlwdGlvbjogJ0tub3dsZWRnZSBiYXNlIHNuaXBwZXRzIHNvdXJjZWQgZnJvbSBaZW5kZXNrIGV4cG9ydHMuJyxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsaWRhdG9yczoge1xuICAgICAgICAgIG9uQ2hhbmdlOiAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0VmFsdWVzID0gdmFsdWUgYXMgeyBkYXRhc2V0TmFtZT86IHN0cmluZyB9XG4gICAgICAgICAgICBpZiAoIW5leHRWYWx1ZXMuZGF0YXNldE5hbWUgfHwgbmV4dFZhbHVlcy5kYXRhc2V0TmFtZS5sZW5ndGggPCAzKVxuICAgICAgICAgICAgICByZXR1cm4gJ0RhdGFzZXQgbmFtZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzLidcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Zm9ybSA9PiAoXG4gICAgICAgIDxmb3JtXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXcteGwgZmxleC1jb2wgZ2FwLTRcIlxuICAgICAgICAgIG9uU3VibWl0PXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBmb3JtLmhhbmRsZVN1Ym1pdCgpXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxmb3JtLkFwcEZpZWxkXG4gICAgICAgICAgICBuYW1lPVwiZGF0YXNldE5hbWVcIlxuICAgICAgICAgICAgY2hpbGRyZW49e2ZpZWxkID0+IChcbiAgICAgICAgICAgICAgPGZpZWxkLlRleHRGaWVsZFxuICAgICAgICAgICAgICAgIGxhYmVsPVwiRGF0YXNldCBuYW1lXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlN1cHBvcnQga25vd2xlZGdlIGJhc2VcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxmb3JtLkFwcEZpZWxkXG4gICAgICAgICAgICBuYW1lPVwiZGF0YXNldERlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgIGNoaWxkcmVuPXtmaWVsZCA9PiAoXG4gICAgICAgICAgICAgIDxmaWVsZC5UZXh0QXJlYUZpZWxkXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJEZXNjcmlwdGlvblwiXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJBZGQgYSBoZWxwZnVsIHN1bW1hcnkgZm9yIGNvbGxhYm9yYXRvcnNcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxmb3JtLkFwcEZvcm0+XG4gICAgICAgICAgICA8Zm9ybS5BY3Rpb25zXG4gICAgICAgICAgICAgIEN1c3RvbUFjdGlvbnM9eyh7IGZvcm06IGFwcEZvcm0sIGlzU3VibWl0dGluZywgY2FuU3VibWl0IH0pID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJnaG9zdFwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGFwcEZvcm0ucmVzZXQoKX1cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzU3VibWl0dGluZ31cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgUmVzZXRcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwidGVydGlhcnlcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgYXBwRm9ybS5oYW5kbGVTdWJtaXQoKVxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhblN1Ym1pdH1cbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZz17aXNTdWJtaXR0aW5nfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBTYXZlIGRyYWZ0XG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBhcHBGb3JtLmhhbmRsZVN1Ym1pdCgpfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWNhblN1Ym1pdH1cbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZz17aXNTdWJtaXR0aW5nfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBQdWJsaXNoXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9mb3JtLkFwcEZvcm0+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICl9XG4gICAgPC9Gb3JtU3RvcnlXcmFwcGVyPlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8Rm9ybVBsYXlncm91bmQgLz4sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG5jb25zdCBmb3JtID0gdXNlQXBwRm9ybSh7XG4gIC4uLmRlbW9Gb3JtT3B0cyxcbiAgdmFsaWRhdG9yczoge1xuICAgIG9uU3VibWl0OiAoeyB2YWx1ZSB9KSA9PiBVc2VyU2NoZW1hLnNhZmVQYXJzZSh2YWx1ZSkuc3VjY2VzcyA/IHVuZGVmaW5lZCA6ICdWYWxpZGF0aW9uIGZhaWxlZCcsXG4gIH0sXG4gIG9uU3VibWl0OiAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgc2V0U3RhdHVzKFxcYFN1Y2Nlc3NmdWxseSBzYXZlZCBwcm9maWxlIGZvciBcXCR7dmFsdWUubmFtZX1cXGApXG4gIH0sXG59KVxuXG5yZXR1cm4gKFxuICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fT5cbiAgICA8Zm9ybS5BcHBGaWVsZCBuYW1lPVwibmFtZVwiPlxuICAgICAge2ZpZWxkID0+IDxmaWVsZC5UZXh0RmllbGQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJTdGFydCB3aXRoIGEgY2FwaXRhbCBsZXR0ZXJcIiAvPn1cbiAgICA8L2Zvcm0uQXBwRmllbGQ+XG4gICAgPGZvcm0uQXBwRmllbGQgbmFtZT1cInN1cm5hbWVcIj5cbiAgICAgIHtmaWVsZCA9PiA8ZmllbGQuVGV4dEZpZWxkIGxhYmVsPVwiU3VybmFtZVwiIC8+fVxuICAgIDwvZm9ybS5BcHBGaWVsZD5cbiAgICA8Zm9ybS5BcHBGaWVsZCBuYW1lPVwiaXNBY2NlcHRpbmdUZXJtc1wiPlxuICAgICAge2ZpZWxkID0+IDxmaWVsZC5DaGVja2JveEZpZWxkIGxhYmVsPVwiSSBhY2NlcHQgdGhlIHRlcm1zIGFuZCBjb25kaXRpb25zXCIgLz59XG4gICAgPC9mb3JtLkFwcEZpZWxkPlxuICAgIHshIWZvcm0uc3RvcmUuc3RhdGUudmFsdWVzLm5hbWUgJiYgPENvbnRhY3RGaWVsZHMgZm9ybT17Zm9ybX0gLz59XG4gICAgPGZvcm0uQXBwRm9ybT5cbiAgICAgIDxmb3JtLkFjdGlvbnMgLz5cbiAgICA8L2Zvcm0uQXBwRm9ybT5cbiAgPC9mb3JtPlxuKVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEZpZWxkRXhwbG9yZXI6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxGaWVsZEdhbGxlcnkgLz4sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBuZXh0anM6IHtcbiAgICAgIGFwcERpcmVjdG9yeTogdHJ1ZSxcbiAgICAgIG5hdmlnYXRpb246IHtcbiAgICAgICAgcGF0aG5hbWU6ICcvYXBwcy9kZW1vLWFwcC9mb3JtJyxcbiAgICAgICAgcGFyYW1zOiB7IGFwcElkOiAnZGVtby1hcHAnIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuY29uc3QgZm9ybSA9IHVzZUFwcEZvcm0oe1xuICBkZWZhdWx0VmFsdWVzOiB7XG4gICAgaGVhZGxpbmU6ICdEaWZ5IEFwcCcsXG4gICAgZGVzY3JpcHRpb246ICdTdHJlYW1saW5lIHlvdXIgQUkgd29ya2Zsb3dzJyxcbiAgICBjYXRlZ29yeTogJ3dvcmtiZW5jaCcsXG4gICAgYWxsb3dOb3RpZmljYXRpb25zOiB0cnVlLFxuICAgIGRhaWx5TGltaXQ6IDQwLFxuICAgIGF0dGFjaG1lbnQ6IFtdLFxuICB9LFxufSlcblxucmV0dXJuIChcbiAgPGZvcm0gY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBnYXAtNCBsZzpncmlkLWNvbHMtMlwiIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxuICAgIDxmb3JtLkFwcEZpZWxkIG5hbWU9XCJoZWFkbGluZVwiPlxuICAgICAge2ZpZWxkID0+IDxmaWVsZC5UZXh0RmllbGQgbGFiZWw9XCJIZWFkbGluZVwiIC8+fVxuICAgIDwvZm9ybS5BcHBGaWVsZD5cbiAgICA8Zm9ybS5BcHBGaWVsZCBuYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgIHtmaWVsZCA9PiA8ZmllbGQuVGV4dEFyZWFGaWVsZCBsYWJlbD1cIkRlc2NyaXB0aW9uXCIgLz59XG4gICAgPC9mb3JtLkFwcEZpZWxkPlxuICAgIDxmb3JtLkFwcEZpZWxkIG5hbWU9XCJjYXRlZ29yeVwiPlxuICAgICAge2ZpZWxkID0+IDxmaWVsZC5TZWxlY3RGaWVsZCBsYWJlbD1cIkNhdGVnb3J5XCIgb3B0aW9ucz17c2VsZWN0T3B0aW9uc30gLz59XG4gICAgPC9mb3JtLkFwcEZpZWxkPlxuICAgIDxmb3JtLkFwcEZpZWxkIG5hbWU9XCJhbGxvd05vdGlmaWNhdGlvbnNcIj5cbiAgICAgIHtmaWVsZCA9PiA8ZmllbGQuQ2hlY2tib3hGaWVsZCBsYWJlbD1cIkVuYWJsZSB1c2FnZSBub3RpZmljYXRpb25zXCIgLz59XG4gICAgPC9mb3JtLkFwcEZpZWxkPlxuICAgIDxmb3JtLkFwcEZpZWxkIG5hbWU9XCJkYWlseUxpbWl0XCI+XG4gICAgICB7ZmllbGQgPT4gPGZpZWxkLk51bWJlclNsaWRlckZpZWxkIGxhYmVsPVwiRGFpbHkgc2Vzc2lvbiBsaW1pdFwiIG1pbj17MTB9IG1heD17MTAwfSBzdGVwPXsxMH0gLz59XG4gICAgPC9mb3JtLkFwcEZpZWxkPlxuICAgIDxmb3JtLkFwcEZpZWxkIG5hbWU9XCJhdHRhY2htZW50XCI+XG4gICAgICB7ZmllbGQgPT4gPGZpZWxkLkZpbGVVcGxvYWRlckZpZWxkIGxhYmVsPVwiUmVmZXJlbmNlIG1hdGVyaWFsc1wiIGZpbGVDb25maWc9e21vY2tGaWxlVXBsb2FkQ29uZmlnfSAvPn1cbiAgICA8L2Zvcm0uQXBwRmllbGQ+XG4gICAgPGZvcm0uQXBwRm9ybT5cbiAgICAgIDxmb3JtLkFjdGlvbnMgLz5cbiAgICA8L2Zvcm0uQXBwRm9ybT5cbiAgPC9mb3JtPlxuKVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IENvbmRpdGlvbmFsVmlzaWJpbGl0eTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPENvbmRpdGlvbmFsRmllbGRzU3RvcnkgLz4sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ0RlbW9uc3RyYXRlcyBzY2hlbWEtZHJpdmVuIHZpc2liaWxpdHkgdXNpbmcgYHNob3dfb25gIGNvbmRpdGlvbnMgcmVuZGVyZWQgdGhyb3VnaCB0aGUgcmV1c2FibGUgYEJhc2VGb3JtYCBjb21wb25lbnQuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG5jb25zdCBjb25kaXRpb25hbFNjaGVtYXM6IEZvcm1TY2hlbWFbXSA9IFtcbiAgeyB0eXBlOiBGb3JtVHlwZUVudW0uc2VsZWN0LCBuYW1lOiAnY2hhbm5lbCcsIGxhYmVsOiAnUHJlZmVycmVkIGNoYW5uZWwnLCBvcHRpb25zOiBDb250YWN0TWV0aG9kcyB9LFxuICB7IHR5cGU6IEZvcm1UeXBlRW51bS50ZXh0SW5wdXQsIG5hbWU6ICdjb250YWN0RW1haWwnLCBsYWJlbDogJ0VtYWlsJywgc2hvd19vbjogW3sgdmFyaWFibGU6ICdjaGFubmVsJywgdmFsdWU6ICdlbWFpbCcgfV0gfSxcbiAgeyB0eXBlOiBGb3JtVHlwZUVudW0udGV4dElucHV0LCBuYW1lOiAnY29udGFjdFBob25lJywgbGFiZWw6ICdQaG9uZScsIHNob3dfb246IFt7IHZhcmlhYmxlOiAnY2hhbm5lbCcsIHZhbHVlOiAncGhvbmUnIH1dIH0sXG4gIHsgdHlwZTogRm9ybVR5cGVFbnVtLmJvb2xlYW4sIG5hbWU6ICdvcHRJbicsIGxhYmVsOiAnT3B0IGluIHRvIG1hcmtldGluZyBtZXNzYWdlcycgfSxcbl1cblxucmV0dXJuIChcbiAgPEJhc2VGb3JtXG4gICAgZm9ybVNjaGVtYXM9e2NvbmRpdGlvbmFsU2NoZW1hc31cbiAgICBkZWZhdWx0VmFsdWVzPXt7IGNoYW5uZWw6ICdlbWFpbCcsIG9wdEluOiBmYWxzZSB9fVxuICAgIGZvcm1DbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC00XCJcbiAgICBvbkNoYW5nZT17KGZpZWxkLCB2YWx1ZSkgPT4gc2V0VmFsdWVzKHByZXYgPT4gKHsgLi4ucHJldiwgW2ZpZWxkXTogdmFsdWUgfSkpfVxuICAvPlxuKVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbUFjdGlvbnM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxDdXN0b21BY3Rpb25zU3RvcnkgLz4sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBzdG9yeTogJ1Nob3dzIGhvdyB0byByZXBsYWNlIHRoZSBkZWZhdWx0IHN1Ym1pdCBidXR0b24gd2l0aCBhIGZ1bGx5IGN1c3RvbSBmb290ZXIgbGV2ZXJhZ2luZyBjb250ZXh0dWFsIGZvcm0gc3RhdGUuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG5jb25zdCBmb3JtID0gdXNlQXBwRm9ybSh7XG4gIGRlZmF1bHRWYWx1ZXM6IHtcbiAgICBkYXRhc2V0TmFtZTogJ1N1cHBvcnQgRkFRJyxcbiAgICBkYXRhc2V0RGVzY3JpcHRpb246ICdLbm93bGVkZ2UgYmFzZSBzbmlwcGV0cyBzb3VyY2VkIGZyb20gWmVuZGVzayBleHBvcnRzLicsXG4gIH0sXG4gIHZhbGlkYXRvcnM6IHtcbiAgICBvbkNoYW5nZTogKHsgdmFsdWUgfSkgPT4gdmFsdWUuZGF0YXNldE5hbWU/Lmxlbmd0aCA+PSAzID8gdW5kZWZpbmVkIDogJ0RhdGFzZXQgbmFtZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3QgMyBjaGFyYWN0ZXJzLicsXG4gIH0sXG59KVxuXG5yZXR1cm4gKFxuICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC00XCI+XG4gICAgPGZvcm0uQXBwRmllbGQgbmFtZT1cImRhdGFzZXROYW1lXCI+XG4gICAgICB7ZmllbGQgPT4gPGZpZWxkLlRleHRGaWVsZCBsYWJlbD1cIkRhdGFzZXQgbmFtZVwiIC8+fVxuICAgIDwvZm9ybS5BcHBGaWVsZD5cbiAgICA8Zm9ybS5BcHBGaWVsZCBuYW1lPVwiZGF0YXNldERlc2NyaXB0aW9uXCI+XG4gICAgICB7ZmllbGQgPT4gPGZpZWxkLlRleHRBcmVhRmllbGQgbGFiZWw9XCJEZXNjcmlwdGlvblwiIC8+fVxuICAgIDwvZm9ybS5BcHBGaWVsZD5cbiAgICA8Zm9ybS5BcHBGb3JtPlxuICAgICAgPGZvcm0uQWN0aW9uc1xuICAgICAgICBDdXN0b21BY3Rpb25zPXsoeyBmb3JtOiBhcHBGb3JtLCBpc1N1Ym1pdHRpbmcsIGNhblN1Ym1pdCB9KSA9PiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwiZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiBhcHBGb3JtLnJlc2V0KCl9IGRpc2FibGVkPXtpc1N1Ym1pdHRpbmd9PlxuICAgICAgICAgICAgICBSZXNldFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJ0ZXJ0aWFyeVwiIG9uQ2xpY2s9eygpID0+IGFwcEZvcm0uaGFuZGxlU3VibWl0KCl9IGRpc2FibGVkPXshY2FuU3VibWl0fSBsb2FkaW5nPXtpc1N1Ym1pdHRpbmd9PlxuICAgICAgICAgICAgICBTYXZlIGRyYWZ0XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXsoKSA9PiBhcHBGb3JtLmhhbmRsZVN1Ym1pdCgpfSBkaXNhYmxlZD17IWNhblN1Ym1pdH0gbG9hZGluZz17aXNTdWJtaXR0aW5nfT5cbiAgICAgICAgICAgICAgUHVibGlzaFxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAvPlxuICAgIDwvZm9ybS5BcHBGb3JtPlxuICA8L2Zvcm0+XG4pXG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19