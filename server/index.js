const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'$Hibiton1214',
    database:'shift_app'
})

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

//雇用主アカウント作成
app.post('/api/insertEmployer',(req,res)=>{
    const name = req.body.name
    const password = req.body.password
    const shopName = req.body.shopName

    const sqlInsert = "INSERT INTO user (name,password,shopName,position) VALUES(?,?,?,?)"
    db.query(sqlInsert,[name,password,shopName,'employer'],(err,result)=>{
        console.log(result)
    })
})

//従業員アカウント作成
app.post('/api/insertEmployee',(req,res)=>{
    const name = req.body.name
    const password = req.body.password
    const shopName = req.body.shopName
    const place = req.body.place
    const desiredDays = req.body.desiredDays


    const sqlInsert = "INSERT INTO user (name,password,shopName,place,desiredDays,position) VALUES(?,?,?,?,?,?)"
    db.query(sqlInsert,[name,password,shopName,place,desiredDays,'employee'],(err,result)=>{
        res.send(result)
    })
})

app.post('/api/login',(req,res) => {
    const name = req.body.name
    const password = req.body.password

    db.query(
        "SELECT * FROM user WHERE name = ? AND password = ?",
        [name,password],
        (err,result) => {
            if(err){
                res.send({err:err})
            }

            if(result.length > 0){
                res.send(result)
            }else{
                res.send({message:'Wrong username/password combination!'})
            }
            
        }
    )
})

app.post('/api/getHoliday',(req,res) => {
    const id = req.body.id
    
    db.query(
        "SELECT DISTINCT * FROM desiredHoliday WHERE id = ?",
        [id],
        (err,result) => {
            if(err){
                res.send({err:err})
            }
            res.send(result)
        }
    )
})

app.post('/api/addHoliday',(req,res) => {
    const id = req.body.id
    const holiday = req.body.holiday
    const shopName = req.body.shopName
    const sqlInsert = "INSERT INTO desiredHoliday (id,day,shopName) VALUES(?,?,?)"
    const sqlDelete = "DELETE FROM desiredHoliday WHERE id = ?"
    db.query(sqlDelete,[id],(err,result) => {
        console.log(err)
    })
    for(let i = 0;i < holiday.length;i++){
        db.query(sqlInsert,[id,holiday[i],shopName],(err,result)=>{
            console.log(err)
        })
    }
})

app.post('/api/getEmployeeInfo',(req,res) => {
    const shopName = req.body.shopName;
    db.query(
        "SELECT `id`, `name`, `place`, `desiredDays` FROM user WHERE shopName = ? AND position = ?",
        [shopName,'employee'],
        (err,result) => {
            if(err){
                res.send({err:err})
            }
            res.send(result)
        }
    )
})

app.post('/api/getHoliday2',(req,res) => {
    const shopName = req.body.shopName
    const sqlGet = "SELECT DISTINCT * FROM desiredHoliday WHERE shopName = ?"   
    db.query(sqlGet,[shopName],(err,result) => {
        if(err){
            res.send({err:err})
        }
        res.send(result)
    }) 
})



app.post('/api/addWorkDay',(req,res) => {
    const workDay = req.body.workDay
    const shopName = req.body.shopName
    const sqlInsert = "INSERT INTO workDay (name,day,shopName) VALUES(?,?,?)"
    for(let i = 0;i < workDay.length;i++){
        let name = ''
        let day = ''
        let flag = false
        for(let j = 0;j < workDay[i].length;j++){
            if(workDay[i][j] == '/') flag = true
            else if(!flag) name += workDay[i][j]
            else day += workDay[i][j]
        }
        db.query(sqlInsert,[name,day,shopName],(err,result) => {
            console.log(err)
        })
    }
})

app.post('/api/getWorkDay',(req,res) => {
    const shopName = req.body.shopName;
    const sqlGet = "SELECT * FROM workDay WHERE shopName = ?"
    db.query(sqlGet,[shopName],(err,result) => {
        if(err){
            res.send(err)
        }else res.send(result)
    })
})

app.post('/api/addDecided',(req,res) => {
    const decidedMonth = req.body.decidedMonth;
    const shopName = req.body.shopName;
    const sqlInsert = "INSERT INTO decidedMonth (decidedMonth,shopName) VALUES(?,?)"
    db.query(sqlInsert,[decidedMonth,shopName],(err,result) => {
        console.log(err)
    })
})

app.post('/api/isDecided',(req,res) => {
    const shopName = req.body.shopName;
    const sqlGet = "SELECT * FROM decidedMonth WHERE shopName = ?"
    db.query(sqlGet,[shopName],(err,result) => {
        res.send(result)
    })
})



app.listen(3001,() => {
    console.log('running on port 3001')
})