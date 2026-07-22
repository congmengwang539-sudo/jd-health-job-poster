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
  duties: "1. 负责核心业务或项目，制定策略并推动落地；\n2. 分析用户与业务数据，持续优化关键指标；\n3. 联动产品、研发、设计等团队推进项目；\n4. 建立目标拆解、验证和效果复盘机制。",
  requirements: "1. 本科及以上学历，具备相关岗位经验；\n2. 熟悉业务方法和工作流程；\n3. 具备数据分析、沟通协作和项目推动能力；\n4. 目标导向、执行力强；\n5. 相关行业或项目经验优先。"
};

function compact(text: string, limit: number) {
  const clean = text.replace(/\r/g, "").trim();
  if (!clean) return [];
  const parts = clean.split(/\n+|(?=\d+[.、])/).map(x => x.trim()).filter(Boolean);
  return parts.slice(0, limit).map((x, i) => {
    const body = x.replace(/^\d+[.、]\s*/, "").replace(/[；;。]+$/, "");
    const short = body.length > 48 ? body.slice(0, 47).replace(/[，、][^，、]*$/, "") + "…" : body;
    return `${i + 1}. ${short}${i === Math.min(parts.length, limit) - 1 ? "。" : "；"}`;
  });
}

export default function Home() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState("classic");
  const [format, setFormat] = useState("story");
  const [form, setForm] = useState({
    job: "产品运营", department: "创新产品研发部", city: "北京", level: "P6",
    intro: departments["创新产品研发部"], duties: samples.duties, requirements: samples.requirements,
    highlights: "京东健康App核心增长方向\n覆盖问诊、购药、健康管理等丰富场景\n参与用户增长策略到落地的完整闭环",
    contact: "wangcongmeng.1", email: "wangcongmeng.1@jd.com", jobCode: "XXXXXX"
  });
  const [busy, setBusy] = useState("");
  const duties = useMemo(() => compact(form.duties, 4), [form.duties]);
  const requirements = useMemo(() => compact(form.requirements, 6), [form.requirements]);
  const highlights = useMemo(() => form.highlights.split(/\n+/).map(x => x.trim().replace(/^[-•·]\s*/, "")).filter(Boolean).slice(0, 3), [form.highlights]);
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
    pptx.defineLayout({ name: "POSTER", width: 7.5, height: 13.333 }); pptx.layout = "POSTER";
    pptx.author = "京东健康活水岗位海报生成器"; pptx.subject = `${form.job}招聘海报`; pptx.title = `${form.job}｜${form.department}`;
    const s = pptx.addSlide(); const red = template === "classic" ? "E1251B" : "C92922"; const bg = template === "classic" ? "F7F5F3" : "FFF9F7";
    s.background = { color: bg };
    s.addShape(pptx.ShapeType.ellipse, { x: 5.35, y: -0.6, w: 2.9, h: 2.9, fill: { color: "FFF0EE" }, line: { color: "FFF0EE" } });
    s.addShape(pptx.ShapeType.ellipse, { x: 6.5, y: -0.3, w: 1.35, h: 1.35, fill: { color: red }, line: { color: red } });
    const text = (t:string,x:number,y:number,w:number,h:number,size:number,color="202124",bold=false,align:"left"|"center"|"right"="left") => s.addText(t,{x,y,w,h,fontFace:"Microsoft YaHei",fontSize:size,color,bold,margin:0,breakLine:false,fit:"shrink",valign:"mid",align});
    text("京东健康",.62,.42,3.2,.55,32,red,true); s.addShape(pptx.ShapeType.roundRect,{x:.6,y:1.36,w:2.55,h:.52,rectRadius:.12,fill:{color:red},line:{color:red}}); text("内部活水岗位",.6,1.36,2.55,.52,21,"FFFFFF",true,"center");
    text(form.job,.62,2.14,5.8,.68,36,"202124",true); text(`${form.department}  ·  ${form.city}  ·  ${form.level}`,.65,2.95,5.8,.28,15,"666A73");
    s.addShape(pptx.ShapeType.line,{x:.6,y:3.38,w:6.25,h:0,line:{color:"E9E4E1",width:1}});
    s.addShape(pptx.ShapeType.roundRect,{x:.6,y:3.7,w:6.25,h:1.55,rectRadius:.1,fill:{color:"FFFFFF"},line:{color:"E9E4E1",width:1}}); text(`关于${form.department}`,.95,3.95,3.8,.28,17,red,true); text(form.intro,.95,4.28,5.5,.78,14,"202124");
    text("01",.65,5.68,.42,.3,15,red,true); text("岗位职责",1.14,5.62,4.6,.45,24,"202124",true); s.addShape(pptx.ShapeType.line,{x:.6,y:6.06,w:.42,h:0,line:{color:red,width:4}}); text(duties.join("\n"),1.14,6.45,5.45,1.55,14,"666A73");
    text("02",.65,8.24,.42,.3,15,red,true); text("任职要求",1.14,8.18,4.6,.45,24,"202124",true); s.addShape(pptx.ShapeType.line,{x:.6,y:8.62,w:.42,h:0,line:{color:red,width:4}}); text(requirements.join("\n"),1.14,9.0,5.45,1.65,14,"666A73");
    s.addShape(pptx.ShapeType.roundRect,{x:.6,y:10.85,w:6.25,h:1.55,rectRadius:.1,fill:{color:"202124"},line:{color:"202124"}}); text("投递方式",.95,11.05,1.5,.3,18,"FFFFFF",true); text("内部活水候选人优先",4.75,11.05,1.65,.25,11,"FFB3AE",true,"right"); text(`京ME联系：${form.contact}`,.95,11.45,3.5,.28,15,"FFFFFF",true); text(`简历请发送至：${form.email}\n邮件主题：活水申请＋岗位名称＋姓名  ｜  岗位编号：${form.jobCode}`,.95,11.78,5.5,.42,11,"DADCE0"); text("让每一次流动，都通往更适合的位置",.6,12.75,6.25,.25,11,"666A73",false,"center");
    await pptx.writeFile({ fileName: `京东健康-${form.job}-${form.level}.pptx` }); setBusy("");
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand-mark">京东健康</div><div className="product-name">活水岗位海报生成器 <span>初版</span></div><div className="status-dot">部门资料已连接</div></header>
      <section className="workspace">
        <aside className="panel editor">
          <div className="panel-title"><div><span className="step">01</span><h1>填写岗位信息</h1></div><p>填写内容后，右侧海报会实时更新。</p></div>
          <div className="template-picker"><label>选择模板</label><div className="template-list"><button className={template === "classic" ? "selected" : ""} onClick={() => setTemplate("classic")}><i className="thumb classic"/>模板1</button><button className={template === "warm" ? "selected" : ""} onClick={() => setTemplate("warm")}><i className="thumb warm"/>模板2</button></div></div>
          <div className="grid-fields"><Field label="岗位名称" value={form.job} onChange={v=>update("job",v)}/><Field label="职级" value={form.level} onChange={v=>update("level",v)}/><Field label="工作地点" value={form.city} onChange={v=>update("city",v)}/><label className="field"><span>部门名称</span><select value={form.department} onChange={e=>selectDepartment(e.target.value)}>{Object.keys(departments).map(x=><option key={x}>{x}</option>)}</select></label></div>
          <label className="field"><span>部门介绍 <em>已自动匹配，可编辑</em></span><textarea rows={4} value={form.intro} onChange={e=>update("intro",e.target.value)}/></label>
          <label className="field"><span>岗位亮点 <em>每行一条，最多展示 3 条</em></span><textarea rows={4} value={form.highlights} onChange={e=>update("highlights",e.target.value)} placeholder="例如：核心业务方向、成长机会、团队优势"/></label>
          <label className="field"><span>岗位职责 <em>最多提取 4 条</em></span><textarea rows={7} value={form.duties} onChange={e=>update("duties",e.target.value)}/></label>
          <label className="field"><span>任职要求 <em>最多提取 6 条</em></span><textarea rows={7} value={form.requirements} onChange={e=>update("requirements",e.target.value)}/></label>
          <details><summary>投递信息</summary><div className="grid-fields compact"><Field label="京ME联系人" value={form.contact} onChange={v=>update("contact",v)}/><Field label="投递邮箱" value={form.email} onChange={v=>update("email",v)}/><Field label="岗位编号" value={form.jobCode} onChange={v=>update("jobCode",v)}/></div></details>
        </aside>
        <section className="preview-zone"><div className="preview-head"><div><span className="step">02</span><h2>成品预览</h2></div><span className="scale-note">不同尺寸会自动调整信息密度</span></div>
          <div className="format-picker" role="group" aria-label="选择海报尺寸">
            <button className={format === "story" ? "selected" : ""} onClick={()=>setFormat("story")}><b>9:16</b><span>完整长海报</span></button>
            <button className={format === "feed" ? "selected" : ""} onClick={()=>setFormat("feed")}><b>3:4</b><span>论坛配图</span></button>
            <button className={format === "square" ? "selected" : ""} onClick={()=>setFormat("square")}><b>1:1</b><span>群聊卡片</span></button>
          </div>
          <div className={`poster-stage ${format}`}>
            <Poster ref={posterRef} form={form} duties={duties} requirements={requirements} highlights={highlights} template={template} format={format}/>
          </div>
          <div className="actions"><button className="secondary" onClick={downloadPpt} disabled={!!busy}>{busy==="ppt"?"正在生成…":"下载可编辑 PPT"}</button><button className="primary" onClick={downloadPng} disabled={!!busy}>{busy==="png"?"正在生成…":"下载 PNG 海报"}</button></div>
        </section>
      </section>
    </main>
  );
}

function Field({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}){return <label className="field"><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)}/></label>}

const Poster = ({ref,form,duties,requirements,highlights,template,format}:{ref:React.Ref<HTMLDivElement>,form:any,duties:string[],requirements:string[],highlights:string[],template:string,format:string}) => <div ref={ref} className={`poster ${template} ${format}`}>
  <div className="orbit"><b/></div><div className="poster-brand">京东健康</div><div className="poster-tag">内部活水岗位</div><div className="hero-title">{form.job||"岗位名称"}</div><div className="meta">{form.department}　·　{form.city}　·　{form.level}</div><div className="divider"/>
  <div className="intro-card"><h3>关于{form.department}</h3><p>{form.intro}</p></div>
  {highlights.length > 0 && <div className="highlight-card"><h3>岗位亮点</h3><div>{highlights.map((x,i)=><span key={i}>{x}</span>)}</div></div>}
  <PosterSection num="01" title="岗位职责" items={format === "story" ? duties : duties.slice(0, format === "feed" ? 3 : 2)}/>
  {format !== "square" && <PosterSection num="02" title="任职要求" items={format === "story" ? requirements : requirements.slice(0, 3)}/>}
  <div className="apply-card"><div className="apply-top"><h3>投递方式</h3><b>内部活水候选人优先</b></div><h4>京ME联系：{form.contact}</h4><p>简历请发送至：{form.email}<br/>邮件主题：活水申请＋岗位名称＋姓名　｜　岗位编号：{form.jobCode}</p></div><footer>让每一次流动，都通往更适合的位置</footer>
</div>;

function PosterSection({num,title,items}:{num:string,title:string,items:string[]}){return <section className="poster-section"><div className="section-label"><span>{num}</span><i/></div><div><h3>{title}</h3><ol>{items.map((x,i)=><li key={i}>{x.replace(/^\d+\.\s*/,"")}</li>)}</ol></div></section>}
