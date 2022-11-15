# fast-lzw
Extremely fast LZW decompression for JavaScript using WASM extracted from FFmpeg. Can decompress upwards of ~100MB/s.

```javascript
import { LZW } from 'fast-lzw'
const WORKER_POOL_SIZE = 4

async function decompress(blob) {
  const lzw = new LZW(WORKER_POOL_SIZE)
  const arrayBuffer = await blob.arrayBuffer()
  
  // FastLZW can also take TypedArrays as input, it just
  // gets their ArrayBuffers
  const uint8Arrays = await lzw.decompress([ arrayBuffer ])
  
  return uint8Arrays.map(_ => _.buffer)
}

```

TIP: For fastest performance, if you have multiple blocks (e.g. from a TIFF), pass them all to LZW.decompress in a single call. Ideally they'd be backed by SharedArrayBuffer(s). FastLZW will not use web workers if instatiated without a WORKER_POOL_SIZE argument.
