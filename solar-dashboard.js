const CARD_VERSION = "1.1.0";

class SolarDashboardCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("solar-dashboard-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:solar-dashboard-card" };
  }

  setConfig(config) {
    this.config = config || {};
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.render();
  }

  set hass(value) {
    this._hass = value;
    this.render();
  }

  get hass() {
    return this._hass;
  }

  _entity(name, fallback, unit = "") {
    const entity = name && this._hass?.states?.[name];
    return {
      value: entity?.state ?? fallback,
      unit: entity?.attributes?.unit_of_measurement || unit,
    };
  }

  render() {
    if (!this.shadowRoot || !this.config) return;
    const c = this.config;
    const solar = this._entity(c.solar_power, "573", "W");
    const home = this._entity(c.home_power, "1.4", "kW");
    const battery = this._entity(c.battery_level, "54", "%");
    const grid = this._entity(c.grid_power, "0", "W");
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:#182536;font-family:var(--paper-font-body1_-_font-family,"DM Sans",sans-serif)}
        *{box-sizing:border-box}.card{max-width:1460px;margin:auto;padding:32px 48px 22px;border:1px solid #dce6eb;border-radius:20px;background:linear-gradient(145deg,#faffff,#f4f9fa 45%,#f8fbfc);box-shadow:0 10px 35px #2e465b0d}
        .topbar,.panel-header,.card-heading,.top-actions,footer{display:flex;align-items:center;justify-content:space-between}.eyebrow{margin:0 0 5px;color:#a2adba;font-size:10px;font-weight:700;letter-spacing:.16em}h1,h2,p{margin:0}h1,h2{font-family:"Space Grotesk",sans-serif}h1{font-size:29px;letter-spacing:-.04em}h2{font-size:18px}.top-actions{gap:20px}.live{color:#708195;font-size:12px}.live i,.updated i{display:inline-block;width:7px;height:7px;margin-right:6px;border-radius:50%;background:#4dcc9a;box-shadow:0 0 0 4px #dff7ed}
        .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:34px 0 18px}.metric,.panel{border:1px solid #dce6eb;border-radius:18px;background:#ffffffcc;box-shadow:0 10px 35px #2e465b0d}.metric{padding:20px 21px 17px}.card-heading{justify-content:flex-start;gap:9px;color:#8290a3;font-size:12px;font-weight:600}.card-heading b{margin-left:auto;color:#abb5c0;font-size:10px;font-weight:500}.metric strong{display:block;margin:13px 0 10px;font:600 26px "Space Grotesk"}.metric small{font:500 13px "DM Sans"}.metric p{margin-top:8px;color:#99a6b4;font-size:11px}.metric em{font-style:normal;font-weight:700}.sun{color:#ff9f1f}.blue{color:#63a9e9}.aqua{color:#32b9b5}.purple{color:#8066df}.metric .icon{display:grid;place-items:center;width:25px;height:25px;border-radius:8px;background:#fff3da;font-size:18px}.blue .icon{background:#e5f2ff}.aqua .icon{background:#e2f9f4}.purple .icon{background:#f0ebff}
        .content{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(310px,.8fr);gap:18px}.panel{padding:23px}.updated{color:#a7b1bc;font-size:10px}.flow{min-height:570px}.canvas{height:480px;position:relative;margin-top:8px;overflow:hidden}.connections{position:absolute;inset:0;width:100%;height:100%}.line{fill:none;stroke-width:3;stroke-dasharray:9 9;opacity:.75}.orange{stroke:#ffb43d}.teal{stroke:#53c7c6}.node{position:absolute;text-align:center;z-index:1}.node p{margin-top:5px;color:#8d9bab;font-size:12px;font-weight:600}.node strong{display:block;color:#39bdba;font:700 21px "Space Grotesk"}.node small{font-size:11px}.node .sub{display:block;margin-top:1px;color:#a9b6c3}.solar-node{left:4%;top:82px;color:#ff9f1f}.solar-art{width:105px;height:74px;margin:auto;border:3px solid #ffb743;background:repeating-linear-gradient(90deg,#448bd4 0 17px,#2e6eb7 17px 19px),repeating-linear-gradient(0deg,transparent 0 19px,#2763a5 19px 21px);box-shadow:0 0 0 7px #fff8eb}.home-node{left:56%;top:155px;color:#39bdba}.house-art{width:72px;height:72px;margin:auto;border:2px solid #39bdba;border-radius:50%;display:grid;place-items:center;font-size:30px}.battery-node{left:41%;top:355px;color:#319a91}.battery-art{width:51px;height:78px;margin:auto;border:3px solid #16877f;border-radius:8px;background:linear-gradient(#2e857f 0 53%,#62b6a8 53%);display:grid;place-items:center;color:white;font-size:13px;font-weight:700}.grid-node{right:5%;top:73px;color:#5593c4}.grid-art{width:91px;height:91px;margin:auto;border:2px solid #bddaea;border-radius:50%;display:grid;place-items:center;font-size:40px}.loads{position:absolute;right:1%;bottom:9px;width:160px}.load{display:flex;align-items:center;gap:10px;margin:11px 0;color:#92a8b7}.load>span{display:grid;place-items:center;width:37px;height:37px;border:1px solid #bfd9e0;border-radius:50%;font-size:17px}.load b,.load small{display:block;font-size:11px}.load small{margin-top:3px;color:#748b9d;font-size:12px}
        .side{display:flex;flex-direction:column;gap:18px}.weather{min-height:215px}.weather-main{display:flex;align-items:center;gap:18px;margin:25px 0}.weather-main strong{color:#e8a933;font:600 42px "Space Grotesk"}.weather-main span{color:#75889a;font-size:12px;line-height:1.5}.hours{display:flex;justify-content:space-between;text-align:center;color:#a1adba;font-size:10px}.hours b{display:block;margin-top:5px;color:#65798e;font-size:12px}.device{display:flex;align-items:center;gap:11px;padding:14px 0;border-bottom:1px solid #edf1f3}.device:last-child{border:0}.device div{flex:1}.device b,.device small{display:block;font-size:12px}.device small{margin-top:3px;color:#a4b1bd;font-size:10px}.device strong{font:600 12px "Space Grotesk"}footer{margin-top:19px;padding:0 5px;color:#9daab7;font-size:11px}footer b{color:#6e8193;margin-left:4px}
        @media(max-width:1000px){.card{padding:25px 24px}.content{grid-template-columns:1fr}.side{display:grid;grid-template-columns:1fr 1fr}}@media(max-width:620px){.card{padding:20px 14px}.metrics,.side{grid-template-columns:1fr}.content{display:block}.flow{margin-bottom:16px;padding:15px}.canvas{height:510px}.solar-node{left:0}.grid-node{right:0}.home-node{left:49%}.battery-node{left:35%}.loads{right:-12px}footer{gap:12px;flex-wrap:wrap;justify-content:center}}
      </style>
      <section class="card">
        <header class="topbar"><div><p class="eyebrow">HOME ASSISTANT · ENERGIA</p><h1>Solar home</h1></div><span class="live"><i></i> Ao vivo</span></header>
        <section class="metrics" aria-label="Resumo energético">
          <article class="metric sun"><div class="card-heading"><span class="icon">☀</span><span>Produção solar</span><b>Agora</b></div><strong>${solar.value} <small>${solar.unit}</small></strong><p><em>Produção</em> neste momento</p></article>
          <article class="metric aqua"><div class="card-heading"><span class="icon">▣</span><span>Bateria</span><b>${battery.value}%</b></div><strong>${battery.value}<small>%</small></strong><p><em>Estado atual</em> da bateria</p></article>
          <article class="metric blue"><div class="card-heading"><span class="icon">⌂</span><span>Consumo da casa</span><b>Agora</b></div><strong>${home.value} <small>${home.unit}</small></strong><p><em>Consumo</em> neste momento</p></article>
          <article class="metric purple"><div class="card-heading"><span class="icon">⌁</span><span>Rede elétrica</span><b>Agora</b></div><strong>${grid.value} <small>${grid.unit}</small></strong><p><em>Importação</em> neste momento</p></article>
        </section>
        <section class="content"><article class="panel flow"><div class="panel-header"><div><p class="eyebrow">FLUXO DE ENERGIA</p><h2>Agora</h2></div><span class="updated">Dados do Home Assistant <i></i></span></div><div class="canvas"><svg class="connections" viewBox="0 0 760 460" preserveAspectRatio="none" aria-hidden="true"><path class="line orange" d="M147 117 C232 132 247 168 315 190"/><path class="line teal" d="M348 198 C405 205 430 211 477 230"/><path class="line teal" d="M348 210 C365 280 378 325 410 356"/><path class="line" stroke="#bcddec" d="M530 243 C591 231 640 161 675 112"/></svg>
          <div class="node solar-node"><div class="solar-art"></div><p>Solar</p><strong>${solar.value} <small>${solar.unit}</small></strong><small class="sub">Produção atual</small></div>
          <div class="node home-node"><div class="house-art">⌂</div><p>Casa</p><strong>${home.value} <small>${home.unit}</small></strong><small class="sub">Consumo atual</small></div>
          <div class="node battery-node"><div class="battery-art">${battery.value}%</div><p>Bateria</p><strong>${battery.value}%</strong><small class="sub">Carga atual</small></div>
          <div class="node grid-node"><div class="grid-art">⌁</div><p>Rede</p><strong>${grid.value} <small>${grid.unit}</small></strong><small class="sub">Importação atual</small></div>
          <div class="loads"><div class="load"><span>▱</span><div><b>Consumo da casa</b><small>${home.value} ${home.unit}</small></div></div></div>
        </div></article>
        <aside class="side"><article class="panel weather"><div class="panel-header"><div><p class="eyebrow">SISTEMA</p><h2>Estado atual</h2></div><span>☀</span></div><div class="weather-main"><strong>OK</strong><span>Sistema online<br><small>Valores em tempo real</small></span></div><div class="hours"><span>Solar<br><b>${solar.value} ${solar.unit}</b></span><span>Casa<br><b>${home.value} ${home.unit}</b></span><span>Bateria<br><b>${battery.value}%</b></span></div></article><article class="panel"><div class="panel-header"><div><p class="eyebrow">ENTIDADES</p><h2>Sensores ligados</h2></div></div><div class="device"><span class="icon aqua">☀</span><div><b>Produção solar</b><small>${c.solar_power || "valor de demonstração"}</small></div><strong>${solar.value} ${solar.unit}</strong></div><div class="device"><span class="icon purple">⌁</span><div><b>Rede elétrica</b><small>${c.grid_power || "valor de demonstração"}</small></div><strong>${grid.value} ${grid.unit}</strong></div></article></aside></section>
        <footer><span>☀ Dados fornecidos pelo Home Assistant</span><span>Atualização automática</span><span>Solar Dashboard <b>v${CARD_VERSION}</b></span></footer>
      </section>`;
  }

  getCardSize() {
    return 6;
  }
}

customElements.define("solar-dashboard-card", SolarDashboardCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "solar-dashboard-card", name: "Solar Dashboard", description: "Monitorização de produção solar, bateria, rede e consumo da casa." });
