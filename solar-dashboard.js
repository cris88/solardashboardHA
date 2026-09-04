const CARD_VERSION = "1.0.0";

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

  _state(entity, fallback = "—") {
    const state = entity && this._hass?.states?.[entity];
    return state ? state.state : fallback;
  }

  _unit(entity, fallback = "") {
    const state = entity && this._hass?.states?.[entity];
    return state?.attributes?.unit_of_measurement || fallback;
  }

  render() {
    if (!this.shadowRoot || !this.config) return;
    const c = this.config;
    const solar = this._state(c.solar_power, "573");
    const home = this._state(c.home_power, "1.4");
    const battery = this._state(c.battery_level, "54");
    const grid = this._state(c.grid_power, "0");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; color:#182536; font-family:var(--paper-font-body1_-_font-family, "DM Sans", sans-serif); }
        .card { padding:22px; border:1px solid #e1eaee; border-radius:18px; background:linear-gradient(145deg,#fff,#f5fafb); box-shadow:0 8px 28px #263e4d0d; }
        .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        h2 { margin:0; font-size:20px; font-weight:600; letter-spacing:-.03em; } .eyebrow { margin:0 0 4px; color:#9aa9b6; font-size:10px; font-weight:700; letter-spacing:.15em; }
        .live { color:#6f8291; font-size:11px; } .live i { display:inline-block; width:7px; height:7px; margin-right:5px; border-radius:50%; background:#4dcc9a; }
        .metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; } .metric { padding:13px; border-radius:12px; background:#ffffffc9; }
        .label { color:#8191a0; font-size:11px; } .value { margin-top:9px; font-size:24px; font-weight:700; } .unit { color:#91a0ad; font-size:11px; font-weight:500; }
        .orange .value { color:#f2a82e; } .aqua .value { color:#32b9b5; } .blue .value { color:#4b93c6; } .purple .value { color:#856bdb; }
        .diagram { position:relative; display:grid; grid-template-columns:repeat(3,1fr); align-items:center; min-height:210px; margin-top:18px; overflow:hidden; }
        .diagram:before,.diagram:after { content:""; position:absolute; left:19%; right:19%; top:50%; border-top:3px dashed #a8dede; z-index:0; }
        .diagram:after { top:76%; left:38%; right:38%; border-color:#ffcb72; transform:rotate(-15deg); }
        .node { position:relative; z-index:1; text-align:center; } .orb { display:grid; place-items:center; width:78px; height:78px; margin:auto; border:2px solid currentColor; border-radius:50%; background:#ffffffeb; font-size:32px; box-shadow:0 0 22px currentColor33; }
        .node b { display:block; margin-top:7px; font-size:12px; } .node small { display:block; margin-top:3px; color:#92a1ad; font-size:11px; }
        .solar { color:#f3a62c; } .home { color:#39bdba; } .battery { color:#319a91; }
        @media (max-width:600px) { .metrics { grid-template-columns:repeat(2,1fr); } .diagram { min-height:180px; } .orb { width:65px; height:65px; } }
      </style>
      <section class="card">
        <div class="head"><div><p class="eyebrow">HOME ASSISTANT · ENERGIA</p><h2>Solar home</h2></div><span class="live"><i></i>Ao vivo</span></div>
        <div class="metrics">
          <div class="metric orange"><span class="label">☀ Produção solar</span><div class="value">${solar} <span class="unit">${this._unit(c.solar_power, "W")}</span></div></div>
          <div class="metric aqua"><span class="label">▣ Bateria</span><div class="value">${battery}<span class="unit">%</span></div></div>
          <div class="metric blue"><span class="label">⌂ Consumo casa</span><div class="value">${home} <span class="unit">${this._unit(c.home_power, "kW")}</span></div></div>
          <div class="metric purple"><span class="label">⌁ Rede</span><div class="value">${grid} <span class="unit">${this._unit(c.grid_power, "W")}</span></div></div>
        </div>
        <div class="diagram">
          <div class="node solar"><div class="orb">☀</div><b>Solar</b><small>${solar} W</small></div>
          <div class="node home"><div class="orb">⌂</div><b>Casa</b><small>${home} kW</small></div>
          <div class="node battery"><div class="orb">▣</div><b>Bateria</b><small>${battery}%</small></div>
        </div>
      </section>`;
  }

  getCardSize() {
    return 5;
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
