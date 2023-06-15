import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/system';

const BoldTypography = styled(Typography)({
    fontWeight: 'bold'
}),
CostBox = styled(Box)({
    width: '80%', marginLeft: '1vw', marginBottom: '3.6vh', height: '12vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '.5vh'
}),
FilterBox = styled(Box)({
    width: '20%', backgroundColor: 'white', borderRadius: '14px'
}),
SecondBox = styled(Box)({
    borderTop: '3px #EEEEEE solid'
})

export default function Filter(){

    const [value, setValue] = React.useState('1');

    const roomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
      };

    const [typesOfHousing, setTOH] = React.useState({
        house: false,
        flat: false,
        villa: false,
        hotel: false
      });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTOH({
            ...typesOfHousing,
            [event.target.name]: event.target.checked,
    });
    };

    const { house, flat, villa, hotel } = typesOfHousing;

    return (
        <FilterBox>
            <CostBox>
                <BoldTypography sx={{marginBottom: '2.5vh'}}>Стоимость</BoldTypography>
                <Slider defaultValue={12} max={80} min={5} aria-label="Default" valueLabelDisplay="auto"
                onChangeCommitted={(e, val)=>{console.log('NEW: ', val)}} sx={{marginLeft: '0.5vw'}}/>
            </CostBox>
            <SecondBox>
                <FormControl sx={{marginLeft: '1vw', marginTop: '3.8vh', marginBottom: '3.6vh'}}>
                    <FormLabel id="demo-controlled-radio-buttons-group" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Количество комнат</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={roomsChange}
                    >
                        <FormControlLabel value="1" control={<Radio />} label={<BoldTypography>1 комната</BoldTypography>} />
                        <FormControlLabel value="2" control={<Radio />} label={<BoldTypography>2 комнаты</BoldTypography>} />
                        <FormControlLabel value="3" control={<Radio />} label={<BoldTypography>3 комнаты</BoldTypography>} />
                        <FormControlLabel value="4" control={<Radio />} label={<BoldTypography>4+ комнаты</BoldTypography>} />
                    </RadioGroup>
                </FormControl>
            </SecondBox>
            <SecondBox>
                <FormControl sx={{ m: 3, marginTop: '3vh' }} component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Тип жилья</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                            <Checkbox checked={house} onChange={(e)=>{handleChange(e); console.log(!house)}} name="house" />
                            }
                            label={<BoldTypography>Дом</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={flat} onChange={(e)=>{handleChange(e); console.log(!flat)}} name="flat" />
                            }
                            label={<BoldTypography>Квартира</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={villa} onChange={(e)=>{handleChange(e); console.log(!villa)}} name="villa" />
                            }
                            label={<BoldTypography>Вилла</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={hotel} onChange={(e)=>{handleChange(e); console.log(!hotel)}} name="hotel" />
                            }
                            label={<BoldTypography>Отель</BoldTypography>}
                        />
                    </FormGroup>
                </FormControl>
            </SecondBox>
        </FilterBox>
    )
}