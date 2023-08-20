const tool_url = base_url+"/tool/generic-item-block-generator";
const items_url = tool_url+"/items.json";

const item_option = document.getElementById("item");
const item_filter = document.getElementById("filter");
let items;

async function initalize() {
    items = await getJson(items_url);
    for(key in items) {
        let selection = document.createElement("option");
        selection.setAttribute("value", key);
        selection.appendChild(document.createTextNode(key));
        item_option.appendChild(selection);
    }
}

initalize();

function generate() {
    let rl = item_option.value;
    let id = items[rl];
    document.getElementById('give-command').innerHTML = `/give @p minecraft:generic_item_block{BlockStateTag:{item:"${id}"},display:{Lore:["${rl}"]}}`;
    document.getElementById('setblock-command').innerHTML = `/setblock ~ ~ ~ minecraft:generic_item_block[item=${id}]`;
}

function filter() {
    let filter_str = item_filter.value.toLowerCase().replace(" ", "_");
    let options = item_option.getElementsByTagName("option");
    for(let i = 0; i < options.length; i++) {
        let value = options[i].textContent;
        if(value.indexOf(filter_str) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}