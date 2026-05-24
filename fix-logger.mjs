import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync('grep -rl "console.error" app/api --include="*.ts"').toString().trim().split('\n');

let total = 0;
for (const file of files) {
  let content = readFileSync(file, 'utf8');

  if (!content.includes("from '@/lib/logger'") && !content.includes('from "@/lib/logger"')) {
    content = "import { logger } from '@/lib/logger';\n" + content;
  }

  const before = content;
  content = content.replace(
    /console\.error\(([^)]+)\)/g,
    (_, args) => `logger.error({ route: '${file}' }, ${args})`
  );

  if (content !== before) {
    writeFileSync(file, content);
    total++;
    console.log('Fixed:', file);
  }
}
console.log('Done. Fixed', total, 'files.');
