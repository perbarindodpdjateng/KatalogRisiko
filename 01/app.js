const headers = ["No","Grup Kegiatan","Daftar Aktivitas / Kegiatan","Potensi Risiko / Risiko Melekat","Jenis Kejadian","Pemilik Risiko","Alat mitigasi Risiko"];
let originalData=[],filteredData=[];
const sheetUrl='https://script.google.com/macros/s/AKfycbwZnBnGaYXqVJ0A_O8FfdjIIygjqC2YFehglHPAT_cPWC6QbBOkwPQUHHY_syS06CJj/exec';

async function fetchData(){
  try{
    const res=await fetch(sheetUrl,{cache:'no-store'});
    const d=await res.json();
    originalData=(d||[]).slice(1).filter(r=>Array.isArray(r)&&r.length);
    filteredData=[...originalData];
    render();
  }catch(e){console.error(e);rowCount.textContent='gagal memuat';}
}
function render(){
  rowCount.textContent=`Jml Data : ${filteredData.length}`;
  tableHead.innerHTML='<tr>'+headers.map((h,i)=>`<th class="${i===0?'sticky-col':''}">${h}</th>`).join('')+'</tr>';
  tableBody.innerHTML=filteredData.map(r=>'<tr>'+r.map((c,i)=>`<td class="${i===0?'sticky-col':''}">${c??''}</td>`).join('')+'</tr>').join('');
}
searchInput.addEventListener('input',e=>{
  const k=e.target.value.toLowerCase();
  filteredData=originalData.filter(r=>r.some(c=>String(c??'').toLowerCase().includes(k)));
  render();
});
pdfBtn.onclick=()=>{
  const style=`
    @page{size:A4 landscape;margin:1cm}
    body{font-family:Calibri;font-size:10px}
    h1{font-size:16px;margin:0 0 6px}
    footer{font-size:10px;color:#555;margin-top:10px;text-align:center}
    table{width:100%;border-collapse:collapse}
    th,td{border:1px solid #333;padding:4px}
    th{background:#007bff;color:#fff}
  `;
  const title=document.getElementById('docTitle').textContent;
  const head='<tr>'+headers.map(h=>`<th>${h}</th>`).join('')+'</tr>';
  const rows=filteredData.map(r=>'<tr>'+r.map(c=>`<td>${c??''}</td>`).join('')+'</tr>').join('');
  const html=`
    <html>
    <head><style>${style}</style></head>
    <body onload="window.print()">
      <h1>${title}</h1>
      <table>${head}${rows}</table>
      <footer>© 2025 German Sparkassenstiftung & Perbarindo DPD Jateng. All rights reserved.</footer>
    </body>
    </html>`;
  const w=window.open('','_blank','width=900,height=600');
  w.document.write(html);
  w.document.close();
  w.focus();
};
toTop.onclick   =()=> document.querySelector('.table-wrapper').scrollTop = 0;
toBottom.onclick=()=> {
  const wrap=document.querySelector('.table-wrapper');
  wrap.scrollTop=wrap.scrollHeight;
};
fetchData();
setInterval(fetchData,15000);
