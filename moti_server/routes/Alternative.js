const express = require('express');
const router = express.Router();
const query = require('../dbConnector')
router.use((req,res,next)=>{
    console.log("[Alternative query]");
    next();
})

router.route('/bycriterion/:IdCrit/:OptimType').get((req,res)=>{
   // console.log(req.body);
    
    query(`select alternative.AName, alternative.IdAlt from alternative INNER JOIN vector on alternative.IdAlt = vector.IdAlt INNER  JOIN mark ON vector.IdMark = mark.IdMark INNER JOIN criterion on mark.IdCrit = criterion.IdCrit WHERE criterion.IdCrit=${req.params.IdCrit} AND criterion.OptimType='${req.params.OptimType}';`, response=>{
        res.send(response)
    })
})
router.route('/')
        .get((req,res)=>{
            query('SELECT * FROM alternative;', response=>{
                res.send(response)
            })
        })
        .post((req,res)=>{
            console.log(req.body);
            
            query(`INSERT IGNORE INTO alternative(AName) VALUES('${req.body.AName}')`,response=>{
                console.log(response);
                
                res.send(response)
            })
        })
        .delete((req,res)=>{
            console.log(req.body);
            
            query(`DELETE FROM alternative WHERE IdAlt='${req.body.IdAlt}'`,response=>{
                res.send(response)
            })
        })
        .put((req,res)=>{
            query(`UPDATE alternative SET AName='${req.body.newAName}' WHERE IdAlt='${req.body.IdAlt}'`,response=>{
                res.send(response)
            })
        })


module.exports = router;