import * as React from 'react';
import SearchBlock from './MobileSearchBlock';
import Card from './MobileCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Room} from './Types';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import Footer from './MobileFooter';

const CardsBlock = styled(Box)({
    display: 'flex', width: '90vw', margin: '0  auto', flexDirection: 'column', marginTop: '1rem'
});

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
            loader={<CardsBlock>
            {Array(8).fill(0).map((_, index)=>(
                            <Card 
                            imgSrc={''}
                            cost={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            rate={0}
                            key={`${index}-load`}
                            />
                        ))}
                </CardsBlock>}
            hasMore={hasMoreRooms}>
            <CardsBlock>
                {
                rooms.length==0?(
                    Array(12).fill(0).map((_, index)=>(
                            <Card 
                            imgSrc={''}
                            cost={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            rate={0}
                            key={`${index}-load`}

                            />
                        ))
                ):
                (rooms.map(room=>(
                    <Card 
                    imgSrc={room["primary-image"]}
                    cost={room.price}
                    title={room.title} 
                    subtitle={room.subtitle}
                    id={room.id}
                    rate={room.rate}
                    key={room.id}
                    />
                )))}
            </CardsBlock>
            </InfiniteScroll>
            <Footer/>
        </>
    )
}