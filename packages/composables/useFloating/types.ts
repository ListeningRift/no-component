// The type declarations from '@floating-ui/dom' are used to solve the non-portable type inference problem prompted by TypeScript.

import type { MiddlewareState, Coords, Padding } from '@floating-ui/dom'

export type Alignment = 'start' | 'end'
export type Side = 'top' | 'right' | 'bottom' | 'left'
export type AlignedPlacement = `${Side}-${Alignment}`
export type Placement = Side | AlignedPlacement
export type Strategy = 'absolute' | 'fixed'

type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element. Represents
       * the distance (gutter or margin) between the reference and floating
       * element.
       * @default 0
       */
      mainAxis?: number
      /**
       * The axis that runs along the alignment of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      crossAxis?: number
      /**
       * The same axis as `crossAxis` but applies only to aligned placements
       * and inverts the `end` alignment. When set to a number, it overrides the
       * `crossAxis` value.
       *
       * A positive number will move the floating element in the direction of
       * the opposite edge to the one that is aligned, while a negative number
       * the reverse.
       * @default null
       */
      alignmentAxis?: number | null
    }

type OffsetFunction = (state: MiddlewareState) => OffsetValue

export type OffsetOptions = OffsetValue | OffsetFunction

export interface ShiftOptions {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default true
   */
  mainAxis: boolean
  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default false
   */
  crossAxis: boolean
  /**
   * Accepts a function that limits the shifting done in order to prevent
   * detachment.
   */
  limiter: {
    fn: (state: MiddlewareState) => Coords
    options?: any
  }
}

export interface FlipOptions {
  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * @default true
   */
  mainAxis: boolean
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * @default true
   */
  crossAxis: boolean
  /**
   * Placements to try sequentially if the preferred `placement` does not fit.
   * @default [oppositePlacement] (computed)
   */
  fallbackPlacements: Array<Placement>
  /**
   * What strategy to use when no placements fit.
   * @default 'bestFit'
   */
  fallbackStrategy: 'bestFit' | 'initialPlacement'
  /**
   * Whether to allow fallback to the perpendicular axis of the preferred
   * placement, and if so, which side direction along the axis to prefer.
   * @default 'none' (disallow fallback)
   */
  fallbackAxisSideDirection: 'none' | 'start' | 'end'
  /**
   * Whether to flip to placements with the opposite alignment if they fit
   * better.
   * @default true
   */
  flipAlignment: boolean
}

export interface ArrowOptions {
  /**
   * The arrow element to be positioned.
   * @default undefined
   */
  element: any
  /**
   * The padding between the arrow element and the floating element edges.
   * Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & object
type Promisable<T> = T | Promise<T>

interface CoreSizeOptions {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply(
    args: MiddlewareState & {
      availableWidth: number
      availableHeight: number
    }
  ): void | Promise<void>
}

export type SizeOptions = Prettify<
  Omit<CoreSizeOptions, 'apply'> & {
    /**
     * Function that is called to perform style mutations to the floating element
     * to change its size.
     * @default undefined
     */
    apply(
      args: MiddlewareState & {
        availableWidth: number
        availableHeight: number
      }
    ): Promisable<void>
  }
>

export interface AutoPlacementOptions {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether to check for most space along this axis.
   * @default false
   */
  crossAxis: boolean
  /**
   * Choose placements with a particular alignment.
   * @default undefined
   */
  alignment: Alignment | null
  /**
   * Whether to choose placements with the opposite alignment if the preferred
   * alignment does not fit.
   * @default true
   */
  autoAlignment: boolean
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `alignment` option if explicitly set.
   * @default allPlacements (variable)
   */
  allowedPlacements: Array<Placement>
}

export interface HideOptions {
  /**
   * The strategy used to determine when to hide the floating element.
   */
  strategy: 'referenceHidden' | 'escaped'
}

export interface InlineOptions {
  /**
   * Viewport-relative `x` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  x: number
  /**
   * Viewport-relative `y` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  y: number
  /**
   * Represents the padding around a disjoined rect when choosing it.
   * @default 2
   */
  padding: Padding
}
