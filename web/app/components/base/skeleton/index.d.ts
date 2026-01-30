import type { ComponentProps, FC } from 'react';
type SkeletonProps = ComponentProps<'div'>;
export declare const SkeletonContainer: FC<SkeletonProps>;
export declare const SkeletonRow: FC<SkeletonProps>;
export declare const SkeletonRectangle: FC<SkeletonProps>;
export declare const SkeletonPoint: FC<SkeletonProps>;
export {};
/**
 * Usage
 * <SkeletonContainer>
 *  <SkeletonRow>
 *    <SkeletonRectangle className="w-96" />
 *    <SkeletonPoint />
 *    <SkeletonRectangle className="w-96" />
 *  </SkeletonRow>
 *  <SkeletonRow>
 *    <SkeletonRectangle className="w-96" />
 *  </SkeletonRow>
 * <SkeletonRow>
 */
