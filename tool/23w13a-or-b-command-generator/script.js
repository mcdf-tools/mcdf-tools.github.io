const tool_url = base_url+"/tool/23w13a-or-b-command-generator";

const vote_rules_url = tool_url+'/vote_rules.json';
const registries_url = tool_url+"/registries.json";
const biome_colors_url = tool_url+"/biome_colors.json";
const lists_url = tool_url+"/lists.json";

const vote_option = document.getElementById("vote-rule");
let vote_rules;
let registries;
let biome_colors;
let lists;

async function getJson(url) {
    return new Promise((resolve) => {
        fetch(url)
        .then(res => res.json())
        .then(obj => resolve(obj))
        .catch(err => { throw err });
    });
}

async function initalize() {
    vote_rules = await getJson(vote_rules_url);
    for(key in vote_rules) {
        let selection = document.createElement("option");
        selection.setAttribute("value", key);
        selection.appendChild(document.createTextNode(key));
        vote_option.appendChild(selection);
    }
    registries = await getJson(registries_url);
    biome_colors = await getJson(biome_colors_url);
    lists = await getJson(lists_url);
}

initalize();

function createSelect(array, id) {
    let select = document.createElement("select");
    let name_value = [
        "$biome_colors",
        "$dye_colors"
    ]
    let unset = document.createElement("option");
    unset.setAttribute("value", "");
    unset.appendChild(document.createTextNode("unset"));
    select.appendChild(unset);
    for(v of array) {
        let option = document.createElement("option");
        option.setAttribute("value", name_value.includes(id) ? v.name : v.value);
        option.appendChild(document.createTextNode(`${v.name} (${v.value})`));
        select.appendChild(option);
    }
    return select;
}

function createNumberInput(min, max) {
    let input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", min);
    input.setAttribute("max", max);
    return input;
}

function createCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    return checkbox;
}

function createSection(input, key, text, note) {
    let id = "custom-form-"+key;
    let section = document.createElement("div");
    section.setAttribute("class", "widget-section");
    let label = document.createElement("label");
    label.setAttribute("for", id);
    label.setAttribute("id", "label-"+id);
    label.appendChild(document.createTextNode(text));
    section.appendChild(label);
    input.setAttribute("name", key);
    input.setAttribute("id", id);
    section.appendChild(input);
    if(note) {
        let tooltip = createTooltip(note);
        section.appendChild(tooltip);
    }
    return section;
}

function randomNum(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

function updateForm() {
    let form = document.getElementById("custom-form");
    form.firstChild.remove();
    let new_div = document.createElement("div")
    if(vote_option.value == "") {
        form.appendChild(new_div);
        return;
    }
    let syntax_obj = vote_rules[vote_option.value]
    for(key in syntax_obj) {
        let argument = syntax_obj[key];
        let input = document.createElement("span");
        if(argument._values) {
            if(Array.isArray(argument._values)) {
                input = createSelect(argument._values);
            } else if(argument._values == "$biome_colors") {
                input = createSelect(biome_colors, "$biome_colors");
            } else {
                input = createSelect(lists[argument._values], argument._values);
            }
        } else if(argument.parser == "brigadier:integer") {
            input = createNumberInput("-2147483648", "2147483647");
        } else if(argument.parser == "brigadier:long") {
            input = createNumberInput("-9223372036854775808", "9223372036854775807");
        } else if(argument.parser == "brigadier:float") {
            input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("step", "any"); //allows for decimals
        } else if(argument.parser == "minecraft:resource") {
            input = createSelect(registries[argument.properties.registry]);
        }
        new_div.appendChild(createSection(input, key, key, argument._note));
        if(key == "delta") {
            let checkbox = createCheckbox();
            new_div.appendChild(createSection(
                checkbox,
                "use-value",
                "use value instead of delta",
                "Will set the value of a rule instead of changing the value by delta"
            ));
        } else if(key == "seed") {
            let checkbox = createCheckbox();
            new_div.appendChild(createSection(
                checkbox,
                "random-seed",
                "use random seed",
                "Generates a random seed to put in the command"
            ));
        }
    }

    form.appendChild(new_div);
}

function parseValue(value, syntax) {
    if(syntax.parser == "brigadier:string" || syntax.parser == "minecraft:resource") {
        return `"${value}"`;
    } else if(syntax.parser == "brigadier:long") {
        return value+"L"
    } else {
        return value;
    }
}

function generate(form) {
    let rule = form["vote-rule"].value;
    let syntax_obj = vote_rules[rule];
    let command = `/vote rule ${rule} approve `;
    let keys = Object.keys(syntax_obj);
    if(keys.length == 1 && keys[0] == "value") {
        let value = parseValue(form["value"].value, syntax_obj["value"]);
        command += value;
    } else {
        command += '{'
        let args = []
        for(key in syntax_obj) {
            let raw_value = form[key].value;
            if(key == "seed" && form["random-seed"].checked) raw_value = randomNum(-9223372036854775808, 9223372036854775807);
            if(raw_value == "") continue;
            let value = parseValue(raw_value, syntax_obj[key]);
            if(key == "delta" && form["use-value"].checked) {
                args.push(`value: ${value}`);
            } else {
                args.push(`${key}: ${value}`);
            }
        }
        command += args.join(', ') + '}'
    }
    document.getElementById('command').innerHTML = command;
}