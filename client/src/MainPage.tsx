import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { blankImage } from './Images';

type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string,
    "primary-image": string
};

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
        
    return (
        <>
            <SearchBlock />
            <CardsBlock container sx={{width: '85vw', margin: '0 auto', marginTop: '5vh'}}>
                {
                rooms.length==0?(<CircularProgress size={'5vw'} sx={{margin: 'auto'}}/>):
                (rooms.map(room=>(
                <CardsBlockItem item key={room.id}>
                    <Card 
                    imgSrc={room["primary-image"] || blankImage}
                    cost={room.price} rating={room.rate}
                    title={room.title} 
                    subtitle={room.subtitle}
                    id={room.id}
                    />
                </CardsBlockItem>
                )))}
            </CardsBlock>
        </>
    )
}