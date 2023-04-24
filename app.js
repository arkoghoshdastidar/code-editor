const axios = require('axios');
const qs = require('qs');
const express = require('express');
require('./db/dbconnect');
const codeModel = require('./db/model');
require('dotenv').config();
const app = express();
const port = 3000 || process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/compile', async (req, res) => {
    const codeId = req.body.codeId;
    const lan = req.body.lan;
    const inp = req.body.inp;
    let _code = null;

    try {
        _code = await codeModel.findById(codeId);
        _code = _code.code;
    } catch (err) {
        res.send(err);
    }

    const data = qs.stringify({
        'code': _code,
        'language': lan,
        'input': inp
    });

    const config = {
        method: 'post',
        url: 'https://api.codex.jaagrav.in',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    try {
        const response = await axios(config);
        res.send(response.data);
    } catch (err) {
        res.send(err);
    }
});

app.get('/', (req, res) => {
    const code = `Clone is an online code editor that allows users to quickly and easily share code snippets with others. It is a simple, lightweight tool that is perfect for quickly sharing code, without the need for an account or login.
    
    With Clone, users can paste their code into the editor, select the language, and share the generated URL with others. The code is then displayed in a clean, readable format, with syntax highlighting to make it easier to read and understand.`;

    res.render('pages/code-display', {
        numberOfLines: code.split('\n').length,
        code: code,
        class: 'language-plaintext',
        newButton: true
    });
})


app.get('/new', (req, res) => {
    res.render('pages/new', {
        showSaveOption: true,
        newButton: true
    })
})

app.post('/save', async (req, res) => {
    const code = req.body.value;
    try {
        const newDoc = await new codeModel({ code });
        await newDoc.save();
        res.redirect(`/${newDoc._id}/new`);
    } catch (err) {
        res.send(err.message);
    }
})

app.get('/:id/new', async (req, res) => {
    try {
        let newCode = await codeModel.findById(req.params.id);
        newCode = newCode.code;
        res.render('pages/code-display', {
            numberOfLines: newCode.split('\n').length,
            code: newCode,
            id: req.params.id,
            showDelete: true,
            displayForm: true,
            displayRunBtn: true
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

app.get('/:id/duplicate', async (req, res) => {
    let newCode = await codeModel.findById(req.params.id);
    newCode = newCode.code;
    res.render('pages/new', {
        showSaveOption: true,
        code: newCode,
        showEdit: true
    })
})

app.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    try {
        await codeModel.findByIdAndRemove(id);
    } catch (err) {
        console.log('doc not found!');
    }
    res.redirect('/new');
})

app.post('/:id/edit', async (req, res) => {
    try {
        const result = await codeModel.findByIdAndUpdate(req.params.id, { code: req.body.code });
        res.send(JSON.stringify('success'));
    } catch (err) {
        res.send(JSON.stringify('error'));
    }
})

app.all('*', (req, res, next) => {
    res.redirect('/new');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})