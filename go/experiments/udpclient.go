package main

import (
	"encoding/hex"
	"fmt"
	"net"
)

func checkError(err error) {
	if err != nil {
		fmt.Println("Error: ", err)
	}
}

func main() {
	addr, err := net.ResolveUDPAddr("udp", "239.0.0.57:12345")
	checkError(err)

	conn, err := net.ListenMulticastUDP("udp", nil, addr)
	checkError(err)
	conn.SetReadBuffer(1024)

	fmt.Println("Listening for udp")

	defer conn.Close()

	for {

		b := make([]byte, 1024)
		n, src, err := conn.ReadFromUDP(b)
		checkError(err)

		fmt.Println(n, "bytes read from", src)
		fmt.Println(b[1:4])
		fmt.Println(hex.Dump(b[:n]))

	}
}
