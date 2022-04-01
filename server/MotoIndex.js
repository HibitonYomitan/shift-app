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

//sqlからデータを取ってくるルーティング
app.get('/api/get',(req,res) => {
    const sqlSelect = 
        "SELECT * FROM new_table";
    db.query(sqlSelect,(err,result)=>{
        res.send(result)
    })
})

//SQに追加するルーティング
app.post('/api/insert',(req,res)=>{
    const movieName = req.body.movieName
    const movieReview = req.body.movieReview

    const sqlInsert = "INSERT INTO new_table (movieName, movieReview) VALUES(?,?)"
    db.query(sqlInsert,[movieName,movieReview],(err,result)=>{
        console.log(result)
    })
})

app.delete('/api/delete/:movieName',(req,res) => {
    const name = req.params.movieName

    const sqlDelete = 
    "DELETE FROM new_table WHERE movieName = ?";
    
    db.query(sqlDelete,name,(err,results) => {
       if(err) console.log(err)
    })
    
})

app.put('/api/update',(req,res) => {
    const name = req.body.movieName
    const review = req.body.movieReview
    const sqlUpdate = 
    "UPDATE new_table SET movieReview = ? WHERE movieName = ?";
    
    db.query(sqlUpdate,[review,name],(err,result) => {
       console.log(result)
    })
    
})




app.listen(3001,() => {
    console.log('running on port 3001')
})