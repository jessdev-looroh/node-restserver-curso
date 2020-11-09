import './config/config';
import express from "express";
const app = express();
import {urlencoded,json} from "body-parser";

app.use(urlencoded({extended:false}));
app.use(json());


app.get("/usuario", function (req, res) {
  res.json("get Usuario");
});

app.post('/usuario',function (req, res){


    let data = req.body;
    if(data.nombre == undefined){
        res.status(400).json({
            ok : false,
            mensaje: "El nombre es necesario"
        })
    }else{

        res.json(data);
    }
})
app.put('/usuario/:id',(req, res)=>{
    
    let id = req.params.id;
    res.json({id});
})
app.delete('/usuario/:id',(req, res)=>{
    // console.log(req.body);
    res.json("delete");
})

app.listen(process.env.PORT,()=>{
    console.log("Escuchando puerto : ", process.env.PORT);
}); 