"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://knip.dev/reference/configuration
 */
const config = {
    entry: [
        'scripts/**/*.{js,ts,mjs}',
        'bin/**/*.{js,ts,mjs}',
    ],
    ignore: [
        'i18n/**',
        'public/**',
    ],
    ignoreBinaries: [
        'only-allow',
    ],
    ignoreDependencies: [],
    rules: {
        files: 'warn',
        dependencies: 'warn',
        devDependencies: 'warn',
        optionalPeerDependencies: 'warn',
        unlisted: 'warn',
        unresolved: 'warn',
        exports: 'warn',
        nsExports: 'warn',
        classMembers: 'warn',
        types: 'warn',
        nsTypes: 'warn',
        enumMembers: 'warn',
        duplicates: 'warn',
    },
};
exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25pcC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrbmlwLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBOztHQUVHO0FBQ0gsTUFBTSxNQUFNLEdBQWU7SUFDekIsS0FBSyxFQUFFO1FBQ0wsMEJBQTBCO1FBQzFCLHNCQUFzQjtLQUN2QjtJQUNELE1BQU0sRUFBRTtRQUNOLFNBQVM7UUFDVCxXQUFXO0tBQ1o7SUFDRCxjQUFjLEVBQUU7UUFDZCxZQUFZO0tBQ2I7SUFDRCxrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxNQUFNO1FBQ2IsWUFBWSxFQUFFLE1BQU07UUFDcEIsZUFBZSxFQUFFLE1BQU07UUFDdkIsd0JBQXdCLEVBQUUsTUFBTTtRQUNoQyxRQUFRLEVBQUUsTUFBTTtRQUNoQixVQUFVLEVBQUUsTUFBTTtRQUNsQixPQUFPLEVBQUUsTUFBTTtRQUNmLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLFlBQVksRUFBRSxNQUFNO1FBQ3BCLEtBQUssRUFBRSxNQUFNO1FBQ2IsT0FBTyxFQUFFLE1BQU07UUFDZixXQUFXLEVBQUUsTUFBTTtRQUNuQixVQUFVLEVBQUUsTUFBTTtLQUNuQjtDQUNGLENBQUE7QUFFRCxrQkFBZSxNQUFNLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEtuaXBDb25maWcgfSBmcm9tICdrbmlwJ1xuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly9rbmlwLmRldi9yZWZlcmVuY2UvY29uZmlndXJhdGlvblxuICovXG5jb25zdCBjb25maWc6IEtuaXBDb25maWcgPSB7XG4gIGVudHJ5OiBbXG4gICAgJ3NjcmlwdHMvKiovKi57anMsdHMsbWpzfScsXG4gICAgJ2Jpbi8qKi8qLntqcyx0cyxtanN9JyxcbiAgXSxcbiAgaWdub3JlOiBbXG4gICAgJ2kxOG4vKionLFxuICAgICdwdWJsaWMvKionLFxuICBdLFxuICBpZ25vcmVCaW5hcmllczogW1xuICAgICdvbmx5LWFsbG93JyxcbiAgXSxcbiAgaWdub3JlRGVwZW5kZW5jaWVzOiBbXSxcbiAgcnVsZXM6IHtcbiAgICBmaWxlczogJ3dhcm4nLFxuICAgIGRlcGVuZGVuY2llczogJ3dhcm4nLFxuICAgIGRldkRlcGVuZGVuY2llczogJ3dhcm4nLFxuICAgIG9wdGlvbmFsUGVlckRlcGVuZGVuY2llczogJ3dhcm4nLFxuICAgIHVubGlzdGVkOiAnd2FybicsXG4gICAgdW5yZXNvbHZlZDogJ3dhcm4nLFxuICAgIGV4cG9ydHM6ICd3YXJuJyxcbiAgICBuc0V4cG9ydHM6ICd3YXJuJyxcbiAgICBjbGFzc01lbWJlcnM6ICd3YXJuJyxcbiAgICB0eXBlczogJ3dhcm4nLFxuICAgIG5zVHlwZXM6ICd3YXJuJyxcbiAgICBlbnVtTWVtYmVyczogJ3dhcm4nLFxuICAgIGR1cGxpY2F0ZXM6ICd3YXJuJyxcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnXG4iXX0=