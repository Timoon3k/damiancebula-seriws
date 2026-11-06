(() => {
  'use strict';
  document.querySelectorAll('.brand img[data-logo-tone]').forEach(image => {
    const inspect = () => {
      if (!image.naturalWidth) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(512, image.naturalWidth);
        canvas.height = Math.max(1, Math.round(canvas.width * image.naturalHeight / image.naturalWidth));
        const context = canvas.getContext('2d', {willReadFrequently:true});
        context.drawImage(image,0,0,canvas.width,canvas.height);
        const pixels = context.getImageData(0,0,canvas.width,canvas.height).data;
        let x1=canvas.width, y1=canvas.height, x2=0, y2=0;
        for(let y=0;y<canvas.height;y++) for(let x=0;x<canvas.width;x++) {
          const n=(y*canvas.width+x)*4;
          if(pixels[n+3]<96 || Math.max(pixels[n],pixels[n+1],pixels[n+2])<12) continue;
          x1=Math.min(x1,x);y1=Math.min(y1,y);x2=Math.max(x2,x);y2=Math.max(y2,y);
        }
        if(x2<=x1 || y2<=y1) return;
        const bw=x2-x1+1,bh=y2-y1+1;
        let light=0,count=0;
        for(let y=y1;y<=y2;y++) for(let x=Math.round(x1+bw*.38);x<=x2;x++) {
          const n=(y*canvas.width+x)*4;
          if(pixels[n+3]<128 || Math.max(pixels[n],pixels[n+1],pixels[n+2])<12) continue;
          light+=.2126*pixels[n]+.7152*pixels[n+1]+.0722*pixels[n+2];count++;
        }
        if(image.dataset.logoTone==='auto' && count && light/count<145) image.dataset.logoTone='dark';
        const box=image.closest('.brand-uploaded-lockup');
        if(box){
          const fit=()=>{
            const scale=Math.min(box.clientWidth/bw,box.clientHeight/bh);
            image.style.width=`${canvas.width*scale}px`;image.style.height=`${canvas.height*scale}px`;
            image.style.left=`${(box.clientWidth-bw*scale)/2-x1*scale}px`;
            image.style.top=`${(box.clientHeight-bh*scale)/2-y1*scale}px`;
            box.classList.add('is-fitted');
          };
          fit();if('ResizeObserver' in window)new ResizeObserver(fit).observe(box);
        }
      } catch { /* Explicit contrast controls remain available for cross-origin logos. */ }
    };
    if(image.complete) inspect();else image.addEventListener('load',inspect,{once:true});
  });
})();
