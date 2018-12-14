const express = require('express');
const router = express.Router();
const query = require('../dbConnector')
router.use((req,res,next)=>{
    console.log("[Lpr query]");
    next();
})


router.route('/')
.get((req,res)=>{
    query('SELECT * FROM lpr;',response=>{
        res.send(response)
    })
})
.post((req,res)=>{
    query(`INSERT IGNORE INTO lpr(LName) VALUES('${req.body.LName}')`,response=>{
        res.send(response)
    })
})
.delete((req,res)=>{
  query(`DELETE FROM lpr WHERE IdLPR='${req.body.IdLPR}'`,response=>{
      res.send(response)
  })
})
.put((req,res)=>{
  query(`UPDATE lpr SET LName='${req.body.LName}' WHERE IdLPR='${req.body.IdLPR}'`,response=>{
      res.send(response)
  })
})
    


module.exports = router;