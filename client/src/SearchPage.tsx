import * as React from 'react';
import Box from '@mui/material/Box';
import Filter from './Filter';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import { styled } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';
import { blankImage } from './Images';
import InfiniteScroll from 'react-infinite-scroll-component';

type Room = {
    description : string,
    id: number,
    price: number,
    rate: number,
    subtitle: string,
    title: string,
    "primary-image": string
};

type TypesOfHousing = {
    house: boolean,
    flat: boolean,
    villa: boolean,
    hotel: boolean
};
const Content = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '85vw', margin: 'auto', marginTop: '5vh', justifyContent: 'space-between',
    alignItems: 'flex-start'
})


export default function SearchPage (){
    const filterCost : number = Number(localStorage.getItem('filterCost') || '35000'),
    filterCount : number= Number(localStorage.getItem('countRooms') || '1'),
    filterTypes : TypesOfHousing = JSON.parse(localStorage.getItem('filterTypes') || JSON.stringify({
        house: true,
    flat: true,
    villa: true,
    hotel: true
    })),
    searchPlace : string = localStorage.getItem('searchPlace') || '';
    const getTypes = () : String =>{
        let arr = [];
        if(filterTypes.house) arr.push('Дом')
        if(filterTypes.flat) arr.push('Квартира')
        if(filterTypes.villa) arr.push('Вилла')
        if(filterTypes.hotel) arr.push('Отель')
        return arr.join('+');
    }
    const [rooms, setRooms] = React.useState(Array<Room>);
    const [hasMoreRooms, setHMR] = React.useState(true);
    React.useEffect(()=>{
        axios.get(`/rooms?offset=0&size=12&sort_by_cost=true${searchPlace?`&place=${searchPlace}`: ''}&max_cost=${filterCost}
        ${getTypes()?`&type=${getTypes()}`:''}
        &max_rate=5`
    )
    .then(res=>{
            setRooms(res.data.rooms);
        })
    .catch((error) => {
        toast.error(`Ошибка на сервере. `+error);
        });
    }, [])

    const loadMoreRooms = ()=>{
        axios.get(`/rooms?offset=${rooms.length}&size=6&sort_by_cost=true${searchPlace?`&place=${searchPlace}`: ''}&max_cost=${filterCost}
        ${getTypes()?`&type=${getTypes()}`:''}
        &max_rate=5`
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
            <Content>
                <Filter />
                <InfiniteScroll
                dataLength={rooms.length}
                next={loadMoreRooms}
                loader={<CardsBlock container sx={{width: '65vw', margin: '0 auto', marginTop: '5vh'}}>
                {Array(6).fill(0).map((_, index)=>(
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
                            ))}
                            </CardsBlock>}
                hasMore={hasMoreRooms}>
                <CardsBlock container sx={{width: '65vw', marginLeft: '0vw'}}>
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
                    (rooms.map(room=>(
                    <CardsBlockItem item key={room.id}>
                        <Card
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price} rating={room.rate}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        />
                    </CardsBlockItem>)
                    ))
                    }
                </CardsBlock>
                </InfiniteScroll>
            </Content>
        </>
    )
}
