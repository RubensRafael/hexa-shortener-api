import express from 'express'
import cors from 'cors';

import db from './database.js'
import * as query from './query.js'
import { choice } from 'randomicsjs'

const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json())

// Caracteres base para criação do código
const CODE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


app.post('/',async (req,res)=>{
  // Verifica se é uma url válida
  const { url } = req.body
  let regex = new RegExp("((http|https)://)(www.)?" + "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" + "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)")

  //Se não for
  if(!regex.test(url)){
    res.status(400).send({'result':'URL inválida'})
  }else{// se for, verifique se essa url já está salva.
    const priorResult = await db.query(query.GET_SHORT_CODE,[url])
    //se já estiver, envie.
    if(priorResult.rowCount > 0){
      res.send({'result':priorResult.rows[0].short})
    }else{ //se não, adicione-a ao banco.
      let short 
      while(true){
        short = choice(CODE,6).join('')// cria o código de 6 digitos
        const verifDouble = await db.query(query.GET_ORIGIN,[short])// verifica duplicatas
        if(verifDouble.rowCount === 0 ){break}
      }
      let result = await db.query(query.INSERT_URL,[url,short])// salva
      
      res.send({'result':result.rows[0].short})
    }
    
  }
  
})

app.get('/:code',async (req,res)=>{

  const code = await db.query(query.GET_ORIGIN,[req.params.code])// recupera o link original, baseado no código.
  if(code.rowCount > 0){//se encontrar, redirecione.
    res.redirect(code.rows[0].origin)
  }else{// se não, avise.
    res.status(404).send({'result':'Código não encontrado'})
  }
  
})

app.listen(port, () => {
  console.log(`app listening...`)
})