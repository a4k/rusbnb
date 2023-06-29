import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import useId from '@mui/material/utils/useId';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string,
    image: string,
    "primary-image": string
};


const blankImage = '/images/blankPhoto.png';

export default function MainPage (){
    const [rooms, setRooms] = React.useState(Array<Room>);
    React.useEffect(()=>{
        axios.get('/rooms'
        )
        .then(res=>{
                setRooms(res.data.rooms);
            })
        .catch((error) => {
            toast.error(`Ошибка на сервере. `+error);
            });
    }, [])
    

    const id = useId();
        
    return (
        <>
            <SearchBlock />
            <CardsBlock container sx={{width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                {
                rooms.length==0?(<CircularProgress size={'5vw'} sx={{marginLeft: '35.5vw'}}/>):
                (rooms.map((room, index)=>(
                <>
                <CardsBlockItem item key={`${id}-${index}`}>
                    <Card 
                    imgSrc={room["primary-image"] || blankImage}
                    cost={room.price} rating={room.rate}
                    title={room.title} 
                    subtitle={room.subtitle}
                    id={room.id}
                    />
                </CardsBlockItem>
                </>)))}
            </CardsBlock>
        </>
    )
}