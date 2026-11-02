import fs from 'node:fs/promises'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({channel:'chrome',headless:true})
try {
 const page=await browser.newPage()
 for(const [name,file,cols] of [['hands','hands-source.png',160],['making','making.svg',100],['growing','growing.svg',100],['hands-mobile','hands-source.png',80],['making-mobile','making.svg',60],['growing-mobile','growing.svg',60]]) {
  const bytes=await fs.readFile('docs/public/ascii-creation/'+file)
  const src='data:image/'+(file.endsWith('.svg')?'svg+xml':'png')+';base64,'+bytes.toString('base64')
  const result=await page.evaluate(async({src,cols})=>{
   const image=new Image();image.src=src;await image.decode()
   const c=document.createElement('canvas');c.width=image.width;c.height=image.height
   const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0)
   const pixels=ctx.getImageData(0,0,c.width,c.height).data
   let x0=c.width,y0=c.height,x1=0,y1=0
   for(let y=0;y<c.height;y+=2)for(let x=0;x<c.width;x+=2){if(pixels[(y*c.width+x)*4]<215){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}}
   const pad=12;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(c.width,x1+pad);y1=Math.min(c.height,y1+pad)
   const rows=Math.ceil((y1-y0)/(x1-x0)*cols*.6)
   c.width=cols;c.height=rows;ctx.fillStyle='white';ctx.fillRect(0,0,cols,rows);ctx.drawImage(image,x0,y0,x1-x0,y1-y0,0,0,cols,rows)
   const small=ctx.getImageData(0,0,cols,rows).data
   const ramp=' .:-=+*#%@';const lines=[]
   for(let y=0;y<rows;y++){let line='';for(let x=0;x<cols;x++){const v=small[(y*cols+x)*4];const density=v>233?0:(255-v)/255;line+=ramp[Math.min(9,Math.ceil(density*9))]}lines.push(line)}
   return {cols,rows,lines}
  },{src,cols})
  await fs.writeFile('.vitepress/theme/ascii/creation/'+name+'.json',JSON.stringify(result))
  console.log(name,result.cols,result.rows,result.lines.join('').replaceAll(' ','').length)
 }
}finally{await browser.close()}
