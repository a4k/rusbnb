import * as React from 'react';
import SearchBlock from './MobileSearchBlock';
import Card from './MobileCard';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Room} from './Types';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import Footer from './MobileFooter';
import { useLocation, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';


const CardsBlock = styled(Box)({
    display: 'flex', width: '90vw', margin: '0  auto', flexDirection: 'column', marginTop: '1rem'
});

type housing = {
    house: boolean,
    flat: boolean,
    villa: boolean,
    hotel: boolean
};

export default function MainPage (){
    const navigate = useNavigate(), location = useLocation();
    const state = location.state;
    const place : string = state?.place || '';
    const cost : number= state?.cost || 50_000,
    rate : number = state?.rate || 0,
    countRooms : string = state?.countRooms || '1',
    typesOfHousing : housing = state?.typesOfHousing || {
        house: true, flat: true, villa: true, hotel: true
    },
    dateDeparture : Dayjs = state?.dateDeparture || dayjs().add(1, 'day'), //пока не используется
    dateArrival : Dayjs = state?.dateArrival || dayjs(), //пока не используется
    adults = state?.adults || 0,
    children = state?.children || 0,
    guests = adults + children;
    const [takeCallback, setTakeCallB] = React.useState(false);

    const getTypes = () : String =>{
        let arr = [];
        if(typesOfHousing.house) arr.push('Дом')
        if(typesOfHousing.flat) arr.push('Квартира')
        if(typesOfHousing.villa) arr.push('Вилла')
        if(typesOfHousing.hotel) arr.push('Отель')
        return arr.join('+');
    }
    
    const [rooms, setRooms] = React.useState(Array<Room>);
    const [hasMoreRooms, setHMR] = React.useState(true);
    React.useEffect(()=>{
        let url = '/rooms?offset=0&size=6&sort_by_cost=true&min_rate=0';
        if(state != null)
        url = `/rooms?offset=0&size=6&sort_by_cost=true${place?`&place=${place}`: ''}&max_cost=${cost}${getTypes()?`&type=${getTypes()}`:''}&min_rate=${rate}`;
        axios.get(url
        
        )
        .then(res=>{
            setTakeCallB(true);
            setRooms(res.data.rooms);
            })
        .catch((error) => {
            setTakeCallB(true);
            });
    }, [place, guests, cost, ...Object.values(typesOfHousing)])

    const loadMoreRooms = ()=>{
        let url = `/rooms?offset=${rooms.length}&size=3&sort_by_cost=true&min_rate=0`;
        if(state != null)
        url = `/rooms?offset=${rooms.length}&size=3&sort_by_cost=true${place?`&place=${place}`: ''}&max_cost=${cost}${getTypes()?`&type=${getTypes()}`:''}&min_rate=${rate}`;
        axios.get(url
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
            {Array(3).fill(0).map((_, index)=>(
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
            hasMore={hasMoreRooms&&rooms.length>0}>
            <CardsBlock>
                {
                !takeCallback?(
                    Array(4).fill(0).map((_, index)=>(
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
                (
                    rooms.length==0?<a style={{color: '#79747E', fontWeight: '600', fontSize: '3rem', textAlign: 'center'}}>Ничего не найдено</a>:
                    rooms.map(room=>(
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