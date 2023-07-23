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
import {Room} from './Types'
import { useLocation, useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';

const Content = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '85vw', margin: 'auto', marginTop: '5vh', justifyContent: 'space-between',
    alignItems: 'flex-start'
});

type housing = {
    house: boolean,
    flat: boolean,
    villa: boolean,
    hotel: boolean
};

export default function SearchPage (){
    const navigate = useNavigate(), location = useLocation();

    const place : string = location.state.place || 'Ижевск';
    const cost : number= location.state.cost || 50_000,
    countRooms : string = location.state.countRooms || '1',
    typesOfHousing : housing = location.state.typesOfHousing || {
        house: true, flat: true, villa: true, hotel: true
    },
    dateDeparture : Dayjs = location.state.dateDeparture || dayjs().add(1, 'day'), //пока не используется
    dateArrival : Dayjs = location.state.dateArrival || dayjs(); //пока не используется
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
        setTakeCallB(false);
        setHMR(true);
        axios.get(`/rooms?offset=0&size=12&sort_by_cost=true${place?`&place=${place}`: ''}&max_cost=${cost}${getTypes()?`&type=${getTypes()}`:''}&min_rate=0`
    )
    .then(res=>{
            window.scrollTo(0, 0);
            setTakeCallB(true);
            if(res.data.rooms)
            setRooms(res.data.rooms);
            else 
            setRooms([]);
        })
    .catch((error) => {
        setTakeCallB(true);
        setRooms([]);
        });
    }, [cost, place, countRooms, ...Object.values(typesOfHousing)])

    const loadMoreRooms = ()=>{
        axios.get(`/rooms?offset=${rooms.length}&size=6&sort_by_cost=true${place?`&place=${place}`: ''}&max_cost=${cost}${getTypes()?`&type=${getTypes()}`:''}&min_rate=0`
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
                loader={<CardsBlock container sx={{width: '65vw', margin: '0 auto', marginTop: '2vh'}}>
                {Array(6).fill(0).map((_, index)=>(
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
                hasMore={hasMoreRooms&&rooms.length>0}>
                <CardsBlock container sx={{width: '65vw', marginLeft: '0vw'}}>
                {
                    !takeCallback?(
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
                    (
                        rooms.length==0?<a style={{color: '#79747E', fontWeight: '600', fontSize: '3rem'}}>Ничего не найдено</a>:
                        <>
                        {rooms.map(room=>(
                    <CardsBlockItem item key={room.id}>
                        <Card
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        rate={room.rate}
                        />
                    </CardsBlockItem>)
                    )}
                    </>
                    )
                    }
                </CardsBlock>
                </InfiniteScroll>
            </Content>
        </>
    )
}
