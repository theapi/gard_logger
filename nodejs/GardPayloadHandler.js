const PayloadHandler = require('./PayloadHandler.js');

/**
 * Garden Animal Repellent Device
 */
module.exports = class GardPayloadHandler extends PayloadHandler {

  constructor(socket, loggers) {
    super(socket, loggers);

    this.device_id = 2;
  }

  processPayload(payload) {
    payload = super.processPayload(payload);

    // Extract the flags to fields of their own.
    // bit 0 = pump_switch
    // bit 1 = water
    // bit 2 = temperature
    // bit 3 = battery

    payload.flag_switch = this.bitRead(payload.flags, 0) ? true : false;
    payload.flag_water = this.bitRead(payload.flags, 1) ? true : false;
    payload.flag_temperature = this.bitRead(payload.flags, 2) ? true : false;
    payload.flag_battery = this.bitRead(payload.flags, 3) ? true : false;

    // Remove unsued values.
    delete payload.mv;
    delete payload.light;
    delete payload.temperature;

    return payload;
  }
}
