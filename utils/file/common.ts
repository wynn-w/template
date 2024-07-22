import fs from "node:fs";

export function readFileAsByteStream(
    filePath: string,
    blockSize: number
): Promise<{
    fileContent: Uint8Array;
    sum: number;
}> {
    return new Promise((resolve, reject) => {
        let sum = 0;
        let bitBuffer = 0;
        let bitCount = 0;
        const fileContent: number[] = [];
        const readStream = fs.createReadStream(filePath, { highWaterMark: blockSize });
        readStream.on("data", (chunk: number[]) => {
            for (let i = 0; i < chunk.length; i++) {
                bitBuffer = (bitBuffer << 8) | chunk[i];
                bitCount += 8;

                while (bitCount >= 8) {
                    const byte = (bitBuffer >> (bitCount - 8)) & 0xff;
                    sum += byte;
                    fileContent.push(byte);
                    bitCount -= 8;
                }
            }
        });
        readStream.on("end", () => {
            resolve({ fileContent: new Uint8Array(fileContent), sum });
        });

        readStream.on("error", err => {
            console.error(`read file error: ${err}`);
            reject(err?.message || err);
        });
    });
}
