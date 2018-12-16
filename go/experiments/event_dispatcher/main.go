package main

import (
	"fmt"
	"time"
)

/**
 *
 * Let each worker listen to dedicated broadcast channel,
 * and dispatch the message from the main channel to each dedicated broadcast channel.
 */
type subscriber struct {
	name   string
	source chan interface{}
}

/**
 * Add the Start() method to the worker
 *
 * @see https://stackoverflow.com/questions/36417199/how-to-broadcast-message-using-channel
 */
func (s *subscriber) Start() {
	// Create the dedicated broadcast channel.
	s.source = make(chan interface{}, 10) // some buffer size to avoid blocking
	go func() {
		for {
			select {
			case msg := <-s.source:
				// do something with msg
				s.Log(msg)
			}
		}
	}()
}

func (s *subscriber) Log(msg interface{}) {

	fmt.Println(s.name, msg)

}

func main() {

	subscribers := []*subscriber{&subscriber{name: "foo"}, &subscriber{name: "bar"}}
	for _, subscriber := range subscribers {
		subscriber.Start()
	}

	for i := 0; i < 5; i++ {
		for _, subscriber := range subscribers {
			subscriber.source <- i
		}
		time.Sleep(time.Second)
	}
}
