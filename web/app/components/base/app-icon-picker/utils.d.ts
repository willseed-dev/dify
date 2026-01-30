export declare const createImage: (url: string) => Promise<HTMLImageElement>;
export declare function getRadianAngle(degreeValue: number): number;
export declare function getMimeType(fileName: string): string;
/**
 * Returns the new bounding area of a rotated rectangle.
 */
export declare function rotateSize(width: number, height: number, rotation: number): {
    width: number;
    height: number;
};
/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default function getCroppedImg(imageSrc: string, pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
}, fileName: string, rotation?: number, flip?: {
    horizontal: boolean;
    vertical: boolean;
}): Promise<Blob>;
export declare function checkIsAnimatedImage(file: File): Promise<boolean>;
