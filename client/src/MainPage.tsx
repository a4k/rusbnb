import * as React from 'react';
import Header from './Header';
import SearchBlock from './SearchBlock';
import Card from './Card';
import {CardsBlock, CardsBlockItem} from './CardsBlock';
 
export default function MainPage (){
    return (
        <>
            <Header />
            <SearchBlock />
            <CardsBlock container sx={{width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                <CardsBlockItem item>
                    <Card 
                    imgSrc='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/99/ec/e0/getlstd-property-photo.jpg?w=1200&h=-1&s=1'
                    cost={12345} rating={3.9}
                    type='Вилла' place='Сочи'
                    desc='Кайф вилла с бассейном'
                    />
                </CardsBlockItem>
                <CardsBlockItem item>
                    <Card 
                    imgSrc='https://prorus.ru/_/manager/files/629/8c77ee1375/-MG-9802-result.jpg'
                    cost={11900} rating={4.5}
                    type='Вилла' place='Сочи'
                    desc='Роскошная вилла с частным бассейном рядом с центром'
                    />
                </CardsBlockItem>
                <CardsBlockItem item>
                    <Card 
                    imgSrc='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/99/ec/e0/getlstd-property-photo.jpg?w=1200&h=-1&s=1'
                    cost={12345} rating={3.9}
                    type='Вилла' place='Сочи'
                    desc='Кайф вилла с бассейном'
                    />
                </CardsBlockItem>
                <CardsBlockItem item>
                    <Card 
                    imgSrc='https://prorus.ru/_/manager/files/629/8c77ee1375/-MG-9802-result.jpg'
                    cost={11900} rating={4.5}
                    type='Вилла' place='Сочи'
                    desc='Роскошная вилла с частным бассейном рядом с центром'
                    />
                </CardsBlockItem>
                <CardsBlockItem item>
                    <Card 
                    imgSrc='https://prorus.ru/_/manager/files/629/8c77ee1375/-MG-9802-result.jpg'
                    cost={11900} rating={4.5}
                    type='Вилла' place='Сочи'
                    desc='Роскошная вилла с частным бассейном рядом с центром'
                    />
                </CardsBlockItem>
            </CardsBlock>
        </>
    )
}