// Servidor local mínimo: sirve la página y guarda los datos en datos/datos.json (solo en esta computadora).
const http=require("http"),fs=require("fs"),path=require("path");
const PORT=8787,RAIZ=__dirname,DATOS=path.join(__dirname,"datos"),ARCH=path.join(DATOS,"datos.json"),COPIAS=path.join(DATOS,"copias");
const TIPOS={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".json":"application/json"};
fs.mkdirSync(COPIAS,{recursive:true});
function copiaDelDia(){
  const d=new Date(),n=`datos-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}.json`,dest=path.join(COPIAS,n);
  if(fs.existsSync(ARCH)&&!fs.existsSync(dest)){
    fs.copyFileSync(ARCH,dest);
    fs.readdirSync(COPIAS).filter(f=>f.startsWith("datos-")).sort().slice(0,-30).forEach(f=>fs.unlinkSync(path.join(COPIAS,f)));
  }
}
function localOk(req){const h=(req.headers.host||"").replace(/:\d+$/,""),o=req.headers.origin;
  return (h==="localhost"||h==="127.0.0.1")&&(!o||/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o))}
http.createServer((req,res)=>{
  if(!localOk(req)){res.writeHead(403);return res.end("No permitido")}
  const url=decodeURIComponent(req.url.split("?")[0]);
  if(url==="/api/datos"){
    if(req.method==="GET"){res.writeHead(200,{"Content-Type":"application/json"});return res.end(fs.existsSync(ARCH)?fs.readFileSync(ARCH):"null")}
    if(req.method==="POST"){
      let b=[];req.on("data",c=>b.push(c)).on("end",()=>{
        try{const t=Buffer.concat(b).toString();JSON.parse(t);copiaDelDia();fs.writeFileSync(ARCH+".tmp",t);fs.renameSync(ARCH+".tmp",ARCH);res.writeHead(200);res.end("ok")}
        catch(e){res.writeHead(400);res.end("error")}});return}
    res.writeHead(405);return res.end();
  }
  let f=path.join(RAIZ,url==="/"?"index.html":url);
  if(f.endsWith(path.sep)||(fs.existsSync(f)&&fs.statSync(f).isDirectory()))f=path.join(f,"index.html");
  if(!f.startsWith(RAIZ)){res.writeHead(403);return res.end()}
  fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end("No encontrado")}res.writeHead(200,{"Content-Type":TIPOS[path.extname(f)]||"application/octet-stream"});res.end(d)});
}).listen(PORT,"127.0.0.1",()=>{
  const u=`http://localhost:${PORT}`;
  console.log("\n  Sistema de clientes funcionando.\n  Abrilo en: "+u+"\n  Los datos se guardan en: "+ARCH+"\n  Dejá esta ventana abierta mientras lo usás. Para cerrar: Ctrl+C.\n");
  require("child_process").exec(`start "" "${u}"`);
}).on("error",e=>{console.log(e.code==="EADDRINUSE"?"\n  Ya está abierto. Abrí http://localhost:"+PORT+" en el navegador.\n":e)});
