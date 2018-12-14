const express = require('express');
const router = express.Router();
const query = require('../dbConnector')
router.use((req, res, next) => {
  console.log("[Mark query]");
  next();
})

router.route('/normmark')
      .get((req,res)=>{
        let { IdMark } = req.body;
        query(`select NormMark from mark where IdMark=${IdMark};`, response => {
          res.send(response);
        })
      })
      .put((req,res)=>{
        let { NormMark, IdMark } = req.body;
        query(`update mark set NormMark=${NormMark} where IdMark=${IdMark};`, response => {
          res.send(response);
        })
      })


router.route('/nummark')
  .put((req, res) => {
    let { NumMark, IdMark } = req.body;
    query(`update mark set NumMark=${NumMark} where IdMark=${IdMark};`, response => {
      res.send(response);
    })
  })

router.route('/getmarkbycrit/:IdCrit')
  .get((req, res) => {

    let { IdCrit } = req.params;

    query(`select IdMark,IdCrit,MName from mark where mark.IdCrit='${IdCrit}';`, response => {

      res.send(response)
    })
  })
router.route('/')
  .get((req, res) => {
    query('select IdMark,IdCrit,MName from mark;', response => {
      res.send(response)
    })
  })
  .post((req, res) => {
    let { IdCrit, MName } = req.body;
    query(`insert into mark(IdCrit, MName) values('${IdCrit}','${MName}')`, response => {
      res.send(response)
    })
  })
  .delete((req, res) => {
    console.log("delete query");

    let { IdMark } = req.body;
    query(`delete from mark where IdMark='${IdMark}'`, response => {
      res.send(response)
    })
  })
  .put((req, res) => {
    let { IdMark, MName, IdCrit } = req.body;
    query(`UPDATE mark SET MName='${MName}',IdCrit='${IdCrit}' where IdMark ='${IdMark}'`, response => {
      console.log(response);

      res.send(response)
    })
  })


module.exports = router;