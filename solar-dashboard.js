const CARD_VERSION = "2.0.0";

class SolarDashboardCard extends HTMLElement {
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

  _state(entity, fallback) {
    return entity && this._hass?.states?.[entity]?.state !== undefined
      ? this._hass.states[entity].state
      : fallback;
  }

  _unit(entity, fallback) {
    return this._hass?.states?.[entity]?.attributes?.unit_of_measurement || fallback;
  }

  render() {
    if (!this.shadowRoot || !this.config) return;
    const c = this.config;
    const solar = this._state(c.solar_power, "573");
    const home = this._state(c.home_power, "1.4");
    const battery = this._state(c.battery_level, "54");
    const grid = this._state(c.grid_power, "0");
    const solarUnit = this._unit(c.solar_power, "W");
    const homeUnit = this._unit(c.home_power, "kW");
    const gridUnit = this._unit(c.grid_power, "W");

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; color:#182536; font-family:var(--paper-font-body1_-_font-family,"DM Sans",sans-serif); }
        * { box-sizing:border-box; } .dashboard { min-height:620px; padding:30px 22px 20px; background:linear-gradient(145deg,#faffff,#f4f9fa 45%,#f8fbfc); }
        .topbar,.panel-header,.card-heading,footer { display:flex; align-items:center; justify-content:space-between; }
        .eyebrow { margin:0 0 5px; color:#a2adba; font-size:10px; font-weight:700; letter-spacing:.16em; }
        h1,h2,p { margin:0; } h1 { font:700 25px "Space Grotesk",sans-serif; letter-spacing:-.04em; } h2 { font:600 18px "Space Grotesk",sans-serif; }
        .live-dot { color:#708195; font-size:12px; font-weight:600; } .live-dot i,.updated i { display:inline-block; width:7px; height:7px; margin-right:6px; border-radius:50%; background:#4dcc9a; box-shadow:0 0 0 4px #dff7ed; }
        .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:28px 0 18px; }
        .metric-card,.panel { border:1px solid rgba(220,230,235,.8); border-radius:18px; background:rgba(255,255,255,.8); box-shadow:0 10px 35px rgba(46,70,91,.05); }
        .metric-card { padding:18px; position:relative; overflow:hidden; } .card-heading { color:#8290a3; font-size:12px; font-weight:600; gap:8px; justify-content:flex-start; }
        .card-heading b { margin-left:auto; font-size:10px; color:#abb5c0; font-weight:500; }.metric-card strong { display:block; margin:13px 0 10px; color:var(--ink); font:600 25px "Space Grotesk",sans-serif; }.metric-card small { font:500 12px "DM Sans",sans-serif; }
        .metric-card p { color:#99a6b4; font-size:11px; }.metric-card em { font-style:normal;font-weight:700; }.sun-card strong,.sun-card em { color:#ff9f1f; }.blue-card strong,.blue-card em { color:#4b93c6; }.battery-card strong,.battery-card em { color:#32b9b5; }.grid-card strong,.grid-card em { color:#856bdb; }
        .sun-symbol,.bolt-symbol,.battery-symbol,.grid-symbol { display:grid;place-items:center;width:25px;height:25px;border-radius:8px;background:#fff3da;font-size:15px }.bolt-symbol{background:#e5f2ff}.battery-symbol{background:#e2f9f4}.grid-symbol{background:#f0ebff}
        .content-grid { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(250px,.8fr); gap:15px; }.panel { padding:20px; }.flow-card{min-height:470px}.updated { color:#a7b1bc;font-size:10px; }.updated i{margin:0 0 0 6px}
        .flow-canvas{height:380px;position:relative;margin-top:8px;overflow:hidden}.connections{position:absolute;inset:0;width:100%;height:100%}.flow-line{fill:none;stroke-width:3;stroke-linecap:round;stroke-dasharray:9 9;opacity:.75;animation:flow 1.2s linear infinite}.orange{stroke:#ffb43d}.aqua{stroke:#53c7c6}.battery-flow{stroke:#2aa99d}.pale{stroke:#bcddec;stroke-width:2}@keyframes flow{to{stroke-dashoffset:-36px}}
        .node{position:absolute;text-align:center;z-index:1}.node p{color:#8d9bab;font-size:12px;font-weight:600;margin-top:5px}.node strong{display:block;font:700 19px "Space Grotesk",sans-serif;color:#39bdba}.node small{font:600 11px "DM Sans",sans-serif}.node .sub{display:block;color:#a9b6c3;font-weight:500;margin-top:1px}.solar-node{left:3%;top:55px;color:#ffac31}.solar-node p,.solar-node strong{color:#ff9f1f}.solar-art{width:78px;height:78px;margin:auto;border:2px solid #ff9f1f;border-radius:50%;display:grid;place-items:center;font-size:30px;background:#fff}.inverter-node{left:32%;top:120px}.inverter-art{width:63px;height:37px;margin:auto;padding-top:8px;border:2px solid #6d9db9;border-radius:7px;background:#27465e;color:#abc6d4;font-size:9px}.inverter-art b{color:#64d6c8}.home-node{left:55%;top:115px}.house-art{width:78px;height:78px;margin:auto;border:2px solid #32b9b5;border-radius:50%;display:grid;place-items:center;color:#32b9b5;font-size:26px;background:#fff}.battery-node{left:40%;top:265px}.battery-art{width:51px;height:70px;margin:auto;border:3px solid #16877f;border-radius:8px;background:linear-gradient(#2e857f 0 53%,#62b6a8 53%);display:grid;place-items:center;color:white;font-size:12px;font-weight:700}.grid-node{right:3%;top:50px}.grid-art{width:78px;height:78px;margin:auto;border:2px solid #319a91;border-radius:50%;display:grid;place-items:center;color:#319a91;font-size:27px;background:#fff}.loads{position:absolute;right:1%;bottom:2px;width:145px}.load{display:flex;align-items:center;gap:8px;margin:8px 0;color:#92a8b7}.load>span{display:grid;place-items:center;width:30px;height:30px;border:1px solid #bfd9e0;border-radius:50%;font-size:14px}.load b,.load small{display:block;font-size:10px;font-weight:600}.load small{color:#748b9d;font-size:11px;margin-top:2px}
        .side-column{display:flex;flex-direction:column;gap:15px}.weather-card{min-height:180px}.weather-icon{font-size:26px;color:#ffc04b}.weather-main{display:flex;align-items:center;gap:15px;margin:20px 0}.weather-main strong{font:600 38px "Space Grotesk",sans-serif;color:#e8a933}.weather-main span{color:#75889a;font-size:12px;line-height:1.5}.weather-hours{display:flex;justify-content:space-between;text-align:center;color:#a1adba;font-size:10px}.weather-hours b{display:block;margin-top:5px;color:#65798e;font-size:12px}.devices-card{flex:1}.device-row{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid #edf1f3}.device-row:last-child{border-bottom:0}.device-row>div{flex:1}.device-row b,.device-row small{display:block;font-size:11px}.device-row small{margin-top:3px;color:#a4b1bd;font-size:10px}.device-row strong{font:600 11px "Space Grotesk",sans-serif}.device-icon{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;font-size:15px}.cyan{background:#e6f8f7;color:#31b8b3}.purple{background:#f0ecff;color:#896bdf}.yellow{background:#fff3d9;color:#edac2d}.green{background:#e4f6ed;color:#45b480}
        footer{margin-top:15px;padding:0 5px;color:#9daab7;font-size:10px}footer b{color:#6e8193;margin-left:4px}@media(max-width:850px){.summary-grid{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr}.side-column{display:grid;grid-template-columns:1fr 1fr}}@media(max-width:560px){.summary-grid,.side-column{grid-template-columns:1fr}.dashboard{padding:20px 12px}.flow-canvas{height:430px}.loads{display:none}}
      </style>
      <main class="dashboard">
        <header class="topbar"><div><p class="eyebrow">HOME ASSISTANT · ENERGIA</p><h1>Solar home</h1></div><span class="live-dot"><i></i> Ao vivo</span></header>
        <section class="summary-grid">
          <article class="metric-card sun-card"><div class="card-heading"><span class="sun-symbol">☀</span><span>Produção solar</span><b>Agora</b></div><strong>${solar} <small>${solarUnit}</small></strong><p><em>${solar} ${solarUnit}</em> produção atual</p></article>
          <article class="metric-card blue-card"><div class="card-heading"><span class="bolt-symbol">↯</span><span>Consumo da casa</span><b>Agora</b></div><strong>${home} <small>${homeUnit}</small></strong><p><em>${home} ${homeUnit}</em> neste momento</p></article>
          <article class="metric-card battery-card"><div class="card-heading"><span class="battery-symbol">▣</span><span>Bateria</span><b>${battery}%</b></div><strong>${battery}<small>%</small></strong><p><em>${battery}%</em> carga disponível</p></article>
          <article class="metric-card grid-card"><div class="card-heading"><span class="grid-symbol">⌁</span><span>Rede elétrica</span><b>Agora</b></div><strong>${grid} <small>${gridUnit}</small></strong><p><em>${grid} ${gridUnit}</em> importados agora</p></article>
        </section>
        <section class="content-grid">
          <article class="flow-card panel"><div class="panel-header"><div><p class="eyebrow">FLUXO DE ENERGIA</p><h2>Agora</h2></div><span class="updated">Dados do Home Assistant <i></i></span></div>
            <div class="flow-canvas"><svg class="connections" viewBox="0 0 760 380" preserveAspectRatio="none" aria-hidden="true"><path class="flow-line orange" d="M120 95 C210 105 260 125 330 150"/><path class="flow-line aqua" d="M350 150 C420 145 470 150 535 160"/><path class="flow-line battery-flow" d="M330 170 C350 220 365 250 385 280"/><path class="flow-line pale" d="M550 160 C620 135 650 105 690 90"/></svg>
              <div class="node solar-node"><div class="solar-art">☀</div><p>Solar</p><strong>${solar} <small>${solarUnit}</small></strong></div>
              <div class="node inverter-node"><div class="inverter-art">DC <b>AC</b></div><p>Inversor</p><strong>—</strong><small class="sub">Sistema pronto</small></div>
              <div class="node home-node"><div class="house-art">⌂</div><p>Casa</p><strong>${home} <small>${homeUnit}</small></strong></div>
              <div class="node battery-node"><div class="battery-art">${battery}%</div><p>Bateria</p><strong>${battery}%</strong></div>
              <div class="node grid-node"><div class="grid-art">⌁</div><p>Rede</p><strong>${grid} <small>${gridUnit}</small></strong></div>
              <div class="loads"><div class="load"><span>▱</span><div><b>Consumo casa</b><small>${home} ${homeUnit}</small></div></div><div class="load"><span>ϟ</span><div><b>Produção solar</b><small>${solar} ${solarUnit}</small></div></div></div>
            </div>
          </article>
          <aside class="side-column"><article class="panel weather-card"><div class="panel-header"><div><p class="eyebrow">PREVISÃO</p><h2>Energia hoje</h2></div><span class="weather-icon">☀</span></div><div class="weather-main"><strong>—</strong><span>Dados meteorológicos<br><small>Configure uma integração</small></span></div><div class="weather-hours"><span>Solar<br><b>${solar} ${solarUnit}</b></span><span>Casa<br><b>${home} ${homeUnit}</b></span><span>Bateria<br><b>${battery}%</b></span></div></article>
            <article class="panel devices-card"><div class="panel-header"><div><p class="eyebrow">DISPOSITIVOS</p><h2>Consumo por área</h2></div></div><div class="device-row"><span class="device-icon cyan">⌂</span><div><b>Casa</b><small>Consumo total</small></div><strong>${home} ${homeUnit}</strong></div><div class="device-row"><span class="device-icon purple">⌁</span><div><b>Rede</b><small>Importação atual</small></div><strong>${grid} ${gridUnit}</strong></div><div class="device-row"><span class="device-icon yellow">ϟ</span><div><b>Solar</b><small>Produção atual</small></div><strong>${solar} ${solarUnit}</strong></div></article></aside>
        </section>
        <footer><span>☀ Energia solar <b>Home Assistant</b></span><span>Valores atualizados em tempo real</span><span>Bateria <b>${battery}%</b></span></footer>
      </main>`;
  }

  getCardSize() {
    return 8;
  }
}

customElements.define("solar-dashboard-card", SolarDashboardCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "solar-dashboard-card",
  name: "Solar Dashboard",
  description: "Monitorização de produção solar, bateria, rede e consumo da casa."
});
console.info(`%c SOLAR-DASHBOARD %c v${CARD_VERSION}`, "color:#fff;background:#35bcb6;font-weight:bold", "color:#35bcb6");
