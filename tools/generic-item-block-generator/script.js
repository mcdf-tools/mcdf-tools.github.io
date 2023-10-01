const tool_url = base_url+"/tools/generic-item-block-generator";
const items_url = tool_url+"/items.json";

const item_option = document.getElementById("item");
const item_filter = document.getElementById("filter");
let items;

async function initialize() {
    items = await getJson(items_url);
    resourceSelect(item_option, items);
}

initialize();

function generate() {
    let rl = item_option.value;
    let id = items[rl];
    document.getElementById('give-command').innerHTML = `/give @p minecraft:generic_item_block{BlockStateTag:{item:"${id}"},display:{Lore:["${rl}"]}}`;
    document.getElementById('setblock-command').innerHTML = `/setblock ~ ~ ~ minecraft:generic_item_block[item=${id}]`;
}