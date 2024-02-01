import express from  'express';
import debug from 'debug';
import { check, validationResult } from 'express-validator';


const router = express.Router();
const debugTempConverter = debug(`app:TempConverterDebug`)


router.post(`/convert`,
[
  //check  inputs
  check('mode', `Please enter 'FtoC' or 'CtoF'.`).isString(),
  check('temp', "Temperature is required.").isString()
],  (req, res) =>{
    //gets the errors if any field has
    const errors = validationResult(req);

    // if errors is not empty, show error  messages
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    //else validate the inputs and do the math
    else
    {
      const mode = req.body.mode;
      let temp = parseFloat(req.body.temp);
    
      try
      {
        //check the input mode
        if(mode.toLowerCase() !== 'ftoc'  && mode.toLowerCase() !== 'ctof')
        {
          return res.status(400).json({message:  `'${mode}' is an invalid conversion mode. Please enter 'FtoC' or 'CtoF'`});
        }
        else if(isNaN(temp))
        {
          return res.status(400).json({message:  `Please enter a valid digit/number for temperature.`});
        }
        // else if all inputs are valid, do the math
        else
        {
          let convertedTemp = 0.00;
          //do the conversion based on the mode
          switch(mode.toLowerCase())
          {
            case 'ftoc':
              debugTempConverter("Converting Fahrenheit to Celsius");
              convertedTemp = ((temp - 32) * (5/9));
              break;
              
            default:
              debugTempConverter("Converting Celsius to Fahrenheit");
              convertedTemp = ((temp *(9/5)) + 32);
          }
          
          return res.status(200).json({message: `${convertedTemp.toFixed(2)} degrees for the ${mode} conversion of ${temp}.`});
        
        }//end else
      }
      catch(error)
      {
        //internal error
        debugTempConverter(`error:  ${error}`);
        return res.status(500).json({ message:`Something wen't wrong`});
      }
    }
});

export {router as  tempConverterRouter};