"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typography_1 = require("@tailwindcss/typography");
const tailwind_theme_var_define_1 = require("./themes/tailwind-theme-var-define");
const typography_2 = require("./typography");
const config = {
    theme: {
        typography: typography_2.default,
        extend: {
            colors: {
                gray: {
                    25: '#fcfcfd',
                    50: '#f9fafb',
                    100: '#f2f4f7',
                    200: '#eaecf0',
                    300: '#d0d5dd',
                    400: '#98a2b3',
                    500: '#667085',
                    700: '#475467',
                    600: '#344054',
                    800: '#1d2939',
                    900: '#101828',
                },
                primary: {
                    25: '#f5f8ff',
                    50: '#eff4ff',
                    100: '#d1e0ff',
                    200: '#b2ccff',
                    300: '#84adff',
                    400: '#528bff',
                    500: '#2970ff',
                    600: '#155eef',
                    700: '#004eeb',
                    800: '#0040c1',
                    900: '#00359e',
                },
                blue: {
                    500: '#E1EFFE',
                },
                green: {
                    50: '#F3FAF7',
                    100: '#DEF7EC',
                    800: '#03543F',
                },
                yellow: {
                    100: '#FDF6B2',
                    800: '#723B13',
                },
                purple: {
                    50: '#F6F5FF',
                    200: '#DCD7FE',
                },
                indigo: {
                    25: '#F5F8FF',
                    50: '#EEF4FF',
                    100: '#E0EAFF',
                    300: '#A4BCFD',
                    400: '#8098F9',
                    600: '#444CE7',
                    800: '#2D31A6',
                },
                ...tailwind_theme_var_define_1.default,
            },
            screens: {
                'mobile': '100px',
                // => @media (min-width: 100px) { ... }
                'tablet': '640px', // 391
                // => @media (min-width: 600px) { ... }
                'pc': '769px',
                // => @media (min-width: 769px) { ... }
                '2k': '2560px',
            },
            boxShadow: {
                'xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                'sm': '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
                'sm-no-bottom': '0px -1px 2px 0px rgba(16, 24, 40, 0.06), 0px -1px 3px 0px rgba(16, 24, 40, 0.10)',
                'md': '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
                'lg': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
                'xl': '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
                '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
                '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
                'status-indicator-green-shadow': '0px 2px 6px 0px var(--color-components-badge-status-light-success-halo), 0px 0px 0px 1px var(--color-components-badge-status-light-border-outer)',
                'status-indicator-warning-shadow': '0px 2px 6px 0px var(--color-components-badge-status-light-warning-halo), 0px 0px 0px 1px var(--color-components-badge-status-light-border-outer)',
                'status-indicator-red-shadow': '0px 2px 6px 0px var(--color-components-badge-status-light-error-halo), 0px 0px 0px 1px var(--color-components-badge-status-light-border-outer)',
                'status-indicator-blue-shadow': '0px 2px 6px 0px var(--color-components-badge-status-light-normal-halo), 0px 0px 0px 1px var(--color-components-badge-status-light-border-outer)',
                'status-indicator-gray-shadow': '0px 1px 2px 0px var(--color-components-badge-status-light-disabled-halo), 0px 0px 0px 1px var(--color-components-badge-status-light-border-outer)',
            },
            opacity: {
                2: '0.02',
                8: '0.08',
            },
            fontFamily: {
                instrument: ['var(--font-instrument-serif)', 'serif'],
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            backgroundColor: {
                'background-gradient-bg-fill-chat-bubble-bg-3': 'var(--color-background-gradient-bg-fill-chat-bubble-bg-3)',
            },
            backgroundImage: {
                'chatbot-bg': 'var(--color-chatbot-bg)',
                'chat-bubble-bg': 'var(--color-chat-bubble-bg)',
                'chat-input-mask': 'var(--color-chat-input-mask)',
                'workflow-process-bg': 'var(--color-workflow-process-bg)',
                'workflow-run-failed-bg': 'var(--color-workflow-run-failed-bg)',
                'workflow-batch-failed-bg': 'var(--color-workflow-batch-failed-bg)',
                'mask-top2bottom-gray-50-to-transparent': 'var(--mask-top2bottom-gray-50-to-transparent)',
                'marketplace-divider-bg': 'var(--color-marketplace-divider-bg)',
                'marketplace-plugin-empty': 'var(--color-marketplace-plugin-empty)',
                'toast-success-bg': 'var(--color-toast-success-bg)',
                'toast-warning-bg': 'var(--color-toast-warning-bg)',
                'toast-error-bg': 'var(--color-toast-error-bg)',
                'toast-info-bg': 'var(--color-toast-info-bg)',
                'app-detail-bg': 'var(--color-app-detail-bg)',
                'app-detail-overlay-bg': 'var(--color-app-detail-overlay-bg)',
                'dataset-chunk-process-success-bg': 'var(--color-dataset-chunk-process-success-bg)',
                'dataset-chunk-process-error-bg': 'var(--color-dataset-chunk-process-error-bg)',
                'dataset-chunk-detail-card-hover-bg': 'var(--color-dataset-chunk-detail-card-hover-bg)',
                'dataset-child-chunk-expand-btn-bg': 'var(--color-dataset-child-chunk-expand-btn-bg)',
                'dataset-option-card-blue-gradient': 'var(--color-dataset-option-card-blue-gradient)',
                'dataset-option-card-purple-gradient': 'var(--color-dataset-option-card-purple-gradient)',
                'dataset-option-card-orange-gradient': 'var(--color-dataset-option-card-orange-gradient)',
                'dataset-chunk-list-mask-bg': 'var(--color-dataset-chunk-list-mask-bg)',
                'line-divider-bg': 'var(--color-line-divider-bg)',
                'dataset-warning-message-bg': 'var(--color-dataset-warning-message-bg)',
                'price-premium-badge-background': 'var(--color-premium-badge-background)',
                'premium-yearly-tip-text-background': 'var(--color-premium-yearly-tip-text-background)',
                'price-premium-text-background': 'var(--color-premium-text-background)',
                'price-enterprise-background': 'var(--color-price-enterprise-background)',
                'grid-mask-background': 'var(--color-grid-mask-background)',
                'node-data-source-bg': 'var(--color-node-data-source-bg)',
                'tag-selector-mask-bg': 'var(--color-tag-selector-mask-bg)',
                'tag-selector-mask-hover-bg': 'var(--color-tag-selector-mask-hover-bg)',
                'pipeline-template-card-hover-bg': 'var(--color-pipeline-template-card-hover-bg)',
                'pipeline-add-documents-title-bg': 'var(--color-pipeline-add-documents-title-bg)',
                'billing-plan-title-bg': 'var(--color-billing-plan-title-bg)',
                'billing-plan-card-premium-bg': 'var(--color-billing-plan-card-premium-bg)',
                'billing-plan-card-enterprise-bg': 'var(--color-billing-plan-card-enterprise-bg)',
                'knowledge-pipeline-creation-footer-bg': 'var(--color-knowledge-pipeline-creation-footer-bg)',
            },
            animation: {
                'spin-slow': 'spin 2s linear infinite',
            },
        },
    },
    plugins: [typography_1.default],
    // https://github.com/tailwindlabs/tailwindcss/discussions/5969
    corePlugins: {
        preflight: false,
    },
};
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFpbHdpbmQtY29tbW9uLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhaWx3aW5kLWNvbW1vbi1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3REFBd0Q7QUFDeEQsa0ZBQXVFO0FBQ3ZFLDZDQUFxQztBQUVyQyxNQUFNLE1BQU0sR0FBRztJQUNiLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBVixvQkFBVTtRQUNWLE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUU7b0JBQ0osRUFBRSxFQUFFLFNBQVM7b0JBQ2IsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7aUJBQ2Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLEVBQUUsRUFBRSxTQUFTO29CQUNiLEVBQUUsRUFBRSxTQUFTO29CQUNiLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO29CQUNkLEdBQUcsRUFBRSxTQUFTO2lCQUNmO2dCQUNELElBQUksRUFBRTtvQkFDSixHQUFHLEVBQUUsU0FBUztpQkFDZjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsRUFBRSxFQUFFLFNBQVM7b0JBQ2IsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsR0FBRyxFQUFFLFNBQVM7aUJBRWY7Z0JBQ0QsTUFBTSxF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QUFFLG1DQUFtQztnQkFDM0QscUJBQXFCLEVBQUUsa0NBQWtDO2dCQUN6RCxzQkFBc0IsRUFBRSxtQ0FBbUM7Z0JBQzNELDRCQUE0QixFQUFFLHlDQUF5QztnQkFDdkUsaUNBQWlDLEVBQUUsOENBQThDO2dCQUNqRixpQ0FBaUMsRUFBRSw4Q0FBOEM7Z0JBQ2pGLHVCQUF1QixFQUFFLG9DQUFvQztnQkFDN0QsOEJBQThCLEVBQUUsMkNBQTJDO2dCQUMzRSxpQ0FBaUMsRUFBRSw4Q0FBOEM7Z0JBQ2pGLHVDQUF1QyxFQUFFLG9EQUFvRDthQUM5RjtZQUNELFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQUUseUJBQXlCO2FBQ3ZDO1NBQ0Y7S0FDRjtJQUNELE9BQU8sRUFBRSxDQUFDLG9CQUFrQixDQUFDO0lBQzdCLCtEQUErRDtJQUMvRCxXQUFXLEVBQUU7UUFDWCxTQUFTLEVBQUUsS0FBSztLQUNqQjtDQUNGLENBQUE7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGFpbHdpbmRUeXBvZ3JhcGh5IGZyb20gJ0B0YWlsd2luZGNzcy90eXBvZ3JhcGh5J1xuaW1wb3J0IHRhaWx3aW5kVGhlbWVWYXJEZWZpbmUgZnJvbSAnLi90aGVtZXMvdGFpbHdpbmQtdGhlbWUtdmFyLWRlZmluZSdcbmltcG9ydCB0eXBvZ3JhcGh5IGZyb20gJy4vdHlwb2dyYXBoeSdcblxuY29uc3QgY29uZmlnID0ge1xuICB0aGVtZToge1xuICAgIHR5cG9ncmFwaHksXG4gICAgZXh0ZW5kOiB7XG4gICAgICBjb2xvcnM6IHtcbiAgICAgICAgZ3JheToge1xuICAgICAgICAgIDI1OiAnI2ZjZmNmZCcsXG4gICAgICAgICAgNTA6ICcjZjlmYWZiJyxcbiAgICAgICAgICAxMDA6ICcjZjJmNGY3JyxcbiAgICAgICAgICAyMDA6ICcjZWFlY2YwJyxcbiAgICAgICAgICAzMDA6ICcjZDBkNWRkJyxcbiAgICAgICAgICA0MDA6ICcjOThhMmIzJyxcbiAgICAgICAgICA1MDA6ICcjNjY3MDg1JyxcbiAgICAgICAgICA3MDA6ICcjNDc1NDY3JyxcbiAgICAgICAgICA2MDA6ICcjMzQ0MDU0JyxcbiAgICAgICAgICA4MDA6ICcjMWQyOTM5JyxcbiAgICAgICAgICA5MDA6ICcjMTAxODI4JyxcbiAgICAgICAgfSxcbiAgICAgICAgcHJpbWFyeToge1xuICAgICAgICAgIDI1OiAnI2Y1ZjhmZicsXG4gICAgICAgICAgNTA6ICcjZWZmNGZmJyxcbiAgICAgICAgICAxMDA6ICcjZDFlMGZmJyxcbiAgICAgICAgICAyMDA6ICcjYjJjY2ZmJyxcbiAgICAgICAgICAzMDA6ICcjODRhZGZmJyxcbiAgICAgICAgICA0MDA6ICcjNTI4YmZmJyxcbiAgICAgICAgICA1MDA6ICcjMjk3MGZmJyxcbiAgICAgICAgICA2MDA6ICcjMTU1ZWVmJyxcbiAgICAgICAgICA3MDA6ICcjMDA0ZWViJyxcbiAgICAgICAgICA4MDA6ICcjMDA0MGMxJyxcbiAgICAgICAgICA5MDA6ICcjMDAzNTllJyxcbiAgICAgICAgfSxcbiAgICAgICAgYmx1ZToge1xuICAgICAgICAgIDUwMDogJyNFMUVGRkUnLFxuICAgICAgICB9LFxuICAgICAgICBncmVlbjoge1xuICAgICAgICAgIDUwOiAnI0YzRkFGNycsXG4gICAgICAgICAgMTAwOiAnI0RFRjdFQycsXG4gICAgICAgICAgODAwOiAnIzAzNTQzRicsXG5cbiAgICAgICAgfSxcbiAgICAgICAgeWVsbG93OiB7XG4gICAgICAgICAgMTAwOiAnI0ZERjZCMicsXG4gICAgICAgICAgODAwOiAnIzcyM0IxMycsXG4gICAgICAgIH0sXG4gICAgICAgIHB1cnBsZToge1xuICAgICAgICAgIDUwOiAnI0Y2RjVGRicsXG4gICAgICAgICAgMjAwOiAnI0RDRDdGRScsXG4gICAgICAgIH0sXG4gICAgICAgIGluZGlnbzoge1xuICAgICAgICAgIDI1OiAnI0Y1RjhGRicsXG4gICAgICAgICAgNTA6ICcjRUVGNEZGJyxcbiAgICAgICAgICAxMDA6ICcjRTBFQUZGJyxcbiAgICAgICAgICAzMDA6ICcjQTRCQ0ZEJyxcbiAgICAgICAgICA0MDA6ICcjODA5OEY5JyxcbiAgICAgICAgICA2MDA6ICcjNDQ0Q0U3JyxcbiAgICAgICAgICA4MDA6ICcjMkQzMUE2JyxcbiAgICAgICAgfSxcbiAgICAgICAgLi4udGFpbHdpbmRUaGVtZVZhckRlZmluZSxcbiAgICAgIH0sXG4gICAgICBzY3JlZW5zOiB7XG4gICAgICAgICdtb2JpbGUnOiAnMTAwcHgnLFxuICAgICAgICAvLyA9PiBAbWVkaWEgKG1pbi13aWR0aDogMTAwcHgpIHsgLi4uIH1cbiAgICAgICAgJ3RhYmxldCc6ICc2NDBweCcsIC8vIDM5MVxuICAgICAgICAvLyA9PiBAbWVkaWEgKG1pbi13aWR0aDogNjAwcHgpIHsgLi4uIH1cbiAgICAgICAgJ3BjJzogJzc2OXB4JyxcbiAgICAgICAgLy8gPT4gQG1lZGlhIChtaW4td2lkdGg6IDc2OXB4KSB7IC4uLiB9XG4gICAgICAgICcyayc6ICcyNTYwcHgnLFxuICAgICAgfSxcbiAgICAgIGJveFNoYWRvdzoge1xuICAgICAgICAneHMnOiAnMHB4IDFweCAycHggMHB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wNSknLFxuICAgICAgICAnc20nOiAnMHB4IDFweCAycHggMHB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wNiksIDBweCAxcHggM3B4IDBweCByZ2JhKDE2LCAyNCwgNDAsIDAuMTApJyxcbiAgICAgICAgJ3NtLW5vLWJvdHRvbSc6ICcwcHggLTFweCAycHggMHB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wNiksIDBweCAtMXB4IDNweCAwcHggcmdiYSgxNiwgMjQsIDQwLCAwLjEwKScsXG4gICAgICAgICdtZCc6ICcwcHggMnB4IDRweCAtMnB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wNiksIDBweCA0cHggOHB4IC0ycHggcmdiYSgxNiwgMjQsIDQwLCAwLjEwKScsXG4gICAgICAgICdsZyc6ICcwcHggNHB4IDZweCAtMnB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wMyksIDBweCAxMnB4IDE2cHggLTRweCByZ2JhKDE2LCAyNCwgNDAsIDAuMDgpJyxcbiAgICAgICAgJ3hsJzogJzBweCA4cHggOHB4IC00cHggcmdiYSgxNiwgMjQsIDQwLCAwLjAzKSwgMHB4IDIwcHggMjRweCAtNHB4IHJnYmEoMTYsIDI0LCA0MCwgMC4wOCknLFxuICAgICAgICAnMnhsJzogJzBweCAyNHB4IDQ4cHggLTEycHggcmdiYSgxNiwgMjQsIDQwLCAwLjE4KScsXG4gICAgICAgICczeGwnOiAnMHB4IDMycHggNjRweCAtMTJweCByZ2JhKDE2LCAyNCwgNDAsIDAuMTQpJyxcbiAgICAgICAgJ3N0YXR1cy1pbmRpY2F0b3ItZ3JlZW4tc2hhZG93JzogJzBweCAycHggNnB4IDBweCB2YXIoLS1jb2xvci1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1zdWNjZXNzLWhhbG8pLCAwcHggMHB4IDBweCAxcHggdmFyKC0tY29sb3ItY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtYm9yZGVyLW91dGVyKScsXG4gICAgICAgICdzdGF0dXMtaW5kaWNhdG9yLXdhcm5pbmctc2hhZG93JzogJzBweCAycHggNnB4IDBweCB2YXIoLS1jb2xvci1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC13YXJuaW5nLWhhbG8pLCAwcHggMHB4IDBweCAxcHggdmFyKC0tY29sb3ItY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtYm9yZGVyLW91dGVyKScsXG4gICAgICAgICdzdGF0dXMtaW5kaWNhdG9yLXJlZC1zaGFkb3cnOiAnMHB4IDJweCA2cHggMHB4IHZhcigtLWNvbG9yLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LWVycm9yLWhhbG8pLCAwcHggMHB4IDBweCAxcHggdmFyKC0tY29sb3ItY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtYm9yZGVyLW91dGVyKScsXG4gICAgICAgICdzdGF0dXMtaW5kaWNhdG9yLWJsdWUtc2hhZG93JzogJzBweCAycHggNnB4IDBweCB2YXIoLS1jb2xvci1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1ub3JtYWwtaGFsbyksIDBweCAwcHggMHB4IDFweCB2YXIoLS1jb2xvci1jb21wb25lbnRzLWJhZGdlLXN0YXR1cy1saWdodC1ib3JkZXItb3V0ZXIpJyxcbiAgICAgICAgJ3N0YXR1cy1pbmRpY2F0b3ItZ3JheS1zaGFkb3cnOiAnMHB4IDFweCAycHggMHB4IHZhcigtLWNvbG9yLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LWRpc2FibGVkLWhhbG8pLCAwcHggMHB4IDBweCAxcHggdmFyKC0tY29sb3ItY29tcG9uZW50cy1iYWRnZS1zdGF0dXMtbGlnaHQtYm9yZGVyLW91dGVyKScsXG4gICAgICB9LFxuICAgICAgb3BhY2l0eToge1xuICAgICAgICAyOiAnMC4wMicsXG4gICAgICAgIDg6ICcwLjA4JyxcbiAgICAgIH0sXG4gICAgICBmb250RmFtaWx5OiB7XG4gICAgICAgIGluc3RydW1lbnQ6IFsndmFyKC0tZm9udC1pbnN0cnVtZW50LXNlcmlmKScsICdzZXJpZiddLFxuICAgICAgfSxcbiAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICcyeHMnOiAnMC42MjVyZW0nLFxuICAgICAgfSxcbiAgICAgIGJhY2tncm91bmRDb2xvcjoge1xuICAgICAgICAnYmFja2dyb3VuZC1ncmFkaWVudC1iZy1maWxsLWNoYXQtYnViYmxlLWJnLTMnOiAndmFyKC0tY29sb3ItYmFja2dyb3VuZC1ncmFkaWVudC1iZy1maWxsLWNoYXQtYnViYmxlLWJnLTMpJyxcbiAgICAgIH0sXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IHtcbiAgICAgICAgJ2NoYXRib3QtYmcnOiAndmFyKC0tY29sb3ItY2hhdGJvdC1iZyknLFxuICAgICAgICAnY2hhdC1idWJibGUtYmcnOiAndmFyKC0tY29sb3ItY2hhdC1idWJibGUtYmcpJyxcbiAgICAgICAgJ2NoYXQtaW5wdXQtbWFzayc6ICd2YXIoLS1jb2xvci1jaGF0LWlucHV0LW1hc2spJyxcbiAgICAgICAgJ3dvcmtmbG93LXByb2Nlc3MtYmcnOiAndmFyKC0tY29sb3Itd29ya2Zsb3ctcHJvY2Vzcy1iZyknLFxuICAgICAgICAnd29ya2Zsb3ctcnVuLWZhaWxlZC1iZyc6ICd2YXIoLS1jb2xvci13b3JrZmxvdy1ydW4tZmFpbGVkLWJnKScsXG4gICAgICAgICd3b3JrZmxvdy1iYXRjaC1mYWlsZWQtYmcnOiAndmFyKC0tY29sb3Itd29ya2Zsb3ctYmF0Y2gtZmFpbGVkLWJnKScsXG4gICAgICAgICdtYXNrLXRvcDJib3R0b20tZ3JheS01MC10by10cmFuc3BhcmVudCc6ICd2YXIoLS1tYXNrLXRvcDJib3R0b20tZ3JheS01MC10by10cmFuc3BhcmVudCknLFxuICAgICAgICAnbWFya2V0cGxhY2UtZGl2aWRlci1iZyc6ICd2YXIoLS1jb2xvci1tYXJrZXRwbGFjZS1kaXZpZGVyLWJnKScsXG4gICAgICAgICdtYXJrZXRwbGFjZS1wbHVnaW4tZW1wdHknOiAndmFyKC0tY29sb3ItbWFya2V0cGxhY2UtcGx1Z2luLWVtcHR5KScsXG4gICAgICAgICd0b2FzdC1zdWNjZXNzLWJnJzogJ3ZhcigtLWNvbG9yLXRvYXN0LXN1Y2Nlc3MtYmcpJyxcbiAgICAgICAgJ3RvYXN0LXdhcm5pbmctYmcnOiAndmFyKC0tY29sb3ItdG9hc3Qtd2FybmluZy1iZyknLFxuICAgICAgICAndG9hc3QtZXJyb3ItYmcnOiAndmFyKC0tY29sb3ItdG9hc3QtZXJyb3ItYmcpJyxcbiAgICAgICAgJ3RvYXN0LWluZm8tYmcnOiAndmFyKC0tY29sb3ItdG9hc3QtaW5mby1iZyknLFxuICAgICAgICAnYXBwLWRldGFpbC1iZyc6ICd2YXIoLS1jb2xvci1hcHAtZGV0YWlsLWJnKScsXG4gICAgICAgICdhcHAtZGV0YWlsLW92ZXJsYXktYmcnOiAndmFyKC0tY29sb3ItYXBwLWRldGFpbC1vdmVybGF5LWJnKScsXG4gICAgICAgICdkYXRhc2V0LWNodW5rLXByb2Nlc3Mtc3VjY2Vzcy1iZyc6ICd2YXIoLS1jb2xvci1kYXRhc2V0LWNodW5rLXByb2Nlc3Mtc3VjY2Vzcy1iZyknLFxuICAgICAgICAnZGF0YXNldC1jaHVuay1wcm9jZXNzLWVycm9yLWJnJzogJ3ZhcigtLWNvbG9yLWRhdGFzZXQtY2h1bmstcHJvY2Vzcy1lcnJvci1iZyknLFxuICAgICAgICAnZGF0YXNldC1jaHVuay1kZXRhaWwtY2FyZC1ob3Zlci1iZyc6ICd2YXIoLS1jb2xvci1kYXRhc2V0LWNodW5rLWRldGFpbC1jYXJkLWhvdmVyLWJnKScsXG4gICAgICAgICdkYXRhc2V0LWNoaWxkLWNodW5rLWV4cGFuZC1idG4tYmcnOiAndmFyKC0tY29sb3ItZGF0YXNldC1jaGlsZC1jaHVuay1leHBhbmQtYnRuLWJnKScsXG4gICAgICAgICdkYXRhc2V0LW9wdGlvbi1jYXJkLWJsdWUtZ3JhZGllbnQnOiAndmFyKC0tY29sb3ItZGF0YXNldC1vcHRpb24tY2FyZC1ibHVlLWdyYWRpZW50KScsXG4gICAgICAgICdkYXRhc2V0LW9wdGlvbi1jYXJkLXB1cnBsZS1ncmFkaWVudCc6ICd2YXIoLS1jb2xvci1kYXRhc2V0LW9wdGlvbi1jYXJkLXB1cnBsZS1ncmFkaWVudCknLFxuICAgICAgICAnZGF0YXNldC1vcHRpb24tY2FyZC1vcmFuZ2UtZ3JhZGllbnQnOiAndmFyKC0tY29sb3ItZGF0YXNldC1vcHRpb24tY2FyZC1vcmFuZ2UtZ3JhZGllbnQpJyxcbiAgICAgICAgJ2RhdGFzZXQtY2h1bmstbGlzdC1tYXNrLWJnJzogJ3ZhcigtLWNvbG9yLWRhdGFzZXQtY2h1bmstbGlzdC1tYXNrLWJnKScsXG4gICAgICAgICdsaW5lLWRpdmlkZXItYmcnOiAndmFyKC0tY29sb3ItbGluZS1kaXZpZGVyLWJnKScsXG4gICAgICAgICdkYXRhc2V0LXdhcm5pbmctbWVzc2FnZS1iZyc6ICd2YXIoLS1jb2xvci1kYXRhc2V0LXdhcm5pbmctbWVzc2FnZS1iZyknLFxuICAgICAgICAncHJpY2UtcHJlbWl1bS1iYWRnZS1iYWNrZ3JvdW5kJzogJ3ZhcigtLWNvbG9yLXByZW1pdW0tYmFkZ2UtYmFja2dyb3VuZCknLFxuICAgICAgICAncHJlbWl1bS15ZWFybHktdGlwLXRleHQtYmFja2dyb3VuZCc6ICd2YXIoLS1jb2xvci1wcmVtaXVtLXllYXJseS10aXAtdGV4dC1iYWNrZ3JvdW5kKScsXG4gICAgICAgICdwcmljZS1wcmVtaXVtLXRleHQtYmFja2dyb3VuZCc6ICd2YXIoLS1jb2xvci1wcmVtaXVtLXRleHQtYmFja2dyb3VuZCknLFxuICAgICAgICAncHJpY2UtZW50ZXJwcmlzZS1iYWNrZ3JvdW5kJzogJ3ZhcigtLWNvbG9yLXByaWNlLWVudGVycHJpc2UtYmFja2dyb3VuZCknLFxuICAgICAgICAnZ3JpZC1tYXNrLWJhY2tncm91bmQnOiAndmFyKC0tY29sb3ItZ3JpZC1tYXNrLWJhY2tncm91bmQpJyxcbiAgICAgICAgJ25vZGUtZGF0YS1zb3VyY2UtYmcnOiAndmFyKC0tY29sb3Itbm9kZS1kYXRhLXNvdXJjZS1iZyknLFxuICAgICAgICAndGFnLXNlbGVjdG9yLW1hc2stYmcnOiAndmFyKC0tY29sb3ItdGFnLXNlbGVjdG9yLW1hc2stYmcpJyxcbiAgICAgICAgJ3RhZy1zZWxlY3Rvci1tYXNrLWhvdmVyLWJnJzogJ3ZhcigtLWNvbG9yLXRhZy1zZWxlY3Rvci1tYXNrLWhvdmVyLWJnKScsXG4gICAgICAgICdwaXBlbGluZS10ZW1wbGF0ZS1jYXJkLWhvdmVyLWJnJzogJ3ZhcigtLWNvbG9yLXBpcGVsaW5lLXRlbXBsYXRlLWNhcmQtaG92ZXItYmcpJyxcbiAgICAgICAgJ3BpcGVsaW5lLWFkZC1kb2N1bWVudHMtdGl0bGUtYmcnOiAndmFyKC0tY29sb3ItcGlwZWxpbmUtYWRkLWRvY3VtZW50cy10aXRsZS1iZyknLFxuICAgICAgICAnYmlsbGluZy1wbGFuLXRpdGxlLWJnJzogJ3ZhcigtLWNvbG9yLWJpbGxpbmctcGxhbi10aXRsZS1iZyknLFxuICAgICAgICAnYmlsbGluZy1wbGFuLWNhcmQtcHJlbWl1bS1iZyc6ICd2YXIoLS1jb2xvci1iaWxsaW5nLXBsYW4tY2FyZC1wcmVtaXVtLWJnKScsXG4gICAgICAgICdiaWxsaW5nLXBsYW4tY2FyZC1lbnRlcnByaXNlLWJnJzogJ3ZhcigtLWNvbG9yLWJpbGxpbmctcGxhbi1jYXJkLWVudGVycHJpc2UtYmcpJyxcbiAgICAgICAgJ2tub3dsZWRnZS1waXBlbGluZS1jcmVhdGlvbi1mb290ZXItYmcnOiAndmFyKC0tY29sb3Ita25vd2xlZGdlLXBpcGVsaW5lLWNyZWF0aW9uLWZvb3Rlci1iZyknLFxuICAgICAgfSxcbiAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICAnc3Bpbi1zbG93JzogJ3NwaW4gMnMgbGluZWFyIGluZmluaXRlJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW3RhaWx3aW5kVHlwb2dyYXBoeV0sXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YWlsd2luZGxhYnMvdGFpbHdpbmRjc3MvZGlzY3Vzc2lvbnMvNTk2OVxuICBjb3JlUGx1Z2luczoge1xuICAgIHByZWZsaWdodDogZmFsc2UsXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIl19