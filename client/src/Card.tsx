import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Link } from '@mui/material';

const CardPrimaryText = styled(Typography)({
    fontWeight: 'bold'
}), CardLink = styled(Link)({
    marginLeft: '0.8vw', fontWeight: 'bold',
    color: 'black', fontSize: '1rem'
}), CardBox = styled(Box)({
    backgroundColor: 'white', width: '18vw', minHeight: '35vh', height: '100%', borderRadius: '12px', marginBottom: '2vh'
}), CardUpperBox = styled(Box)({
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.8vh'
});

type CardProps = {
    imgSrc : string,
    cost: number,
    rating : number,
    type: string,
    place: string,
    desc: string,
    id: number
};

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function Card(props: CardProps){
    return (
        <Link href={"/details/"+props.id} underline='none' color={'black'}>
        <CardBox>
            <img src={props.imgSrc} alt="" 
            style={{width: '100%', height: '19vh', borderRadius: '12px 12px 0px 0px', objectFit: 'cover', marginBottom: '0.8vh'}}/>
            <CardUpperBox>
                <CardLink underline='none'>{numberWithSpaces(props.cost)} &#8381; ночь</CardLink>
                <CardPrimaryText sx={{marginRight: '0.8vw'}}>&#9733; {props.rating}</CardPrimaryText>
            </CardUpperBox>
            <CardPrimaryText sx={{marginLeft: '0.8vw', marginBottom: '0.8vh'}}>{props.type}, {props.place}</CardPrimaryText>
            <Typography sx={{marginLeft: '0.8vw'}}>{props.desc}</Typography>
        </CardBox>
        </Link>
    )
}
