let registersAcces = {
    "AH": () => { return registers.AX.slice(0, 8) },
    "BH": () => { return registers.BX.slice(0, 8) },
    "CH": () => { return registers.CX.slice(0, 8) },
    "DH": () => { return registers.DX.slice(0, 8) },
    "AL": () => { return registers.AX.slice(8, 16) },
    "BL": () => { return registers.BX.slice(8, 16) },
    "CL": () => { return registers.CX.slice(8, 16) },
    "DL": () => { return registers.DX.slice(8, 16) },
    "BP": () => { return registers.BP },
    "SP": () => { return registers.SP },
    "SI": () => { return registers.SI },
    "DI": () => { return registers.DI },
    "CS": () => { return registers.CS },
    "SS": () => { return registers.SS },
    "DS": () => { return registers.DS },
    "ES": () => { return registers.ES },
    "AX": () => { return registers.AX },
    "BX": () => { return registers.BX },
    "CX": () => { return registers.CX },
    "DX": () => { return registers.DX },
}

let registers = {
    "AX": '0000000000000000',
    "BX": '0000000000000000',
    "CX": '0000000000000000',
    "DX": '0000000000000000',
    "BP": '0000000000000000',
    "SP": '0000000000000000',
    "SI": '0000000000000000',
    "DI": '0000000000000000',
    "CS": '0000000000000000',
    "SS": '0000000000000000',
    "DS": '0000000000000000',
    "ES": '0000000000000000',
}

let SplitReg = ["AH", "BH", "CH", "DH", "AL", "BL", "CL", "DL"];



let fillWithZero = (str, len) => {
    let tmp = str;
    while (tmp.length < len) {
        tmp = "0" + tmp;
    }
    // for (let i = 0; i < len - str.length; i++) {

    // }
    return tmp;
}

let updateRegisterDisplay = () => {
    for (let i = 0; i < 16; i++) {
        const key = Object.keys(registersAcces)[i];
        document.querySelector("#" + key.toString()).value = registersAcces[key]();

    }
}

let connectRegisters = () => {

    for (let i = 0; i < 4; i++) {
        const keyH = Object.keys(registersAcces)[i];
        const keyL = Object.keys(registersAcces)[i + 4];
        const keyFull = Object.keys(registersAcces)[i + 16];
        //const keyX = Object.keys(registersAcces)[i+16];
        document.querySelector("#" + keyH).addEventListener('change', (e) => {
            registers[keyFull] = fillWithZero(e.target.value.slice(0, 8), 8) + registers[keyFull].slice(8, 16);
            //console.log('aa');

            updateRegisterDisplay();
        });
        document.querySelector("#" + keyL).addEventListener('change', (e) => {
            registers[keyFull] = registers[keyFull].slice(0, 8) + fillWithZero(e.target.value.slice(0, 8), 8);
            updateRegisterDisplay();
        });
    }
    //full
    for (let i = 8; i < 16; i++) {
        const keyF = Object.keys(registersAcces)[i];
        document.querySelector("#" + keyF).addEventListener('change', (e) => {
            registers[keyF] = fillWithZero(e.target.value.slice(0, 16), 16);
            updateRegisterDisplay();
        });

    }
}

connectRegisters();


updateRegisterDisplay();

let evalAddress = (address) => {
    if (Object.keys(registers).includes(address)) {
        return console.log("aa");
    };
}

let movInstruction = (a, b) => {
    let regex = RegExp(/\[(.*?)\]/);

    if (Object.keys(registers).includes(a) && !Object.keys(registers).includes(b) && !regex.test(b)) {
        console.log()
        registers[a] = fillWithZero(parseInt(b).toString(2), 16);
    }

    if (Object.keys(registers).includes(a) && Object.keys(registers).includes(b)) {
        //let temp = registers[a];
        registers[a] = registers[b];
        //registers[b] = temp;
    } else if (Object.keys(registers).includes(a) && regex.test(b)) {
        registers[a] = memory[memoryAccess(b)].toString(16) + memory[memoryAccess(b) + 1].toString(16);


    } else if (regex.test(a) && regex.test(b)) {
        memory[memoryAccess(a)] = parseInt(memory[memoryAccess(b)], 16);

    } else if (regex.test(a) && Object.keys(registers).includes(b)) {
        memory[memoryAccess(a)] = registers[b].slice(0, 8);
        memory[memoryAccess(a) + 1] = registers[b].slice(8, 16);
    }

    if (SplitReg.find((value) => { return value == a }) && SplitReg.find((value) => { return value == a })) {

        if (a.includes('L') && b.includes('L')) {
            registers[(a.substring(0, 1) + 'X')] = registers[(a.substring(0, 1) + 'X')].slice(0, 8) + registers[(b.substring(0, 1) + 'X')].slice(8, 16);
        } else if (a.includes('H') && b.includes('H')) {
            registers[(a.substring(0, 1) + 'X')] = registers[(b.substring(0, 1) + 'X')].slice(0, 8) + registers[(a.substring(0, 1) + 'X')].slice(8, 16);
        } else if (a.includes('L') && b.includes('H')) {
            registers[(a.substring(0, 1) + 'X')] = registers[(a.substring(0, 1) + 'X')].slice(0, 8) + registers[(b.substring(0, 1) + 'X')].slice(0, 8);
        } else if (a.includes('H') && b.includes('L')) {
            registers[(a.substring(0, 1) + 'X')] = registers[(b.substring(0, 1) + 'X')].slice(8, 16) + registers[(a.substring(0, 1) + 'X')].slice(8, 16);
        }
    }

    updateRegisterDisplay();
    updatehexdump(0);
}


let swapInstruction = (a, b) => {
    let regex = RegExp(/\[(.*?)\]/);

    if (Object.keys(registers).includes(a) && Object.keys(registers).includes(b)) {
        //let temp = registers[a];
        [registers[a], registers[b]] = [registers[b], registers[a]];
        //registers[b] = temp;
    } else if (Object.keys(registers).includes(a) && regex.test(b)) {
        let tmp = registers[a];
        registers[a] = memory[memoryAccess(b)].toString(16);
        memory[memoryAccess(b)] = tmp;

    } else if (regex.test(a) && regex.test(b)) {
        let tmp = memory[memoryAccess(a)];
        memory[memoryAccess(a)] = parseInt(memory[memoryAccess(b)], 16);
        memory[memoryAccess(b)] = tmp;

    } else if (regex.test(a) && Object.keys(registers).includes(b)) {
        let tmp = memory[memoryAccess(a)].toString(16);
        let tmp2 = memory[memoryAccess(a) + 1].toString(16);
        memory[memoryAccess(a)] = registers[b].slice(0, 8);
        memory[memoryAccess(a) + 1] = registers[b].slice(8, 16);
        registers[b] = tmp + tmp2;
    }

    if (SplitReg.find((value) => { return value == a }) && SplitReg.find((value) => { return value == a })) {
        let tmp = registers[(a.substring(0, 1) + 'X')];

        if (a.includes('L') && b.includes('L')) {

            registers[(a.substring(0, 1) + 'X')] = registers[(a.substring(0, 1) + 'X')].slice(0, 8) + registers[(b.substring(0, 1) + 'X')].slice(8, 16);
            registers[(b.substring(0, 1) + 'X')] = tmp.slice(0, 8) + tmp.slice(8, 16);
        } else if (a.includes('H') && b.includes('H')) {

            registers[(a.substring(0, 1) + 'X')] = registers[(b.substring(0, 1) + 'X')].slice(0, 8) + registers[(a.substring(0, 1) + 'X')].slice(8, 16);
            registers[(b.substring(0, 1) + 'X')] = tmp.slice(0, 8) + tmp.slice(8, 16);
        } else if (a.includes('L') && b.includes('H')) {

            registers[(a.substring(0, 1) + 'X')] = registers[(a.substring(0, 1) + 'X')].slice(0, 8) + registers[(b.substring(0, 1) + 'X')].slice(0, 8);
            registers[(b.substring(0, 1) + 'X')] = tmp.slice(0, 8) + tmp.slice(0, 8);
        } else if (a.includes('H') && b.includes('L')) {
            registers[(a.substring(0, 1) + 'X')] = registers[(b.substring(0, 1) + 'X')].slice(8, 16) + registers[(a.substring(0, 1) + 'X')].slice(8, 16);
            registers[(b.substring(0, 1) + 'X')] = tmp.slice(8, 16) + tmp.slice(8, 16);
        }
    }

    updateRegisterDisplay();
    updatehexdump(0);
}

let helloInstruction = (a) => {

    let offset = memoryAccess(a);
    let h = ["01001000", "01100101", "01101100", "01101100", "01101111", "00100000", "01010111", "01101111", "01110010", "01101100", "01100100"];
    for (let i = 0; i < h.length; i++) {
        memory[offset + i] = h[i];
    }
    updatehexdump(0);
}

let binToHex = (bin) => {
    return parseInt(bin, 2).toString(16).toUpperCase();
}

let decToHex = (dec) => {
    return parseInt(dec).toString(16).toUpperCase();
}
let decToBin = (dec) => {
    return parseInt(dec).toString(2).toUpperCase();
}

let memory = [];
for (let i = 0; i < 1048576; i++) {
    memory[i] = '0000000000000000';
}

const memDisplay = document.querySelector("#hexdump")
let updatehexdump = (address) => {
    let dump = '';
    let offset = parseInt(address, 16);
    let nextFullHex = Math.ceil(offset / 16) * 16;
    let offsetMod = offset % 16;
    if (offset !== nextFullHex) {
        let hexLine = '', asciiLine = '', addrLine = '';
        addrLine += fillWithZero(decToHex(offset.toString()), 5);
        for (let j = 0; j < 16; j++) {
            if (j >= offsetMod) {
                const element = memory[offset + j];

                hexLine += fillWithZero(parseInt(element, 2).toString(16), 2) + "&nbsp";
                asciiLine += String.fromCharCode(parseInt(element, 2) == 0 ? 46 : parseInt(element, 2));
            } else {
                hexLine += "&nbsp&nbsp&nbsp";
                asciiLine += "&nbsp";
            }
        }
        dump += addrLine + ":&nbsp&nbsp" + hexLine + '&nbsp&nbsp' + asciiLine + '<br>'

    }

    for (let i = nextFullHex; i < nextFullHex + 80; i += 16) {

        let hexLine = '', asciiLine = '', addrLine = '';
        addrLine += fillWithZero(decToHex(i.toString()), 5);

        for (let j = 0; j < 16; j++) {
            const element = memory[i + j];
            hexLine += fillWithZero(parseInt(element, 2).toString(16), 2) + "&nbsp";
            asciiLine += String.fromCharCode(parseInt(element, 2) == 0 ? 46 : parseInt(element, 2));

        }

        dump += addrLine + ":&nbsp&nbsp" + hexLine + '&nbsp&nbsp' + asciiLine + '<br>'

    }
    memDisplay.innerHTML = dump;
}
updatehexdump("00000");

document.querySelector("#memoryAddress").addEventListener('change', (e) => {
    updatehexdump(fillWithZero(e.target.value));
});

// document.querySelector("#prog").addEventListener('change', (e) => {
//     evalProgram(e.target.value);
// });

let run = () => {
    evalProgram(document.querySelector("#prog").value)
}

let evalProgram = (input) => {
    let lines = splitToLines(input);
    lines.forEach(line => {
        evaluateLine(line);
    });
};

let splitToLines = (input) => {
    return input.split('\n');
};

let evaluateLine = (input) => {
    input = input.toUpperCase();
    let line = input.split('\ ');
    let instruction = line[0];
    let operandA = line[1];
    try {
        let operandB = line[2];



        switch (instruction) {
            case 'MOV':
                movInstruction(operandA, operandB);
                break;

            case 'SWAP':
                swapInstruction(operandA, operandB);
                break;
            case 'HELLO':
                helloInstruction(operandA);
                break;

            default:
                break;
        }
    } catch{ }
};

let memoryAccess = (input) => {

    let returnAddres = 0;
    //evaluate every item

    let items = input.split('\+');
    items.forEach(el => {


        el = el.replace('[', '');
        el = el.replace(']', '');
        el = el.replace(' ', '');
        console.log(el);
        if (Object.keys(registers).includes(el)) {
            returnAddres += parseInt(registers[el], 2);
            console.log(registers[el]);
        } else {
            returnAddres += parseInt(el);
        }
    })
    console.log(returnAddres);

    return returnAddres;
}

