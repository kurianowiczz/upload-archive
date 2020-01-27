import * as fs from 'fs';
import { ungzip } from 'node-gzip';

export default class ReadService {
    public static async readArch(fileName: string, rowsCount: number) {
        try {
            const data = fs.readFileSync(fileName);
            const decompressed = await ungzip(data);
            return decompressed.toString().split('\n').slice(0, rowsCount);
        } catch (err) {
            return err.toString();
        }
    };
}
