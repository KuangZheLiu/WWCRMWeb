// Create connection to database
const sqlConfig = require('../../config/setting.js').mssql.CRM
var msSql = require('mssql')

const express = require('express')
const router = express.Router()

// function ExecSQL(SqlStr, Config, Acallback) {
//   msSql.connect(Config, function (err) {
//     if (err) {
//       console.error(err)
//       Acallback(err, '')
//     }
//     var request = new msSql.Request()
//     console.log('===========SQL Statement ===========')
//     console.log(SqlStr + '\r\n')
//     request.query(SqlStr, function (err, rsp) {
//       msSql.close()
//       if (err) {
//         console.error(err)
//         Acallback(err, '')
//       }
//       Acallback(err, rsp.recordset)
//     })
//   })
// }

async function ExecSQL(SqlStr, Config) {
  try {
    await msSql.connect(Config)
    const request = new msSql.Request()

    console.log('===========SQL Statement ===========')
    console.log(SqlStr + '\r\n')

    const result = await request.query(SqlStr)
    return result.recordset
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    msSql.close()
  }
}

// 测试代码
async function test() {
  try {
    const SqlStr = 'SELECT TOP 2 * FROM InvData'
    const result = await ExecSQL(SqlStr, sqlConfig)
    console.log(result)
  } catch (err) {
    console.error('测试失败:', err)
  }
}

function getSeqNo(Acallback) {
  var SqlStr = ''
  SqlStr =
    'DECLARE @plus varchar(6);\r\n DECLARE @SDATE  varchar(8) = convert(varchar, getdate(), 112)'
  SqlStr += ' IF NOT EXISTS(SELECT * FROM LOG_SEQ WHERE SDATE=@SDATE)\r\n'
  SqlStr += " SET @plus = '000000'\r\n"
  SqlStr +=
    " ELSE SET @plus =RIGHT('000000'+cast((SELECT LOG_COUNT FROM LOG_SEQ WHERE SDATE=@SDATE)+1 as varchar(6)),6)"
  SqlStr += " DECLARE @TransID varchar(16) =@SDATE + '_' + @plus"
  SqlStr += ' SELECT @TransID AS TranID, @SDATE AS SDATE, @plus AS SeqNo'
  ExecSQL(SqlStr, sqlConfig, Acallback)
}

module.exports.queryLog = function (instance, Acallback) {
  var SqlStr = 'SELECT * FROM Trans\r\n'
  ExecSQL(SqlStr, sqlConfig, Acallback)
}

module.exports.InsertLog = function (instance, Acallback) {
  getSeqNo(function (err, Rsp) {
    var SqlStr = 'DECLARE @SDATE varchar(8) = convert(varchar, getdate(), 112);\r\n'
    SqlStr += ' DECLARE @CURRENT_TS datetimeoffset = GETDATE();\r\n'
    SqlStr +=
      ' INSERT INTO Trans(AccID, TranID, TranTime, AtmID, TranType, TranNote, UP_DATETIME, UP_USR)\r\n'
    SqlStr +=
      " VALUES('" +
      instance.AccID +
      "', '" +
      Rsp[0].TranID +
      "', @CURRENT_TS, '" +
      instance.AtmID +
      "', '"
    SqlStr +=
      instance.TranType +
      "', '" +
      instance.TranNote +
      "', @CURRENT_TS, '" +
      instance.UP_USR +
      "')\r\n"
    if (Rsp[0].SeqNo == '000000')
      SqlStr += "INSERT INTO LOG_SEQ (SDATE,LOG_COUNT) VALUES(@SDATE,'000000')\r\n"
    else {
      SqlStr += "UPDATE LOG_SEQ SET LOG_COUNT='" + Rsp[0].SeqNo + "' WHERE SDATE=@SDATE\r\n"
    }
    SqlStr += 'SELECT @@ROWCOUNT AS count'
    ExecSQL(SqlStr, sqlConfig, Acallback)
  })
}

module.exports.UpdateLog = function (instance, Acallback) {
  if (instance.TranID) {
    var SqlStr = 'UPDATE Trans SET'
    SqlStr += " AccID='" + instance.AccID + "',"
    SqlStr += " TranTime='" + instance.TranTime + "',"
    SqlStr += " AtmID='" + instance.AtmID + "',"
    SqlStr += " TranType='" + instance.TranType + "',"
    SqlStr += " TranNote='" + instance.TranNote + "',"
    SqlStr += ' UP_DATETIME=getdate(),'
    SqlStr += " UP_USR='" + instance.UP_USR + "'\r\n"
    SqlStr += " WHERE TranID='" + instance.TranID + "'\r\n"
    SqlStr += ' SELECT @@ROWCOUNT AS count'
    ExecSQL(SqlStr, sqlConfig, Acallback)
  } else {
    Acallback('', 'Transation ID does not be specified')
  }
}

module.exports.DeleteLog = function (instance, Acallback) {
  if (instance.TranID) {
    var SqlStr = 'DELETE Trans WHERE'
    SqlStr += " TranID='" + instance.TranID + "'"
    ExecSQL(SqlStr, sqlConfig, Acallback)
  } else {
    Acallback('', 'fail')
  }
}

/* GET home page. */
router.get('/dbinfo', function (req, res, next) {
  // console.log('Connected')
  // res.send('Connected')

  // mssql connect for database
  msSql.connect(sqlConfig, (err) => {
    // ... error checks

    if (err) {
      console.log('error: ' + err)
      return res.status(500).send(err)
    }

    console.log('connected')

    new msSql.Request().query('SELECT TOP 2 * FROM InvData', (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      }

      console.log('Query result:', result)
      res.json(result)
    })
  })
})
module.exports = router

router.get('/dbquery', async function (req, res, next) {
  try {
    const SqlStr = 'SELECT TOP 2 * FROM InvData\r\n'
    const result = await ExecSQL(SqlStr, sqlConfig)
    res.json(result)
    console.log('Query result:', result)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})
