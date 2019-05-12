const PayloadHandler = require('./PayloadHandler.js');

/**
 * GARD repurposed to be light activation.
 */
module.exports = class GardLightPayloadHandler extends PayloadHandler {

  constructor(socket, loggers) {
    super(socket, loggers);

    this.device_id = 3;
  }

  unserialize(buf) {
    let payload = {};
    payload.msg_type = buf.readUInt8(0);
    payload.device_id = buf.readUInt8(1);
    payload.msg_id = buf.readUInt8(2);
    this.msg_id = payload.msg_id;
    payload.flags = buf.readUInt8(3);
    payload.battery = buf.readInt16BE(4);
    payload.mv = buf.readInt16BE(6);
    payload.ma = buf.readInt16BE(8);
    payload.light = buf.readInt16BE(10);
    payload.cpu_temperature = buf.readInt16BE(12);
    payload.temperature = buf.readInt16BE(14) / 10;
    payload.rssi = buf.readInt16BE(16);
    payload.snr = buf.readInt16BE(18);
    payload.freg_error = buf.readInt16BE(20);

    return payload;
  }

  processPayload(payload) {
    payload = super.processPayload(payload);

    // Extract the flags to fields of their own.
    // bit 0 = door
    // bit 1 = dark
    // bit 2 = temperature
    // bit 3 = battery
    // bit 4 = activated

    payload.flag_door = this.bitRead(payload.flags, 0) ? true : false;
    payload.flag_dark = this.bitRead(payload.flags, 1) ? true : false;
    payload.flag_temperature = this.bitRead(payload.flags, 2) ? true : false;
    payload.flag_battery = this.bitRead(payload.flags, 3) ? true : false;
    payload.flag_activated = this.bitRead(payload.flags, 4) ? true : false;

    return payload;
  }

}
