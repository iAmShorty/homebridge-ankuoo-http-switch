# homebridge-ankuoo-http-switch
[Homebridge](https://github.com/nfarina/homebridge/) plugin that integrates with Ankuoo Rec Switch

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/homebridge-sonoff.svg
[npm-url]: https://www.npmjs.com/package/homebridge-sonoff

# Installation

1. Install homebridge: `npm install -g homebridge`
1. Install homebridge-rcswitch-gpiomem: `npm install -g  homebridge-ankuoo-http-switch`
1. Update your homebridge configuration file.

# Requirements

Switch must have latest Firmware + [Firmware Mod](https://github.com/ljalves/hfeasy)

# Configuration

## Example config

```json
{
  "platform": "AnkuooHTTPSwitch",
  "name": "AnkuooHTTPSwitch",
  "devices": [
    {
      "name": "Name of of the accessory",
      "ip": "192.168.xxx.xxx",
      "mac": "XX:XX:XX:XX:XX:XX"
    }
  ]
}
```

Based on https://github.com/AlexanderBabel/homebridge-sonoff
