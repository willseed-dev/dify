import type { Emitter, EventType, Handler, WildcardHandler } from 'mitt';
export type _Events = Record<EventType, unknown>;
export type UseSubscribeOption = {
    /**
     * Whether the subscription is enabled.
     * @default true
     */
    enabled: boolean;
};
export type ExtendedOn<Events extends _Events> = {
    <Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>, options?: UseSubscribeOption): void;
    (type: '*', handler: WildcardHandler<Events>, option?: UseSubscribeOption): void;
};
export type UseMittReturn<Events extends _Events> = {
    useSubscribe: ExtendedOn<Events>;
    emit: Emitter<Events>['emit'];
};
declare function useMitt<Events extends _Events>(mitt?: Emitter<Events>): UseMittReturn<Events>;
export { useMitt };
