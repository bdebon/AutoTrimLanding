/** Run with `npm run brand:assets`. Fonts are static instances of our OFL-licensed site fonts. */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { ImageResponse } from 'next/og.js';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public');
// Reuse the actual header glyph rather than maintaining a second logo.
const logo = await readFile(path.join(root, 'components/landing/Logo.tsx'), 'utf8');
const pulse = logo.match(/PULSE_PATH = "([^"]+)"/)[1];
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100"><rect width="100" height="100" rx="${100 * 186 / 824}" fill="#FF5B2E"/><svg x="13" y="13" width="74" height="74" viewBox="0 0 16 16"><path d="${pulse}" fill="none" stroke="#14100E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></svg>`;
await writeFile(path.join(output, 'favicon.svg'), icon);
for (const [size, name] of [[16,'favicon-16x16.png'],[32,'favicon-32x32.png'],[180,'apple-touch-icon.png'],[192,'icon-192.png'],[512,'icon-512.png']]) {
  await sharp(Buffer.from(icon)).resize(size,size).png().toFile(path.join(output,name));
}
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(size => sharp(Buffer.from(icon)).resize(size,size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1,2); header.writeUInt16LE(sizes.length,4);
let offset = header.length;
for(let i=0;i<sizes.length;i++) {
 const at=6+16*i; header[at]=sizes[i]; header[at+1]=sizes[i];
 header.writeUInt16LE(1,at+4); header.writeUInt16LE(32,at+6);
 header.writeUInt32LE(pngs[i].length,at+8); header.writeUInt32LE(offset,at+12); offset+=pngs[i].length;
}
await writeFile(path.join(root,'app/favicon.ico'),Buffer.concat([header,...pngs]));

const h=React.createElement;
const fonts=await Promise.all(['display','ui'].map(async name=>({name,data:await readFile(path.join(root,`scripts/assets/${name}.ttf`)),weight:name==='display'?700:400,style:'normal'})));
const brandIcon='data:image/svg+xml;base64,'+Buffer.from(icon).toString('base64');
const cards = [
 ['home-fr','DU RUSH AU MONTAGE',['Moins de coupes.','Plus de création.'],'Silences, hésitations, multicam. Retrouvez le plaisir de monter.'],
 ['home-en','FROM FOOTAGE TO EDIT',['Less cutting.','More creating.'],'Silences, filler words, multicam. Get back to the edit.'],
 ['download-fr','MACOS · WINDOWS',['Votre prochain montage','commence ici.'],'Essayez AutoTrim gratuitement, avec vos propres rushes.'],
 ['download-en','MACOS · WINDOWS',['Your next edit','starts here.'],'Try AutoTrim for free, with your own footage.'],
 ['pricing-fr','LES LICENCES AUTOTRIM',['Essayez sur vos rushes.','Choisissez ensuite.'],'Traitez et prévisualisez gratuitement. Une licence pour exporter.'],
 ['pricing-en','AUTOTRIM LICENSES',['Try it on your footage.','Decide from there.'],'Process and preview for free. Get a license when you export.'],
 ['guides-en','THE EDITOR’S NOTEBOOK',['More time for','the good cuts.'],'Practical guides to silence removal, filler words and faster rough cuts.'],
];
for(const [slug,name] of Object.entries({'timebolt':'TimeBolt','autocut':'AutoCut','descript':'Descript','final-cut-pro':'Final Cut Pro','premiere-pro':'Premiere Pro'})) {
 for(const locale of ['fr','en']) cards.push([`compare-${slug}-${locale}`,locale==='fr'?'LE COMPARATIF':'THE COMPARISON',['AutoTrim',`vs ${name}`],locale==='fr'?'Deux approches du montage. Trouvez celle qui vous convient.':'Two approaches to editing. Find the right one for your workflow.']);
}
cards.push(
 ['guide-how-to-remove-silence-final-cut-pro-en','THE PRACTICAL GUIDE',['Remove silence.','Keep Final Cut Pro.'],'Manual and automatic workflows, explained.'],
 ['guide-best-silence-remover-final-cut-pro-en','THE EDITOR’S GUIDE',['A silence remover','for Final Cut Pro.'],'Compare the tools. Find your workflow.'],
 ['guide-timebolt-alternative-mac-en','THE EDITOR’S GUIDE',['Beyond TimeBolt.','A Mac workflow.'],'What to look for when choosing an alternative.'],
 ['guide-remove-filler-words-from-video-en','THE PRACTICAL GUIDE',['Less “um”.','More to say.'],'How to remove filler words from your videos.'],
 ['guide-descript-alternative-final-cut-pro-en','THE EDITOR’S GUIDE',['Beyond Descript.','Inside your workflow.'],'Cleanup for editors who work in Final Cut Pro.'],
);
await mkdir(path.join(output,'og'),{recursive:true});
for(const [name,eyebrow,lines,description] of cards) {
 const tree=h('div',{style:{width:'100%',height:'100%',display:'flex',flexDirection:'column',background:'#100E0C',backgroundImage:'radial-gradient(ellipse at 100% 100%, #462419 0%, #100E0C 72%)',color:'#F3EEE8',padding:'54px 64px',fontFamily:'ui'}},
  h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between'}},
   h('div',{style:{display:'flex',alignItems:'center',gap:16}},h('img',{src:brandIcon,width:54,height:54}),h('span',{style:{fontFamily:'display',fontSize:34}},'AutoTrim')),
   h('span',{style:{fontSize:16,letterSpacing:2,color:'#B7AA9E'}},eyebrow)),
  h('div',{style:{display:'flex',flexDirection:'column',marginTop:65,fontFamily:'display',fontSize:lines.some(l=>l.length>23)?62:76,lineHeight:1.06,letterSpacing:-2.5}},...lines.map((line,i)=>h('div',{key:i,style:{color:i?'#FF754F':'#F3EEE8'}},line))),
  h('div',{style:{fontSize:23,color:'#C4B9AE',marginTop:26,maxWidth:940,lineHeight:1.45}},description),
  h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto',borderTop:'1px solid #443127',paddingTop:23}},
   h('span',{style:{fontSize:18,color:'#B7AA9E'}},'autotrim.app'),
   h('div',{style:{display:'flex',height:46,alignItems:'center',gap:5}},...Array.from({length:70},(_,i)=>h('div',{key:i,style:{width:4,height:8+Math.round(Math.abs(Math.sin(i*1.73)*Math.sin(i*.26))*35),borderRadius:2,background:i>46?'#FF5B2E':'#80503A'}})))
  )
 );
 const image=new ImageResponse(tree,{width:1200,height:630,fonts});
 const bytes=Buffer.from(await image.arrayBuffer());
 await writeFile(path.join(output,`og/${name}.png`),bytes);
 if(name==='home-en') await sharp(bytes).jpeg({quality:90}).toFile(path.join(output,'og/autotrim-v2.jpg'));
}
console.log(`Generated brand icons and ${cards.length} social previews.`);
