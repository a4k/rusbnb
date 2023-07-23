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
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const BoldTypography = styled(Typography)({
    fontWeight: 'bold'
}),
CostBox = styled(Box)({
    width: '100%', minHeight: '6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: '2rem 8%'
}),
FilterBox = styled(Box)({
    width: '90vw', backgroundColor: 'white', borderRadius: '14px',
    margin: '0 auto',
    marginTop: '2rem',
    marginBottom: '15vh'
}),
SecondBox = styled(Box)({
    borderTop: '3px #EEEEEE solid',
    minHeight: '5rem',
    padding: '0.5rem 8%'
}),
Footer = styled(Box)({
    backgroundColor: '#F5F5F5', height: '4rem', width: '100%', position: 'fixed', bottom: '0',
    borderTop: '1px solid gray', display: 'flex', justifyContent: 'space-between',
    padding: '0.5rem 5%'

}),
FooterBtn = styled(Button)({
    fontSize: '1.2rem',
    textTransform: 'none',
    minWidth: '40%'
});

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function MobileFilter(){
    const navigate = useNavigate();
    const location = useLocation();
    const state = location?.state || {};

    const [countRooms, setCountRooms] = React.useState(state.countRooms || '1');
    const [typesOfHousing, setTOH] = React.useState(state.typesOfHousing || 
        {house: true,
        flat: true,
        villa: true,
        hotel: true});
    const [cost, setCost] = React.useState(state.cost || 50_000);
    const [rate, setRate] = React.useState(state.rate || 0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newVal = {
            ...typesOfHousing,
            [event.target.name]: event.target.checked,
        };
        setTOH(newVal);
    };

    const handleChangeRooms = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCountRooms((event.target as HTMLInputElement).value);
      };

    const handleChangeCost = (newCost: number | number[]) : void => {
        setCost(newCost)
    }

    const { house, flat, villa, hotel } = typesOfHousing;

    const handleSearch = ()=>{
        const navState : any = location.state || {};
        navState.typesOfHousing=typesOfHousing;
        navState.countRooms = countRooms;
        navState.cost = cost;
        navState.rate = rate;
        navigate('/', {state: navState});
    }

    const handleCancel = ()=>{
        navigate(-1);
    }

    return (
        <>
        <FilterBox>
            <CostBox>
                <BoldTypography>Стоимость {numberWithSpaces(cost)} &#8381;</BoldTypography>
                <Slider defaultValue={state.cost || 50_000} max={100_000} min={10} aria-label="Default" valueLabelDisplay="auto"
                onChangeCommitted={(e, val)=>{handleChangeCost(val)}}
                color="secondary"/>
            </CostBox>
            <SecondBox>
                <FormControl sx={{marginTop: '1.5em', marginBottom: '1.5em', width: '100%'}}>
                    <FormLabel id="demo-controlled-radio-buttons-group" sx={{fontWeight: 'bold', color: 'black!important', marginBottom: '1vh'}}>Количество комнат</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={countRooms}
                        onChange={handleChangeRooms}
                        sx={{display: 'flex', width: '100%', flexWrap: 'wrap', flexDirection: 'row'}}
                    >
                        <FormControlLabel value="1" control={<Radio color="secondary"/>} sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}} label={<BoldTypography>1 комната</BoldTypography>} />
                        <FormControlLabel value="2" control={<Radio color="secondary"/>} sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}} label={<BoldTypography>2 комнаты</BoldTypography>} />
                        <FormControlLabel value="3" control={<Radio color="secondary"/>} sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}} label={<BoldTypography>3 комнаты</BoldTypography>} />
                        <FormControlLabel value="4" control={<Radio color="secondary"/>} sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}} label={<BoldTypography>4+ комнаты</BoldTypography>} />
                    </RadioGroup>
                </FormControl>
            </SecondBox>
            <SecondBox>
                <FormControl sx={{marginTop: '1.5em', marginBottom: '1.5em', width: '100%'}} component="fieldset" variant="standard">
                    <FormLabel component="legend" sx={{fontWeight: 'bold', color: 'black!important', marginBottom: '1vh'}}>Тип жилья</FormLabel>
                    <FormGroup sx={{display: 'flex', width: '100%', flexWrap: 'wrap', flexDirection: 'row'}}>
                        <FormControlLabel sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}}
                            control={
                            <Checkbox checked={house} onChange={handleChange} name="house" 
                            color="secondary"/>
                            }
                            label={<BoldTypography>Дом</BoldTypography>}
                        />
                        <FormControlLabel sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}}
                            control={
                            <Checkbox checked={flat} onChange={handleChange} name="flat" 
                            color="secondary"/>
                            }
                            label={<BoldTypography>Квартира</BoldTypography>}
                        />
                        <FormControlLabel sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}}
                            control={
                            <Checkbox checked={villa} onChange={handleChange} name="villa" 
                            color="secondary"/>
                            }
                            label={<BoldTypography>Вилла</BoldTypography>}
                        />
                        <FormControlLabel sx={{minWidth: '130px', flexGrow: '1', flexBasis: '130px'}}
                            control={
                            <Checkbox checked={hotel} onChange={handleChange} name="hotel" 
                            color="secondary"/>
                            }
                            label={<BoldTypography>Отель</BoldTypography>}
                        />
                    </FormGroup>
                </FormControl>
            </SecondBox>
            <CostBox sx={{borderTop: '3px #EEEEEE solid'}}>
                <BoldTypography>Рейтинг {rate} &#9733;</BoldTypography>
                <Slider defaultValue={state.rate || 0} max={5} min={0} aria-label="Default" valueLabelDisplay="auto"
                onChangeCommitted={(e, val)=>{setRate(val)}}
                step={1}
                color="secondary"
                marks/>
            </CostBox>
        </FilterBox>
        <Footer>
            <FooterBtn
            sx={{color: `#606060`, border: '1px solid #606060'}}
            onClick={handleCancel}
            >
                <CloseIcon/>Отмена
            </FooterBtn>
            <FooterBtn
            variant="contained"
            onClick={handleSearch}
            sx={{background: `linear-gradient(33deg, #A16BFE, #BC3D2F)`}}>
                <FilterAltIcon/>Поиск
            </FooterBtn>
        </Footer>
        </>
    )
}