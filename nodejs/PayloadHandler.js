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

  bitRead(value, bit) {
    return ((value >> bit) & 0x01);
  }

}
