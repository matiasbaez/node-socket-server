const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
const bandsToAdd = ['Metallica', 'Linkin Park', 'Bon Jovi', 'The Beatles'];
bandsToAdd.map(band => bands.addBand(new Band( band )));


// Sockets Messages
io.on('connection', client => {
    console.log('Socket client connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Socket client disconnected');
    });

    client.on('message', ( payload ) => {
        console.log('message', payload);
        io.emit( 'message', payload );
    });

    client.on('add-band', ( payload ) => {
        const band = new Band(payload.name);
        bands.addBand(band);
        io.emit('active-bands', bands.getBands());
    });

    client.on('remove-band', ( payload ) => {
        bands.removeBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('vote-band', ( payload ) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

});
