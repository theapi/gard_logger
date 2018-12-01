/**
 * Garden Animal Repellent Device
 */
module.exports = class PayloadHandler {

  constructor(socket, loggers) {
    this.socket = socket;
    this.loggers = loggers;
    this.device_id = 0; // No device id set, extend this class and set one.

    this.msg_id = 999;
  }

  run() {
    this.socket.on('message', (input, rinfo) => {
      if (input.readUInt8(0) === 9) {
        // Remove the tab from the UDP message.
        const buf = input.slice(1);
        if (buf.readUInt8(0) === 55) {
          if (this.msg_id !== buf.readUInt8(2)) {
            let payload = this.unserialize(buf);
            this.msg_id = payload.msg_id;

            payload = this.processPayload(payload);

            // Log to all the loggers, if it's form this device.
            if (payload.device_id === this.device_id) {
              for (let i = 0, len = this.loggers.length; i < len; i++) {
                this.loggers[i].log(payload);
              }
            }
          }
        }
      }
    });
  }

  /**
   * Alter the payload.
   */
  processPayload(payload) {
    payload.timestamp = new Date().getTime();
    return payload;
  }

  unserialize(buf) {
    let payload = {};
    payload.msg_type = buf.readUInt8(0);
    payload.device_id = buf.readUInt8(1);
    payload.msg_id = buf.readUInt8(2);
    payload.flags = buf.readUInt8(3);
    payload.vcc = buf.readInt16BE(4);
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


  bitRead(value, bit) {
    return ((value >> bit) & 0x01);
  }

}
