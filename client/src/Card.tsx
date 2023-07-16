import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import { Link } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Skeleton from '@mui/material/Skeleton';

const CardPrimaryText = styled(Typography)({
    fontWeight: 'bold'
}), CardLink = styled(Link)({
    marginLeft: '0.8vw', fontWeight: 'bold',
    color: 'black', fontSize: '1rem'
}), CardBox = styled(Box)({
    backgroundColor: 'white', width: '20vw', minHeight: '35vh', height: '100%', borderRadius: '12px', marginBottom: '2vh',
    minWidth: '190px'
}), CardUpperBox = styled(Box)({
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '0.8vh'
}),
CardImg = styled('img')({
    width: '100%', height: '19vh', borderRadius: '12px 12px 0px 0px', objectFit: 'cover', marginBottom: '0.8vh'
});

type CardProps = {
    imgSrc : string,
    cost: number,
    rating : number,
    id: number,
    title: string,
    subtitle: string,
    skeleton?: boolean
};

function numberWithSpaces(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const blankImage = '/images/blankPhoto.png';

export default function Card(props: CardProps){
    const [imgLoaded, setImgLoaded] = React.useState(false);
    const [sr, setSr] = React.useState("0");
    React.useEffect(
        ()=>{
            axios.get('/avr-rate/'+String(props.id))
        .then(res=>{
            setSr(res.data["average-rate"]);
            })
        .catch((error) => {
            toast.error('Ошибка '+error)
        });
        
        },
        []
    )
    return (
        <Link href={"/details/"+props.id} underline='none' color={'black'}>
        <CardBox>
            {
                props.skeleton?(<>
                    <Skeleton variant="circular" sx={{width: '100%', height: '19vh', borderRadius: '12px 12px 0px 0px', marginBottom: '0.8vh'}}
                animation="wave" />
                     <CardUpperBox sx={{marginTop: '1.6vh'}}>
                        <Skeleton animation="wave" variant="rounded" sx={{width: '50%', height: '1.3rem', marginLeft: '5%'}}/>
                        <Skeleton animation="wave" variant="rounded" sx={{width: '10%', height: '1.3rem', marginRight: '5%'}}/>
                    </CardUpperBox>
                        <Skeleton animation="wave" variant="rounded" sx={{width: '66%', height: '1.5rem', marginLeft: '5%', marginTop: '0.8rem'}}/>
                        <Skeleton animation="wave" variant="rounded" sx={{width: '90%', height: '3rem', margin: 'auto', marginTop: '0.8vh'}}/>
                </>
                ):(
                    <>
                    {imgLoaded?(<></>):(
                    <Skeleton variant="circular" sx={{width: '100%', height: '19vh', borderRadius: '12px 12px 0px 0px', marginBottom: '1.5vh'}}
                    animation="wave" />
                    )
                    }
                        <CardImg src={props.imgSrc} alt="" 
                        style={imgLoaded ? {} : {display: 'none'}}
                        onLoad={()=>setImgLoaded(true)}/>
                <CardUpperBox>
                    <CardLink underline='none'>{numberWithSpaces(props.cost)} &#8381; ночь</CardLink>
                    <CardPrimaryText sx={{marginRight: '0.8vw'}}>&#9733; {parseFloat(sr || "0").toFixed(1)}</CardPrimaryText>
                </CardUpperBox>
                <CardPrimaryText sx={{marginLeft: '0.8vw', marginBottom: '0.8vh'}}>{props.title}</CardPrimaryText>
                <Typography sx={{marginLeft: '0.8vw'}}>{props.subtitle}</Typography>
                </>
                )
            }
            
        </CardBox>
        </Link>
    )
}
