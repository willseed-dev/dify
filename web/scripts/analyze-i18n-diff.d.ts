/**
 * This script compares i18n keys between current branch (flat JSON) and main branch (nested TS).
 *
 * It checks:
 * 1. All namespaces from main branch have corresponding JSON files
 * 2. No TS files exist in current branch (all should be converted to JSON)
 * 3. All keys from main branch exist in current branch
 * 4. Values for existing keys haven't changed
 * 5. Lists newly added keys and values
 *
 * Usage: npx tsx scripts/analyze-i18n-diff.ts
 */
export {};
