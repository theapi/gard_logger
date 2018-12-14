package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"net"
)

func checkError(err error) {
	if err != nil {
		fmt.Println("Error: ", err)
	}
}

func main() {
	var msgID uint8

	addr, err := net.ResolveUDPAddr("udp", "239.0.0.57:12345")
	checkError(err)

	conn, err := net.ListenMulticastUDP("udp", nil, addr)
	checkError(err)
	conn.SetReadBuffer(1024)

	fmt.Println("Listening for udp")

	defer conn.Close()

	var payload struct {
		Start          uint8
		MessageType    uint8
		DeviceId       uint8
		MessageId      uint8
		Flags          uint8
		VCC            uint16
		ChargeMv       uint16
		ChargeMa       int16
		Light          uint16
		CpuTemperature int16
		Temperature    int16
		// The radio signal stats.
		Rssi      int16
		Snr       int16
		Frq_error int16
	}

	for {

		b := make([]byte, 1024)
		_, _, err := conn.ReadFromUDP(b)
		checkError(err)

		r := bytes.NewReader(b)

		// Display only for the solar payload test device: 101
		if b[2] == 101 && msgID != b[3] {
			msgID = b[3]

			if err := binary.Read(r, binary.BigEndian, &payload); err != nil {
				fmt.Println("binary.Read failed:", err)
			}
			fmt.Println(payload)
			//fmt.Println(hex.Dump(b[:n]))
		}

	}
}
