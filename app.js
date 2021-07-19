const fs = require("fs");
const _ = require("lodash");
const path = require('path');
const chokidar = require('chokidar');
const { spawnSync } = require('child_process');


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const papers = [
    './kertas/folio1.jpg',
    './kertas/folio2.jpg',
    './kertas/folio3.jpg'
];


const textWatcher = chokidar.watch('./text', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

textWatcher
  .on('change', filePath => {
    const rotate = parseFloat([(Math.random() < 0.5 ? -1 : 1), getRandom(10, 50)].join('.'));
    const crop = parseFloat([getRandom(0, 4), getRandom(10, 99)].join('.'));
    const westCrop = getRandom(25, 40);
    fs.readFile(filePath, (err, text) => {
        spawnSync('convert', [ 
            papers[Math.floor(Math.random()  * papers.length)],
            // './kertas/foliomodif.jpg',
            '-font',
            './font/font3.ttf',   
            '-pointsize',
            '40',
            '-interline-spacing',
            '-12',
            '-annotate',
            '+48+137',
            text,
            '-quality',
            '1',
            '-transparent',
            'white',
            '-fill',
            'white',
            '+noise',
            'gaussian',
            '-size',
            '870x1125',
            '-gravity',
            'West',
            '-chop',
            westCrop + 'x0',
            '-crop',
            '87'+ crop.toFixed(0) +'x11'+ crop.toFixed(0) +'5+0+0',
            '-gamma',
            '1.6',
            '-auto-level',
            './results/' + path.parse(filePath).name + '.png'
        ]);

        spawnSync('convert', [
            '-gravity',
            'center',
            '-pointsize',
            '15',
            '-rotate',
            rotate.toFixed(2),
            '-size',
            '870x1125',
            '-annotate',
            '+300+540',
            "Scanned by CamScanner",
            './results/' + path.parse(filePath).name + '.png',
            './results/' + path.parse(filePath).name + '.png',
        ])
    });
})