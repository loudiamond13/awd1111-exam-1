import express from 'express';
import debug from 'debug';
import { check, validationResult } from 'express-validator';

const debugInterest = debug(`app:InterestDebug`);
const router = express.Router();



router.post(`/calc`,
[
  check(`principal`, `Please enter the principal money.`).isString(),
  check(`interestRate`,`Please enter the interest rate.`).isString(),
  check(`years`,`Please enter the years.`).isString()
], (req,res) => {

  //store the errors
  const errors = validationResult(req);

  //check the errors if there is
  if (!errors.isEmpty()) 
  {
    debugInterest(errors.array);
    return res.status(400).json({ errors:  errors.array() });
  }
  //else if all fields are filled
  else
  {
    const  princ = parseFloat(req.body.principal);
    const intRate = parseFloat(req.body.interestRate)/100;//convert to decimal
    const   yrs     = parseInt(req.body.years);
    let finalAmt = 0.00;
    try
    {
      if(isNaN(princ) || princ <= 0)
      {
        debugInterest(`principal amount is <= 0`);
        return res.status(400).json({message: `Please enter a valid positive for principal amount`});
      }
      else if (isNaN(intRate) || intRate  < 0 || intRate > 1)
      {
        debugInterest(`interest rate is <= 0 or > 100`);
        return res.status(400).json({ message:`The interest rate should be between 1 and 100.`})
      } 
      else if (isNaN(yrs) ||  yrs <= 0 ||  yrs > 50)
      {
        debugInterest(`yrs is <= 0 or > 50yrs`);
        return res.status(400).json({ message:"Years must be between 1 and 50." })
      }
      //else if all validation passed
      else
      {
        //do the math
        finalAmt = princ * ((1 + intRate/ 12) ** (12 * yrs));
        debugInterest(`finalAmount : $${finalAmt.toFixed(2)}`);
        return res.status(200).json({message:`Final Amount: $${finalAmt.toFixed(2)}`});
      }
    }
    catch(error)
    {
      debugInterest(error);
      return res.status(500).json({ message : "Internal Server Error"});
    }

    
  }
});

export {router as InterestRouter};