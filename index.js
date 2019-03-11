const request = require('request');

const pluginName = 'homebridge-ankuoo-http-switch';
const platformName = 'AnkuooHTTPSwitch';

let Service;
let Characteristic;
let Accessory;
let UUIDGen;

function AnkuooHTTPSwitch(log, config, api) {
  const platform = this;
  platform.log = log;
	
  if (!config) {
    platform.log("Sonoff Plugin has no configuration - Skipping");
    return;
  }
	
  platform.accessories = [];
  platform.config = config;
  platform.config.devices = platform.config.devices || [];

  for (let i = 0; i < platform.config.devices.length; i += 1) {
    platform.config.devices[i] = platform.config.devices[i] || {};
    platform.config.devices[i].name = platform.config.devices[i].name || 'AnkuooHTTPSwitch';
    platform.config.devices[i].ip = platform.config.devices[i].ip || '';
    platform.config.devices[i].mac = platform.config.devices[i].mac || '';
  }

  if (api) {
    platform.api = api;
    platform.api.on('didFinishLaunching', () => {
      platform.log('Cached accessories loaded.');
      if (platform.accessories.length < platform.config.devices.length) {
        for (let i = platform.accessories.length;
          i < config.devices.length; i += 1) {
          platform.addAccessory(i);
        }
      }
    });
  }
}

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  Accessory = homebridge.platformAccessory;
  UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(pluginName, platformName, AnkuooHTTPSwitch, false);
};

AnkuooHTTPSwitch.prototype.addAccessory = function addAccessory(index) {
  const platform = this;

  const accessoryName = platform.config.devices[index].name;
  const accessory = new Accessory(accessoryName,
    UUIDGen.generate(accessoryName));

  accessory.context = { index };
  accessory.addService(Service.Outlet, accessoryName);

  platform.log(`Added ${accessoryName}`);
  platform.api.registerPlatformAccessories(pluginName, platformName,
    [accessory]);
  platform.configureAccessory(accessory);
};

/* eslint max-len: ["error", { "ignoreComments": true }] no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["accessory"] }] */
AnkuooHTTPSwitch.prototype.configureAccessory = function configureAccessory(accessory) {
  const platform = this;

  platform.accessories.push(accessory);

  const index = accessory.context.index;
  if (!platform.config.devices[index]) {
    platform.removeAccessory(accessory.displayName);
    return;
  }

  if (platform.config.devices[index].name !== accessory.displayName) {
    platform.removeAccessory(accessory.displayName);
    platform.addAccessory(index);
    return;
  }

  const config = platform.config.devices[index];
  accessory.context.ip = config.ip;
  accessory.context.mac = config.mac;
	accessory.context.desc = config.name;
  accessory.context.url = `http://${config.ip}/state`;

  accessory.getService(Service.AccessoryInformation)
		.setCharacteristic(Characteristic.Name, 'Ankuoo Rec Switch')
		.setCharacteristic(Characteristic.Manufacturer, 'Ankuoo')
		.setCharacteristic(Characteristic.Model, 'HF-LPB100')
		.setCharacteristic(Characteristic.SerialNumber, config.mac)
		.setCharacteristic(Characteristic.FirmwareRevision, 'hfeasy v.0.4')

  accessory.getService(Service.Outlet).getCharacteristic(Characteristic.On)
    .on('get', async (callback) => {
      const response = await platform.sendRequest(accessory.context.url);
			//platform.log("Get State for "+${accessory.displayName}+" : "+response");
      if (!response) {
        callback(new Error('Could not get state'));
        return;
      }
      callback(null, response === 'ON' ? 1 : 0);
    })
    .on('set', async (toggle, callback) => {
			platform.log("Set "+accessory.context.desc+" to "+`${toggle ? '1' : '0'}`);
      const response = await platform
        .sendRequest(`${accessory.context.url}?sw=${toggle ? '1' : '0'}`);
      if (!response) {
        callback(new Error('Could not set state'));
        return;
      }
      callback();
    });

  platform.log(`Loaded accessory ${accessory.displayName}`);
};

AnkuooHTTPSwitch.prototype.removeAccessory = function removeAccessory(name) {
  const platform = this;

  platform.log(`Removing accessory ${name}`);
  const remainingAccessories = [];
  const removedAccessories = [];

  for (let i = 0; i < platform.accessories.length; i += 1) {
    if (platform.accessories[i].displayName === name) {
      removedAccessories.push(platform.accessories[i]);
    } else {
      remainingAccessories.push(platform.accessories[i]);
    }
  }

  if (removedAccessories.length > 0) {
    platform.api.unregisterPlatformAccessories(pluginName, platformName,
      removedAccessories);
    platform.accessories = remainingAccessories;
    platform.log(`${removedAccessories.length} accessories removed.`);
  }
};

AnkuooHTTPSwitch.prototype.sendRequest = function sendRequest(url) {
	const platform = this;
  return new Promise((resolve) => {
    request(url, (error, response) => {
      if (error) {
        resolve(false);
        return;
      }
			var newresponse = response.body.replace(/<(?:.|\n)*?>/gm, '');
			var newresponse = newresponse.replace("SWITCH STATESWITCH STATE WEB PAGE", "")
			var pos = newresponse.indexOf("relay_state=");
			var switchvalue = newresponse.substring(pos).split('=');
			//platform.log("response ---> "+newresponse.substring(pos))
			//platform.log("switchvalue ---> "+switchvalue[1])
			if (parseInt(switchvalue[1]) === 0) {
				resolve("OFF");
			} else {
				resolve("ON");
			}
      //resolve(JSON.parse(response.body));
    });
  });
};

