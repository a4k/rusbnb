import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import { blankImage } from './Images';
import InfiniteScroll from 'react-infinite-scroll-component';
import LinearProgress from '@mui/material/LinearProgress';

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
    const [hasMoreRooms, setHMR] = React.useState(true);
    React.useEffect(()=>{
        axios.get('/rooms?offset=0&size=12&sort_by_cost=true&rate=5'
        )
        .then(res=>{
                setRooms(res.data.rooms);
            })
        .catch((error) => {
            toast.error(`Ошибка на сервере. `+error);
            });
    }, [])

    const loadMoreRooms = ()=>{
        axios.get(`/rooms?offset=${rooms.length}&size=8&sort_by_cost=true&rate=5`
        )
        .then(res=>{
                setRooms([...rooms, ...res.data.rooms]);
            })
        .catch((error) => {
            setHMR(false);
            });
    }
        
    return (
        <>
            <SearchBlock />
            <InfiniteScroll
            dataLength={rooms.length}
            next={loadMoreRooms}
            loader={<LinearProgress sx={{width: '85vw', marginLeft: '7.5vw'}}/>}
            hasMore={hasMoreRooms}>
            <CardsBlock container sx={{width: '85vw', margin: '0 auto', marginTop: '5vh'}}>
                {
                rooms.length==0?(<CircularProgress size={'5vw'} sx={{margin: 'auto'}}/>):
                (rooms.map(room=>(
                <CardsBlockItem item key={room.id}>
                    <Card 
                    imgSrc={room["primary-image"]}
                    cost={room.price} rating={room.rate}
                    title={room.title} 
                    subtitle={room.subtitle}
                    id={room.id}
                    />
                </CardsBlockItem>
                )))}
            </CardsBlock>
            </InfiniteScroll>
        </>
    )
}