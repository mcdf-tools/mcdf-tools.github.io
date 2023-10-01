let versions;

const VA = document.getElementById('versionA');
const VB = document.getElementById('versionB');
const FA = document.getElementById('filterA');
const FB = document.getElementById('filterB');
const info = document.getElementById('version-information');

async function initialize() {
    versions = await getJson('https://omv-id.github.io/v1.0/JE/ids.json');
    const data = Object.entries(versions);
    for(v of data) {
        let selection = document.createElement("option");
        selection.setAttribute("value", v[0]);
        selection.appendChild(document.createTextNode(v[1].name));
        VA.appendChild(selection.cloneNode(true));
        VB.appendChild(selection);
    }
}

initialize();

function compare() {
    const a = VA.value;
    const b = VB.value;
    const output = [];
    let quick_return = false;
    if(a && b) {
        if( a == b) {
            output.push(`Version A and Version B are the same`);
            quick_return = true;
        } else if(a > b) {
            output.push(`${versions[a].name} came out after ${versions[b].name}`)
        } else {
            output.push(`${versions[a].name} came out before ${versions[b].name}`)
        }
    }

    if(a) vInfo(a, output);

    if(quick_return) {
        info.innerHTML = output.join('\n');
        return
    }

    if(b) vInfo(b, output);

    info.innerHTML = output.join('\n');
}

function vInfo(v, output) {
    const v_data = versions[v];
    const v_name = v_data.name;
    const v_release = v_data.release
    if(v_name != v_release) {
        output.push(`${v_name} is a ${v_release} development version`);
    }
    output.push(`${v_name} has the launcher id '${v_data.launcherID}'`);
}