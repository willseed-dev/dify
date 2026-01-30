import type { FC } from 'react';
import 'react-pdf-highlighter/dist/style.css';
type PdfPreviewProps = {
    url: string;
    onCancel: () => void;
};
declare const PdfPreview: FC<PdfPreviewProps>;
export default PdfPreview;
