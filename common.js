const base_url = 'https://mcdf-tools.github.io';
//const base_url = 'http://localhost:9000';

const mcw_url = 'https://minecraft.wiki/w';
const mcdf_url = 'https://mcdf.wiki.gg/wiki';

let showingTooltip = false;

function showTooltip(element, msg) {
    let rect = element.getBoundingClientRect();
    tooltip = document.getElementById("tooltip");
    let top = rect.top+window.scrollY+35;;
    let side = window.innerWidth-rect.right-150;
    let dir = "right";
    if(window.innerWidth >= 700) {
        top = rect.top+window.scrollY-2;
        side = rect.right+5;
        dir = "left"
    }
    if(side < 50) side = 50;
    tooltip.setAttribute("style", `top: ${top}px; ${dir}: ${side}px; display: block;`);
    tooltip.innerHTML = msg;
    showingTooltip = true;
}

function hideTooltip() {
    tooltip = document.getElementById("tooltip");
    tooltip.setAttribute("style", "display: none;");
    showingTooltip = false;
}

function createTooltip(msg) {
    let tooltip = document.createElement("button");
    tooltip.appendChild(document.createTextNode("?"));
    tooltip.setAttribute("type", "button");
    tooltip.setAttribute("class", "tooltip-button");
    tooltip.setAttribute("onClick", `showTooltip(this, "${msg}");`);
    return tooltip;
}

window.addEventListener('click', (event) => {
    if (showingTooltip && !(event.target.className == "tooltip-button" || event.target.id == "tooltip" || event.target.parentElement.id == "tooltip")) {
        hideTooltip();
    }
})

window.addEventListener("resize", (event) => {
    hideTooltip();
});

async function getJson(url) {
    return new Promise((resolve) => {
        fetch(url)
        .then(res => res.json())
        .then(obj => resolve(obj))
        .catch(err => { throw err });
    });
}

function filter(selector, filter) {
    let filter_str = filter.value.toLowerCase().replace(" ", "_");
    let options = selector.getElementsByTagName("option");
    for(let i = 0; i < options.length; i++) {
        let value = options[i].textContent;
        if(value.indexOf(filter_str) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}

function resourceSelect(selector, resource_keys) {
    for(key in resource_keys) {
        let selection = document.createElement("option");
        selection.setAttribute("value", key);
        selection.appendChild(document.createTextNode(key));
        selector.appendChild(selection);
    }
}