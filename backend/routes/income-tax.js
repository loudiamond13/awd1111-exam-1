import express from  'express';
import debug from 'debug';
import { check, validationResult } from 'express-validator';


const debugIncomeTax = debug(`app:IncomeTaxDebug`);
const router = express.Router();


router.post(`/calc`,
[
  check(`status`,`Please enter a valid status 'Single' or 'Married'.`).isString(),
  check('income', 'Please enter a valid incom, must be greater than zero.').isString()
],  (req, res) =>{

  //store the error, if there is
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    debugIncomeTax(`Validation failed from ${errors.array}`);
    return res.status(400).json({errors:  errors.array()});
  }
  //else if all fields are filled
  else
  {
    try
    {
      const status  = req.body.status;
      const income = parseFloat(req.body.income);

      //if status is not married or single, send a validation message
      if(status.toLowerCase() !== 'single' &&  status.toLowerCase() !== 'married')
      {
        debugIncomeTax(`invalid status: ${status}`)
        return res.status(400).json({message:  `Invalid Status! Please use either 'Single' or 'Married'`}) ;
      }
      //if income is lower than zero or equal to zero send a validation messsage 
      else if (isNaN(income) || income <= 0)
      {
        debugIncomeTax(`invalid income input: ${income}`)
        return res.status(400).json({message: `Please enter a valid positive number for income.`});
      }
      else
      {
        let totalIncomeTax = 0.00;

        switch(status.toLowerCase())
        {//2020 tax bracket
          
          case "single":
            //calculating  tax for single person
            debugIncomeTax(`calculating  tax for single person`);
            // 10% tax if user is single and income is <= 9,875
            if(income <= 9875)
            {
            totalIncomeTax = (income * .1);
            }
            // 12% tax if user is single and income is >9,875 and <= 40,125
            if(income > 9875 )
            {
                totalIncomeTax = (income * .12);
            }
            // 22% tax if user is single and income is >40,125 and <= 85,525
            if(income > 40125)
            {
                totalIncomeTax = (income * .22);
            }
            // 24% tax if user is single and income is >85,525 and <= 163,300
            if(income > 85525)
            {
                totalIncomeTax = (income * .24);
            }
            // 32% tax if user is single and income is >163,300 and <= 207,350
            if(income > 163300)
            {
                totalIncomeTax = (income * .32);
            }
            // 35% tax if user is single and income is >207,350 and <= 518,400
            if(income > 207350)
            {
                totalIncomeTax = (income * .35);
            }
            // 37% tax if user is single and income is >518,400 and more...
            if(income > 518400)
            {
                totalIncomeTax = (income * .37);
            }
            break;
          default:
            //calculating  tax for married person
            debugIncomeTax(`calculating  tax for married person`);
            // 10% tax if user is married and income is <= 19,750
            if(income <= 19750)
            {
                totalIncomeTax = (income * .1);
            }
            // 12% tax if user is married and income is >19,750 
            if(income > 19750 )
            {
                totalIncomeTax = (income * .12);
            }
            // 22% tax if user is married and income is >80,250 
            if(income > 80250)
            {
                totalIncomeTax = (income * .22);
            }
            // 24% tax if user is married and income is >171,050
            if(income > 171050)
            {
                totalIncomeTax = (income * .24);
            }
            // 32% tax if user is married and income is >326600
            if(income > 326600)
            {
                totalIncomeTax = (income * .32);
            }
            // 35% tax if user is married and income is >414,700
            if(income > 414700)
            {
                totalIncomeTax = (income * .35);
            }
            // 37% tax if user is married and income is >622,050 and more...
            if(income > 622050)
            {
                totalIncomeTax = (income * .37);
            }
            break;
        }

        debugIncomeTax(`income tax is: $${Math.ceil(totalIncomeTax)}`);
        return res.status(200).json({message: `income tax is: $${Math.ceil(totalIncomeTax)}`});
      }
    }
    catch(error)
    {
      debugIncomeTax(error);
      return res.status(500).json({error:`Something went wrong.`});
    }
  }


});


export {router as IncomeTaxRouter};