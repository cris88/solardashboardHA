# Solar Dashboard HA

Cartão Lovelace para monitorização de energia solar, bateria, rede elétrica e consumo da casa.

## Instalação através do HACS

1. Abra o **HACS** → **Frontend**.
2. Procure por **Solar Dashboard HA** e instale.
3. Reinicie o Home Assistant.
4. Adicione o recurso criado pelo HACS como **JavaScript Module**:
   `/hacsfiles/solardashboardHA/solar-dashboard.js`
5. Adicione um cartão manual ao dashboard:

```yaml
type: custom:solar-dashboard-card
solar_power: sensor.solar_power
home_power: sensor.home_power
battery_level: sensor.battery_level
grid_power: sensor.grid_power
```

Substitua os `entity_id` pelos sensores existentes na sua instalação. As entidades são opcionais; sem configuração, o cartão apresenta valores de demonstração.

## Pré-visualização

Abra `index.html` para ver a composição visual completa usada como referência do cartão.
