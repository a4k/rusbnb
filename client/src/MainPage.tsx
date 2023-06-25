import * as React from 'react';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
import axios from 'axios';
import useId from '@mui/material/utils/useId';

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

const server = 'http://rusbnb-1.exp-of-betrayal.repl.co';

export default function MainPage (){
    const [rooms, setRooms] = React.useState(Array<Room>);
    if(rooms.length == 0)
    axios.get(server+'/rooms'
    )
    .then(res=>{
            setRooms(res.data.rooms);
        })
        .catch((error) => {
            console.log(error)
            if (error.response){
                console.log(error.response.data);
                
                }else if(error.request){
                    console.log(1);
                    console.log(error.request)
                
                }else if(error.message){
                    console.log(2);
                    console.log(error.message)
                
                }
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
                    imgSrc={server + room.primary_image}
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