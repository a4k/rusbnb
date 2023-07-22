import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Room} from './Types';

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
            loader={<CardsBlock container sx={{width: '85vw', margin: '0 auto', marginTop: '2vh'}}>
            {Array(8).fill(0).map((_, index)=>(
                        <CardsBlockItem item key={`${index}-load`}>
                            <Card 
                            imgSrc={''}
                            cost={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            rate={0}
                            />
                        </CardsBlockItem>
                        ))}
                        </CardsBlock>}
            hasMore={hasMoreRooms}>
            <CardsBlock container sx={{width: '85vw', margin: '0 auto', marginTop: '5vh'}}>
                {
                rooms.length==0?(
                    Array(12).fill(0).map((_, index)=>(
                        <CardsBlockItem item key={`${index}-load`}>
                            <Card 
                            imgSrc={''}
                            cost={0}
                            title={''} 
                            subtitle={''}
                            id={0}
                            skeleton={true}
                            rate={0}
                            />
                        </CardsBlockItem>
                        ))
                ):
                (rooms.map(room=>(
                <CardsBlockItem item key={room.id}>
                    <Card 
                    imgSrc={room["primary-image"]}
                    cost={room.price}
                    title={room.title} 
                    subtitle={room.subtitle}
                    id={room.id}
                    rate={room.rate}
                    />
                </CardsBlockItem>
                )))}
            </CardsBlock>
            </InfiniteScroll>
        </>
    )
}