import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import useId from '@mui/material/utils/useId';
import { toast } from 'react-toastify';

type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string,
    image: string,
    primary_image: string
};

export default function MainPage (){
    const [rooms, setRooms] = React.useState(Array<Room>);
    if(rooms.length == 0)
    axios.get('/rooms'
    )
    .then(res=>{
            setRooms(res.data.rooms);
        })
    .catch((error) => {
        toast.error(`Ошибка на сервере. `+error);
        });

    const id = useId();
        
    return (
        <>
            <SearchBlock />
            <CardsBlock container sx={{width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                {
                    
                rooms.map((room, index)=>(
                <>
                <CardsBlockItem item key={`${id}-${index}`}>
                    <Card 
                    imgSrc={axios.defaults.baseURL + room.primary_image}
                    cost={room.price} rating={room.rate}
                    type={room.title} place={room.subtitle}
                    desc={room.description}
                    id={room.id}
                    />
                </CardsBlockItem>
                </>))}
            </CardsBlock>
        </>
    )
}