const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
const PORT = 3000;

let user = {
    id: "sdkcmekdcfedcfecv",
    email: "jags@gmail.com",
    password: "wdwedmwedwedm3@23344-32de3ked"
}

const JWT_SECRET = 'Some Super Secret...'

app.get('/', (req, res)=>{
    res.send(`<h1>Please use '/forgot-password' at the end of above URL to navigate to forgot-password page</h1>`)
})

app.get('/forgot-password', (req, res, next)=>{
    res.render('forgot-password')
})

app.post('/forgot-password', (req, res, next)=>{
    const {email} = req.body
    //Make sure the user exists n Database
    if(user.email!== email){
        res.send("<h1>User is not registered.......Please hard refresh the page to navigate back to forgot-password page and enter the user that exists in DB</h1>");
        return
    }

    //User exist and now create a one time link valild for 15 min
    const secret =  JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'})
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    console.log(link);
    res.send(`<h2>Please Click the link to navigate to the <a style=color:red href=${link} target="_blank">RESET-PASSWORD</a> Page</h2>`);

})

app.get('/reset-password/:id/:token', (req, res, next)=>{
    const {id, token} = req.params
    //check if this id exists in database
    if(id!==user.id){
        res.send('Invalid Id....')
        return
    }
    //We have a valid ID and we have a valid user id
    const secret = JWT_SECRET + user.password
    try{
        const payload = jwt.verify(token, secret)
        res.render('reset-password', {email: user.email})
    }catch(err){
        console.log(err.message);
        res.send(err.message)
    }
})

app.post('/reset-password/:id/:token', (req, res, next)=>{
    const {id, token} = req.params
    const {password, password2} = req.body
    if(id!==user.id){
        res.send('Invalid Id....')
        return
    }

    const secret =  JWT_SECRET + user.password
    try{
        const payload = jwt.verify(token, secret)
        user.password = password
        res.send(user)

    }catch(err){
        console.log(err.message)
    }
})

app.listen(PORT, ()=>{
    console.log("Server Up and Running" + PORT)
})