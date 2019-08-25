import * as alt from 'alt';
import * as chat from 'chat';
import * as configurationItems from '../configuration/items.mjs';

console.log('Loaded: commands->sandbox.mjs');

chat.registerCmd('pos', player => {
    console.log(player.pos);
});

chat.registerCmd('veh', (player, args) => {
    if (args.length == 0) {
        chat.send(player, "/veh [carname]");
        args[0] = 'Infernus'; // for dev purposes only |by eappels
    }
    SpawnVehicleInFrontOfPlayer(player, 3, args[0]);
});

async function SpawnVehicleInFrontOfPlayer(player, distance, vehiclename) {
    var position = await getForwardVector(player);
    var pos = {
        x: player.pos.x + position.x * distance,
        y: player.pos.y + position.y * distance,
        z: player.pos.z + position.z * distance
    }
    new alt.Vehicle(vehiclename, pos.x, pos.y, pos.z, 0, 0, 0);
}

async function getForwardVector(player) {
    var result = await ClientCallback(player, 'getForwardVector', []);
    return result;
}

async function ClientCallback(player, clientEventName, argsArray) {
    alt.emitClient(player, clientEventName, argsArray);    
    let promise = new Promise((res, rej) => {
        alt.onClient(clientEventName, (player, resultsArray) => {
            res(resultsArray);
        });
    });    
    var result = await promise;
    return result;
}

chat.registerCmd('addcash', (player, value) => {
    let data = value * 1;

    player.addCash(data);
});

chat.registerCmd('wep', player => {
    player.giveWeapon(-1312131151, 999, true);
});

// temporay item commands
chat.registerCmd('addlicense', player => {
    let itemTemplate = configurationItems.Items['DriversLicense'];
    let clonedTemplate = { ...itemTemplate }; // Clone the template.

    clonedTemplate.props.name = player.data.name;
    clonedTemplate.props.organdonor = true;
    clonedTemplate.props.description = 'Looks pretty weird.';
    player.addItem(clonedTemplate, 1, true);
});

chat.registerCmd('showlicense', player => {
    let res = player.inventory.find(x => x.label === 'Drivers License');
    player.useItem(res.hash);
});

chat.registerCmd('additem', player => {
    let itemTemplate = configurationItems.Items['GranolaBar'];
    player.addItem(itemTemplate, 5);
});

chat.registerCmd('getdrink', player => {
    let itemTemplate = configurationItems.Items['Coffee'];
    player.addItem(itemTemplate, 5);
});

chat.registerCmd('subitem', player => {
    let itemTemplate = configurationItems.Items['GranolaBar'];
    let result = player.subItem(itemTemplate, 1);
});

chat.registerCmd('items', player => {
    player.inventory.forEach((item, index) => {
        player.sendMessage(`[${index}] ${item.label} x${item.quantity}`);
    });
});

chat.registerCmd('consume', (player, arg) => {
    player.consumeItem(player.inventory[arg[0]].hash);
});

chat.registerCmd('addveh', (player, arg) => {
    player.addVehicle(arg[0], player.pos, new alt.Vector3(0, 0, 0));
});

chat.registerCmd('tpto', (player, arg) => {

    if (arg[0] == undefined || arg[0] == null) {
        return player.sendMessage ('tpto [PlayerID]');
    }

    if (alt.Player.all[arg] == undefined || alt.Player.all[arg] == null ) {
        return player.sendMessage('Player does not exist.');
    }

    let targetPos = alt.Player.all[arg].pos;
    let targetName = alt.Player.all[arg].name;

    player.pos = targetPos;
    player.sendMessage(`You got teleported to ${targetName} position.`);
});