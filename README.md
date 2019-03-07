# homebridge-ankuoo-http-switch
[Homebridge](https://github.com/nfarina/homebridge/) plugin that integrates with Ankuoo Rec Switch

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/homebridge-ankuoo-http-switch.svg
[npm-url]: https://www.npmjs.com/package/homebridge-ankuoo-http-switch

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
