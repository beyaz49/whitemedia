import { useState } from "react";
import CameraIntro from "@/components/CameraIntro";

export default function CameraReview() {
  const [time,setTime]=useState(.85);
  const [phone,setPhone]=useState(false);
  return <main style={{minHeight:"100vh",padding:20,background:"#e9e9e6",color:"#111",fontSize:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:18}}>
      <strong>White Media · Sony açılış kontrolü</strong>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[[.85,"Bayonet"],[1.65,"Yaklaşma"],[2.23,"Kilitlenme"],[3.6,"Kamera"],[4.5,"Logo"]].map(([seconds,title])=><button key={title} onClick={()=>setTime(Number(seconds))} aria-pressed={time===seconds} style={{padding:"10px 14px",background:"white",border:"1px solid #ccc",borderRadius:5}}>{title}</button>)}
        <button onClick={()=>setPhone(false)} aria-pressed={!phone} style={{padding:"10px 14px",background:"white",border:"1px solid #ccc",borderRadius:5}}>Masaüstü</button>
        <button onClick={()=>setPhone(true)} aria-pressed={phone} style={{padding:"10px 14px",background:"white",border:"1px solid #ccc",borderRadius:5}}>Telefon 390 px</button>
      </div>
    </div>
    <div data-testid="camera-review-viewport" style={{width:phone?390:1120,maxWidth:"100%",height:phone?780:650,margin:"0 auto",position:"relative",overflow:"hidden",borderRadius:phone?20:3}}>
      <CameraIntro key={phone?"phone":"desktop"} reviewTime={time} reviewPhone={phone}/>
    </div>
  </main>;
}
