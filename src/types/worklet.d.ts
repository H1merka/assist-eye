declare module '*.worklet.ts' {
  // Worklet modules export a default function which runs on worklet thread.
  const fn: (frame: any, width: number, height: number) => Uint8Array;
  export default fn;
}
