import * as path from 'path';
import * as fs from 'node:fs';

export let dataBase = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/core/db/data.json'), 'utf8'),
);
