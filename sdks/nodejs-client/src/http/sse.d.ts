import type { Readable } from "node:stream";
import type { BinaryStream, DifyStream, Headers, StreamEvent } from "../types/common";
export declare const parseSseStream: <T>(stream: Readable) => AsyncIterable<StreamEvent<T>>;
export declare const createSseStream: <T>(stream: Readable, meta: {
    status: number;
    headers: Headers;
    requestId?: string;
}) => DifyStream<T>;
export declare const createBinaryStream: (stream: Readable, meta: {
    status: number;
    headers: Headers;
    requestId?: string;
}) => BinaryStream;
