import * as React from 'react';
import Box from '@mui/material/Box';
import Filter from './Filter';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import { styled } from '@mui/system';
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

type TypesOfHousing = {
    house: boolean,
    flat: boolean,
    villa: boolean,
    hotel: boolean
};
const Content = styled(Box)({
    display: 'flex', flexDirection: 'row', width: '79.8vw', marginLeft: '12vw', marginTop: '5vh', justifyContent: 'space-between',
    alignItems: 'flex-start'
})

export default function SearchPage (){
    const filterCost : number = Number(localStorage.getItem('filterCost') || '35000'),
    filterCount : number= Number(localStorage.getItem('filterCount') || '1'),
    filterTypes : TypesOfHousing = JSON.parse(localStorage.getItem('filterTypes') || JSON.stringify({
        house: true,
    flat: true,
    villa: true,
    hotel: true
    })),
    searchPlace : string = localStorage.getItem('searchPlace') || '';
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
            <Content>
                <Filter />
                <CardsBlock container sx={{width: '60vw', marginLeft: '0vw'}}>
                {
                    rooms.length==0?(<CircularProgress size={'5vw'} sx={{marginLeft: '27.5vw'}}/>):
                    (rooms.map(room=>(
                        
                    ((filterTypes.house && room.title.toLowerCase().includes("дом")) ||
                    (filterTypes.flat && room.title.toLowerCase().includes("квартира"))||
                    (filterTypes.villa && room.title.toLowerCase().includes("вилла"))||
                    (filterTypes.hotel && room.title.toLowerCase().includes("отель"))) &&
                    (room.price <= filterCost && room.title.toLowerCase().includes(searchPlace.toLowerCase()))?
                    (<>
                    <CardsBlockItem item key={room.id}>
                        <Card
                        imgSrc={room["primary-image"] || blankImage}
                        cost={room.price} rating={room.rate}
                        title={room.title} 
                        subtitle={room.subtitle}
                        id={room.id}
                        />
                    </CardsBlockItem>
                    </>):(<></>))))
                    }
            </CardsBlock>
            </Content>
        </>
    )
}
