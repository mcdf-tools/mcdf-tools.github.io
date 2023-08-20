const container_slots = {
    "minecraft:barrel": 27,
    "minecraft:blast_furnace": 3,
    "minecraft:brewing_stand": 5,
    "minecraft:chest": 27,
    "minecraft:dispenser": 9,
    "minecraft:dropper": 9,
    "minecraft:furnace": 3,
    "minecraft:hopper": 7,
    "minecraft:shulker_box": 27,
    "minecraft:smoker": 3,
    "minecraft:trapped_chest": 27
}

var item_array = [];

function calculate(form) {
    let signal_strength = form["signal-strength"].value;
    let container = form["container"].value;
    let non_stackables = 0;
    let stackables = 0;
    let stack_size = form["127-stack"].checked ? 127 : 64;
    console.log(stack_size);
    let error_msg = "";
    if(signal_strength < 2) {
        if(signal_strength < 0) {
            error_msg = "Can't Have Negative Signal Strength"
        } else {
            stackables = signal_strength;
        }
    } else {
        let fullness = (signal_strength-1)/14;
        let slots = container_slots[container];
        let item_min = Math.ceil(64*slots*fullness);
        if(item_min > stack_size*64*slots) {
            error_msg = "Signal Strength is too High"
        } else {
            non_stackables = Math.floor(item_min/64);
            if(non_stackables > stack_size*(slots - 1)) {
                let item_max = Math.ceil(64*slots*signal_strength/14) - 1;
                if(((item_min % 64) != 0) && (Math.floor(item_min/64) == Math.floor(item_max/64))) {
                    error_msg = "That Signal Strength is not Possible with this Container";
                } else {
                    non_stackables += item_min % 64 == 0 ? 0 : 1;
                }
            } else {
                stackables = Math.ceil(item_min - 64*non_stackables);
            }
        }
    }

    if(error_msg == "") {
        document.getElementById('result').style = "display: block;";
        document.getElementById('error').style = "display: none;";
        document.getElementById('stackable').innerHTML = stackables;
        document.getElementById('non-stackable').innerHTML = non_stackables;

        item_array = []
        let slot = 0;
        while(non_stackables > stack_size) {
            item_array.push(`{Slot:${slot}b,id:"minecraft:iron_sword",Count:${stack_size}b}`);
            non_stackables -= stack_size;
            slot++;
        }
        item_array.push(`{Slot:${slot}b,id:"minecraft:iron_sword",Count:${non_stackables}b}`);
        if(stackables > 0) {
            item_array.push(`{Slot:${slot+1}b,id:"minecraft:iron_ingot",Count:${stackables}b}`);
        }

        if(form["old-version"].checked) {
            document.getElementById('give-command').innerHTML = 
            `/give @p ${container} 1 0 {BlockEntityTag:{Items:[${item_array.join(',')}]},display:{Lore:["${signal_strength} Signal Strength"]}}`;
            document.getElementById('setblock-command').innerHTML = 
            `/setblock ~ ~ ~ ${container} 0 replace {Items:[${item_array.join(',')}]}`;
        } else {
            document.getElementById('give-command').innerHTML = 
            `/give @p ${container}{BlockEntityTag:{Items:[${item_array.join(',')}]},display:{Lore:["${signal_strength} Signal Strength"]}}`;
            document.getElementById('setblock-command').innerHTML = 
            `/setblock ~ ~ ~ ${container}{Items:[${item_array.join(',')}]}`;
        }
    } else {
        document.getElementById('result').style = "display: none;";
        document.getElementById('error').style = "display: block;";
        document.getElementById('error-msg').innerHTML = "ERROR: "+error_msg;
    }
    return false;
}