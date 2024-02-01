import express from  'express';
import debug from 'debug';
import { check, validationResult } from 'express-validator';

const debugMPG = debug(`app:MpgRouter`);

const router = express.Router();


// mpg calc route
// /api/mpg/calc
router.post('/calc',
[
  check('milesDriven', `Miles driven is required.`).isString(),
  check(`gallonUsed`, `Gallon used is required.`).isString()
],async (req, res) => 
{
  // gets the errors from the validation, if there is 
  const errors = validationResult(req);
  
  if (!errors.isEmpty())  
  {
    return res.status(400).json({ message: errors.array() });
   }
   else
   {
    try
    {
      const milesDriven = parseFloat(req.body.milesDriven);
      const gallonsUsed = parseFloat(req.body.gallonUsed);
      // make sure miles driven and gallons used are numbers
      if (isNaN(milesDriven) || milesDriven <= 0)  
      {
        debugMPG(`invalid miles driven input`);
        return res.status(400).json({message:  "Input for miles driven must be valid numbers."});
      }
      else if (isNaN(gallonsUsed) || gallonsUsed <= 0)  
      {
        debugMPG(`invalid gallons used input`);
        return res.status(400).json({message:  "Input for gallons used must be valid numbers."});
      }
      else
      {
        // calculate MPG
        const MPG = milesDriven / gallonsUsed;
        debugMPG(`${MPG.toFixed(2)} miles per gallon.`);
        // send back results as json
        res.status(200).json({message: `Your car gets ${MPG.toFixed(2)} miles per gallon.`});
      }
   } 
   catch (err) 
   {
    debugMPG(err);
    // make it general  so any error will get caught here
    res.status(500).json({message:`Something wen't wrong.`});
   }
  }

   
});


export {router as MpgRouter}