import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
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
        axios.get('/rooms?offset=0&size=12&sort_by_cost=true&max_rate=5'
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
            loader={<LinearProgress sx={{width: '85vw', marginLeft: '7.5vw', display: rooms.length > 0?'block':'none'}}/>}
            hasMore={hasMoreRooms}>
            <CardsBlock container sx={{width: '85vw', margin: '0 auto', marginTop: '5vh'}}>
                {
                rooms.length==0?(
                    Array(12).fill(0).map((_, index)=>(
                        <CardsBlockItem item key={`${index}-load`}>
                            <Card 
                            imgSrc={''}
                            cost={0} rating={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            />
                        </CardsBlockItem>
                        ))
                ):
                (rooms.map((room, index)=>(
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