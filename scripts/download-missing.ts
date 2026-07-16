import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

function dl(url: string, dest: string): Promise<boolean> {
  return new Promise(resolve => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res: any) => {
      if (res.statusCode === 200) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const f = fs.createWriteStream(dest);
        res.pipe(f); f.on('finish', () => { f.close(); resolve(true); });
      } else resolve(false);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  const IMG = path.join(process.cwd(), 'public', 'images');

  // Files to download - tried multiple URL patterns
  const missing = [
    // Flat gallery files (from different CDN paths)
    '20260105145329_47363.jpg',
    '20250818172649_44779.jpg',
    '20250818172706_72647.jpg',
    '20250818172721_11969.jpg',
    '20250818172733_87272.jpg',
    '20251121155545_84612.jpg',
    // Editor subdirectory files
    'hydra-pumps/editor/20260420153539_98499.png',
    'hydra-pumps/editor/20250528175225_65321.png',
    'hydra-pumps/editor/20250529105215_12026.png',
    'hydra-pumps/editor/20250527161505_72061.png',
    'hydra-pumps/editor/20250527161600_98755.png',
    'hydra-pumps/editor/20250527161655_57759.png',
    'hydra-pumps/editor/20250527161706_25007.png',
    'hydra-pumps/editor/20250530175936_58754.png',
    'hydra-pumps/editor/20250529162345_76724.png',
    'hydra-pumps/editor/20250528165659_73736.png',
    'hydra-pumps/editor/20250527155019_20375.png',
    'hydra-pumps/editor/20250527155039_64071.png',
    'hydra-pumps/editor/20250527155203_35386.png',
    'hydra-pumps/editor/20250527155324_50838.png',
    'hydra-pumps/editor/20250527155347_89715.png',
    'hydra-pumps/editor/20250528110529_71810.png',
    'hydra-pumps/editor/20250529171446_16512.png',
    'hydra-pumps/editor/20250527162327_44576.png',
    'hydra-pumps/editor/20250529102825_70567.png',
    'hydra-pumps/editor/20250530103525_23237.png',
    'hydra-pumps/editor/20250530160022_68323.png',
    'hydra-pumps/editor/20250528171929_30367.png',
    'hydra-pumps/editor/20250529163950_38849.png',
    'hydra-pumps/editor/20250528160201_58962.png',
    'hydra-pumps/editor/20250530161101_81368.png',
    'hydra-pumps/editor/20250528115053_85783.png',
    'hydra-pumps/editor/20250528115105_70257.png',
    'hydra-pumps/editor/20250528173345_24173.png',
    'hydra-pumps/editor/20250530174725_42688.png',
    'hydra-pumps/editor/20250528163121_35093.png',
    'hydra-pumps/editor/20250529180105_52755.png',
    'hydra-pumps/editor/20250603110816_89540.png',
    'hydra-pumps/editor/20250918175148_38587.webp',
    'hydra-pumps/editor/20250506173421_15324.png',
    'hydra-pumps/editor/20250527155807_63016.png',
  ];

  // Remove files already downloaded by copy
  const copied = fs.readdirSync(path.join(IMG, 'hydra-pumps/editor')).filter(f => f.endsWith('.jpg'));
  for (const fn of copied) {
    const idx = missing.indexOf(fn);
    if (idx >= 0) missing.splice(idx, 1);
  }

  console.log('Files to download:', missing.length);

  let dlCount = 0, fail = 0;
  for (const fn of missing) {
    const dest = path.join(IMG, fn);
    if (fs.existsSync(dest)) continue;

    const urlPatterns = [];
    if (fn.includes('editor/')) {
      const name = fn.split('/').pop()!;
      urlPatterns.push(
        `https://img.hydra-pumps.com/photo/hydra-pumps/editor/${name}`,
        `https://img.hydra-pumps.com/test/hydra-pumps.com/photo/hydra-pumps/editor/${name}`,
      );
    } else {
      urlPatterns.push(
        `https://img.hydra-pumps.com/photo/${fn}`,
        `https://img.hydra-pumps.com/photo/hydra-pumps/editor/${fn}`,
        `https://img.hydra-pumps.com/test/hydra-pumps.com/photo/${fn}`,
      );
    }

    let ok = false;
    for (const url of urlPatterns) {
      if (await dl(url, dest)) { ok = true; break; }
    }

    if (ok) { dlCount++; process.stdout.write('.'); }
    else { fail++; process.stdout.write('x'); }
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\nDownloaded: ${dlCount}, Failed: ${fail}`);
}

main().catch(err => console.error(err.message));
