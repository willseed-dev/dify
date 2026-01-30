import type { Dayjs } from 'dayjs';
import type { Locale } from '@/i18n-config';
import 'dayjs/locale/de';
import 'dayjs/locale/es';
import 'dayjs/locale/fa';
import 'dayjs/locale/fr';
import 'dayjs/locale/hi';
import 'dayjs/locale/id';
import 'dayjs/locale/it';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/pl';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';
import 'dayjs/locale/sl';
import 'dayjs/locale/th';
import 'dayjs/locale/tr';
import 'dayjs/locale/uk';
import 'dayjs/locale/vi';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
/**
 * Formats a number with comma separators.
 * @example formatNumber(1234567) will return '1,234,567'
 * @example formatNumber(1234567.89) will return '1,234,567.89'
 * @example formatNumber(0.0000008) will return '0.0000008'
 */
export declare const formatNumber: (num: number | string) => string | number;
/**
 * Format file size into standard string format.
 * @param fileSize file size (Byte)
 * @example formatFileSize(1024) will return '1.00 KB'
 * @example formatFileSize(1024 * 1024) will return '1.00 MB'
 */
export declare const formatFileSize: (fileSize: number) => string | number;
/**
 * Format time into standard string format.
 * @example formatTime(60) will return '1.00 min'
 * @example formatTime(60 * 60) will return '1.00 h'
 */
export declare const formatTime: (seconds: number) => string | number;
export declare const downloadFile: ({ data, fileName }: {
    data: Blob;
    fileName: string;
}) => void;
/**
 * Formats a number into a readable string using "k", "M", or "B" suffix.
 * @example
 * 950     => "950"
 * 1200    => "1.2k"
 * 1500000 => "1.5M"
 * 2000000000 => "2B"
 *
 * @param {number} num - The number to format
 * @returns {string} - The formatted number string
 */
export declare const formatNumberAbbreviated: (num: number) => string | undefined;
export declare const formatToLocalTime: (time: Dayjs, local: Locale, format: string) => any;
