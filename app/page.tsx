"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import PptxGenJS from "pptxgenjs";

const departments: Record<string, string> = {
  "互医与AI应用产品研发部": "聚焦互联网医疗与产业AI应用，以AI和数据驱动医疗服务、医药及健康管理场景创新。团队持续建设线上医检诊药服务闭环和可复用的产业级AI能力，提升医生执业效率、用户健康体验与业务运营效能。",
  "B2C产品研发部": "负责京东健康核心B2C业务的全流程系统能力建设，覆盖用户健康消费、商品交易以及供应链、商家和运营管理。团队横跨医药、保健、器械、医保等多种业态，并通过AI技术持续推动产品创新和降本增效。",
  "即时零售与到家研发部": "聚焦健康即时零售与到家健康服务，建设线上线下一体化网络和端到端产品能力。团队覆盖交易履约、商家经营、线下药房供应链及到家服务平台，以数字化和AI提升履约体验、经营效率与服务质量。",
  "消费与线下产品研发部": "聚焦体检、医美、正骨、口腔及高端健管等线下健康服务，以AI Native理念重构服务流程。团队通过数字化运营与服务标准化，建设线上线下一体化、全程可追溯的健康消费平台。",
  "企业产品研发部": "聚焦京东健康ToB业务，依托电商、技术、商品和服务供应链能力，为不同行业和客户提供以BBC商城为核心的解决方案，覆盖医疗金、创新药营销及保险创新等场景。",
  "智能算法部": "作为京东健康算法技术与AI中台核心团队，聚焦医疗大模型、AI Agent、搜索推荐和多模态理解，推动前沿算法在问诊、辅诊、健康管理及药品供应链等真实业务场景落地。",
  "创新产品研发部": "聚焦ToC医疗健康创新产品探索，是公司面向消费者健康领域的前沿探索与产品孵化团队。团队以AI与大模型为核心驱动力，打造智能、精准、可及的健康解决方案，并通过健康APP、夜谜、京东GO等产品延伸健康服务边界。",
  "数据平台部": "负责京东健康全域数据能力建设，构建统一数据仓库、分析可视化和精细化用户画像体系。团队沉淀标准化、可信化、智能化的数据底座，以数据产品和服务赋能业务决策、运营提效与持续增长。",
  "共享平台部": "负责京东健康平台化能力建设，通过中台技术整合通用业务系统、底层技术及AI基础能力，为各业态提供标准化、可复用的中台服务。",
  "组织效能部": "作为战略执行中枢，聚焦战略项目管理、PMO运营和智能化效能体系建设。团队通过资源精细化管理、战略到执行的闭环衔接及AI研发流程创新，持续提升组织能力和战略落地效率。",
  "体验设计部": "负责京东健康全场景体验设计，覆盖消费者端医疗与健康服务、医生端线上服务和询证医学AI工具，以及自营体检与医美全链路。"
};

const samples = {
  description: "负责核心业务或项目，制定策略并推动落地，通过用户与业务数据分析持续优化关键指标，联动产品、研发、设计等团队推进项目并完成效果复盘。希望你具备相关岗位经验，熟悉业务方法和工作流程，拥有良好的数据分析、沟通协作与项目推动能力，目标导向、执行力强，具备相关行业或项目经验者优先。"
};

export default function Home() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState("warm");
  const [format, setFormat] = useState("feed");
  const [form, setForm] = useState({
    job: "产品运营", department: "创新产品研发部", city: "北京", level: "P6",
    intro: departments["创新产品研发部"], description: samples.description,
    highlight1: "京东健康App核心增长", highlight2: "覆盖多元健康场景", highlight3: "增长策略完整闭环",
    contact: "wangcongmeng.1", email: "wangcongmeng.1@jd.com"
  });
  const [busy, setBusy] = useState("");
  const description = form.description;
  const descriptionDense = description.length > (format === "story" ? 240 : format === "feed" ? 160 : 90);
  const highlights = useMemo(() => [form.highlight1, form.highlight2, form.highlight3].map(x => x.trim()).filter(Boolean), [form.highlight1, form.highlight2, form.highlight3]);
  const update = (key: string, value: string) => setForm(v => ({ ...v, [key]: value }));
  const selectDepartment = (name: string) => setForm(v => ({ ...v, department: name, intro: departments[name] || v.intro }));

  async function downloadPng() {
    if (!posterRef.current) return;
    setBusy("png");
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 2, cacheBust: true, backgroundColor: "#f7f5f3" });
    const formatName = format === "story" ? "9x16" : format === "feed" ? "3x4" : "1x1";
    const a = document.createElement("a"); a.href = dataUrl; a.download = `京东健康-${form.job}-${form.level}-${formatName}.png`; a.click();
    setBusy("");
  }

  async function downloadPpt() {
    setBusy("ppt");
    const pptx = new PptxGenJS();
    const formatName = format === "story" ? "9x16" : format === "feed" ? "3x4" : "1x1";
    const slideHeight = format === "story" ? 13.333 : format === "feed" ? 10 : 7.5;
    pptx.defineLayout({ name: "POSTER", width: 7.5, height: slideHeight }); pptx.layout = "POSTER";
    pptx.author = "京东健康活水岗位海报生成器"; pptx.subject = `${form.job}招聘海报`; pptx.title = `${form.job}｜${form.department}`;
    const s = pptx.addSlide(); const red = template === "classic" ? "E1251B" : "C92922"; const bg = template === "classic" ? "F7F5F3" : "FFF9F7";
    s.background = { color: bg };
    s.addShape(pptx.ShapeType.ellipse, { x: 5.35, y: -0.6, w: 2.9, h: 2.9, fill: { color: "FFF0EE" }, line: { color: "FFF0EE" } });
    s.addShape(pptx.ShapeType.ellipse, { x: 6.5, y: -0.3, w: 1.35, h: 1.35, fill: { color: red }, line: { color: red } });
    const text = (t:string,x:number,y:number,w:number,h:number,size:number,color="202124",bold=false,align:"left"|"center"|"right"="left") => s.addText(t,{x,y,w,h,fontFace:"Microsoft YaHei",fontSize:size,color,bold,margin:0,breakLine:false,fit:"shrink",valign:"mid",align});
    const badge = (label:string,x:number,y:number,w=1.5) => { s.addShape(pptx.ShapeType.roundRect,{x,y,w,h:.42,rectRadius:.1,fill:{color:"FFE9E7"},line:{color:"F6C9C5",width:1}}); text(label,x,y,w,.42,17,red,true,"center"); };
    const addHighlights = (y:number) => {
      text("💡 岗位亮点",.6,y,1.35,.34,13,red,true,"center");
      highlights.slice(0,3).forEach((item,i) => {
        const x = .6 + i * 2.08;
        s.addShape(pptx.ShapeType.roundRect,{x,y:y+.48,w:1.88,h:.46,rectRadius:.08,fill:{color:"FFF9F8"},line:{color:"F4D8D5",width:1}});
        text(`${String(i+1).padStart(2,"0")}  ${item}`,x+.08,y+.48,1.72,.46,10,i===0?red:"303238",true,"center");
      });
    };
    if (format !== "story") {
      text("京东健康",.58,.34,3.1,.48,28,red,true);
      s.addShape(pptx.ShapeType.roundRect,{x:.58,y:1.02,w:2.15,h:.45,rectRadius:.1,fill:{color:red},line:{color:red}});
      text("内部活水岗位",.58,1.02,2.15,.45,18,"FFFFFF",true,"center");
      text(form.job,.6,1.65,5.9,.58,format === "feed" ? 32 : 29,"202124",true);
      text(`${form.department}  ·  ${form.city}  ·  ${form.level}`,.62,2.32,5.9,.24,13,"666A73");
      s.addShape(pptx.ShapeType.line,{x:.6,y:2.7,w:6.25,h:0,line:{color:"E9E4E1",width:1}});
      addHighlights(format === "square" ? 3 : 2.9);
      if (format === "feed") {
        badge("岗位介绍&要求",.6,4.05,2.15); text(description,.6,4.65,6.1,2.7,descriptionDense?10:11,"666A73");
        s.addShape(pptx.ShapeType.roundRect,{x:.6,y:8.1,w:6.25,h:1.15,rectRadius:.1,fill:{color:"202124"},line:{color:"202124"}});
        text("投递方式",.92,8.28,1.4,.25,16,"FFFFFF",true); text("内部活水候选人优先",4.8,8.28,1.65,.22,10,"FFB3AE",true,"right");
        text(`京ME联系：${form.contact}`,.92,8.63,3.6,.24,13,"FFFFFF",true); text(`简历请发送至：${form.email}`,.92,8.94,5.3,.2,10,"DADCE0");
        text("让每一次流动，都通往更适合的位置",.6,9.62,6.25,.22,10,"666A73",false,"center");
      } else {
        s.addShape(pptx.ShapeType.roundRect,{x:.6,y:4.72,w:6.25,h:1.15,rectRadius:.1,fill:{color:"202124"},line:{color:"202124"}});
        text("投递方式",.9,4.9,1.35,.24,15,"FFFFFF",true); text("内部活水候选人优先",4.8,4.9,1.65,.2,9,"FFB3AE",true,"right");
        text(`京ME联系：${form.contact}`,.9,5.24,3.5,.22,12,"FFFFFF",true); text(`简历请发送至：${form.email}`,.9,5.54,5.3,.18,9,"DADCE0");
        text("让每一次流动，都通往更适合的位置",.6,6.72,6.25,.2,9,"666A73",false,"center");
      }
      await pptx.writeFile({ fileName: `京东健康-${form.job}-${form.level}-${formatName}.pptx` }); setBusy(""); return;
    }
    text("京东健康",.62,.42,3.2,.55,32,red,true); s.addShape(pptx.ShapeType.roundRect,{x:.6,y:1.36,w:2.55,h:.52,rectRadius:.12,fill:{color:red},line:{color:red}}); text("内部活水岗位",.6,1.36,2.55,.52,21,"FFFFFF",true,"center");
    text(form.job,.62,2.14,5.8,.68,36,"202124",true); text(`${form.department}  ·  ${form.city}  ·  ${form.level}`,.65,2.95,5.8,.28,15,"666A73");
    s.addShape(pptx.ShapeType.line,{x:.6,y:3.38,w:6.25,h:0,line:{color:"E9E4E1",width:1}});
    s.addShape(pptx.ShapeType.roundRect,{x:.6,y:3.7,w:6.25,h:1.55,rectRadius:.1,fill:{color:"FFFFFF"},line:{color:"E9E4E1",width:1}}); text(`关于${form.department}`,.95,3.95,3.8,.28,17,red,true); text(form.intro,.95,4.28,5.5,.78,14,"202124");
    s.addShape(pptx.ShapeType.roundRect,{x:.6,y:5.55,w:6.25,h:4.72,rectRadius:.12,fill:{color:"FFFFFF"},line:{color:"E9E4E1",width:1}});
    s.addShape(pptx.ShapeType.roundRect,{x:.9,y:5.86,w:2.25,h:.48,rectRadius:.12,fill:{color:"FFE9E7"},line:{color:"F6C9C5",width:1}}); text("岗位介绍&要求",.9,5.86,2.25,.48,19,red,true,"center"); text(description,.9,6.62,5.65,3.25,descriptionDense?12:14,"666A73");
    s.addShape(pptx.ShapeType.roundRect,{x:.6,y:10.85,w:6.25,h:1.35,rectRadius:.1,fill:{color:"202124"},line:{color:"202124"}}); text("投递方式",.95,11.05,1.5,.3,18,"FFFFFF",true); text("内部活水候选人优先",4.75,11.05,1.65,.25,11,"FFB3AE",true,"right"); text(`京ME联系：${form.contact}`,.95,11.43,3.5,.28,15,"FFFFFF",true); text(`简历请发送至：${form.email}`,.95,11.78,5.5,.22,11,"DADCE0"); text("让每一次流动，都通往更适合的位置",.6,12.82,6.25,.25,11,"666A73",false,"center");
    await pptx.writeFile({ fileName: `京东健康-${form.job}-${form.level}-${formatName}.pptx` }); setBusy("");
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-mark">京东健康</div><div className="product-name">活水岗位海报生成器 <span>初版</span></div><div className="status-dot">部门资料已连接</div></header>
      <section className="workspace">
        <aside className="panel editor">
          <div className="panel-title"><div><span className="step">01</span><h1>填写岗位信息</h1></div><p>填写内容后，右侧海报会实时更新。</p></div>
          <div className="template-picker"><label>选择模板</label><div className="template-list"><button className={template === "warm" ? "selected" : ""} onClick={() => setTemplate("warm")}><i className="thumb warm"/>默认模板</button><button className={template === "classic" ? "selected" : ""} onClick={() => setTemplate("classic")}><i className="thumb classic"/>模板2</button></div></div>
          <div className="grid-fields"><Field label="岗位名称" value={form.job} onChange={v=>update("job",v)}/><Field label="职级" value={form.level} onChange={v=>update("level",v)}/><Field label="工作地点" value={form.city} onChange={v=>update("city",v)}/><label className="field"><span>部门名称</span><select value={form.department} onChange={e=>selectDepartment(e.target.value)}>{Object.keys(departments).map(x=><option key={x}>{x}</option>)}</select></label></div>
          {format === "story" && <label className="field"><span>部门介绍 <em>已自动匹配，可编辑</em></span><textarea rows={4} value={form.intro} onChange={e=>update("intro",e.target.value)}/></label>}
          <div className="field highlight-fields"><span>岗位亮点 <em>每条最多 12 个字</em></span><div><HighlightField index={1} value={form.highlight1} onChange={v=>update("highlight1",v)}/><HighlightField index={2} value={form.highlight2} onChange={v=>update("highlight2",v)}/><HighlightField index={3} value={form.highlight3} onChange={v=>update("highlight3",v)}/></div></div>
          {format !== "square" && <label className="field"><span>岗位介绍&要求 <em>{format === "story" ? "建议不超过 300 字" : "建议不超过 200 字"}</em></span><textarea rows={9} value={form.description} onChange={e=>update("description",e.target.value)} placeholder="请综合描述岗位工作内容、岗位价值及任职要求，无需分条。"/></label>}
          <section className="delivery-fields"><h3>投递信息</h3><div className="grid-fields compact"><Field label="京ME联系人" value={form.contact} onChange={v=>update("contact",v)}/><Field label="投递邮箱" value={form.email} onChange={v=>update("email",v)}/></div></section>
        </aside>
        <section className="preview-zone"><div className="preview-head"><div><span className="step">02</span><h2>成品预览</h2></div><span className="scale-note">不同尺寸会自动调整信息密度</span></div>
          <div className="format-picker" role="group" aria-label="选择海报尺寸">
            <button className={format === "feed" ? "selected" : ""} onClick={()=>setFormat("feed")}><b>3:4</b><span>论坛配图</span></button>
            <button className={format === "story" ? "selected" : ""} onClick={()=>setFormat("story")}><b>9:16</b><span>完整长海报</span></button>
            <button className={format === "square" ? "selected" : ""} onClick={()=>setFormat("square")}><b>1:1</b><span>群聊卡片</span></button>
          </div>
          <div className={`poster-stage ${format}`}>
            <Poster ref={posterRef} form={form} description={description} highlights={highlights} template={template} format={format} dense={descriptionDense}/>
          </div>
          <div className="actions"><button className="secondary" onClick={downloadPpt} disabled={!!busy}>{busy==="ppt"?"正在生成…":"下载当前尺寸 PPT"}</button><button className="primary" onClick={downloadPng} disabled={!!busy}>{busy==="png"?"正在生成…":"下载 PNG 海报"}</button></div>
        </section>
      </section>
    </main>
  );
}

function Field({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}){return <label className="field"><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)}/></label>}

function HighlightField({index,value,onChange}:{index:number,value:string,onChange:(v:string)=>void}){return <label><span>{index}</span><input maxLength={12} value={value} onChange={e=>onChange(e.target.value)} placeholder={`亮点 ${index}`}/><small>{value.length}/12</small></label>}

const Poster = ({ref,form,description,highlights,template,format,dense=false}:{ref:React.Ref<HTMLDivElement>,form:any,description:string,highlights:string[],template:string,format:string,dense?:boolean}) => <div ref={ref} className={`poster ${template} ${format}${dense ? " dense" : ""}`}>
  <div className="orbit"><b/></div><div className="poster-brand">京东健康</div><div className="poster-tag">内部活水岗位</div><div className="hero-title">{form.job||"岗位名称"}</div><div className="meta">{form.department}　·　{form.city}　·　{form.level}</div><div className="divider"/>
  <div className="intro-card"><h3>关于{form.department}</h3><p>{form.intro}</p></div>
  {highlights.length > 0 && <div className="highlight-card"><h3>岗位亮点</h3><div>{highlights.map((x,i)=><span key={i}><b>{String(i + 1).padStart(2, "0")}</b><em>{x}</em></span>)}</div></div>}
  {format !== "square" && <section className="poster-section unified"><h3>岗位介绍&要求</h3><p>{description}</p></section>}
  <div className="apply-card"><div className="apply-top"><h3>投递方式</h3><b>内部活水候选人优先</b></div><h4>京ME联系：{form.contact}</h4><p>简历请发送至：{form.email}</p></div><footer>让每一次流动，都通往更适合的位置</footer>
</div>;
