const express = require('express');
const router = express.Router();
const query = require('../dbConnector')
router.use((req, res, next) => {
    console.log("[Vector query]");
    next();
})
router
    .route('/deleteall')
    .delete((req, res) => {
        query(`delete from vector where IdAlt=${IdAlt} AND IdMark=${IdMark};`, response => {
            res.send(response);
        })
    })
router.route('/')
    .post((req, res) => {
        let { IdAlt, IdMark } = req.body;
        query(`insert into vector(IdAlt, IdMark) values('${IdAlt}','${IdMark}')`, response => {
            res.send(response)
        })
    })
    .delete((req, res) => {
        let { IdVect } = req.body;
        query(`delete from vector where IdVect=${IdVect};`, response => {
            res.send(response);
        })
    }).put((req, res) => {
        let { IdAlt, IdMark, IdVect } = req.body;
        query(`update vector set IdAlt='${IdAlt}', IdMark='${IdMark}' where IdVect='${IdVect}'`, response => {
            res.send(response)
        })
    })
    router.route('/lab2')
    .get((req,res)=>{
        query(`select vector.IdVect,mark.MName,alternative.AName,mark.IdMark,alternative.IdAlt, criterion.CName, criterion.IdCrit, criterion.EdIzmer from alternative INNER JOIN vector ON alternative.IdAlt = vector.IdAlt INNER JOIN mark ON vector.IdMark = mark.IdMark INNER JOIN criterion ON mark.IdCrit = criterion.IdCrit`, response=>{
            res.send(response)
        })
    })
router.route('/general/:IdAlt')
    .get((req, res) => {
        query(`select vector.IdVect,mark.MName,alternative.AName,mark.IdMark,alternative.IdAlt, criterion.CName, criterion.IdCrit, criterion.EdIzmer from alternative INNER JOIN vector ON alternative.IdAlt = vector.IdAlt INNER JOIN mark ON vector.IdMark = mark.IdMark INNER JOIN criterion ON mark.IdCrit = criterion.IdCrit where alternative.IdAlt = ${req.params.IdAlt};`, response => {
            res.send(response)
        })
    })
    .post((req, res) => {
        let { IdAlt, IdMark } = req.body;
        query(`insert into vector(IdAlt, IdMark) values('${IdAlt}','${IdMark}')`, response => {
            res.send(response)
        })
    })
    .delete((req, res) => {
        let { IdAlt, IdMark } = req.body;
        query(`delete from vector where IdAlt='${IdAlt} AND IdMark=${IdMark}'`, response => {
            res.send(response);
        })
    })
    .put((req, res) => {
        let { AName, MName, newAName, newMName } = req.body;
        query(`UPDATE vector SET IdAlt =(SELECT IdAlt from alternative WHERE AName='${newAName}'),
        IdMark =(SELECT IdMark from mark WHERE MName='${newMName}')
        where IdAlt = (select IdAlt from alternative where AName='${AName}') AND
        IdMark = (select IdMark from mark where MName='${MName}')`, response => {
                res.send(response)
            })

    })


module.exports = router;