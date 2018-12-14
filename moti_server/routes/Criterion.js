const express = require('express');
const router = express.Router();
const query = require('../dbConnector')
router.use((req,res,next)=>{
    console.log("[Criterion query]");
    next();
})
router.route('/critmark').get((req,res)=>{
  query('select criterion.IdCrit, criterion.OptimType, criterion.CName, criterion.CType, mark.MName, mark.IdMark, criterion.EdIzmer from criterion INNER JOIN mark ON criterion.IdCrit = mark.IdCrit;',response=>{
    res.send(response)
  })
})
router.route('/')
      .get((req, res)=>{
        query('select * from criterion;',response=>{
          res.send(response)
        })
      })
      .post((req,res)=>{
        let {CName, CType, OptimType, EdIzmer, ScaleType} = req.body;
        query(`INSERT IGNORE INTO criterion(CName, CType, OptimType, EdIzmer, ScaleType) 
        VALUES('${CName}','${CType}','${OptimType}','${EdIzmer}','${ScaleType}')`,response=>{
          res.send(response)
        })
      })
      .delete((req,res)=>{
        let {IdCrit} = req.body;
          query(`delete from criterion where IdCrit='${IdCrit}'`,response=>{
            res.send(response)
          })
      })
      .put((req,res)=>{
        let {CName, IdCrit, CType, OptimType, EdIzmer, ScaleType} = req.body;
        query(`UPDATE criterion SET CName ='${CName}'
                                    ,CType='${CType}'
                                    ,OptimType='${OptimType}'
                                    ,EdIzmer='${EdIzmer}'
                                    ,ScaleType='${ScaleType}'
                                    WHERE IdCrit='${IdCrit}'`
        ,response=>{
          res.send(response)
        })
        
      })


module.exports = router;