const payload_raw = payload.find(x => x.variable === 'data');
 
if (payload_raw) {
 try {
   const buffer = Buffer.from(payload_raw.value, 'hex');
 
   /* Parse all data received. This includes consider its endianess
      and value con ditioning (in this case, divide both instant voltage
      and instant current values by 10) */
   const total_useful_electrical_energy = buffer.readFloatBE(0);
   const instant_useful_voltage = buffer.readUInt8(4)/10.0;
   const instant_useful_current = buffer.readInt16BE(5)/10.0;
 
   /* Save parsed data into variables to device bucket */ 
   const data = [
     { variable: 'total_useful_electrical_energy', value: total_useful_electrical_energy, unit: 'kWh' },
     { variable: 'instant_useful_voltage',  value: instant_useful_voltage, unit: 'V' },
     { variable: 'instant_useful_current',  value: instant_useful_current, unit: 'mA' }
   ];
 
   payload = payload.concat(data.map(x => ({ ...x, serie: payload_raw.serie, time: payload_raw.time })));
 } catch (e) {
   console.error(e);
   payload = [{ variable: 'parse_error', value: e.message }];
 }
}