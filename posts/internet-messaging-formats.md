---
title: "Internet messaging formats: how computers package and send messages over the internet"
date: "2023-10-12"
completed: true
---

Whenever a message is sent between devices connected to the internet, the messages must be formatted in a way so that **routers**, the postmen of the internet, know how to deliver them. They can additionally include info that is used by the recipients of messages to verify the integrity of the message and understand its content.
To achieve this, internet messages have **headers** that prefix the actual content of the message, similar to a book starting with a table of contents. What this header contains can range from very simple to somewhat complex. Let's go over the various formats that are used to send messages over the internet.

## ToC

## Background info: packets

When delivering some data over the internet, generally it is not sent in one big message. Instead, it is split into several **packets** that are sent independently.

## Internet protocol (IP)

The **internet protocol**, or **IP** for short, is a format that mainly defines how to declare the sender and recipient of a packet. Any packet sent over the internet must adhere to this format: it is the bare minimum amount of formatting needed so that routers know how to deliver your packet. Similar to how you couldn't just drop a piece of paper in a mailbox and expect it to be delivered, you can't just send raw data into the internet and expect to reach its recipient; you need to tell the internet at least where to send your packet.

**Every packet sent over the internet uses the IP format, and using the format means that the internet will know how to deliver your packet.** There are some types of connections that more directly connect devices (e.g. bluetooth) that don't require an IP header as they don't need to be routed over the internet. But as long as you are sending a packet over the internet, you need to use IP.

In order to facilitate sending and receiving packets, devices connected to the internet are assigned an **IP address**. This address is equivalent to a mailing address: imagining yourself as a computer, whenever anyone sends you a letter, they would need to use your IP address so that the internet postal system knows where to send the packet.

More specifically, at the beginning of any packet sent over the internet, an **IP header** is included. This header is equivalent to an envelope with addresses written on it, describing to the internet postal system how to send the enclosed letter. In addition to including the IP address of the recipient, it also includes the IP address of the sender and some other info like the length of the packet being sent. You can look at the [description of the IPv4 header format](https://en.wikipedia.org/wiki/Internet_Protocol_version_4#Header) for details about all the info that is included. Each packet is divided into an IP header followed by the actual body/content of the packet.

<details>
<summary>Deep dive: IPv4 vs IPv6 and what IP addresses look like</summary>

When IP addresses were first created, the **IPv4** format was used. This format defines each address as a 32 bit number, which is usually depicted and interpreted as a series of 4 decimal (standard) numbers separated by periods, for example:

```
174.147.1.36
```

32 bits were used as it generously allowed for ~4.3 billion (2<sup>32</sup>) addresses and devices. However, computing has exploded in popularity since the creation of IPv4 and there are now greater than 4.3 billion computing devices, and IPv4 addresses [have run out](https://en.wikipedia.org/wiki/IPv4_address_exhaustion).

To accommodate this, a new format **IPv6** was created. This format defines each address as a 128 bit number, usually depicted as 8 hexadecimal numbers separated by colons, for example:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

This 128 bit length magnanimously allows for ~340 undecillion (2<sup>128</sup>) addresses, a number so large many spell checkers won't recognize it and should hopefully not run out any time soon. In addition to the change in address length, the format of the IP header also is changed from IPv4 to IPv6 (the [IPv6 header format](https://en.wikipedia.org/wiki/IPv6_packet#Fixed_header)).

Although the two formats are different, both are being used today, and the internet postal system knows how to send packets using either header and address format.

</details>

## UDP

**UDP**, or the **user datagram protocol**, is a format that adds additional header info after the **IP header**, adding the following info in addition to the address of the sender and recipient (the full format [here](https://en.wikipedia.org/wiki/User_Datagram_Protocol#UDP_datagram_structure)):

1. The port of the sender
2. The port of the recipient
3. The length of the non-IP header part of the packet.
4. A checksum, used to validate the packet did not get damaged during transit.

### Ports

Computers contain several **ports**, each essentially serving as a station for sending a receiving data over the internet. Different applications on a computer can be connected to the internet simultaneously, and each will be assigned their own port.

Specifying the port in addition to the IP address in UDP can be thought of like adding the name of your recipient in addition to their address in a real life letter. Perhaps your recipient lives in a house with multiple other people: adding their name to the letter means that someone else in the house won't accidentally open it. Although the postal system can deliver the letter just fine without the recipients name, it makes it nice for the recipient and their housemates to have the name included.

### Checksum

UDP also adds a **checksum**. The checksum contains the sum of the header, and when a recipient receives a packet, they can calculate the sum themselves and _check_ the _sum_ that they calculated matches the sum included in the packet. If the sums differ, it means that the packet was somehow changed during transit.

Although not a perfect analogy, the checksum can be thought of like adding a seal to a letter: if the letter arrives and the seal is removed, you can take that to mean the letter might have been damaged, and possibly a piece of paper fell out or something while it was being delivered.

## TCP

**TCP**, or the **transmission control protocol**, is a messaging format that is an alternative UDP, but essentially adds additional functionality to what UDP offers at the expense of speed and size.

You can see all the fields included in a TCP header [here](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_segment_structure), but to simplify, it importantly offers two additional advantages over what is included in UDP:

1. Adds sequence numbers to packets of a message, defining the order of the packet in a sequence of packets.
2. Requires ACK (acknowledgement packets) from the recipient to verify that a packet that was sent was successfully received.

### Sequence numbers

Because packets (which whole messages are split into) are sent independently, there is the possibility that they can arrive out of order. To help the recipient make sense of different packets that are a part of the same message, a **sequence number** is included in TCP headers. This number makes it possible for the recipient to reorder different packets into the original message they were split out of.

### ACK messages

TCP also sets up a connection with
computers it is sending messages to. This can make it more ideal for sending larger messages split into a lot of packets by maintaining one connection. You can look at this [article from Khan academy](https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet/xcae6f4a7ff015e7d:transporting-packets/a/transmission-control-protocol--tcp) for more details about how this works.

As part of this connection, when the recipient receives a packet, they will send an ACK packet back to the sender to let them know their packet was received. This would be like someone you sent a letter to sending a letter back just to let you know your letter was received.

If the sender doesn't get an ACK packet back, they can resend the original packet to ensure that the recipient receives it.

## HTTP

**HTTP**, or **hypertext transfer protocol**, is a format that adds additional header info to that provided by IP and TCP or UDP. In other words, it adds to TCP or UDP rather than being an alternative them.

When using HTTP, a sender will send an **HTTP request** asking something of the recipient, with the recipient sending an **HTTP response** with some result.

Unlike IP, TCP, and UDP, which are headers that are added to each packet, HTTP requests and responses are cohesive messages, with each message (rather than the smaller packet) having its own HTTP header.

HTTP requests are divided into [multiple categories of actions/request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). The most important and common of these methods are:

**GET**: Used to ask for something from the recipient. For example, a GET request

```http
GET /Promethean HTTP/1.1
```

to a dictionary service could ask for the definition of the word "Promethean". The recipient could then send a response

```http
HTTP/1.1 200 OK \r\n
{
    "word": "Promethean",
    "definition": "Daringly creative."
}
```

with the header `HTTP/1.1 200 OK \r\n` indicating that the request was handled successfully (with `\r\n` being a special sequence indicating the end of the header), being followed by the body of the message containing the info the sender was asking for.

**POST**: Used to tell the recipient to update itself somehow. For example, a POST request to a dictionary service

```http
POST /Promethean HTTP/1.1 \r\n
{
    "definition": "Related to Prometheus."
}
```

could tell the service to add a new definition for the word Promethean. It could be met with a response

```http
HTTP/1.1 200 OK \r\n
```

indicating the definition was successfully updated.

The HTTP format allows for a lot more options that make it easy for senders and recipients to organize the data they are sending between each other (see [more details on Wikipedia](https://en.wikipedia.org/wiki/HTTP#HTTP/1.1_request_messages)). It basically provides a standard way for services (e.g. our example dictionary service) to define how they want to receive requests and how they want to respond. By standardizing, it means tools like web browsers can build around the format, being designed to understand and handle requests and responses.

## Summary

Summarizing the headers described in this article:

1. **IP header**: the bare minimum header, like needing to put a letter in an envelope with a mailing address written on it. An IP header importantly includes the **IP address** of the sender and recipient. Used by routers to understand where to deliver packets.
2. **UDP / TCP headers**: headers that occur in addition to and after the IP header, and help internet devices understand which application to deliver a packet to and verify the integrity of each packet. For UDP, this is like adding the names of the sender and recipient (**ports**) in addition to a seal (**checksum**) to a letter. TCP additionally adds a **sequence number** to help order messages that are split into several packets, and also requires the recipient to send a packet back **ACK**nowledging the sender's packet was received.
3. **HTTP headers**: headers that occur in addition to the IP or TCP / UDP header. Unlike IP, TCP, and UDP, HTTP headers are per message rather than per packet. HTTP messages have well defined **HTTP request** and **HTTP response** formats that help applications receiving a message understand and parse the content of it.
