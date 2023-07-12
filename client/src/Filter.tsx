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
    width: '100%', paddingLeft: '2em', marginBottom: '1em', height: '6em', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginTop: '1em',
    alignItems: 'flex-start',
    paddingRight: '2em'
}),
FilterBox = styled(Box)({
    width: '18vw', backgroundColor: 'white', borderRadius: '14px',
    minWidth: '150px'
}),
SecondBox = styled(Box)({
    borderTop: '3px #EEEEEE solid',
    minHeight: '15em',
    paddingLeft: '2em'
})

export default function Filter(){

    const countRooms = localStorage.getItem('countRooms') || '1';

    const roomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem('countRooms', String((event.target as HTMLInputElement).value));
        window.location.reload();
      };

    const [typesOfHousing, setTOH] = React.useState(JSON.parse(localStorage.getItem('filterTypes') || JSON.stringify({house: true,
        flat: true,
        villa: true,
        hotel: true})));
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTOH({
            ...typesOfHousing,
            [event.target.name]: event.target.checked,
    });
    };

    const updateLocalStorageFilter = (hs : boolean, fl: boolean, vi: boolean, ho: boolean)=>{
        localStorage.setItem('filterTypes', JSON.stringify({
            house: hs,
            flat: fl,
            villa: vi,
            hotel: ho
         }));
         window.location.reload();
    }

    const { house, flat, villa, hotel } = typesOfHousing;

    return (
        <FilterBox>
            <CostBox>
                <BoldTypography>Стоимость</BoldTypography>
                <Slider defaultValue={parseInt(localStorage.getItem('filterCost') || '100000')} max={100000} min={10} aria-label="Default" valueLabelDisplay="auto"
                onChangeCommitted={(e, val)=>{localStorage.setItem('filterCost', String(val)); window.location.reload();}}/>
            </CostBox>
            <SecondBox>
                <FormControl sx={{marginTop: '1.5em', marginBottom: '1.5em'}}>
                    <FormLabel id="demo-controlled-radio-buttons-group" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Количество комнат</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={countRooms}
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
                <FormControl sx={{marginTop: '1.5em', marginBottom: '1.5em'}} component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{fontWeight: 'bold', color: 'black', marginBottom: '1vh'}}>Тип жилья</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                            <Checkbox checked={house} onChange={(e)=>{handleChange(e);
                                updateLocalStorageFilter(!house, flat, villa, hotel);}} name="house" />
                            }
                            label={<BoldTypography>Дом</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={flat} onChange={(e)=>{handleChange(e);
                                updateLocalStorageFilter(house, !flat, villa, hotel);}} name="flat" />
                            }
                            label={<BoldTypography>Квартира</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={villa} onChange={(e)=>{handleChange(e);
                                updateLocalStorageFilter(house, flat, !villa, hotel);}} name="villa" />
                            }
                            label={<BoldTypography>Вилла</BoldTypography>}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox checked={hotel} onChange={(e)=>{handleChange(e);
                                updateLocalStorageFilter(house, flat, villa, !hotel);
                        }} name="hotel" />
                            }
                            label={<BoldTypography>Отель</BoldTypography>}
                        />
                    </FormGroup>
                </FormControl>
            </SecondBox>
        </FilterBox>
    )
}